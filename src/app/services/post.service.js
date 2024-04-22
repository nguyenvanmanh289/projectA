// import { log } from "winston";
import {Post} from "../models/post";
import {LINK_STATIC_URL} from "@/configs";
import { FileUpload } from "@/utils/types";
import {Author} from "../models/author";
import { ObjectId } from "../models";

import { CategoriesPosts } from "../models/categories_posts";
import { details as detail} from "./category.service";
import * as CategoryPost from"./categoryPost.service";

export async function create({title, content ,categoryIds, authorId ,thumnail}) {
    if(thumnail){
        thumnail = thumnail.save();
    }
    const post = new Post({
        title,
        content,
        authorId,
        thumnail
    });

    const postResult = await post.save();

    //create data expand for category with post
    if (categoryIds) {
        categoryIds.split(",").map((categoryId) => categoryId.trim()).map(async (categoryId) => {
            const categoryFound = await detail(categoryId);
            if (!categoryFound) {
                throw new Error("a or more categoryId are not found");
            }
            else {
                CategoryPost.create(categoryId, postResult._id, categoryFound.name, postResult.title);
            }
        });
    }
    
    await Author.findByIdAndUpdate({_id : authorId} , {$push : {posts : postResult._id }});
    
    return post;
}

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{title: q}, {content: q}]}),
    };

    const posts = (
        await Post.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((post) => {
        console.log(post);
        if (post.thumnail) {
            post.thumnail = LINK_STATIC_URL + post.thumnail;
        }
        return post;
    });

    const total = await Post.countDocuments(filter);
    return {total, page, per_page, posts};
}

export async function details(postId) {
    const post = await Post.findById({_id : postId});
    post.thumnail = LINK_STATIC_URL + post.thumnail;
    return post;
}

export async function search(data){
    const filter = {
        $regex : data,
        $options : "i"
    };
    
    const findFromCategoryPost = await CategoriesPosts.find({categoryName : filter});
    const posts1 = await Promise.all( findFromCategoryPost.map( async (post)=>{
        return await details(post.postId);
    }));
    const findFromAuthor= await Author.find({name : filter});
    const posts2 =await Promise.all( findFromAuthor.map( async (author)=>{
        return Promise.all( author.posts.map(async (post)=>{
            return await details(post);
        }));
    }));

    return [
        posts1 && {
            mes :"filter by category",
            type : 0,
            posts1
        },
        posts2 && {
            mes : "filter by author",
            type : 1,
            posts2
        }
    ];
}


export async function update( {_id, title, content ,categoryIds, authorId ,thumnail}) {
    const post = await Post.findOne({ _id: _id});

    if(!post){
        throw new Error("post not found");
    }
    if(thumnail){
        thumnail = thumnail.save();
        if(post.thumnail) FileUpload.remove(post.thumnail);
        post.thumnail = thumnail;
    }

    if(categoryIds){
        await CategoriesPosts.deleteMany({postId : _id});
        categoryIds.split(",").map((categoryId) => categoryId.trim()).map( async (categoryId) => {
            const categoryFound = await detail(categoryId);
            if(!categoryFound){
                throw new Error("a or more categoryId are not found");
            } 
            else{
                await CategoryPost.create(categoryId,_id,categoryFound.name,title || post.title);
            }
        });
    }

    title ? post.title = title : ""; 
    content ? post.content = content : "";
    authorId ? post.authorId = authorId : "";

    await post.save();
}


export async function remove(_id) {
    const post = await Post.findOne({ _id: _id});
    if(!post){
        throw new Error("post not found");
    }

    if(post.thumnail) FileUpload.remove(post.thumnail);
    
    await Author.findByIdAndUpdate(
        {_id : new ObjectId(post.authorId)} ,
        {$pull : {posts : new ObjectId(_id) }});

    await CategoriesPosts.deleteMany({ postId : _id});
    return await Post.deleteOne({_id: _id});
}
 
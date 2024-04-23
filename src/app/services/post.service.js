// import { log } from "winston";
import {Post} from "../models/post";
import {LINK_STATIC_URL} from "@/configs";
import { FileUpload } from "@/utils/types";
import {Author} from "../models/author";
import { ObjectId } from "../models";

import { CategoriesPosts } from "../models/categories_posts";
import { details as detail} from "./category.service";
import * as CategoryPost from"./categoryPost.service";

export async function create({ title, content, categoryIds, authorId, thumnail }) {
    if (categoryIds) {
        try {
            const promises = categoryIds.split(",").map(async (categoryId) => {
                try {
                    const categoryFound = await detail(categoryId.trim());
                    if (!categoryFound) {
                        throw new Error("Category not found for id: " + categoryId.trim());
                    }
                    return categoryFound;
                } catch (err) {
                    return err;
                }
            });

            const results = await Promise.all(promises);

            const hasError = results.some(result => result instanceof Error);
            if (hasError) {
                return false;
            } else {
                if (thumnail) {
                    thumnail = await thumnail.save();
                }
                const post = new Post({
                    title,
                    content,
                    authorId,
                    thumnail
                });

                const postResult = await post.save();
                await Author.findByIdAndUpdate({ _id: authorId }, { $push: { posts: postResult._id } });
                
                Promise.all(categoryIds.split(",").map(async (id)=>{
                    const category = await detail(id.trim());
                    console.log(category,"===");
                    await CategoryPost.create( id.trim(), postResult._id , category.name, postResult.title  );
                }));

                return postResult; // Trả về kết quả nếu không có lỗi
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
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
    

    if(categoryIds){
        await CategoriesPosts.deleteMany({postId : _id});
        const promises = categoryIds.split(",").map(async (categoryId) => {
            try {
                const categoryFound = await detail(categoryId.trim());
                if (!categoryFound) {
                    throw new Error("Category not found for id: " + categoryId.trim());
                }
                return categoryFound;
            } catch (err) {
                return err;
            }
        });

        const results = await Promise.all(promises);

        const hasError = results.some(result => result instanceof Error);
        if (hasError) {
            return false;
        } else {
            const post = await Post.findOne({ _id: _id});

            if (thumnail) {
                thumnail = thumnail.save();
                if (post.thumnail) FileUpload.remove(post.thumnail);
                post.thumnail = thumnail;
            } 
            
            title ? post.title = title : "";
            content ? post.content = content : "";
            authorId ? post.authorId = authorId : "";

            const postResult = await post.save();

            if(authorId) {
                await Author.findByIdAndUpdate({ _id: post.authorId }, { $pull: { posts: postResult._id } });
                await Author.findByIdAndUpdate({ _id: authorId }, { $push: { posts: postResult._id } });
            }
            
            Promise.all(categoryIds.split(",").map(async (id)=>{
                const category = await detail(id.trim());
                console.log(category,"===");
                await CategoryPost.create( id.trim(), postResult._id , category.name, postResult.title  );
            }));
            return postResult;
        }
    }
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
 
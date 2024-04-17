// import { log } from "winston";
import {Post} from "../models/post";
import {LINK_STATIC_URL} from "@/configs";
import { FileUpload } from "@/utils/types";
import {Author} from "../models/author";
import { ObjectId } from "../models";

export async function create({title, content , authorId ,thumnail}) {
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
        if (post.avatar) {
            post.avatar = LINK_STATIC_URL + post.avatar;
        }
        return post;
    });

    const total = await Post.countDocuments(filter);
    return {total, page, per_page, posts};
}

export async function details(postId) {
    const post = await Post.findById({_id : postId});
    post.avatar = LINK_STATIC_URL + post.avatar;
    return post;
}

export async function update( {_id, title, content , authorId ,thumnail}) {
    const post = await Post.findOne({ _id: _id});

    if(!post){
        throw new Error("post not found");
    }
    if(thumnail){
        thumnail = thumnail.save();
        if(post.thumnail) FileUpload.remove(post.thumnail);
        post.thumnail = thumnail;
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

    await Post.deleteOne({_id: _id});
}
 
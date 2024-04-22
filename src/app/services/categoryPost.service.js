import { CategoriesPosts } from "../models/categories_posts";
import { details } from "./post.service";



export async function create( categoryId , postId , cName , pName) {
    const categoryPost = new CategoriesPosts ({
        categoryId : categoryId,
        postId : postId,
        categoryName : cName,
        postTitle : pName
    });
    await categoryPost.save();
}

export async function readAll( categoryId ) {
    return await CategoriesPosts.find({categoryId : categoryId});
}

export async function remove(pId,cId) {
    if(cId){
        return await CategoriesPosts.deleteMany({categoryId : cId}); 
    } 
    else{
        return await CategoriesPosts.deleteMany({ postId: pId});
    }
    
}


export async function readPostsByCategoryId(categoryId) {
    const categoryPosts = await CategoriesPosts.find({categoryId: categoryId});

    const postIds = categoryPosts.map((item) => item.postId);
    const posts = await Promise.all(postIds.map(async (postId) => {
        return await details(postId);
    }));

    return posts;
}

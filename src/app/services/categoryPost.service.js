import { CategoriesPosts } from "../models/categories_posts";
import { details } from "./post.service";
import { details as detail } from "./category.service";



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


export async function readPostsByCategoryName(categoryName) {
    const filter = { "name": { "$regex": `${categoryName}`, "$options": "i" } };
    const categoryPosts = await CategoriesPosts.find(filter);

    const postIds = categoryPosts.map((item) => item.postId);

    const posts = await Promise.all(postIds.map(async (postId) => {
        return await details(postId);
    }));

    return posts;
}

export async function readCategoryByPostTitle( title ){
    const filter = { "title": { "$regex": `${title}`, "$options": "i" } };
    const categoryId = await CategoriesPosts.find(filter)[0].categoryId;

    return await detail(categoryId);
}
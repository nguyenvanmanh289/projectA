// import { log } from "winston";
import {Category} from "../models/category";

export async function create({name, description}) {
    const category = new Category({
        name,
        description
    });
   
    await category.save();
    return category;
}

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {description: q}]}),
    };

    const categories = (
        await Category.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((category) => {
        console.log(category);
        
        return category;
    });

    const total = await Category.countDocuments(filter);
    return {total, page, per_page, categories};
}

export async function details(categoryId) {
    const category = await Category.findById({_id : categoryId});
    return category;
}

export async function update( { _id, name, description}) {
    const category = await Category.findOne({ _id: _id});

    if(!category){
        throw new Error("category not found");
    }

    name ? category.name = name : ""; 
    description ? category.description = description : "";

    await category.save();
}



export async function remove(_id) {
    const category = await Category.findOne({ _id: _id});
    if(!category){
        throw new Error("category not found");
    }
    
    await Category.deleteOne({_id: _id});
    // ... update post data
}

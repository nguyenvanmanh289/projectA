// import { log } from "winston";
import {Author} from "../models/author";
import {LINK_STATIC_URL} from "@/configs";
import { FileUpload } from "@/utils/types";
import { toInteger } from "lodash";

export async function create({name, age , bio ,avatar}) {
    if(avatar){
        avatar = avatar.save();
    }
    const author = new Author({
        name,
        age,
        bio,
        avatar
    });
    await author.save();
    return author;
}

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {age: toInteger(q) ? toInteger(q) : null }, {bio: q}]}),
    };

    const authors = (
        await Author.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((author) => {
        console.log(author);
        if (author.avatar) {
            author.avatar = LINK_STATIC_URL + author.avatar;
        }
        return author;
    });

    const total = await Author.countDocuments(filter);
    return {total, page, per_page, authors};
}

export async function details(authorId) {
    const author = await Author.findById({_id : authorId});
    author.avatar = LINK_STATIC_URL + author.avatar;
    return author;
}

export async function update( { _id, name, age, bio, avatar}) {
    const author = await Author.findOne({ _id: _id});

    if(!author){
        throw new Error("Author not found");
    }
    if(avatar){
        avatar = avatar.save();
        if(author.avatar) FileUpload.remove(author.avatar);
        author.avatar = avatar;
    }

    name ? author.name = name : ""; 
    age ? author.age = age : "";
    bio ? author.bio = bio : "";

    await author.save();
}



export async function remove(_id) {
    const author = await Author.findOne({ _id: _id});
    if(!author){
        throw new Error("Author not found");
    }
    
    if(author.avatar) FileUpload.remove(author.avatar);
    
    await Author.deleteOne({_id: _id});
}

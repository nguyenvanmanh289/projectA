import Joi from "joi";

import {MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate,FileUpload} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";
import { isValidObjectId } from "mongoose";
import { Post } from "../models/post";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "title", "content" ), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createItem = Joi.object({
    title: Joi.string().trim().max(MAX_STRING_SIZE).required().label("tiêu đề bài post"),
    content: Joi.string().required().label("nội dung bài post"),
    authorId: Joi.string().required().custom((value,helpers)=>{
        if(!isValidObjectId(value)){
            helpers.error("Invalid objectId value");
        }
        return value;
    }),
    thumnail: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh bài viết"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    }).instance(FileUpload).allow("").label("thumnail bài viết")
});

export const updateItem = Joi.object({
    _id : Joi.string().required().custom((value,helper) => {
        if(!isValidObjectId(value)){
            helper.error("Invalid objectId author");
        }
        return value;
    }),
    title: Joi.string().trim().max(MAX_STRING_SIZE).label("tiêu đề bài post"),
    content: Joi.string().label("nội dung bài post"),
    authorId: Joi.string().custom((value,helpers)=>{
        if(!isValidObjectId(value)){
            helpers.error("Invalid objectId value");
        }
        return value;
    }),
    thumnail: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh bài viết"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    }).instance(FileUpload).allow("").label("thumnail bài viết")
});

export const detailAItem = Joi.object({
    _id: Joi.string().required().custom((value,helpers) => {
        if(!isValidObjectId(value)){
            helpers.error("Invalid _objectId for detail");
        }
        
        return new AsyncValidate(value, async function () {
            const post = await Post.findOne({_id: value});
            return !post ?  helpers.error("không có post theo id cung cấp") : value ;
        });
        
    })
});






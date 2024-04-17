import Joi from "joi";

import {MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate,FileUpload} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";
import { isValidObjectId } from "mongoose";
import { Author } from "../models/author";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "bio" ,"age"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    age: Joi.number().min(16).default(null).label("Age of author"),
    bio: Joi.string().trim().max(500).default("").label("tiểu sử tác giả"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    }).instance(FileUpload).allow("").label("Ảnh đại diện").required()
});

export const updateItem = Joi.object({
    _id : Joi.string().required().custom((value,helper) => {
        if(!isValidObjectId(value)){
            helper.error("Invalid objectId author");
        }
        return value;
    }),
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ và tên"),
    age: Joi.number().min(16).default(null).label("Age of author"),
    bio: Joi.string().trim().max(500).default("").label("tiểu sử tác giả"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    }).instance(FileUpload).allow("").label("Ảnh đại diện")
});

export const detailAItem = Joi.object({
    _id: Joi.string().required().custom((value,helpers) => {
        if(!isValidObjectId(value)){
            helpers.error("Invalid _objectId for detail");
        }
        
        return new AsyncValidate(value, async function () {
            const author = await Author.findOne({_id: value});
            return !author ?  helpers.error("không có author theo id cung cấp") : value ;
        });
        
    })
});






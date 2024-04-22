import Joi from "joi";

import {MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";
import { isValidObjectId } from "mongoose";
import { Category } from "../models/category";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "description"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(async (value) => {
        try {
            const category = await Category.findOne({ name: value });
            if (category) {
                throw new Error("tên category theo tên cung cấp đã tồn tại !");
            }
            return value;
        } catch (err) {
            throw new Error("tên category theo tên cung cấp đã tồn tại !");
        }
    }).required().label("tên danh mục"),
    description: Joi.string().min(16).max(2000).default(null).label("mô tả danh mục"),
});


export const updateItem = Joi.object({
    _id : Joi.string().required().custom((value,helper) => {
        if(!isValidObjectId(value)){
            helper.error("Invalid objectId author");
        }
        return value;
    }),
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ và tên"),
    description: Joi.string().min(16).max(2000).default(null).label("mô tả danh mục"),
    
});

export const detailAItem = Joi.object({
    _id: Joi.string().required().custom((value,helpers) => {
        if(!isValidObjectId(value)){
            return helpers.error("Invalid _objectId for detail");
        }
        
        return new AsyncValidate(value, async function () {
            const category = await Category.findOne({_id: value});
            return !category ?  helpers.error("không có category theo id cung cấp") : value ;
        });
        
    })
});






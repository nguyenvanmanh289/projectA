/* eslint-disable no-dupe-keys */
import Joi from "joi";
import {Employee} from "../models";
import {MAX_STRING_SIZE, VALIDATE_PHONE_REGEX} from "@/configs";
import {AsyncValidate, FileUpload} from "@/utils/types";
import {comparePassword,tryValidateOrDefault} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "email" ), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const login = Joi.object({
    email: Joi.string().trim().max(MAX_STRING_SIZE).lowercase().email().required().label("Email"),
    password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

export const register = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await Employee.findOne({email: value});
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await Employee.findOne({phone: value});
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện")
        .required(),
});

export const updateProfile = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(MAX_STRING_SIZE)
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const user = await Employee.findOne({email: value, _id: {$ne: req.currentEmployee._id}});
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)

        .allow("")
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const user = await Employee.findOne({phone: value, _id: {$ne: req.currentEmployee._id}});
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện")
        .required(),
});

export const changePassword = Joi.object({
    password: Joi.string()
        .required()
        .label("Mật khẩu cũ")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, (req) =>
                    comparePassword(value, req.currentEmployee.password)
                        ? value
                        : helpers.message("{#label} không chính xác"),
                ),
        ),
    new_password: Joi.string()
        .min(6)
        .max(MAX_STRING_SIZE)
        .required()
        .label("Mật khẩu mới")
        .invalid(Joi.ref("password")),
});

export const remove = Joi.object({
    _id: Joi.string().required().custom((value,helpers)=>{
        if(!isValidObjectId(value)){
            return helpers.error("Invalid _objectId");
        }
        return new AsyncValidate(value, async function(req){
            const employee = await Employee.find({_id: value, _id: { $ne :  req.currentEmployee._id }} ); 
            if(!employee){
                return helpers.error("không thể xóa chinh mình");
            }
            return value;
        });
        
    }),
});


export const detail = Joi.object({
    _id: Joi.string().required().custom((value,helpers)=>{
        if(!isValidObjectId(value)){
            return helpers.error("Invalid _objectId");
        }
        return new AsyncValidate(value, async function(){
            const employee = await Employee.find({_id: value} ); 
            if(!employee){
                return helpers.error("khoong tim thay id cung cap");
            }
            return value;
        });
        
    }),
});
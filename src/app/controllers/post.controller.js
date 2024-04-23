import {responseError, responseSuccess} from "@/utils/helpers";
import * as postService from "../services/post.service";

export async function readRoot(req, res) {
    return responseSuccess(res, await postService.filter(req.query));
}

export async function readItem(req, res) {
    await responseSuccess(res, await postService.details(req.query._id));
}

export async function search(req, res) {
    const posts = await postService.search(req.query.data);
    await responseSuccess(res, posts , 201);
}

export async function createItem(req, res) {
    const iscreated = await postService.create(req.body);
    console.log(iscreated,"======== service");
    if(!iscreated){
        return responseError(res, 201, null , "a or more categoryId not found");
    }
    return responseSuccess(res, iscreated, 201);
}

export async function updateItem(req, res) {
    const isUpdated = await postService.update(req.body);
    if(!isUpdated){
        return responseError(res, 201, null , "a or more categoryId not found");
    }
    return responseSuccess(res, null, 201);
}

export async function removeItem(req, res) {
    await postService.remove(req.body._id);
    return responseSuccess(res);
}


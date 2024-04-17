import {responseSuccess} from "@/utils/helpers";
import * as categoryService from "../services/category.service";

export async function readRoot(req, res) {
    return responseSuccess(res, await categoryService.filter(req.query));
}

export async function readItem(req, res) {
    await responseSuccess(res, await categoryService.details(req.query._id));
}

export async function createItem(req, res) {
    await categoryService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateItem(req, res) {
    await categoryService.update(req.body);
    return responseSuccess(res, null, 201);
}

export async function removeItem(req, res) {
    await categoryService.remove(req.body._id);
    return responseSuccess(res);
}


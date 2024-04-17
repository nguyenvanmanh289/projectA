import {responseSuccess} from "@/utils/helpers";
import * as authorService from "../services/author.service";

export async function readRoot(req, res) {
    return responseSuccess(res, await authorService.filter(req.query));
}

export async function readItem(req, res) {
    await responseSuccess(res, await authorService.details(req.query._id));
}

export async function createItem(req, res) {
    await authorService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateItem(req, res) {
    await authorService.update(req.body);
    return responseSuccess(res, null, 201);
}

export async function removeItem(req, res) {
    await authorService.remove(req.body._id);
    return responseSuccess(res);
}


import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {verifyToken, validate , upload} from "../app/middleware/common";

import * as categoryRequest from "../app/requests/category.request";
// import * as userMiddleware from "../app/middleware/employee.middleware";
import * as categoryController from "../app/controllers/category.controller";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(categoryRequest.readRoot)),
    asyncHandler(categoryController.readRoot)
);

router.get(
    "/detail",
    asyncHandler(validate(categoryRequest.detailAItem)),
    asyncHandler(categoryController.readItem)
);

router.post(
    "/create",
    asyncHandler(upload),
    asyncHandler(validate(categoryRequest.createItem)),
    asyncHandler(categoryController.createItem)
);

router.get(
    "/show",
    asyncHandler(validate(categoryRequest.detailAItem)),
    asyncHandler(categoryController.readPostsByCategoryId)
);


router.put(
    "/update",
    asyncHandler(upload),
    asyncHandler(validate(categoryRequest.updateItem)),
    asyncHandler(categoryController.updateItem),
);

router.delete(
    "/delete",
    asyncHandler(validate(categoryRequest.detailAItem)),
    asyncHandler(categoryController.removeItem)
);


export default router;


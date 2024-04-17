import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {verifyToken, validate , upload} from "../app/middleware/common";

import * as postRequest from "../app/requests/post.request";
// import * as userMiddleware from "../app/middleware/employee.middleware";
import * as postController from "../app/controllers/post.controller";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(postRequest.readRoot)),
    asyncHandler(postController.readRoot)
);

router.get(
    "/detail",
    asyncHandler(validate(postRequest.detailAItem)),
    asyncHandler(postController.readItem)
);

router.post(
    "/create",
    asyncHandler(upload),
    asyncHandler(validate(postRequest.createItem)),
    asyncHandler(postController.createItem)
);

router.put(
    "/update",
    asyncHandler(upload),
    asyncHandler(validate(postRequest.updateItem)),
    asyncHandler(postController.updateItem),
);

router.delete(
    "/delete",
    asyncHandler(validate(postRequest.detailAItem)),
    asyncHandler(postController.removeItem)
);


export default router;

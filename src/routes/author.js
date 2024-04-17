import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {verifyToken, validate , upload} from "../app/middleware/common";

import * as authorRequest from "../app/requests/author.request";
// import * as userMiddleware from "../app/middleware/employee.middleware";
import * as authorController from "../app/controllers/author.controller";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(authorRequest.readRoot)),
    asyncHandler(authorController.readRoot)
);

router.get(
    "/detail",
    asyncHandler(validate(authorRequest.detailAItem)),
    asyncHandler(authorController.readItem)
);

router.post(
    "/create",
    asyncHandler(upload),
    asyncHandler(validate(authorRequest.createItem)),
    asyncHandler(authorController.createItem)
);

router.put(
    "/update",
    asyncHandler(verifyToken),
    asyncHandler(upload),
    asyncHandler(validate(authorRequest.updateItem)),
    asyncHandler(authorController.updateItem),
);

router.delete(
    "/delete",
    asyncHandler(validate(authorRequest.detailAItem)),
    asyncHandler(authorController.removeItem)
);


export default router;

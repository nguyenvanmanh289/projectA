import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {verifyToken, validate, upload} from "../app/middleware/common";

import * as employeeRequest from "../app/requests/employee.request";
import * as employeeController from "../app/controllers/employee.controller";

const router = Router();

router.post(
    "/login",
    asyncHandler(validate(employeeRequest.login)),
    asyncHandler(employeeController.login)
);

router.post(
    "/register",
    asyncHandler(upload),
    asyncHandler(validate(employeeRequest.register)),
    asyncHandler(employeeController.register),
);

router.post(
    "/logout",
    asyncHandler(verifyToken),
    asyncHandler(employeeController.logout)
);

router.get(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(employeeController.me)
);

router.get(
    "/list",
    asyncHandler(verifyToken),
    asyncHandler(validate(employeeRequest.readRoot)),
    asyncHandler(employeeController.readWithFilter)
);

router.get(
    "/detail",
    asyncHandler(verifyToken),
    asyncHandler(validate(employeeRequest.detail)),
    asyncHandler(employeeController.detail)
);

router.put(
    "/update",
    asyncHandler(verifyToken),
    asyncHandler(upload),
    asyncHandler(validate(employeeRequest.updateProfile)),
    asyncHandler(employeeController.updateProfile),
);

router.patch(
    "/change-password",
    asyncHandler(verifyToken),
    asyncHandler(validate(employeeRequest.changePassword)),
    asyncHandler(employeeController.changePassword),
);
router.delete(
    "/delete",
    asyncHandler(verifyToken),
    asyncHandler(validate(employeeRequest.remove)),
    asyncHandler(employeeController.remove)
);

export default router;

import {responseError, responseSuccess, getToken,generatePassword} from "@/utils/helpers";
import * as employeeService from "../services/employee.service";

export async function login(req, res) {
    const validLogin = await employeeService.checkValidLogin(req.body);

    if (validLogin) {
        return responseSuccess(res, employeeService.authToken(validLogin._id));
    } else {
        return responseError(res, 400, "Email hoặc mật khẩu không đúng");
    }
}

export async function register(req, res) {
    const newUser = await employeeService.register(req.body);
    const result = employeeService.authToken(newUser._id);
    return responseSuccess(res, result, 201, "Đăng ký thành công");
}

export async function logout(req, res) {
    const token = getToken(req.headers);
    await employeeService.blockToken(token);
    return responseSuccess(res);
}

export async function me(req, res) {
    return responseSuccess(res, await employeeService.profile(req.currentEmployee._id));
}

export async function updateProfile(req, res) {
    await employeeService.updateProfile(req.currentEmployee, req.body);
    return responseSuccess(res, null, 201);
}

export async function resetPassword(employee, new_password) {
    employee.password = generatePassword(new_password);
    await employee.save();
    return employee;
}

export async function changePassword(req, res) {
    await resetPassword(req.currentEmployee, req.body.new_password);
    return responseSuccess(res, null, 201);
}

import moment from "moment";
import jwt from "jsonwebtoken";
import {Employee} from "../models";
import {cache, JWT_EXPIRES_IN, LINK_STATIC_URL, TOKEN_TYPE} from "@/configs";
import {FileUpload} from "@/utils/types";
import {comparePassword, generatePassword, generateToken} from "@/utils/helpers";

export const tokenBlocklist = cache.create("token-block-list");

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {age: q }]}),
    };

    const employees = (
        await Employee.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((employee) => {
        console.log(employee);
        if (employee.avatar) {
            employee.avatar = LINK_STATIC_URL + employee.avatar;
        }
        return employee;
    });

    const total = await Employee.countDocuments(filter);
    return {total, page, per_page, employees};
}


export async function checkValidLogin({email, password}) {
    const user = await Employee.findOne({
        email: email,
        deleted_at: null,
    });

    if (user) {
        const verified = comparePassword(password, user.password);
        if (verified) {
            return user;
        }
    }

    return false;
}

export function authToken(employee_id) {
    const access_token = generateToken(TOKEN_TYPE.AUTHORIZATION, {employee_id}, JWT_EXPIRES_IN);
    const decode = jwt.decode(access_token);
    const expire_in = decode.exp - decode.iat;
    return {
        access_token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function register({name, email, password, phone, avatar}) {
    if (avatar) {
        avatar = avatar.save();
    }

    const user = new Employee({
        name,
        permission : "yes",
        email,
        password: generatePassword(password),
        phone,
        avatar,
    });
    return await user.save();
}

export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}

export async function profile(employee_id) {
    const user = await Employee.findOne({_id: employee_id});
    if (user.avatar) {
        user.avatar = LINK_STATIC_URL + user.avatar;
    }

    return user;
}

export async function updateProfile(currentEmployee, {name, email, phone, avatar}) {
    currentEmployee.name = name;
    currentEmployee.email = email;
    currentEmployee.phone = phone;
    if (avatar) {
        if (currentEmployee.avatar) {
            FileUpload.remove(currentEmployee.avatar);
        }
        avatar = avatar.save("images");
        currentEmployee.avatar = avatar;
    }

    return await currentEmployee.save();
}


export async function remove(req) {
    const employee = await Employee.findOne(req.currentEmployee._id);
    if (employee.permission === "unlimited") {
        if (employee.avatar) FileUpload.remove(employee.avatar);
        return await Employee.deleteOne({_id : req.body._id});
    }
    return false; 
}
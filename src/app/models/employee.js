import {createModel} from "./base";

export const Employee = createModel("Employee", "employees", {
    name: {
        type: String,
        required: true,
    },
    permission :{
        type: String,
        required: true,
        default: "yes"
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: "",
    },
    avatar: String,
});

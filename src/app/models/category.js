import {createModel} from "./base";

export const Category = createModel("Category", "categories", {
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: ""
    }
});

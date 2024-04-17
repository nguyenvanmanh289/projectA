import {createModel} from "./base";

export const CategoriesVsPosts = createModel("CategoriesVsPosts", "categoriesvsposts", {
    CategoryId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
});

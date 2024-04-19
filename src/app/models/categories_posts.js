import {createModel} from "./base";

export const CategoriesPosts = createModel("CategoriesPosts", "categoriesvsposts", {
    categoryId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    },
    postTitle: {
        type: String,
        required: true,
    }
});

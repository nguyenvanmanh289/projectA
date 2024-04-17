import {createModel} from "./base";

export const Post = createModel("Post", "posts", {
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
   
    thumnail: String,
});

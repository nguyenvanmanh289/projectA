import {createModel} from "./base";

export const Author = createModel("Author", "authors", {
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
        default: null
    },
    bio:{
        type: String,
        required: false,
        default: ""
    },
    posts: {
        type: Array,
        required: false,
        default: []
    },
   
    avatar: String,
});

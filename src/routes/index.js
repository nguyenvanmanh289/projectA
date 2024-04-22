import authRouter from "./employee";
import authorRouter from "./author";
import categoryRouter from "./category";
import postRouter from "./post";


export default function route(app) {
    app.use("/employee", authRouter);
    app.use("/authors", authorRouter);
    app.use("/categories",categoryRouter);
    app.use("/posts",postRouter);

}

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ebookRouter from "./ebook";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/ebook", ebookRouter);

export default router;

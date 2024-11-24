import { Router } from "express";
import { userController } from "./auth.collection";
import { loginSchema, registerSchema } from "./auth.dto";
import { validate } from "../middleware/middleware";

const userRouter = Router();

userRouter.post("/login", validate(loginSchema), userController.login);
userRouter.post("/register", validate(registerSchema), userController.register);
userRouter.post("/google-login", userController.googleLogin);
userRouter.post("/whoami", userController.whoami);

export default userRouter;

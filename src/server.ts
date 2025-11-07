import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "./config/cors.ts";
import { envSchema } from "./schemas/schemas.ts";
import rateLimiter from "./middleware/rateLimiter.ts";
import errorHandler from "./middleware/errorHandler.ts";
import verifyAccessToken from "./middleware/verifyAccessToken.ts";
import checkUserRole from "./middleware/checkUserRole.ts";
//import { requestLogger, errorLogger } from "./middleware/loggerMiddleware.ts";

// Routers
import loginRouter from "./routes/auth/login.ts";
import logoutRouter from "./routes/auth/logout.ts";
import refreshRouter from "./routes/auth/refresh.ts";
import googleLoginRouter from "./routes/auth/googleLogin.ts";
import githubLoginRouter from "./routes/auth/githubLogin.ts";
import facebookLoginRouter from "./routes/auth/facebookLogin.ts";

import userRouter from "./routes/users.ts";

dotenv.config();

envSchema.parse(process.env);

const app = express();

const port = process.env.PORT || 5000;

app.use(cors(corsConfig as any));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(rateLimiter(1, 100));
//app.use(requestLogger);
//app.use(errorLogger);

// Auth routes
app.use("/auth/login", rateLimiter(3, 10), loginRouter);
app.use("/auth/logout", logoutRouter);
app.use("/auth/refresh", refreshRouter);
app.use("/auth/google", googleLoginRouter);
app.use("/auth/github", githubLoginRouter);
app.use("/auth/facebook", facebookLoginRouter);

// User routes
app.use("/users", verifyAccessToken, checkUserRole, userRouter);

app.use(errorHandler);

app.listen(Number(port), () => {
  console.log(`TS server running at http://localhost:${port}/`);
});

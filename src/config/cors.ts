import type { CorsOptions } from "cors";

const whitelist = ["http://127.0.0.1:5000", "http://localhost:5000", "http://localhost", "http://127.0.0.1"];

const corsConfig: CorsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || whitelist.includes(requestOrigin)) {
      callback(null, true);
    } else {
      console.warn("Blocked CORS request from:", requestOrigin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsConfig;

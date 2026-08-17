import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"
dotenv.config({})
 
const app = express();

app.get("/home", (req, res)=>{
    return res.status(200).json({
        message:" I am coming from backend",
        success:true
    })
})

//middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
].filter(Boolean).map((origin) => origin.trim());

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`server running at port ${PORT}`);
})

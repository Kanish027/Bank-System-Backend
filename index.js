import "dotenv/config";
import express from "express";
import databaseConnection from "./database/connectDatabase.js";
import userRoute from "./routes/user.js";
import accountRoute from "./routes/account.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", userRoute);
app.use("/api/v1", accountRoute);
app.use(cors());

databaseConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on PORT ${process.env.PORT}`);
});

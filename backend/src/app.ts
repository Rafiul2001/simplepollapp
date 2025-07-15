import express from "express";
import router from "./routes/route";

const app = express();

app.use(express.json());

//Routes

app.use('/api/poll', router);

export default app;

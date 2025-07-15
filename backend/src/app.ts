import express from "express";
import poll_router from "./routes/poll_route";

const app = express();
app.use(express.json());

//Routes

app.use('/api/poll', poll_router);

export default app;

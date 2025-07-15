import express from "express";
import poll_router from "./routes/poll_route";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

//Routes

app.use('/api/poll', poll_router);

export default app;

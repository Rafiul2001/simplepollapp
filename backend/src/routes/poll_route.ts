import { Router, Request, Response, NextFunction } from "express";
import { pollCollection } from "../mongodb_connection/connection";
import PollModel from "../models/poll_model";

const poll_router = Router();

poll_router.get("/", async (req: Request, res: Response) => {
  try {
    const documents = await pollCollection.find().toArray();
    const poll = new PollModel(documents[0].id, documents[0].question, documents[0].options);
    res.json(poll);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default poll_router;

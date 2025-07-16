import { Router, Request, Response, NextFunction } from "express";
import { pollCollection } from "../mongodb_connection/connection";
import PollModel from "../models/poll_model";
import { ObjectId } from "mongodb";

const poll_router = Router();

poll_router.get("/get_all_polls", async (req: Request, res: Response) => {
  try {
    const documents = await pollCollection.find().toArray();
    const polls = documents.map(doc => new PollModel(doc.question, doc.options, doc._id.toString()));
    res.json(polls);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

poll_router.post("/add_polls", async (req: Request, res: Response) => {
  try {
    const newPoll = new PollModel(req.body.question, req.body.options);
    const result = await pollCollection.insertOne(newPoll);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

poll_router.post("/vote", async (req: Request, res: Response) => {
  const questionAndOptions: { questionId: string, optionId: string }[] = req.body
  try {
    // Run all update operations in parallel and wait for all to finish
    const updatePromises = questionAndOptions.map((qao) =>
      pollCollection.updateOne(
        {
          _id: new ObjectId(qao.questionId),
          "options.id": qao.optionId
        },
        {
          $inc: {
            "options.$.votes": 1
          },
          $set: {
            updatedAt: new Date()
          }
        }
      )
    );
    await Promise.all(updatePromises);
    res.status(200).send("Votes recorded successfully");
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

poll_router.put("/vote/:id", async (req: Request, res: Response) => {
  const objectID = req.params.id;
  const optionID = req.body.optionId;
  try {
    await pollCollection.updateOne({
      _id: new ObjectId(objectID),
      "options.id": optionID
    }, {
      $inc: {
        "options.$.votes": 1
      },
      $set: {
        updatedAt: new Date()
      }
    })
    res.status(200).send("Vote recorded successfully");
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

export default poll_router;

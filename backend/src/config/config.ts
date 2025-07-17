import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  mongodbUrl: string;
  databaseName: string;
  collectionName: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  mongodbUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/",
  databaseName: process.env.DATABASE_NAME || "poll",
  collectionName: process.env.COLLECTION_NAME || "question",
};

export default config;

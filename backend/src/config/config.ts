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
  mongodbUrl: process.env.MONGODB_URL || "",
  databaseName: process.env.DATABASE_NAME || "",
  collectionName: process.env.COLLECTION_NAME || "",
};

export default config;

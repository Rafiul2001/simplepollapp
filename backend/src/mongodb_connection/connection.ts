import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config/config";

const url = config.mongodbUrl;

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        const exists = dbs.databases.some(db => db.name === config.databaseName);
        if (!exists) {
            console.log(`Database ${config.databaseName} does not exist. Creating it now.`);
            await client.db(config.databaseName).createCollection(config.collectionName);
            console.log(`Database ${config.databaseName} created with collection ${config.collectionName}.`);
        } else {
            console.log(`Database ${config.databaseName} already exists.`);
        }

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

const pollDatabase = client.db(config.databaseName);
export const pollCollection = pollDatabase.collection(config.collectionName);
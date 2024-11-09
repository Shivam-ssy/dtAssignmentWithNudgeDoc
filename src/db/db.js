import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
const uri=process.env.DB_URI
const client=new MongoClient(uri)

async function connectDb() {
    await client.connect()
    .then(()=> console.log("Db connection successfull"))
    .catch((error)=>console.error("Database connection error: ",error))
}
export  {connectDb,client};
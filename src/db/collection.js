import { client } from "./db.js";


const database = client.db('myDatabase');
const eventCollection = database.collection('events');

export {eventCollection}
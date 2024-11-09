import app from "./src/app.js";
import {connectDb} from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config({
    path:'/.env'
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`⚙️ Server is running at ${process.env.PORT}`)
    })
})
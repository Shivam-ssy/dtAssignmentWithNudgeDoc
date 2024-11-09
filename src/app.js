import express from "express";
import eventRouter from "./routes/Event.Routes.js"

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/v3/app",eventRouter)
app.get("/",async (req,res)=>{
    res.status(200).json({
        status:200,
        message:"Please test the api end points to get data",
        data:null
    })
})
export default app;
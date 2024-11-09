import express from "express";
import eventRouter from "./routes/Event.Routes.js"

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/v3/app",eventRouter)

export default app;
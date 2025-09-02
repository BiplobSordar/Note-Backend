import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from 'cors'


dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local",
});


const app = express();
app.use(cors())
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

app.post('/',(req,res)=>{
  console.log(req.body,'thsi is the body')
  return res.json({message:'success'})
})

import categoryModel from "../model/categoryModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res,next)=>{
    const categories = await categoryModel.find({});
    res.json(categories)
})
Router.get("/:id",async (req,res,next)=>{      
    const categories = await categoryModel.find({});
    res.json(categories)
})





export default Router;


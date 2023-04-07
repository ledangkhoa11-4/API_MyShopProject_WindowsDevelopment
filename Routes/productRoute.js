import categoryModel from "../model/categoryModel.js";
import express from 'express'

const Router = express.Router();



Router.get("/:slug",async (req,res,next)=>{      
11
    const categories = await categoryModel.find({});
12
    res.json(categories)
13
})



export default Router;


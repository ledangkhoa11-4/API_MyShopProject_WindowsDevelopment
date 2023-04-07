import categoryModel from "../model/categoryModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res)=>{
    try{
        const result = await categoryModel.find({});
        res.json(result)
    }catch(ex){
        const result = []
        res.json(result)
    }
})

export default Router;


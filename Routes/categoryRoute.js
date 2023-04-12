import categoryModel from "../model/categoryModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res)=>{
    try{
        console.log(req.query.id);
        var result = await categoryModel.find({_id: req.query.id});
        if(result.length != 0)  res.json(result)
        else{
            result = await categoryModel.find({})
            res.json(result)
        }
    }catch(ex){
        res.json([])
    }
})

Router.get("/newestId",async (req,res)=>{
    try{
        var result = await categoryModel.find().limit(1).sort({$natural:-1}) 
        res.json(result[0])
    }catch(ex){
        res.json([])
    }
})

Router.post("/", async (req,res)=>{
    try{
        
        const id = req.query.id
        const category = await categoryModel.findById(id)
        if(!category){
            var result = new categoryModel(req.body)
            const add = await result.save()
            res.json(add)
        }
        else{
            Object.assign(category,req.body)
            const result = await category.save()
            res.json(result)
        }
    }catch(ex){
        res.json([])
    }
})

Router.post("/delete",async (req,res)=>{
    try{
        const id = req.query.id;
        const category = await categoryModel.findOneAndDelete({ _id: id });
        if (!category) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.json(category)
    }catch(ex){
        res.json([])
    }
})

export default Router;


import accountModel from "../model/accountModel.js";
import express from 'express'

const Router = express.Router();

Router.get('/:username',async(req,res,next)=>{
    const account = await accountModel.findOne({ Username: req.params.username}).exec();
    res.json(account)
})

Router.post('/',async(req,res,next)=>{
    var user = new accountModel({
        Username: req.body.Username,
        Password: req.body.Password,
    });
    user.save((err,doc)=>{
        if(!err) console.log('auke')
    })
})

export default Router;
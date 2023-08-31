import express from 'express';
import dotevn from 'dotenv'
import connecttoDb from './config/db.js';
import Newsmodel from './models/News.js';
connecttoDb();
const port=process.env.PORT;
  
const app=express();

app.use(express.json());
dotevn.config();
   
// const router=express.Router();
// app.use('/v2/top-headlines',router)
// https://newsapi.org/v2/top-headlines?country=us&apiKey=3a06d5d684514e1cbad640667f422c58
//creating the news-------------------------------
app.post('/top-news/createnews',async (req,res)=>{
    const {source,author,title,description,url,urlToImage}=req.body
    // you can apply some check condition ow okey
    if(!source || !author || !title || !description || !url || !urlToImage){
       return res.status(400).json({
        message:"all fields are required ! "
       }) 
    } 
    try {
        const product=new Newsmodel({...req.body});  
        
        await product.save();
        res.status(200).json({
            message:'news created successfully',
            article:product
        })
    } catch (error) {
        console.log(error)
    }

})

// getting the news-------------------------------.

app.get('/top-news',async (req,res)=>{
    const {country,category,q,pageSize,page}=req.query;
    try {
        let result=[]
        if(country && !q && !category){
          result=await Newsmodel.find({country:country}).sort({publishedAt:-1}).limit(pageSize).skip(pageSize*(page-1)).select({country:0,category:0,__v:0})
        }else if(!country && !q && category ){
            result=await Newsmodel.find({category:country}).sort({publishedAt:-1}).limit(pageSize).skip(pageSize*(page-1)).select({country:0,category:0,__v:0});
        }else if(!country && q && !category ){
            result=await Newsmodel.find({
                $or:[
                    { title: { $regex: q, $options: "i" } },
                    { description: { $regex: q, $options: "i" } },
                ]
            }).sort({publishedAt:-1}).limit(pageSize).skip(pageSize*(page-1)).select({country:0,category:0,__v:0});
        }else if(country && !q && category){
            result=await Newsmodel.find({
                $and:[
                    { country:country },
                    { category:category},
                ]
            }).sort({publishedAt:-1}).limit(pageSize).skip(pageSize*(page-1)).select({country:0,category:0,__v:0});
        }else if(country && q && !category){
            result=await Newsmodel.find({
                $and:[
                    { country:country },
                    {
                        $or:[
                            { title: { $regex: q, $options: "i" } },
                            { description: { $regex: q, $options: "i" } },
                        ]
                    }
                ]
            }).sort({publishedAt:-1}).limit(pageSize).skip(pageSize*(page-1)).select({country:0,category:0,__v:0});
        }else{
            result=await Newsmodel.find({
                $and:[
                    { category:category },
                    {
                        $or:[
                            { title: { $regex: q, $options: "i" } },
                            { description: { $regex: q, $options: "i" } },
                        ]
                    }
                ]
            }).sort({publishedAt:-1}).limit(pageSize).skip(pageSize*(page-1)).select({country:0,category:0,__v:0});
        }
            res.status(200).json({
                status: "ok",
                totalResults: result.length,
                "articles":result
            })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port,()=>{
    console.log(`app is listen at port ${port}`)
})
import mongoose from "mongoose";

const NewSchema=new mongoose.Schema({
    source:{
        type: Object,
        required: true
    },
    author:{
       type:String,
       default:'unknown' 
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    url:{
        type:String,
        default:'unknown'
    },
    urlToImage:{
        type:String,
        default:'unknown'
    },
    country:{
      type:String,
      required:true
    },
    category:{
     type:String,
     required:true
    },
    publishedAt:{
        type: Date,
        default: Date.now
    }
})
const Newsmodel=mongoose.model('newsmodel',NewSchema);
export default Newsmodel;
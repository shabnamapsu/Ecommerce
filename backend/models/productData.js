import mongoose  from "mongoose";
const productSchema=mongoose.Schema({
title:{
    type:String,
required:true,
},
discription:{
    type:String,

},
price:{
    type:Number,
required:true,

},
category:{
    type:String,
    
},
image:{
    
    type:String,
},

}
,{
timestamps:true,
},)
export const  Product=mongoose.model("Product",productSchema)
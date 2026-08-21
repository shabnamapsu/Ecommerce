import mongoose  from "mongoose";
const userSchema=mongoose.Schema({
name:{
    type:String,
required:true,
},
email:{
    type:String,
required:true,
unique:true
},
password:{
    type:String,
required:true,

},
resetOtp: {
  type: String,
},

otpExpire: {
  type: Date,
},

isOtpVerified: {
  type: Boolean,
  default: false,
},
 role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },


},{
timestamps:true,
},)
export const  User=mongoose.model("User",userSchema)
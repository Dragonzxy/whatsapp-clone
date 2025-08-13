import mongoose from "mongoose";
import { text } from "stream/consumers";
const MessageSchema =new mongoose.Schema({
    uid:{
        type:String,
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        required:true,
    }

}
,{timestamps:true}
)
const Message = mongoose.model("Message",MessageSchema)
export default Message;
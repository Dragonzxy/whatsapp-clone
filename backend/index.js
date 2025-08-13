import express from "express"
import { Server } from "socket.io"
import Message from "./mongo.js"
import http from "http"
import cors from "cors"
import connectDB from "./database.js"

const app = express(); 
app.use(cors());

const server = http.createServer(app)
const io= new Server(server,{
    cors:{
        origin:"https://whats-app-dragon.netlify.app",
        methods:["GET","POST"]
    }
})
connectDB().then(()=>{


server.listen(3000,'0.0.0.0',()=>{
    console.log("server is running")
})

io.on("connection", async(socket) => {
    console.log("User connected:", socket.id);
const history= await Message.find().sort({time:1});
socket.emit("history", history)
    socket.on("message", async (data) => {

        console.log(data)
      
        const newMessage =  new Message({
            text:data.text,
            profile:data.profile,
            uid:data.uid,
            time:new Date()

        })
await newMessage.save()

       
io.emit("message", newMessage);

});
    
});



})

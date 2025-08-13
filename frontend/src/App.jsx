import React from "react";
import "./App.css";
import "./index.css";
import { useState,useEffect ,useRef} from "react";
import io from "socket.io-client"

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9KvrX2GFCuc9S5xHWsJFh3a-11419M5I",
  authDomain: "whatsapp-clone-380a2.firebaseapp.com",
  projectId: "whatsapp-clone-380a2",
  storageBucket: "whatsapp-clone-380a2.firebasestorage.app",
  messagingSenderId: "1067610416568",
  appId: "1:1067610416568:web:f839b17537906651705b4d",
  measurementId: "G-NJWM5HG9C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth =getAuth(app);


  const socket =io("https://whatsapp-clone-nvtt.onrender.com")


const App = () => {
const  [message, setMessage] = useState([]);
const bottomRef =useRef(null)
const [user]= useAuthState(auth);
const provider = new GoogleAuthProvider();
const handleKeyUp = (e)=>{
  if(e.key==="Enter"){
    sendBtn()
  }
}
const login = async()=>{
  try{
    await signInWithPopup(auth,provider);
}catch(err){
  console.log("kutta mara :" ,err)
}

}
const logout= async()=>{
  await signOut(auth);
}



  const  [input, setInput] = useState("")
  const sendBtn =()=>{
    if(input==="" ||!user)return;


  socket.emit("message",{
    text:input, username:user.displayName
    ,uid:user.uid,
    profile:user.photoURL,
   
    
  })

    


 setInput("")
  }
  useEffect(() => {
    socket.on("history",(allmsg)=>{
      setMessage(allmsg)
    })
    socket.on("message", (data) => {
    setMessage(prev=>[...prev,data])
    });

    
    return () => {
      socket.off("history")
      socket.off("message");
    };
  }, []);
  useEffect(()=>{
    bottomRef.current?.scrollIntoView();
  },[message])
  return (
    <div className="app">
<header>
  <div className="logo">bubbles</div>
  {user && <button onClick={logout}>Sign Out</button>}
  {!user && <button onClick={login}>Sign In</button>}
</header>

      <div className="main">
        <div className="msg">
          {message.map((msg,idx)=>(
            <p key={idx}> {msg.text} <img src={msg.profile}/><br />
          </p>
          ))}
     <div ref={bottomRef}></div>
        </div>
     
      </div>

      <div className="input">
        <input type="form" onKeyUp={handleKeyUp} value={input} placeholder="Transmit Message" onChange={(e)=>{
          setInput(e.target.value)
        }} />
        <i class="bx bxs-paper-plane" onClick={sendBtn}></i>
      </div>
    </div>
  );
};

export default App;

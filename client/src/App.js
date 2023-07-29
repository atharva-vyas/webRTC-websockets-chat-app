import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect("http://localhost:5000")

function App() {
  const [uid, setUid] = useState("")
  const [recipientID, setRecipientID] = useState("")
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")


  function sendMessage() {
    const peer = new Peer({
			initiator: true,
			trickle: false
		})

    socket.emit("newMessage", {message: message, recipientID: recipientID, from: uid})

    setMessage("")
    setMessages(messages => [...messages, message])
  }


  useEffect(() => {
    socket.on('me', (data) => {
      setUid(data)
    })

    socket.on('newMessage', (data) => {
      if (recipientID != data.from) {
        setRecipientID(data.from)
        setMessages(messages => [...messages, ...[]])
      }

      setMessages(messages => [...messages, data.message])

      console.log(messages);
    })
  }, [])
  
  
  return (
    <div className="App">
      <div align="center">
        <CopyToClipboard text={uid}>
          <button>{uid}</button>
        </CopyToClipboard>
      </div>
      
      <div>
        <ul>
          {messages.map(msg => <li>{msg}</li>)}
        </ul>
      </div>
      <br /><br /><br /><br />

      <div align="center">
        <input placeholder="recipient ID" type="text" value={recipientID} onChange={(e)=>setRecipientID(e.target.value)}/>
        <br /><br />
      
        <textarea placeholder="send message" type="text" value={message} onChange={(e)=>setMessage(e.target.value)} rows="4" cols="50"/>
        <br />
        <button onClick={sendMessage}>send</button>
      </div>
       
    </div>
  );
}

export default App;

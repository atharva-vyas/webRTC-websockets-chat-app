const express = require('express');
const http = require('http');
const app = express()

const server = http.createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*", methods: ['GET', 'POST'] }})

io.on("connection", (socket) => {
    socket.emit("me", socket.id)

    socket.on('newMessage', (data) => {
        console.log(data);
        io.to(data.recipientID).emit("newMessage", { from: data.from, message: data.message })
    })
})


server.listen(5000, () => {{
    console.log('on 5000');
}}) 
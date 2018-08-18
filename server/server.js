const path = require('path');
const http = require("http");
const express = require('express');
const socketIO =require('socket.io');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//creating middleWare
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('Hello User Connected');

  socket.on('createMessage',(message)=>{
    console.log('Created Message',message);
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect',()=>{
    console.log('User was Disconnected');
  });
});
//Hosting the Server
server.listen(port,()=>{
  console.log(`Started on port ${port}`);
});

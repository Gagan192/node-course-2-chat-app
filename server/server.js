const path = require('path');
const http = require("http");
const express = require('express');
const socketIO =require('socket.io');

const {generateMessage} =require('./utils/message');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//creating middleWare
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  //socket.emit from Admin text Welcome to the chat app
  socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

  //socket.broadcast.emit from Admin Text NEW user Joined
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

  socket.on('createMessage',(message,callback)=>{
    console.log('Created Message',message);
    //Emitting to All That are Connected
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback('This is from the server');

// Emiting TO all But Not Himself
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt: new Date().getTime()
    // });

  });

  socket.on('disconnect',()=>{
    console.log('User was Disconnected');
  });
});
//Hosting the Server
server.listen(port,()=>{
  console.log(`Started on port ${port}`);
});

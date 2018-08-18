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
  console.log('New User Connected');

  //socket.emit from Admin text Welcome to the chat app
  socket.emit('newMessage',{
    from:'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  //socket.broadcast.emit from Admin Text NEW user Joined
    socket.broadcast.emit('newMessage',{
      from:"Admin",
      text: 'New User Joined',
      createdAt: new Date().getTime()
    });

  socket.on('createMessage',(message)=>{
    console.log('Created Message',message);
    //Emitting to All That are Connected
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

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

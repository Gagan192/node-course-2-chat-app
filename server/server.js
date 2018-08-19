const path = require('path');
const http = require("http");
const express = require('express');
const socketIO =require('socket.io');

const {generateMessageImpTag} = require('./utils/message');
const {generateMessage} =require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users= new Users();

//creating middleWare
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  // //socket.emit from Admin text Welcome to the chat app
  // socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
  //
  // //socket.broadcast.emit from Admin Text NEW user Joined
  //   socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

    socket.on('join',(params,callback)=>{
      if(!isRealString(params.name) || !isRealString(params.room)){
        return callback('Name and Room name are required');
      }
      //to join room
      socket.join(params.room);
      //socket.leave('The Office fans');

      //io.emit -> io.to('The Office Fans').emit
      //socket.broadcast.emit -> socket.broadcast.to('The Office Fans')
      //socket.emit
      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room);
      io.to(params.room).emit('updateUserList',users.getUserList(params.room));

      socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
      socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));

      callback();
    });

  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      //Emitting to All That are Connected
      io.to(user.room).emit('newMessage',generateMessageImpTag(user.name,message.text,message.ImpTag));

    }
    callback();

// Emiting TO all But Not Himself
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt: new Date().getTime()
    // });

  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });
});
//Hosting the Server
server.listen(port,()=>{
  console.log(`Started on port ${port}`);
});

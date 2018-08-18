  var socket = io();

  socket.on('connect',function(){
    console.log('Connected to Server');
  });

  socket.on('newMessage',function(Message){
    console.log('New Message' ,Message );
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });

  var socket = io();

  socket.on('connect',function(){
    console.log('Connected to Server');

    socket.emit('createMessage',{
      from:'gagangoyal192@gmail.com',
      text:'This is the Email THat User has created and send'
    });

  });

  socket.on('newMessage',function(Message){
    console.log('New Message' ,Message );
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });

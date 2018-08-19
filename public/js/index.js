  var socket = io();

  socket.on('connect',function(){
    console.log('Connected to Server');
  });


  socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template =jQuery('#message-template').html();
    var html = Mustache.render(template,{
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    jQuery('#messages').append(html);

    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });

  // socket.emit('createMessage',{
  //   from: 'frank',
  //   text: 'Hi'
  // },function(data){
  //   console.log('Got it',data);
  // });

  jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage',{
      from:'User',
      text:messageTextbox.val()
    },function(){
    messageTextbox.val("")
    });

  });

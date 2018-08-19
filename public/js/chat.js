  var socket = io();

function scrollToBottom(){
  //Selectors
  var messages =jQuery('#messages');
  var newMessage= messages.children('li:last-child')
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight =newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }

}

  socket.on('connect',function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params,function(err){
      if(err){
        alert(err);
        window.location.href='/';
      }else{
        console.log("No error");
      }
    });
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
    scrollToBottom();

    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });

socket.on('updateUserList',function(users){
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
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
      text:messageTextbox.val()
    },function(){
    messageTextbox.val("")
    });

  });

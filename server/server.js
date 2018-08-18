const path = require('path');
const express = require('express');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

//laod everything into app variable to use
var app = express();
//creating middleWare
app.use(express.static(publicPath));
//Hosting the Server
app.listen(port,()=>{
  console.log(`Started on port ${port}`);
});


;

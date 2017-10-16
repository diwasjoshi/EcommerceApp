var express = require('express');

var app = express();

app.listen(3000, function(err){
    if(err) throw err;
    console.log('App is running');
})

app.get('/', function(err){
    if(err) throw err;
    console.log('App is running');
})

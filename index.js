var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var app = new express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

 mongoose.connect(config.database,function(err){

 	if(err){
 		console.log(err);
 	}else{
 		console.log("connected to dbbbbb");
 	}
 });
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname+'/public'));

var api= require('./app/routes/api')(app,express,io);
app.use('/api',api);

app.get('*',function(req,res){

	res.sendFile(__dirname+'/public/app/views/index.html');
});

http.listen(config.port,function (err) {
	console.log('server listen 3000---------');
});
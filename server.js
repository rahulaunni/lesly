/*
___      ___    __    __   ______    ____
| |	    / _  \  | |   } ) (      )  / __ \
| |    / /  \ \ | |   } | | ()  /  / /  \ |
| |___||___  | || |___} | |  |\  \ | |__| |
|_____|||   |__||______.) |__  \__\[__  [__]
 Version: 1.0.0 (dev)
  Author: rahuanni@evelabs.co
  company: evelabs.co
 Website: http://evelabs.co

 */
var version = '1.0.0';
const simpleGit = require('simple-git');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var router = express.Router();
var api = require('./routes/api')(router);
var port=3000;
var cron = require('node-cron');
var ObjectId = require('mongodb').ObjectID;
var CryptoJS = require("crypto-js");
var request = require('request');
const url = require('url')
var useragent = require('useragent');
var fs =require('fs');
var md5 = require('md5-file');
//Models 


//for logging requests
app.use(morgan('dev'));


//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);
app.use('/api', api);

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set static folder for Angular stuffs
app.use(express.static(path.join(__dirname, '/public')));


// Just send the index.html for other files to support HTML5Mode
app.all('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname,  'public/app/views', 'index.html'));
});


//mongodb configuration
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/leslydb',{ useMongoClient: true }, function(err) {
	if(err){
		console.log("Mongodb connection failed");
	}
	else{
		console.log("Mongodb connection success");
	}
});

server.listen(process.env.PORT || port, function(){
    console.log("Server started listening in port"+port);
});





//----------------------------------------------------------//
//
// Loading dependencies
//
//----------------------------------------------------------//

var express = require('express');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var qt   = require('quickthumb');
var cfg  = require('config');
var bugsnag = require('bugsnag');

//----------------------------------------------------------//
//
// Loading Routes
//
//----------------------------------------------------------//
var routes = require('./routes/index');
var authR = require('./routes/auth');

//----------------------------------------------------------//
//
// Initialize express app
//
//----------------------------------------------------------//
var app = express();

//----------------------------------------------------------//
//
// Express configuration
//
//----------------------------------------------------------//


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//----------------------------------------------------------//
//
// 3rd-party service configuration
//
//----------------------------------------------------------//

bugsnag.register(cfg.bugsnag.key);

//----------------------------------------------------------//
//
// Common middleware
//
//----------------------------------------------------------//

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
var logFile = fs.createWriteStream('./myLogFile.log', {flags: 'a'}); //use {flags: 'w'} to open in write mode
app.use(logger("combined", {stream: logFile}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use quickthumb
app.use(qt.static(__dirname + '/'));



//----------------------------------------------------------//
//
// Socket configuration
//
//----------------------------------------------------------//

var server = require('http').Server(app);

//----------------------------------------------------------//
//
// Attaching routes handlers
//
//----------------------------------------------------------//

app.use('/', routes);
app.use('/auth', authR);

//----------------------------------------------------------//
//
// System Error Handlers 
//
//----------------------------------------------------------//

app.use(function(err, req, res, next) {    
    bugsnag.notify(new Error("General Server Error"), {err:{message:err.message, stack:err.stack}});
    res.status(err.status || 500);
    res.json({status:0, code:1000, message:"Server Error"});
});

//----------------------------------------------------------//
//
// System Export
//
//----------------------------------------------------------//

module.exports = {
    app:app, 
    server:server
};

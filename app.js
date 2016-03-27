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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = {
    app:app, 
    server:server
};

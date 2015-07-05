console.log("Env vars are:");
console.log("MONGO_HOST: " + process.env.MONGO_HOST);
console.log("MONGO_PORT: " + process.env.MONGO_PORT);
console.log("NODECELLAR_PORT: " + process.env.NODECELLAR_PORT);

var express = require('express'),
    path = require('path'),
    http = require('http'),
    wine = require('./routes/wines');

var fs = require('fs');
var morgan = require('morgan');

var app = express();

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

app.set('port', process.env.NODECELLAR_PORT || 3000);
app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', {stream: accessLogStream}));

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

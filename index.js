// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 8080;

server.listen(port, function() {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

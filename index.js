var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watson = require('watson-developer-cloud');

var conversation = watson.conversation({
  username: 'af3d8481-bced-40df-9643-087d68b9fb39',
  password: 'OfJmvSIxgAIQ',
  version: 'v1',
  version_date: '2016-07-11'
});



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/', function(request, response) {
  response.render('pages/index');
});

io.on('connection', function(socket){

  var context = {};

  conversation.message({
	  workspace_id: '3c360d9b-06a8-4175-9d05-1c11c50aa672',
	  input: {'text': 'start'},
	  context: context
	},  function(err, response) {
		
		context = response.context;

	  if (err){
	  	io.emit('error', err);
	  }else{
	  	var text = response.output.text[0];
	  	var data = {user: "Italu", msg: text}
		io.emit('chat message', data);
	  }

	});

  socket.on('chat message', function(msg){
  	var data = {user: "Usuário", msg: msg}
    io.emit('chat message', data);

    conversation.message({
	  workspace_id: '3c360d9b-06a8-4175-9d05-1c11c50aa672',
	  input: {'text': msg},
	  context: context
	},  function(err, response) {
		
		context = response.context;

	  if (err){
	  	io.emit('error', err);
	  }else{
	  	var text = response.output.text[0];
	  	var data = {user: "Italu", msg: text}
    	io.emit('chat message', data);
	  }

	});

  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});



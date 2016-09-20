var socket = io();

$('.chat-footer form').submit(function() {

	socket.emit('chat message', $('.chat-footer input').val());
    $('.chat-footer input').val('');

	return false;
});

socket.on('chat message', function(data){
	if (data.user=="Italu") {
		$('.chat-body ul').append($('<li>').html("<h2>Italu</h2><p>"+data.msg+"</p>"));
	}else{
		$('.chat-body ul').append($('<li class="user">').html("<h2>"+data.user+"</h2><p>"+data.msg+"</p>"));
	}
	$('html, body').animate({ 
	   scrollTop: $(document).height()-$(window).height()}, 
	   0
	);
});



socket.on('error', function(msg){
	console.log(msg);
});
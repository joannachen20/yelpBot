// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var term = document.getElementById('term'),
      location = document.getElementById('location');
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
  socket.emit('chat', {
      term: term.value,
      location: location.value,
  });
  term.value = "";
});

// Listen for events
socket.on('chat', function(data){
    output.innerHTML += '<p>' data.term + data.location '</p>';
});

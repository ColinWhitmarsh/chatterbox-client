// YOUR CODE HERE:
var newUser = function(){
  window.username =prompt('What is your name?');
};
newUser();

var app = {};

app.init = function() {};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  contentType: 'application/json',
  data: {order: "-createdAt", limit: 100},
  success: function (data) {
    console.log(data);
    console.log('chatterbox: Message received');
    postMessages(data);
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to receive message');
  }
});
};

app.clearMessages = function() {
  $('#chats').empty();  
};

app.addMessage = function(message){
  var mainDiv = $('<div>');
  mainDiv.addClass('chat');
  mainDiv.addClass(JSON.stringify(message.roomname));
  mainDiv.addClass(JSON.stringify(message.username));
  
  var username = $('<div>');
  username.addClass('username');
  username.text(message.username+" @ "+ message.roomname);
  username.on('click', app.addFriend);
  
  var text = $('<div>');
  text.text(message.text);

  $('#chats').prepend(mainDiv.append(username).append(text));

  //don't add if username or text is empty
};

app.addRoom = function(room) {
  $('#roomSelect').append($('<div>', room));
};

app.addFriend = function() {
  console.log('add friend!');
};

// $('#send').on('click', app.handleSubmit);
app.handleSubmit = function() {
  var text = $('#message').val();
  var username = window.username;
  var room = 'lobby';
  var message = {
    username: username,
    text: text,
    roomname: room
  };
  app.send(message);
  
  $('#message').val('');
  console.log('handle submit!');
};


var lastMessageID;


var postMessages = function(data) {
  for (var i = data.results.length-1; i >= 0; i--) {
    app.addMessage(data.results[i]);
  }
};


app.rooms = {};

var populateRooms = function() {
  $.each(app.rooms, function(key, value) {   
       $('#roomSelect')
           .append($("<option></option>")
           .attr("value",key)
           .text(value)); 
  });
};

app.getRooms = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {order: "-createdAt", limit: 1000 },
    success: function (data) {
      data.results.forEach(function(item){
        app.rooms[item.roomname] = item.roomname;
      });
      populateRooms();
    },
    error: function (data) {
      console.error('chatterbox: Failed to receive message');
    }
  });
};

app.getRooms();

//onSelect function that hides and shows chats based on rooms
var filterRooms = function(){
  var currentRoom = $('#roomSelect').val();
  var chats = $('#chats').children();

  _.each(chats, function(node) {
    console.log('node', node);
    console.log('currentRoom', currentRoom);
    console.log($(node).hasClass(currentRoom));
    if ($(node).hasClass(JSON.stringify(currentRoom)) === true) {
      $(node).show();
    } else {
      $(node).hide();
    }
  });
};
// $('#roomSelect').on('change', filterRooms);
  //add on select event
  //hide everything except matching room. Rooms are classes on main divs

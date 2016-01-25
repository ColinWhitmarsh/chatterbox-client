// YOUR CODE HERE:
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
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message received');
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
  // $('#chats').append($('<div>', message));
  //create message div
  var mainDiv = $('<div>');
  mainDiv.addClass('chat');
  var username = $('<div>');
  username.text(message.username);
  username.addClass('username');
  var text = $('<div>');
  text.text(message.text);

  $('#chats').append(mainDiv.append(username).append(text));
    //subdiv with username
      //has an onclick related to addFriend...
    //subdiv with text


};

app.addRoom = function(room) {
  $('#roomSelect').append($('<div>', room));
};

app.addFriend = function() {
  return true;
};
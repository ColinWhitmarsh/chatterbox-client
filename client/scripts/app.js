// YOUR CODE HERE:
var newUser = function(){
  window.username =prompt('What is your name?');
};
newUser();

var app = {};

app.init = function() {
  $('.tabs').on('click', '.roomTabs', function(event) {
  var roomname = event.target.textContent;
  $('#roomSelect').val(roomname);
  filterRooms();
});

};

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


app.test = function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox/RP5785bzHR',
    type: 'PUT',
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
  // data: {order: "-createdAt", limit: 100, where:JSON.stringify({roomname: 'lobby'})},
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
  var roomname = $('#roomSelect').val();
  var message = {
    username: username,
    text: text,
    roomname: roomname
  };
  app.send(message);
  
  $('#message').val('');
  console.log('handle submit!');
};


var lastMessageID;


var postMessages = function(data) {
  if(lastMessageID) {
    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].objectId === lastMessageID) {
        lastMessageID = data.results[0].objectId;
        break;
      }
    }
    i--;
    for (;i >= 0; i--) {
      app.addMessage(data.results[i]);
    }
  } else {
    lastMessageID = data.results[0].objectId;
    for (var j = data.results.length-1; j >= 0; j--){
        app.addMessage(data.results[j]);
    }
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
    data: {order: "-createdAt", limit: 100 },
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


var filterRooms = function(){
  var currentRoom = $('#roomSelect').val();
  var chats = $('#chats').children();

  app.newTab();

  _.each(chats, function(node) {
    if ($(node).hasClass(JSON.stringify(currentRoom)) === true) {
      $(node).show();
    } else {
      $(node).hide();
    }
  });
};



app.newTab = function() {
  var currentTabs = $('.tabs').children();
  var found = false;

  _.each(currentTabs, function(tab) {
    if ($(tab).text() === $('#roomSelect').val()) {
      $(tab).addClass('SelectedRoom');
      found = true;
    } else {
      $(tab).removeClass('SelectedRoom');
    }
  });

  if (!found) {
    var roomTab = $('<div>');
    roomTab.text($('#roomSelect').val());
    roomTab.addClass('SelectedRoom');
    roomTab.addClass('roomTabs');
    $('.tabs').prepend(roomTab);  
  }
};



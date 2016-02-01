var message = {
  username: 'drake',
  message: 'hotline bling',
  room: 'all'
}

$.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox/ZruJXZWHPu',
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message received')
    console.log(data)
  },
  error: function (data) {
    console.error('chatterbox: Failed to receive message')
  }
})


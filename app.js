'use strict';
let config = require('./config.js');
const bodyParser = require('body-parser');
let request = require('request');
let apiKey = '[API_KEY]';
const yelp = require('yelp-fusion');
const client = yelp.client(apiKey);
var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

app.use(bodyParser.urlencoded({ extended: true } ));
// Static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('', {results: null, error: null});
  //res.sendFile(__dirname + '/public/index.html');
})

app.set('view engine', 'ejs');

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', (data) => {
        // console.log(data);
        io.sockets.emit('chat', data);
    })
});

    app.post('/', (req, res) => {
    let term = req.body.term;
    let location = req.body.location;
    let searchRequest = {
      term:` ${term}`,
      location: `${location}`
    }

//const client = yelp.client(apiKey);
client.search(searchRequest).then(response => {
    const name = response.jsonBody.businesses[0].name;
    const address = response.jsonBody.businesses[0].location.address1;
    var results = [
        { place: response.jsonBody.businesses[0].name,
          location: response.jsonBody.businesses[0].location.address1,
          rating: response.jsonBody.businesses[0].rating },
        { place: response.jsonBody.businesses[1].name,
          location: response.jsonBody.businesses[1].location.address1,
          rating: response.jsonBody.businesses[0].rating  },
        { place: response.jsonBody.businesses[2].name,
          location: response.jsonBody.businesses[2].location.address1,
          rating: response.jsonBody.businesses[0].rating  },
        { place: response.jsonBody.businesses[3].name,
          location: response.jsonBody.businesses[3].location.address1,
          rating: response.jsonBody.businesses[0].rating  },
        { place: response.jsonBody.businesses[4].name,
          location: response.jsonBody.businesses[4].location.address1,
          rating: response.jsonBody.businesses[0].rating  }
    ];
    //let results = 'YelpBot: Your first result is ' + name + '. Located at ' + address + '.';
    //console.log(output);
    console.log(results);
    //io.sockets.emit('chat', bot);
    res.render('index', {
        results: results
    });
}).catch(err => {
  console.log(err);
})
});

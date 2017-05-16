var Twit = require('twit');
var config = require('./config');

var http = require('http');
var T = new Twit(config);

var request = require("request");

setInterval(tellajoke, 3600000);
tellajoke();
function tellajoke() {
    request("https://api.chucknorris.io/jokes/random", function (error, response, body) {
        var obj = JSON.parse(body)
        console.log(obj.value);
        tweetIt(obj.value);
    });
}

function tweetIt(text) {

    T.post('statuses/update', {
        status: text
    }, function (err, data, response) {
        console.log("sucess!")
    });
}
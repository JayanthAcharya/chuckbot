var Twit = require('twit');
var config = require('./config');
var fs = require('fs');
var http = require('http');
var T = new Twit(config);

var request = require("request");

setInterval(getajoke, 3600000*5);

//getajoke();
getImage();

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function getImage() {

    var a = randomIntInc(1, 1800);
    console.log(a);

    request("https://xkcd.com/"+a+"/info.0.json", function (error, response, body) {
        var obj = JSON.parse(body)
        console.log(obj.img);       

        var imgrequest = require('request').defaults({
            encoding: null
        });

        imgrequest.get(obj.img, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                imdata =  new Buffer(body).toString('base64');
                //tweetImage(data);

                T.post('media/upload', {
                    media_data: imdata
                }, function (err, data, response) {
                    console.log(data);
                    //  console.log(response);

                    var id = data.media_id_string;
                    var tweet = {
                        status: '#XKCD '+obj.title,
                        media_ids: [id]
                    };
                    T.post('statuses/update', tweet, function (err, data, response) {
                        if (err) {
                            console.log("failed!");

                        } else {
                            console.log("sucess!");
                            getajoke();
                        }
                    });
                });
            }
        });
    });
}


function getajoke() {
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
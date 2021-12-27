//Load anything that is in file .env...into environment variable
require('dotenv').config();

//console.log(process.env);

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN
});


var XMLHttpRequest = require('xhr2'); //Nodejs does not support XML requests directly...therefore this library
//var xhr = new XMLHttpRequest();


const code = require('twitter-woeid');
const {Telegraf} = require('telegraf'); // import telegram lib
//const bot_token = "5087705507:AAEWngazLsyFtPsVZwcW2jl-LnB49AIdXXQ" ;
const bot = new Telegraf(process.env.BOT_TOKEN) // get the token from envirenment variable

/*
    .start() - Registers a middleware for handling "/start"
    Call-back function has an argument as context(or ctx)..this is an Context instance and varies for every user
    It contains usueful informations for manipulation of the environment 
*/
bot.start(function (ctx){
    console.log(ctx.update.message.from.first_name);
    console.log(ctx.update.message.text);
    ctx.reply("Welcome ...say Hi");
});

bot.hears('Hi', function (ctx){
    console.log(ctx.update.message.from.first_name);
    console.log(ctx.update.message.text);
    ctx.reply("Hello " + ctx.update.message.from.first_name + " Hope you are doing well. I can provide you with top trending topics on twitter in your locality");
    ctx.reply ("Just type GET to get the list of trending hashtags in your location");
    
});

var xhrRequest =new XMLHttpRequest();

bot.hears(["GET" , "get" , "Get"]  , function (ctx){
    console.log(ctx.update.message.from.first_name);
    console.log(ctx.update.message.text);
    ctx.reply ("Just share with me your location");
    bot.on('location', (ctx) => {
    
    let latitude = ctx.update.message.location.latitude;
    let longitude = ctx.update.message.location.longitude;

    //Using first twitter api to get woeid Code for current latitude and longitude
    
    let firstAddress = "https://api.twitter.com/1.1/trends/closest.json?lat=" + latitude.toString(10) + "&long=" + longitude.toString(10);
    client.get(firstAddress , function(req , res){
    
    let woeid = res[0].woeid;
    
    var address = "https://api.twitter.com/1.1/trends/place.json?id=" + woeid;
    client.get(address , function (req , res){
        //console.log(res[0].trends);

        let str = "";
        
        for (let i = 0;i < 20;i++){
            str += (i+1).toString(10) + " . Name :" + res[0].trends[i].name + "\n\n";
            str += "    URL :" + res[0].trends[i].url + "\n\n";
            str += "    Tweet Volume :" + res[0].trends[i].tweet_volume + "\n\n";
        }
        ctx.reply(str);
    });
    
});
       
    
});
});


bot.launch();
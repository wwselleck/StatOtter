var Snoocore = require('snoocore');

var config = require('./config.json');
var Reddit = require('./lib/reddit.js');
var WinnieBot = require('./lib/winniebot.js')

var r = new Snoocore({
  userAgent: '/u/WinnieBot WinnieBot@0.0.0', // unique string identifying the app
  oauth: {
    type: 'script',
    key: config.api_key, // OAuth client key (provided at reddit app)
    secret: config.secret_key, // OAuth secret (provided at reddit app)
    username: 'WinnieBot', // Reddit username used to make the reddit app
    password: config.password, // Reddit password for the username
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'vote', 'submit' ]
  }
});

var reddit = new Reddit(r);
var WinnieBot = new WinnieBot(reddit, config);
WinnieBot.start();





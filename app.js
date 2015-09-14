var Snoocore = require('snoocore');
var config = require('./config.json');

var reddit = new Snoocore({
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
    scope: [ 'identity', 'read', 'vote' ]
  }
});

reddit('/r/nfl/hot').get().then(function(result) {
  var submission = result.data.children[0];
  console.log(submission);
  var submissionDate = new Date(result.data.children[0].data.created_utc * 1000);
  var now = new Date();
  console.log(submissionDate);
  console.log(now);
  console.log((now.getTime() - submissionDate.getTime()) / 1000); 
});

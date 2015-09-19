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

var already_commented = [];
var url = '/r/' + config.target_subreddit + '/comments';

function run(){
  console.log('Fetching the latest comments from ' + url);
  return new Promise(function(resolve, reject){
    reddit(url).get({sort: 'new', limit: 100}).then(function(result) {
      var comments = result.data.children;
      comments.forEach(function (comment){
        var commentBody = comment.data.body;
        if(/WinnieBot!/.test(commentBody)){
          console.info('FOUND ME A MATCH MATEY!');
          console.info(comment);
        }
        resolve();
      });

      /*
      console.log('NUMBER OF POSTS RETRIEVED: ' + posts.length);
      var submission = result.data.children[0];
      var submissionDate = new Date(result.data.children[0].data.created_utc * 1000);
      var now = new Date();
      console.log(submissionDate);
      console.log(now);
      console.log((now.getTime() - submissionDate.getTime()) / 1000);
      */
    });
  });
}

function main(){
  run().then(function(){
    setTimeout(function(){
      console.log("I HAVE AWOKEN");
      main();
    }, 5000);
  });
}

main();

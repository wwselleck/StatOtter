var Snoocore = require('snoocore');
var async = require('async');

var config = require('./config.json');
var Logger = require('./logger.js');

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


function analyzeAndPost(comment){
  var parentPostId = comment.data.link_id.slice(3);
  var url = '/r/' + comment.data.subreddit + '/comments/' + parentPostId;
  return reddit(url).get().then((commentTree) => {
    var linkListing = commentTree[0];
    var linkInfo = linkListing.data.children[0];
    var comments = commentTree[1].data.children;

    Logger.headerSmall('Parent Link Info');
    console.log(linkInfo);
    var stats = {
      numberOfComments: linkInfo.num_comments,
      commenters: {},
      words: {},
      flairCount: {}
    };

    comments.forEach((currentComment) =>{
      var currentCommentData = currentComment.data;
      console.log(currentComment);
    });

  });
};

function run(){
  Logger.header('Fetching the latest comments from ' + url);
  return new Promise((resolve, reject) => {
    //Get latest 100 comments
    reddit(url).get({sort: 'new', limit: 100}).then(function(result) {
      var comments = result.data.children;
      var promises = [];

      //Add matching comments to promise list
      comments.forEach((comment) => {
        var commentBody = comment.data.body;
        if(/WinnieBot!/.test(commentBody)){
          Logger.header('Match Found! Comment ' + comment.data.id + ' in Thread ' + comment.data.link_id);
          console.info(comment);

          promises.push((callback) => {
            return analyzeAndPost(comment).then(() => {
              callback();
            });
          });
        }
      });

      //Analyze and post for all matcing coments
      async.series(promises, () => {
        resolve();
      });
    });
  });
}

function main(){
  run().then(() => {
    setTimeout(() => {
      console.log("I HAVE AWOKEN");
      main();
    }, 5000);
  });
}

main();

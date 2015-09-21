var Snoocore = require('snoocore');
var async = require('async');

var config = require('./config.json');
var Logger = require('./logger.js');
var Util = require('./util.js');
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

function analyzeComment(comment, stats){
  var commentData = comment.data;
  Logger.headerSmall('Analyzing comment ' + commentData.id);
  console.log(comment);

  var author = commentData.author;
  stats.commenters[author] ? stats.commenters[author] += 1 : stats.commenters[author] = 1;

  var correctedBody = Util.replaceAll(commentData.body, {
    '\n': ' ',
  });
  var words = correctedBody.split(" ");
  words.forEach(word => {
    stats.words[word] ? stats.words[word] += 1 : stats.words[word] = 1;
  });

  var authorFlair = commentData.author_flair_text;
  stats.flairCount[authorFlair] ? stats.flairCount[authorFlair] += 1 : stats.flairCount[authorFlair] = 1;

  if(commentData.replies){
    commentData.replies.data.children.forEach(reply => {
      analyzeComment(reply, stats);
    })
  }
}

function analyzeAndPost(comment){
  var parentPostId = comment.data.link_id.slice(3);
  var url = '/r/' + comment.data.subreddit + '/comments/' + parentPostId;

  return reddit(url).listing({}, {listingIndex: 0}).then((linkListing) => {
    console.log(linkListing);
    var linkInfo = linkListing.children[0];

    Logger.headerSmall('Parent Link Info');
    console.log(linkInfo);

    return reddit(url).listing({}, {listingIndex: 1}).then(commentListing => {
      var comments = commentListing.children;
      var stats = {
        numberOfComments: linkInfo.num_comments,
        commenters: {},
        words: {},
        flairCount: {}
      };

      Logger.headerMedium('Analyzing comments...');
      comments.forEach((currentComment) =>{
        if(currentComment.kind === 't1'){
          analyzeComment(currentComment, stats);
        }
      });
      Logger.headerMedium('Analysis Complete! Reporting stats...');
      console.log(stats);

      });
  });
};

function run(){
  Logger.headerLarge('Fetching the latest comments from ' + url);
  return new Promise((resolve, reject) => {
    //Get latest 100 comments
    reddit(url).get({sort: 'new', limit: 100}).then(function(result) {
      var comments = result.data.children;
      var promises = [];

      //Add matching comments to promise list
      comments.forEach((comment) => {
        var commentBody = comment.data.body;
        if(/WinnieBot!/.test(commentBody)){
          Logger.headerLarge('Match Found! Comment ' + comment.data.id + ' in Thread ' + comment.data.link_id);
          Logger.headerSmall('Matching Comment Info');
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

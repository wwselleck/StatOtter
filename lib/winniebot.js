"use strict"

var Logger = require('./logger.js');
var Util = require('./util.js');
var async = require('async');

class WinnieBot{
	constructor(redditapi, config, cache){
		this.reddit = redditapi;
		this.config = config;
		this.cache = cache;
	}

	start(){
		this.run().then(() => {
			setTimeout(() => {
      	console.log("I HAVE AWOKEN");
	      this.start();
	    }, 5000);
  	});
	}

	run(){
	  return new Promise((resolve, reject) => { 
      console.log();
      var url = '/r/' + this.config.target_subreddit + '/comments';
      Logger.headerLarge('Fetching the latest comments from ' + url);
	    //Get latest 100 comments
	    this.reddit.get(url, {sort: 'new', limit: 100}).then(result => {
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
	            return this._processMatchingComment(comment).then(() => {
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

  _processMatchingComment(comment){
    var parentPostId = comment.data.link_id.slice(3);
    var parentPostUrl = '/r/' + comment.data.subreddit + '/comments/' + parentPostId;

    return this.reddit.listing(parentPostUrl, {}, {listingIndex: 0}).then((linkListing) => {
      console.log(linkListing);
      var linkInfo = linkListing.children[0];

      Logger.headerSmall('Parent Link Info');
      console.log(linkInfo);

      return this.reddit.listing(parentPostUrl, {}, {listingIndex: 1}).then(commentListing => {
        var comments = commentListing.children;
        var stats = {
          numberOfComments: linkInfo.data.num_comments,
          commenters: {},
          words: {},
          flairCount: {}
        };

        Logger.headerMedium('Analyzing comments...');

        comments.forEach((currentComment) => {
          console.log(currentComment);
          if(currentComment.kind === 't1'){
            this._analyzeComment(currentComment, stats);
          }
        });

        Logger.headerMedium('Analysis Complete! Reporting stats...');
        console.log(stats);

        });
    });
  }

  _analyzeComment(comment, stats){
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
        this._analyzeComment(reply, stats);
      })
    }
  }
}

module.exports = WinnieBot;
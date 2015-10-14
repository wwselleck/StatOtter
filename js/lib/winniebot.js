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

    return this.reddit.get(parentPostUrl, {sort: 'top'}).then(link => {
      console.log(link);
      var linkListing = link[0];
      var commentsListing = link[1];
      console.log(linkListing);

      var linkInfo = linkListing.data.children[0];

      Logger.headerSmall('Parent Link Info');
      console.log(linkInfo);

      Logger.headerLarge('Comments Listing');
      console.log(commentsListing);

      var stats = {
        numberOfComments: linkInfo.data.num_comments,
        commentsProcessed: 0,
        commenters: {},
        words: {},
        flairCount: {}
      };

      return this._getAllComments(commentsListing).then(comments => {
        return this._processComments(comments, stats);
      });

    });
  }

  _getAllComments(commentListing){
    return new Promise((resolve, reject) => {
      var ret = [];
      var morePromises = [];

      commentListing.data.children.forEach(comment => {
        this._addComment(comment, ret);
      });
      resolve(ret);
    });
  }

  _addComment(comment, list){
    if(comment.kind === 't1'){
      Logger.headerSmall('Adding comment to comment list...');
      console.log(comment);

      list.push(comment);
    }
    if(comment.data.replies){
      var replies = comment.data.replies.data.children;
      replies.forEach(reply => {
        this._addComment(reply, list);
      });
    }
  }

  _processComments(comments, stats){
    Logger.headerMedium('Analyzing comments...');

    comments.forEach(currentComment => {
      this._processComment(currentComment, stats);
    });

    Logger.headerMedium('Analysis Complete! Reporting stats...');
    console.log(stats);
  }

  _processMore(more, parentLinkInfo, stats){
    var url = '/api/morechildren';
    var options = {
      link_id: parentLinkInfo.name,
      children: more.data.children,
      api_type: 'json'
    }
    this.reddit.get(url, options).then(comments => {
      comments.json.data.things.forEach(comment => {
        this._processComment(comment, stats);
      });
    })
  }

  _processComment(comment, stats){
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

    stats.commentsProcessed++;

    if(commentData.replies){
      
    }
  }
}

module.exports = WinnieBot;
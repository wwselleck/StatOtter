"use strict"
class Reddit{
  constructor(api){
   this.redditapi = api;
  }

  get(url, options){
    return this.redditapi(url).get(options);
  }

  listing(url, options, callContextOptions){
    return this.redditapi(url).listing(options || {}, callContextOptions || {});
  }
}

module.exports = Reddit;

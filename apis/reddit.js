const loadConfig = require('../simple_server/process_env.js');
const config = loadConfig();
const redditPass = config.reddit.pass;
const redditId = config.reddit.id;
const ClientOAuth2 = require('client-oauth2');
const request = require('request');

let PostsObj = function() {
  this.domain = 'https://oauth.reddit.com';
  this.token = '';
  this.posts = [];
  this.comments = [];
  this.getPosts = (cb, sub) => {

    let id = redditId || process_env.REDDIT_ID;
    let secret = redditPass || process_env.REDDIT_PASSWORD;
    let tokenUrl = 'https://www.reddit.com/api/v1/access_token';

    const redditAuth = new ClientOAuth2({
      accessTokenUri: tokenUrl,
      clientId: id,
      clientSecret: secret
    });

    redditAuth.credentials.getToken()
      .then((user) => {
        let token = user.accessToken;
        let postsJson = '';
        let url = `${this.domain}/r/${sub}/new`;
        let options = {
          headers: {
            'User-Agent': 'node:sensi:v.0.0.0 (by u/kokojesus)',
            'Authorization': `Bearer ${token}`
          },
          form: {
            'client_id': id,
            'client_secret': secret
          },
          url: url
        };
        request.get(options, (error, res) => {
          if (error) {
            console.log(error);
          } else {
            cb(res.body);
          }
        });
      });
  }

  this.getComments = (cb) => {
    let commentsJson = '';
    this.posts.forEach( post => {
      let commentUrl = url + post.post.data.permalink + '.json';
      https.get(commentUrl, (res) => {
        res.on('data', function(chunk) {
          commentsJson += chunk;
        });
        res.on('end', function() {
          this.comments = JSON.parse(commentsJson);
          cb(this.comments);
        });
      });
    });
  }
}

module.exports = new PostsObj();

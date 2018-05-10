const watsonNLUV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const loadConfig = require('../simple_server/process_env.js');
const config = loadConfig();
const nluWatsonPass = config.nluWatson.pass;
const nluWatsonId = config.nluWatson.id;

let WatsonObj = function() {
  this.nlu = new watsonNLUV1({
    username: nluWatsonId || process_env.NLPWATSON_ID,
    password: nluWatsonPass || process_env.NLPWATSON_PASSWORD,
    version_date: watsonNLUV1.VERSION_DATE_2017_02_27
  });

  this.getNLU = (data, cb) => {
    let parameters = {};

    if(data.url) {
      parameters = {
        'url': data.url,
        'features': {
          'entities': {
            'emotion': true,
            'sentiment': true
            // 'limit': 2
          },
          'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 2
          }
        }
      }
    } else {
      let text = data.text;
      while ( text.length() < 30 ) {
        text += '0';
      }

      parameters = {
        'text': text,
        'features': {
          'entities': {
            'emotion': true,
            'sentiment': true,
            'limit': 2
          },
          'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 2
          }
        }
      }
    }

    this.nlu.analyze(
      parameters,
      (error, response) => {
        if(error) {
          console.log(`error: ${error}`);
        } else {
          cb(error, response);
        }
      });
  }
}

module.exports = new WatsonObj();

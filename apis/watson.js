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
      parameters = {
        'text': data.text,
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

    // if (data.type === 'title' || data.type === 'selfText') {
    //   let apprStr = '';
    //   let str = data.source;
    //   let numWords = str.split(' ').length;
    //   console.log(`numWords: ${numWords}`);
    //
    //   if (numWords <= 15) {
    //     let count = 15 - numWords;
    //     let i = 0;
    //     while (i < count) {
    //       str += ' 000000';
    //       i++;
    //     }
    //   }
    //   parameters = {
    //     'text': str,
    //     'features': {
    //       'entities': {
    //         'emotion': true,
    //         'sentiment': true,
    //         'limit': 2
    //       },
    //       'keywords': {
    //         'emotion': true,
    //         'sentiment': true,
    //         'limit': 2
    //       }
    //     }
    //   }
    // }
    // console.log(parameters);

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

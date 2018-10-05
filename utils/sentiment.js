const AWS = require('aws-sdk');

const comp = new AWS.Comprehend({ region: 'us-east-1' });

const NoTextError = new Error('No text provided for analysis');

const singleDetect = (textContent) => {
  if (!textContent) {
    return Promise.reject(NoTextError);
  }

  return comp.detectSentiment({
    LanguageCode: 'en',
    Text: textContent,
  }).promise()
  .then(data => data.SentimentScore);
};

const batchDetect = (textArr = []) => {
  if (!textArr.length) {
    return Promise.reject(NoTextError);
  }

  return comp.batchDetectSentiment({
    LanguageCode: 'en',
    TextList: textArr,
  }).promise().then(data => data.ResultList);
}

module.exports = {
  singleDetect,
  batchDetect,
};

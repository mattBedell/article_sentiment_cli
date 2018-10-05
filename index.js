require('dotenv').config();
const inquirer = require('inquirer');

const getHomepageProps = require('./utils/getHomepageProps');
const buildArticleText = require('./utils/buildArticleText');
const {batchDetect, singleDetect } = require('./utils/sentiment')

async function getSentimentByTitle() {
  const articleProps = await getHomepageProps();
  const sentiments = await batchDetect(articleProps.map(prop => prop.title));

  return sentiments.map((sentimentData, i) => ({ ...sentimentData, ...articleProps[i] }));
}

function filterBySentimentPrompt(articleSentiments) {
  return inquirer.prompt([
    {
      type: 'list',
      message: 'Filter by sentiment: ',
      name: 'sentiment',
      choices: Object.keys(articleSentiments.reduce((keyMap, articleObj) => {
        keyMap[articleObj.Sentiment] = true;
        return keyMap;
      }, {})),
    },
  ]);
}

function filteredArticleChoicesPrompt(filterdArticleSentiments) {
  return inquirer.prompt([
    {
      type: 'list',
      message: 'Choose an article to analyze: ',
      name: 'articleIndex',
      choices: filterdArticleSentiments.map(({ title:name, Index:value }) => ({ name, value, short: name })),
    },
  ]);
}

async function init() {
  console.log('Fetching article headlines...\n');
  const sentiments = await getSentimentByTitle();
  console.log(`Found ${sentiments.length} headlines to analyze...\n`);

  const sentimentFilter = await filterBySentimentPrompt(sentiments);

  const filteredTitles = sentiments.filter(articleObj => articleObj.Sentiment === sentimentFilter.sentiment);

  const { articleIndex } = await filteredArticleChoicesPrompt(filteredTitles);

  console.log('\nFetching article content...\n');
  const articleText = await buildArticleText(sentiments[articleIndex].href);

  console.log('Analyzing article content...\n');
  const articleSentimentAnalysis = await singleDetect(articleText);

  console.log(articleSentimentAnalysis);
}

init();
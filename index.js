require('dotenv').config();
const inquirer = require('inquirer');

const getHomepageProps = require('./utils/getHomepageProps');
const {batchDetect, singleDetect } = require('./utils/sentiment')

const sortBySentimentPrompt = inquirer.createPromptModule();

async function getSentimentByTitle() {
  const articleProps = await getHomepageProps();
  const sentiments = await batchDetect(articleProps.map(prop => prop.title));

  return sentiments.map((sentimentData, i) => ({ ...sentimentData, ...articleProps[i] }));
}

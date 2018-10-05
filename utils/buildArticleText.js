const { JSDOM } = require('jsdom');

const requestPage = require('./requestPage');

module.exports = async function(articleUrl) {
  const articleDoc = await requestPage(articleUrl);

  const dom = new JSDOM(articleDoc);

  const paragraphText = Array.from(dom.window.document.querySelectorAll('article p'));

  return paragraphText.reduce((articleText, pElement) => {
    // keep text under AMZN limit of 5000
    // TODO: better size detection
    if (Buffer.byteLength(articleText, 'utf8') >= 4500) {
      return articleText;
    }

    return articleText + `${pElement.textContent}\n`;
  }, '');
}
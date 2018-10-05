const { JSDOM } = require('jsdom');

const requestPage = require('./requestPage');


// article <a> elements come in two flavors
const getTitle = (previewLink) => {
  // small article card
  let title = previewLink.querySelector('.article_preview--title > span')
  if (!title) {
    // large article card
    title = previewLink.querySelector('.article_metabox--title');
  }

  return title.innerHTML;
}

module.exports = async function getHomepageArticles() {
  const homepageDoc = await requestPage('http://www.lifedaily.com');

  // construct DOM and get all article links
  const dom = new JSDOM(homepageDoc);
  const queryAllPreviews = dom.window.document.querySelectorAll('.article_preview > a');

  // get array of article prop objects
  return Array.from(queryAllPreviews).reduce((propArr, previewElement) => {
    const { href } = previewElement;

    return [
      ...propArr,
      {
        href,
        title: getTitle(previewElement),
      }
    ]
  }, []);
}

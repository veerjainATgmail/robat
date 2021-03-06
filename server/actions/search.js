const actions = require('../actions');
const {firstEntityValue} = require('../utils');
const OBAClient = require('../oba');

actions.register('search', search);

function search({context, entities}) {
  const type = firstEntityValue(entities, 'type');

  const author = firstEntityValue(entities, 'author');
  const contact = firstEntityValue(entities, 'contact');

  const language = firstEntityValue(entities, 'language');
  const year = firstEntityValue(entities, 'year');
  const searchQuery = firstEntityValue(entities, 'search_query');
  const parameters = {
    ps: 5,
  };

  if (type) {
    if (parameters.facet) {
      parameters.facet.push(`Type(${type})`);
    } else {
      parameters.facet = [`Type(${type})`];
    }
  }

  if (language) {
    if (parameters.facet) {
      parameters.facet.push(`Language(${language})`);
    } else {
      parameters.facet = [`Language(${language})`];
    }
  }

  if (year) {
    if (parameters.facet) {
      parameters.facet.push(`pubYear(${year})`);
    } else {
      parameters.facet = [`pubYear(${year})`];
    }
  }

  if (author) {
    if (parameters.q) {
      parameters.q += `${author} `;
    } else {
      parameters.q = `${author} `;
    }
  }

  if (contact) {
    if (parameters.q) {
      parameters.q += `${contact} `;
    } else {
      parameters.q = `${contact} `;
    }
  }

  if (searchQuery) {
    if (parameters.q) {
      parameters.q += `${searchQuery} `;
    } else {
      parameters.q = `${searchQuery} `;
    }
  }

  return OBAClient.get('search', parameters)
    .then(res => JSON.parse(res))
    .then(res => {
      const count = Number(res.aquabrowser.meta.count);

      if (count === 0) {
        delete context.results;
        context.notFound = true;
      } else {
        delete context.notFound;
        context.results = res.aquabrowser.results;
      }

      return context;
    })
    .catch(err => console.log(err)); // eslint-disable-line no-console

}

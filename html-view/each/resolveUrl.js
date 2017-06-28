const { resolve } = require('../vendors/url')

module.exports = baseUrl =>
  item => {
    if (['img', 'video', 'audio', 'source'].indexOf(item.tagName) !== -1) {
      if (item.attributes.src) item.attributes.src = resolve(baseUrl, item.attributes.src)
    } else if (item.tagName === 'a') {
      item.attributes.href = resolve(baseUrl, item.attributes.href)
    }
  }

// <a> to <navigator>

const url = require('../vendors/url')
const Router = require('../vendors/Router')

module.exports = (domain, routes) =>
  item => {
    if (item.tagName === 'a') {
      const u = url.parse(item.attributes.href)
      if (u.hostname === domain) {
        const router = new Router(routes)
        const route = router.match(u.pathname)
        if (route) {
          item.wxTag = 'navigator'
          item.url = url.format({ pathname: route.path, query: Object.assign(u.query, route.params, route.options) })
        }
      }
    }
  }

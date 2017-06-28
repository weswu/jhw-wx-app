const himalaya = require('./vendors/himalaya')
const defaultEachFn = require('./each/default')
const resolveUrl = require('./each/resolveUrl')

class HtmlParser {
  constructor(html, { baseUrl } = {}) {
    this.nodes = himalaya.parse(html)
    if (baseUrl) this.each(resolveUrl(baseUrl))
    this.each(defaultEachFn)
  }

  each(fn) {
    this._each(fn, this.nodes)
    return this
  }

  _each(fn, nodes) {
    nodes.forEach((item, ...args) => {
      fn(item, ...args)

      if (item.children) this._each(fn, item.children)
    })
  }

  filter(fn) {
    this.nodes = this._filter(fn, this.nodes)
    return this
  }

  _filter(fn, nodes) {
    return nodes.filter((item, ...args) => {
      const result = fn(item, ...args)
      if (result && item.children) item.children = this._filter(fn, item.children)
      return result
    })
  }

  map(fn) {
    this.nodes = this._map(fn, this.nodes)
    return this
  }

  _map(fn, nodes) {
    return nodes.map((item, ...args) => {
      item = fn(item, ...args)
      if (item.children) item.children = this._map(fn, item.children)
      return item
    })
  }
}

module.exports = HtmlParser

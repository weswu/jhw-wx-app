const html5Entities = require('../vendors/html5-entities')
const { windowWidth } = wx.getSystemInfoSync()

module.exports = item => {
  // decode html entities
  if (item.type === 'Text') {
    item.content = html5Entities.decode(item.content)
    return
  }

  // <video> and <audio>
  if (item.tagName === 'video' || item.tagName === 'audio') {
    item.wxTag = item.tagName

    if (!item.attributes.src) {
      item.children.some(child => {
        if (child.tagName === 'source') {
          item.attributes.src = child.attributes.src
          return true
        }
        return false
      })
    }
    return
  }

  // <br>
  if (item.tagName === 'br') {
    item.wxTag = 'text'
    item.children = [{ type: 'Text', content: '\n' }]
    return
  }

  // other tags
  if (['b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'time', 'var', 'a', 'bdo', 'map', 'object', 'q', 'script', 'span', 'sub', 'sup', 'button', 'input', 'label', 'select', 'textarea'].indexOf(item.tagName) !== -1) {
    item.wxTag = 'text'
  } else {
    item.wxTag = 'view'
  }

  // <img>
  if (item.tagName === 'img') {
    item.wxTag = 'image'

    let width, height

    if (!item.attributes.style) item.attributes.style = {}

    if (item.attributes.style.width && item.attributes.style.width.indexOf('px')) {
      width = item.attributes.style.width.slice(0, -2)
    } else if (item.attributes.width) {
      width = item.attributes.width
    }

    if (item.attributes.style.height && item.attributes.style.height.indexOf('px')) {
      height = item.attributes.style.height.slice(0, -2)
    } else if (item.attributes.height) {
      height = item.attributes.height
    }

    if (item.attributes.style) {
      delete item.attributes.style.width
      delete item.attributes.style.height
    }

    delete item.attributes.width
    delete item.attributes.height

    if (width && width < windowWidth) {
      item.attributes.style.width = width + 'px'
      if (height) item.attributes.style.height = height + 'px'
    }
  }

  // generate inline style string
  if (item.attributes && item.attributes.style) {
    item.attributes.styleString = Object.keys(item.attributes.style).map(key => key + ': ' + item.attributes.style[key]).join(';')
  }
}

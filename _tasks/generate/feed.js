'use strict'

const { isArray, isObject } = require('lodash')

module.exports.customElements = ({ image, speakers }) => {
  let custom = []

  if (image) {

    // Structure properties as key-value objects in array,
    // produces: <image><url></url><title></title> ... </image>
    let xml = Object.keys(image).map(key => (
      { [key]: image[key] }
    ))

    custom.push({ image: xml })
  }

  if (speakers) {
    let author = speakers

    // Handle different data structures for speakers
    if (!isArray(author)) {
      author = [author]
    }

    // Extract name if extra information is included
    author = author.map(entry => (
      isObject(entry) ? entry.name : entry
    ))

    custom.push({ author: `<![CDATA[ ${author.join(', ')} ]]` })
  }

  return custom
}

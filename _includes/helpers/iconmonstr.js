const fs = require('fs');
const path = require('path');
const { images } = require('../../paths.json');

module.exports.iconmonstr = (input) =>
  fs.readFileSync(`${images.dir}iconmonstr/${input.toString().toLowerCase()}.svg`, 'utf8');

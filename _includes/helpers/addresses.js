'use strict'

module.exports.latitude = latlong => latlong.split(',')[0]
module.exports.longitude = latlong => latlong.split(',')[1]
module.exports.directions = ({location, address}) => (
  location ? location : `https://maps.google.co.uk/?q=${encodeURIComponent(address)}`
)

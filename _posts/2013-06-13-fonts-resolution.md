---
number: 73
title: Double Bill: Responsive Web Fonts, Resolution Independence
summary: Achieving resolution independence through SVG and asset fonts
date: 2013-06-13T19:15+00:00
lanyrd: http://lanyrd.com/2013/asyncjs-respwebfonts-resindependence/
speakers:
- name: Richard Rutter
  link: http://clagnut.com
- name: Josh Emerson
  link: http://joshemerson.co.uk
sponsors: 
image:
  url:   https://farm1.staticflickr.com/90/269611427_008e9c3f32.jpg
  title: "'Lines of a wave I' by somebody"
  link:  http://www.flickr.com/photos/sabriirmak/269611427/
tags:
- webfonts
- fontface
- responsive
- svg
- html5
venue:
  name: Lab for the Recently Possible
  link: http://L4RP.com
  location: http://l4rp.com/#location
  address: 45 Gloucester Street, Brighton, BN1 4EW
  latlong: 50.827006,-0.136063
layout: event
category: event
published: true

---

## Part 1: Responsive Web Fonts
Richard Rutter will discuss web fonts in a responsive context. He’ll demonstrate the different techniques available for optimum loading (or not) of web fonts and talk through the options around fallback fonts and other such implications.

## Part 2: Achieving Resolution Independence
Before the “mobile web” became a thing, people were creating fixed width sites. They got away with it for quite a while. They appeared to work. But with the introduction of a whole plethora of screen sizes and capabilities, the web wasn’t quite that simple any more, and so the term [Responsive Web Design][responsive] was coined to relate to sites which work regardless of context.

With the introduction of high-DPI devices, I’m seeing the same thing happening again. We got away with creating images at 72dpi, and it worked, for a while. Not any more. If we want our sites to look great regardless of the display density, we will need to switch to using vector formats instead of bitmap ones.

Josh Emerson will discuss a few techniques for achieving resolution independence on your site including asset fonts, where icons are stored inside a web font, and SVG graphics for vectors which are equal part image and document.

[responsive]: http://alistapart.com/article/responsive-web-design

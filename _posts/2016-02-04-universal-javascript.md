---
title: Writing Universal JavaScript
summary: "A JavaScript Meetup for Brighton & Hove"
date: 2016-02-04T19:15:00
lanyrd: http://lanyrd.com/2016/asyncjs-universal-javascript
speakers:
- name: Jack Franklin
  link: http://jackfranklin.co.uk/
sponsors:
- name: Brandwatch
  link: http://www.brandwatch.com
image:
    url: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/A_view_of_the_server_room_at_The_National_Archives.jpg/640px-A_view_of_the_server_room_at_The_National_Archives.jpg
    title: A view of the server room at The National Archives
    link: https://commons.wikimedia.org/wiki/File:A_view_of_the_server_room_at_The_National_Archives.jpg
tags:
- javascript
- node.js
- react
- universal
venue:
  name: 68 Middle St
  link: http://68middle.st
  location: http://goo.gl/maps/dxEiT
  address: Brighton, BN1
  latlong: 50.82116,-0.143144
layout: event.html
collection: events
---

The main criticism of single-page applications has always been their reliance on JavaScript, but recently there has been a focus on running these client-side applications on the server. Jack Franklin explains the reasons Universal JavaScript should be taken seriously as an approach to building sites and shows how to run client-side JavaScript application on the server.

Jack first explores in detail the reasons why you might want to run your client-side application on the server, including increasing your audience by enabling users without JS enabled and solving the common single-page-application problem of search-engine crawlers being unable to fully read the site. Jack demonstrates that by building the site this way round, you can build for non-JS clients and then layer JS support on, meaning you can give users with JS an incredibly snappy site without compromising.

Jack briefly discusses how ReactJS’s abstractions have led the way here by removing data binding and unifying the flow of data and also outlines some side benefits of this approach, including much easier testing. Although Jack uses ReactJS as his example, EmberJS is also taking this approach, and in the future it’s likely other frameworks will as well.

Following the discussion, Jack shows attendees how to build these applications using ReactJS and webpack. He demonstrates how to configure webpack to generate client-side bundles for your application while running ReactJS on the server through NodeJS. He also covers the development workflow and some additional third-party tools that make building these apps as straightforward as they can be.

### About Jack

Jack Franklin is a developer, writer, and speaker. He is the author of _Beginning jQuery_.

### Pre-requisite knowledge

Attendees should be familiar with JavaScript and the concept of single-page applications. Some knowledge about ReactJS is helpful but not essential.

# Update

This event will be sponsored by [Brandwatch][brandwatch], so **free beers & pizzas** will be supplied! Please contact hello AT asyncjs DOT com if you have specific dietary requirements.

[brandwatch]: http://www.brandwatch.com

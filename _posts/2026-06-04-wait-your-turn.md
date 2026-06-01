---
title: "Wait Your Turn - Durable Queues in Postgres"
summary: "A web tech meetup based in Brighton & Hove"
date: 2026-06-04T19:00:00
meetup: https://www.meetup.com/async-web-tech-meetup/events/315053149/
speakers:
  - name: Dave Pereira-Gurnell
    link: https://spacecat.io/
image:
  url: /img/talks/dave-pereira-gurnell.jpg
  title: Dave Pereira-Gurnell
sponsors:
  - name: Puck
    logo: /img/sponsors/puck.png
    link: https://puckeditor.com/
tags:
  - ai
  - llm
venue:
  name: Runway East
  link: https://runwayea.st/locations/brighton?utm_source=external&utm_medium=event&utm_campaign=sponsorship
  location: https://goo.gl/maps/WGe2p9D7Wup3LdNt8
  address: York And Elder Works, 50 New England St, Brighton BN1 4AW
  latlong: 50.8325788,-0.1420808
layout: event.hbs
collection: events
---

What do you do when the work required to handle a web request takes longer than the browser timeout? What do you do when you need to do something but there are no users around to talk to your server? You, my friend, need a queue.

This talk is about building job queues to do the grunt work in your web app. We'll start with the motivations for using a queue and we'll proceed by building one from scratch using PostgreSQL. We'll discuss features like persistence, concurrent job handling, retries, fault tolerance, and responding to jobs sent from outside your app.

We'll follow a running example of a shared, live word cloud that grows as we throw content at the server. Bring a laptop or a phone — yes, you'll all be able to submit URLs to a server full of strangers, what could possibly go wrong — and we'll watch it scale, and occasionally fall over, in real time. Aimed at anyone who's wired background jobs into a Node app and wanted a clearer picture of what's going on under the hood; no Postgres experience required.

You will be able to join us in-person at [Runway East](https://runwayea.st/locations/brighton?utm_source=external&utm_medium=event&utm_campaign=sponsorship) or online [via YouTube](https://www.youtube.com/watch?v=4dfQUuZj-r8).

---

🍕🍻 Pizza and drinks will be provided thanks to sponsorship from [Puck - the open source visual editor for React](https://puckeditor.com/).

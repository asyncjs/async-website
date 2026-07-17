---
title: "Web Performance, End to End"
summary: "A web tech meetup based in Brighton & Hove"
date: 2026-08-06T19:00:00
meetup: https://www.meetup.com/async-web-tech-meetup/events/315722803/
speakers:
  - name: Niall Coleman-Clarke
    link: https://cdrn.cc/
image:
  url: /img/talks/niall-coleman-clarke.jpg
  title: Niall Coleman-Clarke
sponsors:
  - name: Puck
    logo: /img/sponsors/puck.png
    link: https://puckeditor.com/
tags:
  - web
  - performance
venue:
  name: Runway East
  link: https://runwayea.st/locations/brighton?utm_source=external&utm_medium=event&utm_campaign=sponsorship
  location: https://goo.gl/maps/WGe2p9D7Wup3LdNt8
  address: York And Elder Works, 50 New England St, Brighton BN1 4AW
  latlong: 50.8325788,-0.1420808
layout: event.hbs
collection: events
---

On August 6th we'll be joined by Niall Coleman-Clarke and take a look into improving the performance of a modern web app/website.

Most performance advice is a grab-bag of unrelated tips. This talk treats it as a system instead with three layers that compound: what the client has to render, how bytes travel between client and server, and how fast the server produces those bytes in the first place. Every little helps, even if you can do only some of these optimizations!

We'll go end-to-end with modern image formats and SSR on the rendering side, HTTP/2 vs HTTP/3 and resource hints on the transport side, runtime choice, minification, and static asset offloading on the serving side. Along the way we'll cover practically testing these yourself on your site: is your site actually multiplexing requests? Is upgrading to Rust for latency worth what it costs you in productivity?

Most of this is configuration and architecture, not a rewrite. The highest impact fixes are often the ones nobody's checked in months and are cheap to verify continuously, but expensive to untangle later.

You will be able to join us in-person at [Runway East](https://runwayea.st/locations/brighton?utm_source=external&utm_medium=event&utm_campaign=sponsorship) or online (link added closer to the event).

---

🍕🍻 Pizza and drinks will be provided thanks to sponsorship from [Puck - the open source visual editor for React](https://puckeditor.com/).

---
title: Life in an Eventually Consistent World
summary: Convergent Replicated Data Types with Riak and Node.
date: 2013-05-09T19:15:00
lanyrd: http://lanyrd.com/2013/asyncjs-eventual-consistency/
speakers:
- name: Cristiano Solarino
  link: http://www.linkedin.com/in/cristianosolarino
sponsors:
image:
  url:   https://farm4.staticflickr.com/3025/2303330321_051c08f3d2.jpg
  title: "'A Notable Lineage (2 of 2)' by blogrodent"
  link:  http://www.flickr.com/photos/blogrodent/2303330321/
tags:
- riak
- nodejs
- distributed databases
- crdt
- eventual consistency
- CAP
venue:
  name: Lab for the Recently Possible
  link: http://L4RP.com
  location: http://l4rp.com/#location
  address: 45 Gloucester Street, Brighton, BN1 4EW
  latlong: 50.827006,-0.136063
layout: event.hbs
collection: events
---

**NOTE THE NEW VENUE:** [Lab for the Recently Possible](http://L4RP.com), at 45 Gloucester Street, opposite The Skiff.


It turns out that we can't have it all when we are dealing with the kind of distributed systems required by today's web-scale applications. 

Brewer's Theorem tells us that for any such system we cannot simultaneously guarantee *Consistency*, *Availability* and tolerance to *Partitioning*. We can fulfill any two but we are stuck with a weaker version of whatever is left.

So what happens then when we choose to relax the requirement of data consistency? And how are we going to write reliable code in these situations?

In this talk, [Cristiano Solarino][cristiano] will look at one approach to cope with this scenario called *Convergent Replicated Data Types* using [Riak][riak] as the reference example of an *eventually consistent* database. Cris will explain why he thinks *CRDT*s are really cool and will walk through a couple of simple examples in [Node][node].

We'll then look at adding a constraint on the type of operations we can perform on our *CRDT*s, by creating a generic [Node][node] module to make our dev life a bit easier.

Cristiano is one-third of [BrightMinded][brightminded]'s dev team. Feed him Tiramisu and you'll have gained a friend for life.


### Update: Slides from the talk

The slides are at
<http://eve.terseuniverse.net>.


[cristiano]: https://twitter.com/c_solarino
[riak]: http://basho.com/riak
[node]: http://nodejs.org
[brightminded]: http://brightminded.com

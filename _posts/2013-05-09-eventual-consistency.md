---
number: 71
title: Life in an Eventually Consistent World
summary: Convergent Replicated Data Types with Riak and Node.
date: 2013-05-09T19:15+00:00
lanyrd: http://lanyrd.com/2013/asyncjs-eventual-consistency/
speakers:
- name: Cristiano Solarino
  link: http://www.linkedin.com/in/cristianosolarino
sponsors:
image:
  url:   http://farm4.staticflickr.com/3192/2941676828_07b19d1699.jpg
  title: "'Photo title' by Creator"
  link:  http://www.flickr.com/photos/chavals/2941676828/
tags:
- riak
- node
- distributed databases
- crdt
- eventual consistency
- CAP
venue:
  name: The Skiff
  link: http://theskiff.org/
  location: http://theskiff.org/contact/
  address: 6 Gloucester Street, Brighton, BN1 4EW
  latlong: 50.826945,-0.136401
layout: event
category: event
published: false # Set this to true to publish
---

It turns out that we can't have it all when we are dealing with the kind of distributed systems required by today's web-scale applications. 

Brewer's Theorem tells us that for any such system we cannot simultaneously guarantee *Consistency*, *Availability* and tolerance to *Partitioning*. We can fullfil any two but we are stuck with a weaker version of whatever is left!

So what happens then when we choose to relax the requirement of data consistency? And how are we going to write reliable code in these settings?

In this talk I shall look at one approach to cope with this scenario called *Convergent Replicated Data Types* using [Riak][riak] as the reference example of an *eventually consistent* database. I will discuss why I think *CRDT*s are really cool (*warning* may contains some maths!) and I will go through a couple of very simple examples in [Node][node].

I will then show how by adding a little constraint on the type of operations we can perform on our *CRDT*s, we can create a more generic [Node][node] module that will make our dev life a bit easier!

Let's discuss pros and cons after that shall we?


[Cristiano][cristiano] is one-third of [BrightMinded][brightminded]'s dev team. Give him some good Tiramisu' and you'll have gained a friend!

[riak]: http://basho.com/riak
[node]: http://nodejs.org
[brightminded]: http://brightminded.com






[![Build Status](https://travis-ci.org/asyncjs/async-website.svg?branch=master)](https://travis-ci.org/asyncjs/async-website)

# Async Website

Welcome to the repository for the Async website. The site is statically generated using [Metalsmith][#metalsmith] and hosted on [GitHub pages][#gh-pages]. This just means this repository contains templates and assets that are converted into a static HTML site each time a commit is pushed to GitHub.

## Running the server locally

You'll need [node.js][#nodejs] >=12.13.0 and npm >=6.10.0 installed locally.

If you are using nvm, you can run the following to install and use node 12:

```bash
nvm install
```

You will need to run the following each time you come to work on the site:

```bash
nvm use
```

You can then globally install npm 6 with:

```bash
npm i npm@6.10 -g
```

Once you have the correct node and npm versions you can install project dependencies by running:

```bash
$ npm ci
```

Then to start the server run the following from the project directory:

```bash
$ npm start
```

### Advanced usage

To run a single build and not create a watch task, run the following from the project directory:

```bash
$ npm test
```

This writes out the site files into the `dist/` directory.

## Creating a new event

To create a new post you'll need to create a new file in the `_posts/` directory. This should be named `YYYY-MM-DD-slug.md` where `YYYY-MM-DD` is the date of the event, `slug` is the page slug (what appears in the URL address) and `.md` is the format (`.html` is also supported but not recommended).

The top part of the file is meta data that is used to build the site. The second part after the second `---` is the post body, which can be formatted with [markdown][#md].

### Metadata

There is quite a bit of metadata that can be added to a post between the first and second `---`. It's formatted in [YAML][#yaml] and here's an overview of what it all means.

```yaml
title:      (optional) The title of the event.
summary:    (optional) A short one-liner for the event. Markdown is allowed.
date:       A ISO8601 formatted string for the date and time of the event.
lanyrd:     (optional) The url to the lanyrd page for the event.
speakers:   An array of speakers,
  - name:   Speaker name,
    link:   Speaker website or Twitter account.
sponsors:   (optional) An array of sponsors.
  - name:   Sponsor name,
    link:   Sponsor website,
    logo:   Sponsor logo.
image:      An image to accompany the page,
  url:      The url to the image,
  title:    A short description of the image,
  link:     A link to the image if hosted elsewhere.
tags:       An array of tags (no more than five please).
venue:      An object containing venue data,
  name:     The name of the venue,
  link:     The website for the venue,
  location: A link to a map for the venue,
  address:  The address of the venue all in one line,
  latlong:  Lat long for the venue, e.g. "50.826945,-0.136401".
layout:     The page layout file. Usually "event.html".
collection: The page category. Usually "events".
draft:      If true then the post will not appear on the site.
```

## Creating a blog post

A blog post is created in the same way as an event entry but the date in the filename should be the published date. For a blog post the metadata is much simpler:

```yaml
title:      (optional) The title of the blog post.
summary:    (optional) A short one-liner for the event. Markdown is allowed.
date:       A ISO8601 formatted string for the date and time of the event.
lanyrd:     (optional) The url to the lanyrd page for the event.
authors:    An array of authors,
  - name:   Author name,
    link:   Author website or Twitter account.
layout:     news.html
collection: news
draft:      false
```

## Triggering a site rebuild, without new content

GitHub pages rebuilds the site whenever a new commit is made. If a re-build is required, even without new content - e.g. in order to re-render the 'next event' on the home page, then run the following:

```bash
$ git commit --allow-empty -m "Republish GitHub pages (empty commit)"
$ git push
```

## Ownership

Async was founded by [Premasagar Rose][#prem] in 2010. He has since moved to Portugal, but kindly allowed the community to continue using the name, website, and domain. In the event of Async ceasing to continue, the domain of asyncjs.com should pass back to [Prem][#prem].


[#metalsmith]: http://metalsmith.io/
[#gh-pages]: https://pages.github.com/
[#nodejs]: https://nodejs.org/
[#md]: https://daringfireball.net/projects/markdown/
[#yaml]: http://yaml.org/
[#prem]: http://premasagar.com/

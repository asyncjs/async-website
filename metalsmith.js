"use strict";

const path = require("node:path");
const { rm, mkdir, cp } = require("node:fs/promises");

const isObject = require("isobject");
const moment = require("moment");

const metalsmith = require("metalsmith");
const tags = require("metalsmith-tags");
const feed = require("metalsmith-feed");
const drafts = require("@metalsmith/drafts");
const markdown = require("@metalsmith/markdown");
const permalinks = require("@metalsmith/permalinks");
const helpers = require("metalsmith-register-helpers");
const partials = require("metalsmith-discover-partials");
const boilerplates = require("@metalsmith/layouts");
const templates = require("@metalsmith/in-place");
const collections = require("@metalsmith/collections");
const archive = require("metalsmith-collections-archive");
const offsetCollections = require("metalsmith-collections-offset");
const redirect = require("metalsmith-redirect");
const metadataInFilename = require("metalsmith-metadata-in-filename");
const buildDate = require("metalsmith-build-date");
const excerpts = require("@metalsmith/excerpts");
const more = require("metalsmith-more");
const sitemap = require("metalsmith-sitemap");

const site = require("./site.json");
const { includes, layouts, posts, pages, dist } = require("./paths.json");

const t1 = performance.now();
build();

async function build() {
  await rm(".metalsmith/", { recursive: true, force: true });
  await mkdir(".metalsmith", { recursive: true });
  await cp(posts.dir, ".metalsmith/", { recursive: true });
  await cp(pages.dir, ".metalsmith/", { recursive: true });

  metalsmith(__dirname)
    .source(".metalsmith")
    .destination(dist.dir)
    .clean(false)
    .use(drafts())
    .metadata({ site })
    .use(metadataInFilename({ match: "*.md" }))
    .use(buildDate({ key: "BUILD" }))
    .use(
      redirect({
        redirections: {
          "/podcast": "/",
          "/feed": "/feed/atom/index.xml",
        },
      })
    )
    .use(
      collections({
        rss: {
          pattern: "*.md",
          reverse: true,
          refer: false,
        },
        news: {
          sortBy: "date",
          reverse: true,
        },
        events: {
          sortBy: "date",
          reverse: true,
        },
        headlines: {
          pattern: "*.md",
          sortBy: "date",
          filterBy: ({ collection, date }) =>
            collection.includes("news") &&
            moment(date).isSameOrAfter(moment().subtract(2, "months")),
          reverse: true,
          refer: false,
          limit: 2,
        },
        upcoming: {
          pattern: "*.md",
          sortBy: "date",
          filterBy: ({ collection, date }) =>
            collection.includes("events") &&
            moment(date).isSameOrAfter(moment(), "day"),
          refer: false,
          limit: 2,
        },
        past: {
          pattern: "*.md",
          sortBy: "date",
          filterBy: ({ collection, date }) =>
            collection.includes("events") &&
            moment(date).isBefore(moment(), "day"),
          reverse: true,
          refer: false,
          limit: 2,
        },
        soonest: {
          pattern: "*.md",
          sortBy: "date",
          filterBy: ({ collection, date }) =>
            collection.includes("events") &&
            moment(date).isSameOrAfter(moment(), "day"),
          refer: false,
          limit: 1,
        },
        latest: {
          pattern: "*.md",
          sortBy: "date",
          filterBy: ({ collection, date }) =>
            collection.includes("events") &&
            moment(date).isBefore(moment(), "day"),
          reverse: true,
          refer: false,
          limit: 1,
        },
      })
    )
    .use(
      offsetCollections({
        upcoming: 1,
      })
    )
    .use(markdown())
    .use(
      permalinks({
        linksets: [
          {
            match: { collection: "events" },
            pattern: ":slug",
          },
          {
            match: { collection: "news" },
            pattern: ":slug",
          },
        ],
      })
    )
    .use(excerpts())
    .use(more())
    .use(
      helpers({
        directory: path.join(includes.dir, "helpers/"),
      })
    )
    .use(
      partials({
        directory: path.join(includes.dir, "partials/"),
        pattern: /\.hbs$/,
      })
    )
    .use(
      archive({
        layout: "archive.hbs",
        collections: {
          news: true,
          events: true,
        },
      })
    )
    .use(tags({ layout: "tag.hbs" }))
    .use(
      templates({
        transform: "handlebars",
        extname: null,
        pattern: "**/*.{html,hbs}*",
      })
    )
    .use(boilerplates({ directory: layouts.dir }))
    .use(
      feed({
        collection: "rss",
        limit: false,
        destination: "feed/atom/index.xml",
        preprocess: (file) => ({
          ...file,
          author: file.speakers
            ? (Array.isArray(file.speakers) ? file.speakers : [file.speakers])
                .map((entry) => (isObject(entry) ? entry.name : entry))
                .join(", ")
            : null,
          custom_elements: [
            {
              image: file.image
                ? // Structure properties as key-value objects in array,
                  // produces: <image><url></url><title></title> ... </image>
                  Object.entries(file.image).map(([key, value]) => ({
                    [key]: value,
                  }))
                : null,
            },
          ],
        }),
      })
    )
    .use(sitemap({ hostname: site.url, lastmod: new Date() }))
    .build((err) => {
      if (err) throw err;
      console.info(
        `Build success in ${((performance.now() - t1) / 1000).toFixed(1)}s`
      );
    });
}

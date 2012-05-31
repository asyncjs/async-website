Async Website
=============

Welcome to the repository for the Async website. The site is a static
repository of files and directories that is converted by [Jekyll][#jekyll]
into a static site when a new commit is pushed to GitHub.

Creating a new event
--------------------

To create a new post you'll need to create a new file in the __posts_
directory. This should be named `YYYY-MM-DD-slug.md` where `YYYY-MM-DD` is the
date of the event, `slug` is the page slug and `.md` is the formatter.

See _0000-01-01-_blank.md_ for an example of how a post is structured. The
top part of the post is meta data that is used to build the site the second
part after the second `---` is the post body. This should be formatted
with [markdown][#md].

### Metadata

There is quite a bit of metadata that can be added to a post. It's formatted
in [YAML][#yaml] and here's an overview of what it all means.

    ---
    number:    The number of the event in the series.
    title:     The title of the event.
    summary:   A short one-liner for the event. Markdown is allowed.
    date:      A ISO8601 formatted string for the date and time of the event.
    lanyrd:    The url to the lanyrd page for the event.
    speakers:  An array of speakers
    - name:    Speaker name
      link:    Speaker website or twitter account.
    sponsors:  An array of sponsors.
    - name:    Sponsor name.
      link:    Sponsor website.
      logo:    Sponsor logo.
    image:     An image to accompany the page.
      url:     The url to the image.
      title:   A short description of the image.
      link:    A link to the image if hosted elsewhere
    tags:      An array of tags (no more than five please)
    venue:     An object containing venue data.
      name:    The name of the venue.
      link:    The website for the venue.
      location:A link to a map for the venue, falls back to Google Maps (optional)
      address: The address of the venue all in one line.
      latlong: Lat long for the venue eg. "50.826945,-0.136401"
    layout:    The page layout file. Usually "event"
    category:  The page category. Usually "event"
    published: If false then the post will not appear on the site.
    ---

Creating a blog post
--------------------

A blog post is created in the same way as an event entry but the date in
the filename should be the published date. For a blog post the metadata is
much simpler:

    --- 
    title:     The title of the blog post
    authors:   An array of authors
    - name:    The authors name.
      link:    The authors website.
    category:  news
    layout:    news
    published: true
    ---

[#md]: http://daringfireball.net/projects/markdown/
[#yaml]: http://www.yaml.org/
[#jekyll]: http://jekyllrb.com/

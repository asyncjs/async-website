/*!
    Hubbub

    by Chris Newton <http://chrisnewtn.com>,
       Seanewt <http://seanewt.com>,
       Dharmafly <http://dharmafly.com>

    Repo: <https://github.com/asyncjs/hubbub>
    MIT license
*/

Hubbub = (function() {

  "use strict";

  if ( ![].forEach || !window.XMLHttpRequest ) {
    return;
  }

  var containerClass = "hubbub",
      gistUrlAttr    = "data-gist-url",
      apiRoot        = "https://api.github.com/",
      widgets        = document.querySelectorAll( "." + containerClass ),
      hubbub         = {},
      useFixtures    = false;

  var cssClass = {
    avatar: "hubbub-avatar",
    avatarLink: "hubbub-avatar-link",
    header: "hubbub-header",
    username: "hubbub-username",
    commentBody: "hubbub-comment-body",
    timestamp: "hubbub-timestamp",
    permalink: "hubbub-permalink",
    content: "hubbub-content",
    container: "hubbub-container"
  };

  var cache = (function() {
    var key  = "hubbub-",
        life = 60 * 60 * 1000;

    return {
      has: function( id ) {
        return localStorage.getItem( key + id ) !== null;
      },
      get: function( id ) {
        var blob = JSON.parse( localStorage.getItem( key + id ) );
        if ( blob !== null ) {
          if ( (Date.now() - blob.createdAt) > life ) {
            localStorage.removeItem( key + id );
          }
        }
        return blob.comments;
      },
      set: function( id, comments ) {
        var blob = { comments: comments, createdAt: Date.now() };
        localStorage.setItem( key + id, JSON.stringify( blob ) );
      }
    };
  })();

  // Initial setup
  [].forEach.call( widgets, function( el ) {
    getComments( el, renderComments );
  });

  function getComments ( el, callback ) {
    var gistId = el.getAttribute( gistUrlAttr ).match( /\/(\w+)\/?$/ )[ 1 ];

    if ( cache.has( gistId ) ) {
      callback( el, cache.get( gistId ), gistId );
    } else {
      var url;
      if ( useFixtures ) {
        url = "fixtures/" + gistId + ".json";
      } else {
        url = apiRoot + "gists/" + gistId + "/comments";
      }
      ajax({
        url:url,
        dataType: "json"
      }, function( comments ) {
        parseMarkdown( comments, gistId, el, callback );
      }, function( err ) {
        el.innerHTML = el.innerHTML + "<small>Error fetching Comments</small>";
      });
    }
  }

  function parseMarkdown ( comments, gistId, el, callback ) {
    var opts = {
      url: apiRoot + "markdown",
      reqDataType: "json",
      type: "POST"
    };
    var delimiter = String.fromCharCode( 0x3091 );

    var reqText = comments.reduce(function( mem, curr ) {
      return mem + curr.body + "\r\n\r\n" + delimiter + "\r\n\r\n";
    }, "" );

    opts.data = { text: reqText };

    ajax( opts, function( blob ) {
      var parsedComments = blob.split( "<p>" + delimiter + "</p>" );
      parsedComments.forEach(function( comment, i ) {
        if ( comments[ i ] ) {
          comments[ i ].html_body = comment.trim();
        }
      });
      cache.set( gistId, comments );
      callback( el, comments );
    });
  }

  function renderComments ( el, comments ) {
    var heading = document.createElement( "h3" );
    heading.setAttribute("class", "heading" );
    var link = document.createElement("a" );
    link.setAttribute("href", el.getAttribute( gistUrlAttr ) );
    link.textContent = "Comments (" + comments.length + ")";
    heading.appendChild( link );
    el.appendChild( heading );

    comments.forEach(function( comment ) {
      el.appendChild( renderComment( el, comment ) );
    });
  }

  function renderComment ( container, comment ) {
    var el = document.createElement("div" );
    el.setAttribute("class", cssClass.container );
    el.appendChild( renderAvatar( comment.user ) );

    var content = document.createElement("div" );
    content.setAttribute("class", cssClass.content );
    content.appendChild( renderHeader( container, comment ) );
    content.appendChild( renderCommentBody( comment ) );

    el.appendChild( content );
    return el;
  }

  function renderHeader ( container, comment ) {
    var header = document.createElement("div" );
    header.setAttribute( "class", cssClass.header );

    var un = document.createElement("a" );
    un.setAttribute( "class", cssClass.username );
    un.setAttribute("href", comment.user.html_url );
    un.innerHTML = "<b>" + comment.user.login + "</b>";

    var commentUrl = container.getAttribute( gistUrlAttr );
    commentUrl = commentUrl + "#comment-" + comment.id;

    var pl = document.createElement("a" );
    pl.setAttribute( "class", cssClass.permalink );
    pl.setAttribute("href", commentUrl );
    pl.textContent = "commented";

    header.appendChild( un );
    header.appendChild( pl );
    header.appendChild( renderTimestamp( comment.created_at ) );
    return header;
  }

  function renderTimestamp ( timestamp ) {
    var diff = Date.now() - new Date( timestamp ).getTime();
    var el = document.createElement("time" );
    el.setAttribute( "class", cssClass.timestamp );
    el.setAttribute( "datetime", timestamp );
    el.setAttribute("title", timestamp );

    diff = Math.round( diff / 1000 );
    var str;

    if ( diff < 3600 ) {
      str = Math.round( diff / 60 ) + " minutes ago";
    } else if ( diff < 86400 ) {
      var hours = Math.round( diff / 3600 );
      str = hours === 1 ? "an hour ago" : hours + " hours ago";
    } else {
      var days = Math.round( diff / 86400 );
      str = days === 1 ? "yesterday" : days + " days ago";
    }

    el.textContent = str;

    return el;
  }

  function renderCommentBody ( comment ) {
    var body = document.createElement("div" );
    body.setAttribute("class", cssClass.commentBody );
    body.innerHTML = comment.html_body;
    return body;
  }

  function ajax ( options, success, error ) {
    var req = new XMLHttpRequest();
    options.type = options.type || "GET";
    req.addEventListener( "readystatechange", function( res ) {
      if ( req.readyState === 4 && req.status === 200 ) {
        var data;
        if ( options.dataType === "json" ) {
          data = JSON.parse( res.target.responseText );
        } else {
          data = res.target.responseText;
        }
        success( data, res );
      } else if ( req.readyState === 4 ) {
        if ( error ) {
          error( res );
        }
      }
    });
    req.open( options.type, options.url, true );
    if ( options.reqDataType === "json" ) {
      req.setRequestHeader("Content-type", "application/json" );
      req.send( JSON.stringify( options.data ) );
    } else {
      req.send( options.data );
    }
  }

  function renderAvatar ( user ) {
    var a = document.createElement( "a" );
    a.setAttribute( "href", user.html_url );
    a.setAttribute("class", cssClass.avatarLink );
    var img = document.createElement( "img" );
    img.setAttribute("class", cssClass.avatar );
    img.setAttribute( "src", user.avatar_url );
    img.setAttribute( "width", 48 );
    img.setAttribute( "height", 48 );
    a.appendChild( img );
    return a;
  }

  hubbub.appendWidget = function( el, gistUrl ) {
    var div = document.createElement("div" );
    div.setAttribute("class", containerClass );
    div.setAttribute( gistUrlAttr, gistUrl );
    el.appendChild( div );
    getComments( div, renderComments );
  };

  hubbub.css = cssClass;

  return hubbub;
})();

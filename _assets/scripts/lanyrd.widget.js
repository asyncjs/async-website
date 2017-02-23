/* global lanyrd */

/*
    Lanyrd widget. An extension on top of the Lanyrd API.
*/

(function() {
"use strict";

//
// Extend Lanyrd as `lanyrd.widget`

lanyrd.widget = {};

//
// Tim (a tiny, secure JavaScript micro-templating script)
// https://github.com/premasagar/tim

var tim = function() {var e = /{{\s*([a-z0-9_][\\.a-z0-9_]*)\s*}}/gi;return function( f, g ) {return f.replace( e, function( h, i ) {for ( var c = i.split("."), d = c.length, b = g, a = 0; a < d; a++ ) {b = b[ c[ a ] ];if ( b === void 0 )throw"tim: '" + c[ a ] + "' not found in " + h;if ( a === d - 1 )return b;}});};}();

//
// Here be Widgets !

// People widget
//
// Returns a promise wrapped html string containing markup primarily showing the avatars
// of event(s) attendees and trackers.
//
// parameters:
// - url:           A lanyrd conference url or an array of lanyrd conference urls
// - elem:          An optional html dom element which will be populated with the rendered
//                  html template. The html is also passed to the promise resolution
//                  callback.
// - options:       Object of key value pairs detailing lower level parameters
//  - all:          Flag which determines how many trackers/attendees will be
//                  displayed. (true by default)
//  - append:       Flag for determining how the rendered html template is inserted
//                  into the provided dom element. If false any html in the supplied
//                  dom element will be overwritten. (false by default)
//  - headingLevel  Number which decides what heading level tags the rendered html
//                  should use. (2 by default)

lanyrd.widget.people = function( url, elem, options ) {
    var promise,
        conference,
        options = options || {};
    options.all = options.all || true;
    options.headingLevel = options.headingLevel || 2;

    if ( lanyrd.utils.isArray( url ) && url.length > 1 ) {

      // Get all attendees and trackers for merged lanyrd conference events
      // 1. Convert passed urls to equivalent Lanyrd api resource objects
      // 2. Pass merged attendees and trackers to render and return render's
      //    promise.

      url = lanyrd.utils.map( url, function( url ) {
          return lanyrd.conference( url ).fetch();
        });

      promise = lanyrd.mergeRelated( url, { related: [ "attendees", "trackers" ] })
                .pipe(function( merged ) {
                    return render( merged.attendees, merged.trackers )
                    .then( tryPlaceInElement );
                  });
    } else {

      // Get attendees and trackers for a lanyrd conference event
      // 1. Change single item array as string
      // 2. Fetch conference data
      // 3. Get related attendees and trackers
      // 4. Pass attendees and trackers to render and return render's
      //   promise.

      url += "";
      promise = lanyrd.conference( url ).fetch()
                .pipe(function( con ) {
                    conference = con.get("conference" );
                    return con;
                  })
                .pipe( getAttendeesTrackers )
                .pipe(function( attendees, trackers ) {
                    return render(
                        attendees.get( "attendees" ),
                        trackers.get( "trackers" )
                    )
                    .then( tryPlaceInElement );
                  });
    }

    // Returns a promise representing the retrieval of both the attendees
    // and the trackers. The amount of attendees/trackers passed to the
    // promise resolution is dependant on the options.all parameter.

    function getAttendeesTrackers( con ) {
      if ( options.all ) {
        return lanyrd.utils.when(
            con.related("conference.attendees" ).all(),
            con.related("conference.trackers" ).all()
        );
      } else {
        return lanyrd.utils.when(
            con.related("conference.attendees" ).fetch(),
            con.related( "conference.trackers" ).fetch()
        );
      }
    }

    // Places the generated html in the supplied html dom element
    // (if given).

    function tryPlaceInElement( html ) {
      if ( elem ) {
        if ( options.append ) {
          elem.innerHTML += html;
        } else {
          elem.innerHTML = html;
        }
      }
    }

    // A render function unique to lanyrd.widget.people

    function render( attendees, trackers ) {
      var deferred = lanyrd.utils.deferred(),
          promise = deferred.promise(),
          html = "";

      // returns attendees and trackers markup

      function drawList( people, peopleType ) {
        var peopleTemplate = options.peopleTemplate || '<ul class="lanyrd-people {{peopleType}}">{{list}}</ul>',
            personTemplate = options.personTemplate || '<li><a href="{{web_url}}"><img class="lanyrd-avatar" title="{{name}} ({{username}})" src="{{avatar_url}}"></a></li>',
            builtUpTemplate = "",
            person,
            i = 0;

        for ( i; i < people.length; i++ ) {
          person = people[ i ].user || people[ i ];
          builtUpTemplate += tim( personTemplate, person );
        }
        html += tim( peopleTemplate, { list: builtUpTemplate, peopleType: peopleType });
      }

      // Build the rest of the template
      // (!) Needs cleanup!
      // Only 'see more attendees' link supported on single conferences (no merged events)

      // Attendees heading
      html += "<h" + options.headingLevel + ' class="lanyrd-attendees-title">' + attendees.length +
                  " attending</h" + options.headingLevel + ">";

      // Attendee avatars
      drawList( attendees, "lanyrd-attendees" );

      // Provide conference link to conferences
      if ( conference ) {
        html += tim( '<p><a target="_blank" href={{web_url}}' + "attendees" + ">&rarr; Attendee details</a></p>", conference );
      }

      if ( trackers.length > 0 ) {
        // Trackers heading
        html += "<h" + options.headingLevel + ' class="lanyrd-trackers-title">' + trackers.length +
                    " tracking</h" + options.headingLevel + ">";
        // Tracker avatars
        drawList( trackers, "lanyrd-trackers" );
      }

      // Encapsulating div and embedded style
      html = '<div class="lanyrd-widget">' +
                 "<style>" +
                      ".lanyrd-people, .lanyrd-people li  {" +
                          "padding: 0;" +
                          "margin: 0;" +
                      "}" +
                      ".lanyrd-people, .lanyrd-people li {" +
                         " overflow: hidden;" +
                      "}" +
                      ".lanyrd-people li {" +
                          "list-style: none;" +
                          "float: left;" +
                          "padding-right: 6px;" +
                      "}" +
                 "</style>" +
                 html +
             "</div>";

      // Instantly resolve and pass rendered html as promise

      deferred.resolve( html );
      return promise;
    }

    return promise;
  };

// Person widget
// (!) to be revised

lanyrd.widget.person = function( url, elem, options ) {
    var promise,
        options = options || {};

    function render( person ) {
      var deferred = lanyrd.utils.deferred(),
          promise = deferred.promise(),
          html,
          personTemplate = options.personTemplate || '<h2><a href="{{web_url}}">{{name}}</a></h2>' +
                     '<img class="lanyrd-avatar" title="{{name}} ({{username}})" src="{{avatar_url}}">' +
                     "<p>{{short_bio}}</p>";

      html = tim( personTemplate, person );
      deferred.resolve( html );
      return promise;
    }

    promise = lanyrd.person( url ).fetch()
        .pipe(function( person ) {
            return person.get("user" );
          })
        .pipe(function( person ) {
            return render( person ).then(function( html ) {
                if ( elem ) elem.innerHTML = html;
              });
          });

    return promise;
  };

}());

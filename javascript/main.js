if (document.querySelectorAll) {
  (function () {
    var test    = document.getElementById('media-test'),
        isWide  = test && window.getComputedStyle(test, null).width === '1px',
        scripts = ["lanyrd", "lanyrd.widget"],
        remaining = scripts.length;

    if (isWide) {
      (function loadScript(src) {
        var script = document.createElement("script");
        script.onload = function () {
          remaining -= 1;
          if (remaining === 0) {
            setupLanyrd(window.lanyrd);
          } else {
            loadScript(scripts.shift());
          }
        };
        script.src = "/javascript/" + src + ".js";
        document.body.appendChild(script);
      })(scripts.shift());
    }

    function setupLanyrd(lanyrd) {
      var event, target, container, upcoming;

      event = document.querySelector('.event-detail');
      if (event) {
        target = event.querySelector('.lanyrd-link');

        if (target) {
          container = document.createElement('section');
          container.className = 'lanyrd';
          event.appendChild(container);

          lanyrd.widget.people([target.href], container, {
            append: true,
            headingLevel: 3
          }).done(function () {
            var style, more;

            style = container.querySelector('style');
            style.parentNode.removeChild(style);

            more = container.querySelector('p');
            more.parentNode.removeChild(more);

            lanyrd.utils.each(container.querySelectorAll('h3'), function () {
              var parts = this.innerHTML.split(' '),
                  count = parts.shift();

              this.classList.add('heading');
              this.innerHTML = parts.join(' ') + ' (' + count + ')';
            });

            lanyrd.utils.each(container.querySelectorAll('li a'), function () {
              this.classList.add('bordered');
            });
          });
        }
      }

      upcoming = document.querySelectorAll('.event-item');
      lanyrd.utils.each(upcoming, function () {
        var item = this,
            target = this.querySelector('.lanyrd-link');

        if (target && target.getAttribute('href')) {
          lanyrd.conference(target.href).fetch(function (conference) {
            var requests = [
              conference.related('conference.attendees').fetch(),
              conference.related('conference.trackers').fetch()
            ];

            lanyrd.utils.when(requests).then(function () {
              var trackers  = arguments[1][0],
                  attendees = arguments[0][0],
                  container = document.createElement('p');

              container.className = 'lanyrd-simple';
              container.innerHTML = [
                attendees.get('pagination.total'),
                'attending',
                '&bull;',
                trackers.get('pagination.total'),
                'tracking'
              ].join(' ');
              item.appendChild(container);
            });
          });
        }
      });
    }
  })();

  (function () {
    var emails = document.querySelectorAll('a[href^=mailto]');
    [].forEach.call(emails || [], function (link) {
      link.href = link.href.replace(/ \[([^\]]+)\] /g, function ($0, $1) {
        return {at: '@', dot: '.'}[$1] || $0;
      });
    });
  })();

  (function () {
    var lanyrdLinks = document.querySelectorAll('.lanyrd-link');

    [].forEach.call(lanyrdLinks || [], function (link) {
      var parent = link.parentNode,
          prev = link.previousSibling, words, wrap, clone;

      if (prev) {
        if (prev.nodeType === 3) {
          words = prev.nodeValue.trim().split(" ");
        } else {
          words = prev.innerHTML.split(" ");
        }

        wrap = document.createElement('span');
        wrap.className = 'no-wrap';

        if (words.length > 1) {
          if (prev.nodeType === 3) {
            clone = document.createTextNode(words.pop());
            prev.nodeValue = words.join(" ") + " ";
          } else {
            clone = prev.cloneNode();
            clone.innerHTML = words.pop();
            prev.innerHTML = words.join(" ") + " ";
          }

          wrap.appendChild(clone);
        } else {
          wrap.appendChild(prev);
        }

        wrap.appendChild(link);
        parent.appendChild(wrap);
      }
    });
  })();
}

/*  lanyrd.js - v0.0.0 
 *  Copyright 2011-2012, Dharmafly <http://dharmafly.com> 
 *  Released under the MIT License 
 *  More Information: https://github.com/dharmafly/lanyrd.js 
 */
(function (_lanyrd, jQuery, module, undefined) {
    "use strict";

    var config, utils, lanyrd, parseUrl;

    // Useful utility functions for working with deferred's.
    utils = {
        // Cached anchor element for parsing urls. This is used by url methods
        // like .pathname().
        a: module.document && module.document.createElement('a'),

        // Check to see if the passed object is an array.
        isArray: function (object) {
            return Object.prototype.toString.call(object) === '[object Array]';
        },

        // Iterates over an array or object and calls the callback with each
        // item.
        each: function (items, fn, context) {
            var index = 0, length = items.length, item;
            if (typeof length === 'number') {
                for (;index < length; index += 1) {
                    item = items[index];
                    fn.call(context || item, item, index, items);
                }
            } else {
                for (index in items) {
                    if (items.hasOwnProperty(index)) {
                        item = items[index];
                        fn.call(context || item, item, index, items);
                    }
                }
            }
            return items;
        },

        // Returns the keys for the object provided in an array.
        keys: function (object) {
            return utils.map(object, function (value, key) {
                return key;
            });
        },

        // Iterates over an array or object and collects the return values of
        // each callback function and returns it in an array.
        map: function (items, fn, context) {
            var collected = [];
            utils.each(items, function (item) {
                collected.push(fn ? fn.apply(this, arguments) : item);
            }, context);
            return collected;
        },

        // Iterates over an array or object and collects items where the
        // callback returned a truthy value and returns them in an array.
        filter: function (items, fn, context) {
            var collected = [];
            utils.each(items, function (item) {
                if (fn.apply(this, arguments)) {
                    collected.push(item);
                }
            }, context);
            return collected;
        },

        // Extend the first object passed as an argument with successive ones.
        extend: function (reciever) {
            var target  = arguments[0],
                objects = Array.prototype.slice.call(arguments, 1),
                count = objects.length,
                index = 0, object, property;

            for (; index < count; index += 1) {
                object = objects[index];
                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        target[property] = object[property];
                    }
                }
            }

            return target;
        },

        // Calls the method on the object provided, subsequent arguments will
        // be passed in to the method. Returns an array containing the returned
        // values of each function.
        invoke: function (object, method /* args */) {
            var collected = [], args = [].slice.call(arguments, 2);
            utils.each(object, function (item) {
                collected.push(item[method].apply(item, args));
            });
            return collected;
        },

        // Extracts a single property from each object in the collection.
        pluck: function (object, path, fallback) {
            var args = [].slice.call(arguments, 2);
            return utils.map(object, function (item) {
                return utils.keypath(item, path, fallback);
            });
        },

        // Creates a new deferred object.
        deferred: function () {
            if (jQuery && jQuery.Deferred) {
                return new jQuery.Deferred();
            }
            return new utils._.Deferred();
        },

        // Allows you to determine when multiple promises have resolved. Each
        // promise should be provided as an argument. Alternatively a single
        // array of promises can be provided.
        when: function (array) {
            var promises = arguments.length === 1 && utils.isArray(array) ? array : arguments;
            if (jQuery && jQuery.Deferred) {
                return jQuery.when.apply(jQuery, promises);
            }
            return utils._.when.apply(utils._, promises);
        },

        // Requests a json representation from the url provided. Returns a
        // promise object. This should be used to request resources from the
        // lanyrd API, it includes specialised error handling for the API.
        request: function (url) {
            var type     = config.requestType,
                request  = utils.rawRequest(url, type),
                deferred = utils.deferred(),
                promise  = deferred.promise({
                    data: null,
                    type: type,
                    xhr:  type === utils.request.JSONP ? null : request
                });

            request.then(function (data) {
                promise.data = data;
                deferred[!data || data.error ? 'reject' : 'resolve'](promise);
            }, function () {
                deferred.reject(promise);
            });

            return promise;
        },

        // Request function that will use jQuery if available otherwise fall back to
        // the built in lanyrd methods. Allows the type to be specified, this
        // can be used by scripts to request non lanyrd methods.
        rawRequest: function (url, type) {
            type = type || 'json';
            if (jQuery) {
                return jQuery.ajax({url: url, dataType: type});
            }
            return lanyrd.utils[type](url);
        },

        // Escapes html entities within a string.
        // https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
        escape: function (string) {
            return ('' + string)
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&#x27;')
            .replace(/\//g, '&#x2F;');
        },

        // Function for looking up a value in an object using a key path (period
        // delimited string).
        // Often useful when working with large objects such as JSON data returned
        // from a server as it allows quick navigation to only the required
        // information.
        keypath: function keypath(object, path, fallback, prototype) {
            var keys = (path || '').split('.'),
                key;

            if (!path) {
                return object;
            }

            while (object && keys.length) {
                key = keys.shift();

                if (object.hasOwnProperty(key) || (prototype === true && object[key] !== undefined)) {
                    object = object[key];

                    if (keys.length === 0 && object !== undefined) {
                        return object;
                    }
                } else {
                    break;
                }
            }

            return (arguments.length > 2) ? fallback : null;
        },

        // Returns the pathname of a url.
        pathname: function (url) {
            utils.a.href = url || '/';
            return utils.a.pathname;
        }
    };

    utils.request.JSON  = 'json';
    utils.request.JSONP = 'jsonp';

    // A Collection is simply a collection of objects, it provides support for
    // iteration as well as getting properties and related resources. It treats the
    // collection in the same way that jQuery does in that a getter method will
    // return just the first item. To access all children the iterator methods
    // should be used.
    function Collection(items) {
        items = utils.isArray(items) ? items : [items];
        for (var index = 0, len = items.length, item; index < len; index += 1) {
            item = items[index];
            if (item instanceof Collection || item instanceof Resource) {
                item = item.get();
            }
            this[index] = item;
        }
        this.length = items.length;
    }

    Collection.prototype = {
        constructor: Collection,

        // Lookup keys in the attributes object, period delimited key paths can
        // be used to access nested keys without having to check for the
        // existence of each property. This method will return a single object
        // for the first item in the list.
        get: function (path, fallback) {
            return utils.keypath(this[0], path, fallback);
        },

        // Same as #get() but path returns the property with html entities escaped
        // if it is a string, otherwise returns the coerced value.
        escape: function (path, fallback) {
            return utils.escape(this.get(path, fallback));
        },

        // Gets a related resource for the key provided. If the current resource
        // doesn't support the key then a rejected Resource will be returned.
        // Accepts an optional prefix in case the object with the api urls is
        // nested further into the model chain. For example a user is nested
        // inside speaker and attendee objects.
        //
        // If the path provided returns a url then this will be loaded.
        //
        // Examples:
        //
        //     var related = speakers.related('user.user');
        //     var related = conference.related('attendees');
        //
        //     // Direct path to a resource url also works.
        //     var related = speakers.related('user.api_urls.user');
        related: function (path) {
            var parts = path.split('.'),
                key   = parts.pop(),
                url;

            parts.push('api_urls');

            // Needs to support various keypaths including.
            // "api_url", "api_urls.attendees", "user.api_urls.user"
            url = this.get(parts.join('.'), {})[key];
            if (!url) {
                url = this.get(path);
            }
            return url ? new Resource({url: url}) : Resource.noop();
        },

        // Same as #related() but immediately calls #fetch() on the resource.
        fetchRelated: function (path, success, error) {
            return this.related(path).fetch(success, error);
        },

        // Fetches the related resource for all items in the list. Useful for
        // requesting all attendees to a conference for example. The method will
        // return a generic promise object. #done() callbacks receive two
        // arguments, an array of completed resources and an array of request
        // (jqXHR) objects.
        fetchAllRelated: function (path, success, error) {
            var deferred = utils.deferred();

            function iterator(item) { return item.fetchRelated(path); }
            jQuery.when.apply(jQuery, this.map(iterator)).then(function () {
                var resources = [], requests = [];
                jQuery.each(arguments, function () {
                    requests.push(this[1]);
                    resources.push(this[0]);
                });
                deferred.resolve(resources, requests);
            }, deferred.reject);

            return deferred.promise().then(success, error);
        },

        // Get the object at the index provided. A negative index takes items
        // from the end of the list.
        at: function (index) {
            index = index < 0 ? index + this.length : index;
            return this[index] || null;
        }
    };

    utils.each(['each', 'map', 'filter', 'pluck', 'invoke'], function (method) {
        Collection.prototype[method] = function () {
            return utils[method].apply(this, [].concat.apply(this, arguments));
        };
    });

    // The Resource acts as a request builder for the API and provides basic
    // methods for accessing the returned data. For most use cases it will be
    // all you need to interact with the API. Each instance requires a full path
    // to a Lanyrd resource which can then be fetched. Once loaded the data can
    // be accessed and pages can be iterated. Using a Resource requires full
    // knowledge of the returned data structure.
    //
    // Related resources can also be fetched using the #related() method this
    // allows the API to be traversed using the keys found under the "api_urls"
    // parameter.
    function Resource(options) {
        options = options || {};

        this.url  = options.url;
        this.data = options.data || {};

        var deferred = options.deferred || utils.deferred();
        if (this.url) {
            // We create the fetch method within the constructor to hide the
            // deferred object within the closure.
            this.fetch = function (success, error) {
                if (this.state() !== Resource.PENDING) {
                    return this;
                }

                var url = this.url, request, resource;

                if (config.requestType === utils.request.JSONP) {
                    url += (url.indexOf('?') < 0 ? '?' : '&') + 'callback=?';
                }
                request  = utils.request(url);
                resource = this;

                request.done(function () {
                    resource.data = request.data;
                    deferred.resolveWith(resource, [resource, request]);
                });
                request.fail(function () {
                    deferred.rejectWith(resource, [resource, request]);
                });

                return this.then(success, error);
            };
        }
        deferred.promise(this);
    }

    // Constants for use with pagination.
    Resource.PREV = 'prev';
    Resource.NEXT = 'next';

    // Constants for use with Resource#state().
    Resource.RESOLVED = 'resolved';
    Resource.REJECTED = 'rejected';
    Resource.PENDING  = 'pending';

    // Creates a rejected Resource that can be returned by methods when a
    // request cannot be made. For example at the last page of a paginated
    // collection or if no related resource exists.
    Resource.noop = function (options) {
        var rejected = utils.deferred(),
            noop = new Resource(utils.extend({deferred: rejected}, options));

        rejected.rejectWith(noop, [noop, null]);
        return noop;
    };

    Resource.prototype = {
        constructor: Resource,

        url:   null,
        data:   null,

        // Actually defined in the constructor to hide the deferred object
        // within a closure. This method loads the resource available at the
        // Resource#url endpoint. If no href is provided to the constructor
        // then this method is a no-op.
        fetch: function () { return this; },

        // Checks to see if the current resource was successfully loaded from
        // the server. Will return false if the request failed or is still
        // pending. Resource#state() can be used for more fine grained checks.
        fetched: function () {
            return this.state && this.state() === Resource.RESOLVED;
        },

        // Shortcut to Collection#related(). Can be used to fetch a related resource.
        related: function (path) {
            return this.collection().related(path);
        },

        // Lookup keys in the raw data object returned from the server.
        get: function (path, fallback) {
            return utils.keypath(this.data, path, fallback);
        },

        // Gets a path for a string with html entities escaped.
        escape: function (path, fallback) {
            return utils.escape(this.get(path, fallback));
        },

        // Like #get() but wraps the resource at the end of the path in a Collection
        // this makes it much easier to work with some of the resource data such
        // as a list or user object.
        collection: function (path) {
            var data = this.get(path);
            if (data) {
                data = new Collection(data);
            }
            return data;
        },

        // Paginates through the resource in the direction specified. Use one of the
        // Resource.NEXT or Resource.PREV constants for the first argument. This
        // method returns an unloaded Resource object. To actually fetch the
        // page you must call #fetch().
        paginate: function (direction) {
            var url = this.get('pagination.api_urls', {})[direction];
            return url ? new Resource({url: url}) : Resource.noop();
        },

        // Checks to see if the current resource is paginated. It can be useful
        // to call this before #next() #prev() or #all().
        paginated: function () {
            return this.get('pagination.num_pages', 1) > 1;
        },

        // Checks to see if this resource is the first page. If there is no
        // pagination then this will still return true.
        first: function () {
            return this.get('pagination.page', 1) === 1;
        },

        // Checks to see if the resource is the last page. Returns true if there
        // is only one page or there is no pagination data.
        last: function () {
            var pagination = this.get('pagination', {});
            return pagination.page === pagination.num_pages;
        },

        // Requests the next page of resources in a collection and returns the
        // promised resource. This calls fetch internally, both success and
        // error callbacks can be passed as arguments.
        next: function (success, error) {
            return this.paginate(Resource.NEXT).fetch().then(success, error);
        },

        // Requests the previous page of resources in a collection and returns the
        // promised resource. This calls fetch internally, both success and
        // error callbacks can be passed as arguments.
        prev: function (success, error) {
            return this.paginate(Resource.PREV).fetch().then(success, error);
        },

        // Walks through all pages for a paginated resource and collects the
        // results in a single array. This is then returned as a new "master"
        // Resource.
        all: function (success, error) {
            var self      = this,
                deferred  = utils.deferred(),
                combined  = new Resource({deferred: deferred});

            function inner() {
                var key = self.get('pagination.paginated_key'),
                    collected = [],
                    remaining = 2;

                function complete(resource, request) {
                    remaining -= 1;
                    if (remaining) {
                        return;
                    }

                    if (!request) {
                        combined.data = {};
                        combined.data[key] = collected;
                        deferred.resolveWith(combined, [combined]);
                    } else {
                        deferred.rejectWith(combined, [combined, request]);
                    }
                }

                (function backward(resource) {
                    if (!resource.flag) {
                        resource.flag = true;
                        deferred.notifyWith(resource, arguments);
                        collected = resource.get(key).slice().concat(collected);
                    }
                    return resource.prev().then(backward, complete);
                })(self);

                (function forward(resource) {
                    if (!resource.flag) {
                        resource.flag = true;
                        deferred.notifyWith(resource, arguments);
                        collected = collected.concat(resource.get(key));
                    }
                    return resource.next().then(forward, complete);
                })(self);
            }

            // If the current object is not yet loaded then do so before
            // loading related resources.
            if (this.fetched()) {
                inner();
            } else {
                this.fetch().always(inner);
            }

            return combined.then(success, error);
        }
    };

    // The base API object.
    lanyrd = {
        API_DOMAIN: 'http://lanyrd.asyncjs.com',

        // Attempts to match a conference resource for the Lanyrd url provided.
        // This breaks rest conventions but provides a nicer API for people to
        // get started quickly.
        conference: function (url) {
            return this.resource({url: this.url(url)});
        },
        person: function (url) {
            var apiUrl = this.url(url).replace(/\/profile\//i, '/people/');
            return this.resource({url: apiUrl});
        },
        place: function (url) {
            return this.resource({url: this.url(url)});
        },
        topic: function (url) {
            return this.resource({url: this.url(url)});
        },
        collection: function (object) {
            return new Collection(object);
        },
        resource: function (options) {
            return new Resource(options);
        },
        url: function (url) {
            // Oh dear, here we assume that a Lanyrd API endpoint is the same as
            // the website. Ideally there should be some kind of lookup service
            // that does this for us.
            return this.API_DOMAIN + utils.pathname(url);
        },
        // Allows you to switch between JSON and JSONP transports.
        config: function (newer) {
            utils.extend(config, newer);
        },
        utils: utils,
        noConflict: function () {
            module.lanyrd = _lanyrd;
            return lanyrd;
        },
        Collection: Collection,
        Resource: Resource
    };

    config = {requestType: utils.request.JSONP};

    if (typeof module.define === 'function' && module.define.amd) {
        module.define('lanyrd', function () {
            return lanyrd;
        });
    } else if (module.exports) {
        // Pass utils object into module factories to be augmented.
        require('./lanyrd/deferred')(utils);
        require('./lanyrd/request')(utils);

        // Override pathname with node specific code.
        parseUrl = require('url').parse;
        lanyrd.utils.pathname = function (url) {
            return parseUrl(url).pathname;
        };
        // Default request type is now JSON.
        config.requestType = utils.request.JSON;

        module.exports = lanyrd;
    } else {
        module.lanyrd = lanyrd;
    }

})(this.lanyrd, this.jQuery, typeof module !== 'undefined' ? module : this);
// Underscore Deferred library is wrapped in a closure into which we pass
// lanyrd.utils, this allows us to capture the methods without adding them
// to the window object.
(function () {
// underscore.Deferred by wookiehangover <sam@quickleft.com>
// Released under the MIT License
// https://github.com/wookiehangover/underscore.Deferred
(function(root){

  // Let's borrow a couple of things from Underscore that we'll need

  // _.each
  var breaker = {},
      AP = Array.prototype,
      OP = Object.prototype,

      hasOwn = OP.hasOwnProperty,
      toString = OP.toString,
      forEach = AP.forEach,
      slice = AP.slice;

  var _each = function( obj, iterator, context ) {
    var key, i, l;

    if ( !obj ) {
      return;
    }
    if ( forEach && obj.forEach === forEach ) {
      obj.forEach( iterator, context );
    } else if ( obj.length === +obj.length ) {
      for ( i = 0, l = obj.length; i < l; i++ ) {
        if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
          return;
        }
      }
    } else {
      for ( key in obj ) {
        if ( hasOwn.call( obj, key ) ) {
          if ( iterator.call( context, obj[key], key, obj) === breaker ) {
            return;
          }
        }
      }
    }
  };

  // _.isFunction
  var _isFunction = function( obj ) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // _.extend
  var _extend = function( obj ) {

    _each( slice.call( arguments, 1), function( source ) {
      var prop;

      for ( prop in source ) {
        if ( source[prop] !== void 0 ) {
          obj[ prop ] = source[ prop ];
        }
      }
    });
    return obj;
  };

  // And some jQuery specific helpers

  var class2type = { "[object Array]": "array", "[object Function]": "function" };

  var _type = function( obj ) {
    return !obj ?
      String( obj ) :
      class2type[ toString.call(obj) ] || "object";
  };

  // Now start the jQuery-cum-Underscore implementation. Some very
  // minor changes to the jQuery source to get this working.

  var promiseMethods = "done fail isResolved isRejected promise then always pipe".split(" ");

  // Internal Deferred namespace
  var _d = {};

  var flagsCache = {};
  // Convert String-formatted flags into Object-formatted ones and store in cache
  function createFlags( flags ) {
      var object = flagsCache[ flags ] = {},
          i, length;
      flags = flags.split( /\s+/ );
      for ( i = 0, length = flags.length; i < length; i++ ) {
          object[ flags[i] ] = true;
      }
      return object;
  }

  _d.Callbacks = function( flags ) {

      // Convert flags from String-formatted to Object-formatted
      // (we check in cache first)
      flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

      var // Actual callback list
          list = [],
          // Stack of fire calls for repeatable lists
          stack = [],
          // Last fire value (for non-forgettable lists)
          memory,
          // Flag to know if list is currently firing
          firing,
          // First callback to fire (used internally by add and fireWith)
          firingStart,
          // End of the loop when firing
          firingLength,
          // Index of currently firing callback (modified by remove if needed)
          firingIndex,
          // Add one or several callbacks to the list
          add = function( args ) {
              var i,
              length,
              elem,
              type,
              actual;
              for ( i = 0, length = args.length; i < length; i++ ) {
                  elem = args[ i ];
                  type = _type( elem );
                  if ( type === "array" ) {
                      // Inspect recursively
                      add( elem );
                  } else if ( type === "function" ) {
                      // Add if not in unique mode and callback is not in
                      if ( !flags.unique || !self.has( elem ) ) {
                          list.push( elem );
                      }
                  }
              }
          },
          // Fire callbacks
          fire = function( context, args ) {
              args = args || [];
              memory = !flags.memory || [ context, args ];
              firing = true;
              firingIndex = firingStart || 0;
              firingStart = 0;
              firingLength = list.length;
              for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                  if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
                      memory = true; // Mark as halted
                      break;
                  }
              }
              firing = false;
              if ( list ) {
                  if ( !flags.once ) {
                      if ( stack && stack.length ) {
                          memory = stack.shift();
                          self.fireWith( memory[ 0 ], memory[ 1 ] );
                      }
                  } else if ( memory === true ) {
                      self.disable();
                  } else {
                      list = [];
                  }
              }
          },
          // Actual Callbacks object
          self = {
              // Add a callback or a collection of callbacks to the list
              add: function() {
                       if ( list ) {
                           var length = list.length;
                           add( arguments );
                           // Do we need to add the callbacks to the
                           // current firing batch?
                           if ( firing ) {
                               firingLength = list.length;
                               // With memory, if we're not firing then
                               // we should call right away, unless previous
                               // firing was halted (stopOnFalse)
                           } else if ( memory && memory !== true ) {
                               firingStart = length;
                               fire( memory[ 0 ], memory[ 1 ] );
                           }
                       }
                       return this;
                   },
              // Remove a callback from the list
              remove: function() {
                          if ( list ) {
                              var args = arguments,
                                  argIndex = 0,
                                           argLength = args.length;
                              for ( ; argIndex < argLength ; argIndex++ ) {
                                  for ( var i = 0; i < list.length; i++ ) {
                                      if ( args[ argIndex ] === list[ i ] ) {
                                          // Handle firingIndex and firingLength
                                          if ( firing ) {
                                              if ( i <= firingLength ) {
                                                  firingLength--;
                                                  if ( i <= firingIndex ) {
                                                      firingIndex--;
                                                  }
                                              }
                                          }
                                          // Remove the element
                                          list.splice( i--, 1 );
                                          // If we have some unicity property then
                                          // we only need to do this once
                                          if ( flags.unique ) {
                                              break;
                                          }
                                      }
                                  }
                              }
                          }
                          return this;
                      },
              // Control if a given callback is in the list
              has: function( fn ) {
                       if ( list ) {
                           var i = 0,
                               length = list.length;
                           for ( ; i < length; i++ ) {
                               if ( fn === list[ i ] ) {
                                   return true;
                               }
                           }
                       }
                       return false;
                   },
              // Remove all callbacks from the list
              empty: function() {
                         list = [];
                         return this;
                     },
              // Have the list do nothing anymore
              disable: function() {
                           list = stack = memory = undefined;
                           return this;
                       },
              // Is it disabled?
              disabled: function() {
                            return !list;
                        },
              // Lock the list in its current state
              lock: function() {
                        stack = undefined;
                        if ( !memory || memory === true ) {
                            self.disable();
                        }
                        return this;
                    },
              // Is it locked?
              locked: function() {
                          return !stack;
                      },
              // Call all callbacks with the given context and arguments
              fireWith: function( context, args ) {
                            if ( stack ) {
                                if ( firing ) {
                                    if ( !flags.once ) {
                                        stack.push( [ context, args ] );
                                    }
                                } else if ( !( flags.once && memory ) ) {
                                    fire( context, args );
                                }
                            }
                            return this;
                        },
              // Call all the callbacks with the given arguments
              fire: function() {
                        self.fireWith( this, arguments );
                        return this;
                    },
              // To know if the callbacks have already been called at least once
              fired: function() {
                         return !!memory;
                     }
          };

      return self;
  };

  _d.Deferred = function( func ) {
        var doneList = _d.Callbacks( "once memory" ),
            failList = _d.Callbacks( "once memory" ),
            progressList = _d.Callbacks( "memory" ),
            state = "pending",
            lists = {
                resolve: doneList,
                reject: failList,
                notify: progressList
            },
            promise = {
                done: doneList.add,
                fail: failList.add,
                progress: progressList.add,

                state: function() {
                    return state;
                },

                // Deprecated
                isResolved: doneList.fired,
                isRejected: failList.fired,

                then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
                    deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
                    return this;
                },
                always: function() {
                    deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
                    return this;
                },
                pipe: function( fnDone, fnFail, fnProgress ) {
                    return _d.Deferred(function( newDefer ) {
                        _each( {
                            done: [ fnDone, "resolve" ],
                            fail: [ fnFail, "reject" ],
                            progress: [ fnProgress, "notify" ]
                        }, function( data, handler ) {
                            var fn = data[ 0 ],
                                action = data[ 1 ],
                                returned;
                            if ( _isFunction( fn ) ) {
                                deferred[ handler ](function() {
                                    returned = fn.apply( this, arguments );
                                    if ( returned && _isFunction( returned.promise ) ) {
                                        returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                    }
                                });
                            } else {
                                deferred[ handler ]( newDefer[ action ] );
                            }
                        });
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {
                    if ( !obj ) {
                        obj = promise;
                    } else {
                        for ( var key in promise ) {
                            obj[ key ] = promise[ key ];
                        }
                    }
                    return obj;
                }
            },
            deferred = promise.promise({}),
            key;

        for ( key in lists ) {
            deferred[ key ] = lists[ key ].fire;
            deferred[ key + "With" ] = lists[ key ].fireWith;
        }

        // Handle state
        deferred.done( function() {
            state = "resolved";
        }, failList.disable, progressList.lock ).fail( function() {
            state = "rejected";
        }, doneList.disable, progressList.lock );

        // Call given func if any
        if ( func ) {
            func.call( deferred, deferred );
        }

        // All done!
        return deferred;
    };

    // Deferred helper
    _d.when = function( firstParam ) {
        var args = slice.call( arguments, 0 ),
            i = 0,
            length = args.length,
            pValues = new Array( length ),
            count = length,
            pCount = length,
            deferred = length <= 1 && firstParam && _isFunction( firstParam.promise ) ?
                firstParam :
                _d.Deferred(),
            promise = deferred.promise();
        function resolveFunc( i ) {
            return function( value ) {
                args[ i ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
                if ( !( --count ) ) {
                    deferred.resolveWith( deferred, args );
                }
            };
        }
        function progressFunc( i ) {
            return function( value ) {
                pValues[ i ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
                deferred.notifyWith( promise, pValues );
            };
        }
        if ( length > 1 ) {
            for ( ; i < length; i++ ) {
                if ( args[ i ] && args[ i ].promise && _isFunction( args[ i ].promise ) ) {
                    args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
                } else {
                    --count;
                }
            }
            if ( !count ) {
                deferred.resolveWith( deferred, args );
            }
        } else if ( deferred !== firstParam ) {
            deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
        }
        return promise;
    };

  // Try exporting as a Common.js Module
  if ( typeof module !== "undefined" && module.exports ) {
    module.exports = _d;

  // Or mixin to Underscore.js
  } else if ( typeof root._ !== "undefined" ) {
    root._.mixin(_d);

  // Or assign it to window._
  } else {
    root._ = _d;
  }

})(this);

// Export the code as a node module.
if (typeof module !== "undefined" && module.exports) {
    var _ = module.exports;
    module.exports = function (utils) {
        utils._ = _;
    }
}

}).call(this.lanyrd && this.lanyrd.utils);
/*globals ActiveXObject */
(function (utils) {
    // Node specific code.
    if (typeof module !== 'undefined' && module.exports) {
        return (function () {
            var url  = require('url'),
                http = require('http');

            module.exports = function (utils) {
                utils.json = utils.jsonp = function (uri, fn) {
                    var parsed   = url.parse(uri),
                        deferred = utils.deferred(),
                        promise  = deferred.promise();

                    promise.xhr = http.get(parsed, function (res) {
                        var data = [];

                        res.on('data', function (chunk) {
                            data.push(chunk);
                        });

                        res.on('end', function () {
                            try {
                                if (res.statusCode >= 200 && res.statusCode < 300) {
                                    deferred.resolve(JSON.parse(data.join()), res);
                                } else {
                                    deferred.reject(res);
                                }
                            } catch (error) {
                                deferred.reject(res, error);
                            }
                        });
                    });

                    return promise;
                };
                return utils;
            };
        })();
    }

    // Browser specific code.
    var head = document.getElementsByTagName('head')[0],
        uuid = 0;

    function createXMLHTTPObject() {
        var factory = createXMLHTTPObject.cached,
            XMLHttpFactories, xhr = null;

        if (factory) {
            return factory();
        }

        XMLHttpFactories = [
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
            function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
            function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
        ];

        do {
            factory = XMLHttpFactories.shift();
            try {
                xhr = factory();
                createXMLHTTPObject.cached = factory;
                break;
            } catch (error) {}
        } while (XMLHttpFactories.length);

        return xhr;
    }

    function json(url, fn) {
        var xhr = createXMLHTTPObject(),
            deferred = lanyrd.utils.deferred();

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            var data;
            if (xhr.readyState === 4) {
                try {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        data = JSON.parse(xhr.responseText);
                        deferred.resolve(data, xhr);
                    } else {
                        deferred.reject(xhr);
                    }
                } catch (error) {
                    deferred.reject(xhr, error);
                }
            }
        };

        if (xhr.readyState !== 4) {
            xhr.send();
        }

        // This might be a bad idea...
        return deferred.promise(xhr).done(fn);
    }

    function jsonp(url, fn) {
        var deferred = lanyrd.utils.deferred(),
            script = document.createElement('script'),
            callback = 'callback' + (uuid += 1),
            esc = encodeURIComponent,
            key;

        url = url.replace(/\?$/, callback);
        window[callback] = function (json) {
            deferred.resolve(json);
            delete window[callback];
        };

        script.src = url;
        script.onload = script.onreadystatechange = function () {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script.parentNode.removeChild(script);
                script = undefined;
            }
        };
        head.insertBefore(script, head.lastChild);

        setTimeout(deferred.reject, 30000);
        return deferred.promise().done(fn);
    }

    lanyrd.utils.json  = json;
    lanyrd.utils.jsonp = jsonp;

})(this.lanyrd && this.lanyrd.utils);

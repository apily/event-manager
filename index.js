/*
 * event-manager
 * Event manager
 *
 * Copyright 2012 Enrico Marino and Federico Spini
 * MIT License
 */ 

/*
 * Expose `Manager`
 */

module.exports = EventManager;

/* 
 * Utilities
 */

var object = {};
var toString = object.toString;

/*
 * EventManager
 * Create an event manager.
 *
 * @param {Element} `target` object which events will be bound to
 * @param {Object} `obj` which will receive method calls
 * @return {Manager} the event manager
 */

function EventManager(target, obj) {
  if (!(this instanceof EventManager)) {
    return new EventManager(target, obj);
  }

  this.target = target;
  this.obj = obj;
  this._bindings = {};
}

/**
 * bind
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * @example
 *    events.bind('login') // implies "onlogin"
 *    events.bind('login', 'onLogin')
 *
 * @param {String} event `event` name
 * @param {String} [method] `method` name
 * @return {EventManager} the event manager, for chaining
 * @api public
 */

EventManager.prototype.bind = function(event, method) {
  if (toString.call(event) === '[object Object]') {
    return this.bind_all(event);
  }
  
  var target = this.target;
  var obj = this.obj;
  var bindings = this._bindings;
  var method = method || 'on' + event;
  var fn = obj[method].bind(obj);

  target.on(event, fn);

  bindings[event] = bindings[event] || {};
  bindings[event][method] = fn;

  return this;
};

/**
 * bind_all
 * Bind to `event` with optional `method` name
 * for each pair `event`/`method` in `obj`
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * @example
 *    events.bind('login') // implies "onlogin"
 *    events.bind('login', 'onLogin')
 *
 * @param {Object} obj pairs `event`/`method` to bind
 * @return {DelegateManager} the event manager, for chaining
 * @api public
 */

EventManager.prototype.bind_all = function(obj) {
  Object.keys(obj).forEach(function(key) {
    this.bind(key, obj[key]);
  }, this);
  return this;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * @example
 *     events.unbind('login', 'onLogin')
 *     events.unbind('login')
 *     events.unbind()
 *
 * @param {String} [event]
 * @param {String} [method]
 * @return {EventManager} the event manager, for chaining
 * @api public
 */

EventManager.prototype.unbind = function(event, method) {
  if (0 == arguments.length) {
    return this.unbind_all();
  }
  if (1 == arguments.length) {
    return this.unbind_all_of(event);
  }
  
  var target = this.target;
  var bindings = this._bindings;
  var method = method || 'on' + event;
  var fn = bindings[event][method];

  if (fn) {
    target.off(event, fn);
    delete bindings[event][method];
  }
  
  return this;
};

/**
 * unbind_all
 * Unbind all events.
 *
 * @api private
 */

EventManager.prototype.unbind_all = function() {
  var bindings = this._bindings;
  var event;
  
  for (event in bindings) {
    this.unbind_all_of(event);
  }

  return this;
};

/**
 * unbind_all_of
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

EventManager.prototype.unbind_all_of = function(event) {
  var bindings = this._bindings[event];
  var method;

  if (!bindings) return;

  for (method in bindings) {
    this.unbind(event, method);
  }
  delete this._bindings[event];

  return this;
};

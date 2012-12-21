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
  var target = this.target;
  var obj = this.obj;
  var bindings = this._bindings;
  var method = method || 'on' + name;
  var fn = obj[method].bind(obj);

  target.on(name, fn);

  bindings[name] = bindings[name] || {};
  bindings[name][method] = fn;

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

EventManager.prototype.unbind = function(str, method) {
  var target = this.target;
  var bindings = this._bindings;
  var event = event;
  var method = method || 'on' + name;
  var fn;

  if (bindings[name]) {
    fn = bindings[name][method];
    if (fn) {
      target.off(event, fn);
      delete bindings[name][method];
    }
  }

  return this;
};
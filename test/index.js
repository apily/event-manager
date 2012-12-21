
var events = require('event-manager');
var Emitter = require('component-emitter');
var assert = require('component-assert');

describe('EventManager#bind(event)', function(){
  it('should default to invoking "on<event>"', function(done){
    var user = new Emitter;
    var e = events(user, { onlogin: done });
    e.bind('login');
    user.emit('login');
  })

  it('should pass arguments', function(done){
    var user = new Emitter;

    var e = events(user, {
      onlogin: function(name){
        assert('tobi' == name);
        done();
      }
    });

    e.bind('login');
    user.emit('login', 'tobi');
  })
})

describe('EventManager#bind(event, method)', function(){
  it('should invoke the given method', function(done){
    var user = new Emitter;
    var e = events(user, { login: done });
    e.bind('login', 'login');
    user.emit('login');
  })

  it('should curry arguments', function(done){
    var list = new Emitter;

    var e = events(list, {
      sort: function(col, order){
        assert('name' == col);
        assert('asc' == order);
        done();
      }
    });

    e.bind('click', 'sort', 'name', 'asc');
    list.emit('click');
  })
})

describe('EventManager#unbind(event, method)', function(){
  it('should unbind a single binding', function(){
    var user = new Emitter;

    var e = events(user, {
      login: function(){
        assert(0, 'should not invoke .login()');
      }
    });

    e.bind('login', 'login');
    e.unbind('login', 'login');
    e.unbind('login', 'login');
    e.unbind('login', 'login');
    user.emit('login');
    user.emit('login');
    user.emit('login');
  })
})

describe('EventManager#unbind(event)', function(){
  it('should unbind all bindings for the given event', function(){
    var user = new Emitter;

    var e = events(user, {
      login: function(){
        assert(0, 'should not invoke .login()');
      },

      onlogin: function(){
        assert(0, 'should not invoke .onlogin()');
      }
    });

    e.bind('login', 'login');
    e.bind('login');
    e.unbind('login');
    e.unbind('login');
    e.unbind('login');
    user.emit('login');
    user.emit('login');
    user.emit('login');
  })
})

describe('EventManager#unbind(event)', function(){
  it('should unbind all bindings for all events', function(){
    var user = new Emitter;

    var e = events(user, {
      login: function(){
        assert(0, 'should not invoke .login()');
      },

      onlogin: function(){
        assert(0, 'should not invoke .onlogin()');
      },

      onlogout: function(){
        assert(0, 'should not invoke .onlogout()');
      }
    });

    e.bind('login', 'login');
    e.bind('login');
    e.bind('logout');
    e.unbind();
    e.unbind();
    e.unbind();
    e.unbind();
    user.emit('login');
    user.emit('login');
    user.emit('logout');
  })
})

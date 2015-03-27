describe('EventDispatcher:', function() {

  var dispacher
    , handler
    , context
  ; 

  it('bind and trigger one event', function() {
    dispacher = new EventDispatcher();
    handler = function() {
      handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
    }

    dispacher.on('event', handler);

    dispacher.trigger('event');
    expect(handler.callCount).to.eq(1);

    dispacher.trigger('event');
    dispacher.trigger('event');
    expect(handler.callCount).to.eq(3);

    dispacher.off('event');
    dispacher.trigger('event');
    expect(handler.callCount).to.eq(3);
  })

  it('bind and trigger multiple events', function() {
    dispacher = new EventDispatcher();
    handler = function() {
      handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
    }

    dispacher.on('a b c', handler);

    dispacher.trigger('a');
    expect(handler.callCount).to.eq(1);

    dispacher.trigger('a b');
    expect(handler.callCount).to.eq(3);

    dispacher.off('a c')
    dispacher.trigger('a b c');
    expect(handler.callCount).to.eq(4);
  })

  it('handler with default context', function() {
    dispacher = new EventDispatcher();

    dispacher.on('event', function() {
      expect(this).to.deep.eq(dispacher);
    });
    dispacher.trigger('event');
  })

  it('handler with custom context', function() {
    dispacher = new EventDispatcher();
    context = { a: 1, b: 2 };

    dispacher.on('event', function() {
      expect(this).to.deep.eq(context);
    }, context);
    dispacher.trigger('event');
  })

  it('trigger event with argument', function() {
    dispacher = new EventDispatcher();
    argument = 1;

    dispacher.on('event', function(data) {
      expect(data).to.eq(argument);
    });
    dispacher.trigger('event', argument);
  })

  it('trigger event with multiplie arguments', function() {
    dispacher = new EventDispatcher();

    dispacher.on('event', function(a, b, c) {
      expect(a).to.eq('a');
      expect(b).to.eq('b');
      expect(c).to.eq('c');
    });
    dispacher.trigger('event', 'a', 'b', 'c')
  })

  it('not common handlers', function() {
    var a = new EventDispatcher()
      , b = new EventDispatcher()
    ;

    handler = function() {
      handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
    }

    a.on('b', handler);
    b.on('a', handler);

    b.trigger('a');
    b.trigger('b');
    a.trigger('a');
    a.trigger('b');

    expect(handler.callCount).to.eq(2);
  })

  it('once bind and trigger one event', function() {
    dispacher = new EventDispatcher();

    handler = function() {
      handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
    }

    dispacher.once('a', handler);

    dispacher.trigger('a');
    dispacher.trigger('a');
    dispacher.trigger('a');

    expect(handler.callCount).to.eq(1);
  })

  it('once bind and trigger multiplie events', function() {
    dispacher = new EventDispatcher();

    handler = function() {
      handler.callCount = handler.callCount ? handler.callCount + 1 : 1;
    }

    dispacher.once('a b c', handler);

    dispacher.trigger('a');
    dispacher.trigger('a');
    dispacher.trigger('b');
    dispacher.trigger('b');
    dispacher.trigger('c');
    dispacher.trigger('c');

    expect(handler.callCount).to.eq(3);
  })

})
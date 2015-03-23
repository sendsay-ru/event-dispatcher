do (root = this, factory = (root, EventDispatcher) ->

  class EventDispatcher

    constructor: (options = {}) ->
      @_handlers = {}
      @_splitter = options.splitter || /[\s,]+/

    on: (name = '', callback, ctx = this) ->
      names = name.split @_splitter
      for name in names
        handlers = @_handlers[name] || (@_handlers[name] = [])
        handlers.push
          callback: callback
          ctx: ctx
      return this
    
    off: (name = '', callback, ctx = this) ->
      names = name.split @_splitter
      for name in names
        handlers = @_handlers[name] || (@_handlers[name] = [])
        remaining = []
        for handler in handlers
          if callback && handler.callback != callback ||
             ctx && handler.ctx != ctx
            remaining.push(handler)
        if remaining.length
          @_handlers[name] = remaining
        else
          delete @_handlers[name]
      return this

    trigger: (name, args...) ->
      names = name.split @_splitter
      for name in names
        handlers = @_handlers[name] || (@_handlers[name] = [])
        for handler in handlers
          handler.callback.call(handler.ctx, args...) if handler.callback
      return this

) ->

  if root.define && typeof root.define == 'function' and root.define.amd
    define [], () ->
      factory root, {}
  else
    root.EventDispatcher = factory root, {}
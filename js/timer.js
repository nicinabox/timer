var timer = function(method, args) {
  var api = {};
  
  var newEpoch = function() {
    return Math.round(new Date().getTime() / 1000);
  };
  
  var elapsedTime = function(to_json) {
    var s = status(),
        from = startedAt(),
        elapsed_time = parseFloat(fetch('elapsed_time')) || 0,
        use_elapsed_time = fetch('use_elapsed_time'),
        result = 0;
    
    if (s === 'running') {
      to = newEpoch();
      result = (to - from) + elapsed_time;
    } else if(s === 'paused') {
      if (use_elapsed_time) {
        result = elapsed_time;
      } else {
        to = pausedAt();
        result = to - from;
        if (result !== elapsed_time) {
          result += elapsed_time;
        } 
      }
    }
    return (to_json ? toJSON(result) : result);
  };
  
  var toJSON = function(time) {
    return {
      "h": Math.floor(time / 60 / 60),
      "m": Math.floor(time / 60) % 60,
      "s": time % 60
    };
  };
  
  var status = function() {
    if (isPaused()) {
      return 'paused'
    }
    if (isRunning()) {
      return 'running'
    } else {
      return 'stopped'
    } 
  };
  
  var isRunning = function() {
    if (isPaused()) {
      return false;
    } else {
      return !!fetch('started_at');
    }
  };
  
  var isPaused = function() {
    return !!fetch('paused_at');
  };
  
  var startedAt = function(time) {
    if (time !== undefined) {
      store('started_at', time);
    }
    return parseFloat(fetch('started_at'));
  };
  
  var pausedAt = function(time) {
    if (time !== undefined) {
      store('paused_at', time);
    }
    return parseFloat(fetch('paused_at'));
  };
  
  var store = function(name, data, parse) {
    if (parse) { data = JSON.stringify(data); }
    return localStorage[name] = data;
  };
  
  var fetch = function(name, parse) {
    data = localStorage[name];
    if (parse) { data = JSON.parse(data) }
    return data;
  };
  
  api = {
    start: function(to_json) {
      if (isPaused()) {
        delete localStorage.paused_at;
        delete localStorage.use_elapsed_time;
      }
      startedAt(newEpoch());
      return elapsedTime(to_json);
    },
    stop: function(to_json) {
      var paused_at = newEpoch(),
          elapsed_time = elapsedTime(to_json);
      
      remove = ['paused_at', 'started_at', 'elapsed_time']
      for (var i=0, len = remove.length; i < len; i++) {
        delete localStorage[remove[i]]
      }
      
      return elapsed_time;
    },
    pause: function(to_json) {
      if (!isPaused()) {
        pausedAt(newEpoch());
        elapsed_time = store('elapsed_time', elapsedTime()); 
        store('use_elapsed_time', true)
        
        return to_json ? toJSON(elapsed_time) : elapsed_time;
      } else {
        return elapsedTime(to_json);
      }
    },
    elapsed_time: elapsedTime,
    to_json: toJSON,
    status: status
  };
  
  if (method !== undefined) {
    return api[method].call(null, args);
  } else {
    return api;
  }
};
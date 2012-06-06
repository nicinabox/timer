var timer = function(method, args) {
  var api = {};
  
  var newEpoch = function() {
    return Math.round(new Date().getTime() / 1000);
  };
  
  var elapsedTime = function(format_output) {
    var running = isRunning(),
        paused = isPaused(),
        from = startedAt(),
        elapsed_time = parseFloat(fetch('elapsed_time')) || 0,
        result = 0;
    
    if (running) {
      to = newEpoch();
      result = (to - from) + elapsed_time;
    } else if(paused) {
      to = pausedAt();
      result = to - from;
      if (result !== elapsed_time) {
        result += elapsed_time;
      }
    }

    return (format_output ? format(result) : result);
  };
  
  var format = function(epoch) {
    var sec = epoch % 60,
        min = Math.floor(epoch / 60),
        hr = Math.floor(epoch / 60 / 60),
        formatted = sec + " sec";

    if (min > 0) {
      formatted = min % 60 + " min " + formatted;
    }
    
    if (hr > 0) {
     formatted = hr + " hr " + formatted;
    }

    return formatted;
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
    start: function(format_output) {
      if (isPaused()) {
        delete localStorage.paused_at;
      }
      startedAt(newEpoch());
      return elapsedTime(format_output);
    },
    stop: function(format_output) {
      var paused_at = newEpoch(),
          elapsed_time = elapsedTime(format_output);
      
      remove = ['paused_at', 'started_at', 'elapsed_time']
      for (var i=0, len = remove.length; i < len; i++) {
        delete localStorage[remove[i]]
      }
      
      return elapsed_time;
    },
    pause: function(format_output) {
      if (!isPaused()) {
        pausedAt(newEpoch());
        elapsed_time = store('elapsed_time', elapsedTime()); 
        return format_output ? format(elapsed_time) : elapsed_time;
      } else {
        return elapsedTime(format_output);
      }
    },
    elapsed_time: elapsedTime,
    format: format,
    status: status
  };
  
  if (method !== undefined) {
    return api[method].call(null, args);
  } else {
    return api;
  }
};
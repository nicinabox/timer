(function($) {
  var t = timer();
  
  $(function() {

    var $button = $('.button.stopped'),
        $pause = $('.button.pause'),
        $body = $('body'),
        $time = $('#elapsed-time'),
        id;

    setState(t.status());
    id = setElapsedTime($time, true);

    $button.on('click', function(e) {
      e.preventDefault();

      switch(t.status()) {
        case 'stopped':
        case 'paused':
          $button.trigger('timer.start');
          break;
        default:
          $button.trigger('timer.stop');
          break;
      }

    });
    $body.on('timer.start', $button, function() {
      t.start();
      setState(t.status());
      
      id = setElapsedTime($time, true);
    });
    $body.on('timer.stop', $button, function() {
      t.stop();
      clearInterval(id);
      setState(t.status());
    });
    $pause.on('click', function(e) {
      e.preventDefault();
      t.pause();
      clearInterval(id);
      setState(t.status());
    });
    
    function setState(status) {
      var running = status === 'running';
      
      $pause.toggleClass('hidden', !running);
      $button.toggleClass('running', running)
      $button.text((running ? 'Stop' : 'Start'));
    }
    
    function setElapsedTime($el, update) {
      $el.html(format(t.elapsed_time(true)));

      if (update && t.status() === 'running') {
        return setInterval(function() {
          $el.html(format(t.elapsed_time(true)));
        }, 1000);
      }
    }
    
    function format(time) {
      var formatted = '';
      
      for (k in time) {
        formatted += time[k] + k + ' ' 
      }
      return formatted;
    }
  });
  
})(jQuery);
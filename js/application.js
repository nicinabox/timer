(function($) {
  $(function() {

    var $button = $('#button'),
        $body = $('body'),
        t = timer(),
        id;

    setState($button, t.status());

    $button.on('click', function(e) {
      e.preventDefault();

      if (t.status() === 'running') {
        $button.trigger('timer.stop');
      } else {
        $button.trigger('timer.start');
      }

    });

    $body.on('timer.start', $button, function() {
      t.start();
      setState($button, t.status());

      id = setInterval(function() {
        $('#elapsed').show().find('span').html(t.elapsed_time(true));
      }, 1000);

    });

    $body.on('timer.stop', $button, function() {
      t.stop();
      setState($button, t.status());
    });

  });
  
  function setState($el, status) {
    $el.attr('class', status);
    $el.text((status === 'running' ? 'Stop' : 'Start') + 'Time');
  }
  
})(jQuery);
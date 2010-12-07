function formattedTime(ts) {
   var date = new Date(ts*1000);
    // hours part from the timestamp
    var hours = date.getHours();
    // minutes part from the timestamp
    var minutes = date.getMinutes();
    // will display time in 10:30:23 format
    return hours + ':' + minutes;
}
function checkRunning() {
  var running = localStorage.getItem("startTime");
  if (running != "" && running != null) { // its running
    return true;
  } else {
    return false;
  }
}
function epoch() {
  return Math.round(new Date().getTime() / 1000);
}
function liveTime() {
window.setTimeout( "liveTime()", 1000 );
live = getDiff(epoch());
$('#live').html(live+" min");
}
function getDiff(ts) {
  // get the time from storage
  var started = localStorage['startTime'];
  
  // Get difference in times
  var diff = ts-started;
  minVar = Math.floor(diff/60); 
  secVar = diff % 60;
  return minVar+":"+secVar;
  
}

$(document).ready(function() {
  // If you reload the page
  if (localStorage['startTime']) {
    $("#theButton a").attr('class', 'stop');
    $("#theButton a").text('Stop Time');
    $('.notes').empty().append("<span><b>Started at:</b> "+formattedTime(localStorage['startTime'])+"</span>"); 
    liveTime();
  }
   
  // If you click the button
  $('#theButton a').click(function() {
    ts = epoch();
    running = checkRunning();
    fTime = formattedTime(ts);
    
    if (!running) {
      $("#theButton a").attr('class', 'stop');
      $("#theButton a").text('Stop Time');
      
     localStorage['startTime'] = ts;
      $('.notes').empty().append("<span><b>Started at:</b> "+fTime+"</span>");
      $('#live').show();
      liveTime();
    } else {
      $("#theButton a").attr('class', 'start');
      $("#theButton a").text('Start Time');
      
      var diff = getDiff(ts);
      
      // Feedback
      $('.notes').append("<span><b>Elapsed:</b> "+diff+" min</span>");
      
      // destroy time
      localStorage.removeItem('startTime');
    
      $('#live').hide();
    }
    return false;
  });
  
  
});

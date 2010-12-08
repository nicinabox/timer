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
  $('#live span').html(formatDiff());
}
function totalTime(diff) {
  return (diff/60/60).toFixed(2)+" hours";
}
function getDiff() {
  var ts = epoch();
  var started = localStorage['startTime'];
  var diff = ts-started; 
  return diff;
}
function formatDiff() {
  var diff = getDiff();
  
  sec = diff % 60; 
  min = Math.floor(diff/60); 
  hr = Math.floor(diff/60/60); 

  out = sec+" sec";
  if (min > 0) {
    out = min%60+" min "+out;
  }
  if (hr > 0) {
   out = hr+" hr "+out;
  }
  
  return out;
}

$(document).ready(function() {
  // If you reload the page
  if (localStorage['startTime']) {
    $("#theButton").attr('class', 'stop');
    $("#theButton").text('Stop Time');
    $('#started span').html(formattedTime(localStorage['startTime'])).parent().show(); 
    $('#live').show();
    liveTime();
    id = setInterval(liveTime, 1000);
  }
  if (localStorage['recentTime'] != "0.00") {
    $('#recent span').html(localStorage['recentTime']).parent().show();
  }
   
  // If you click the button
  $('#theButton').click(function() {
    ts = epoch();
    running = checkRunning();
    fTime = formattedTime(ts);
    
    if (!running) {
      $("#theButton").attr('class', 'stop');
      $("#theButton").text('Stop Time');
      
     localStorage['startTime'] = ts;
      $('#started span').html(fTime).parent().fadeIn('fast');
      $('#total').hide();
      $('#live').fadeIn('fast');
      liveTime();
      id = setInterval(liveTime, 1000);
      
    } else {
      $("#theButton").attr('class', 'start');
      $("#theButton").text('Start Time');
      
      var diff = getDiff();
      var total = totalTime(diff);
      $('#total span').html(total).parent().fadeIn('fast');
      
      if (localStorage['recentTime'] != "0.00") {
        $('#recent span').html(localStorage['recentTime']).parent().fadeIn('fast');
      }
      
      localStorage['recentTime'] = total;
      
      // Clean up
      localStorage.removeItem('startTime');
      clearTimeout(id);
      
    }
    return false;
  });
  
  
});

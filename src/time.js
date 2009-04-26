/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Time Cogs
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function Time() {
  
  $C.time = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date();
    
    if (arguments.length > 0) {
      date.setFullYear(1, 0, 1);
      date.setHours(0, 0, 0, 0);
      
      yr = yr || 1;
      mn = mn || 1;
      dy = dy || 1;
      hr = hr || 0;
      mi = mi || 0;
      sc = sc || 0;
      ms = ms || 0;
      
      date.setFullYear(yr, mn - 1, dy);
      date.setHours(hr, mi, sc, ms);
    }
    
    return date.getTime();
  };
  
  $C.utc = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date();
    
    if (arguments.length > 0) {
      date.setUTCFullYear(1, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      
      yr = yr || 1;
      mn = mn || 1;
      dy = dy || 1;
      hr = hr || 0;
      mi = mi || 0;
      sc = sc || 0;
      ms = ms || 0;
      
      date.setUTCFullYear(yr, mn - 1, dy);
      date.setUTCHours(hr, mi, sc, ms);
    }
    
    return date.getTime();
  };
  
})();
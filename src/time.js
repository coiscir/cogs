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
  
  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/
  
  var MIN_T = $C.time(   1,  1,  1,  0,  0,  0,   0);
  var MAX_T = $C.time(9999, 12, 31, 23, 59, 59, 999);
  var MIN_U = $C.utc(    1,  1,  1,  0,  0,  0,   0);
  var MAX_U = $C.utc( 9999, 12, 31, 23, 59, 59, 999);
  
  var to_i = function (num) {
    return num - (num % 1);
  };
  
  var rjust = function (num, len, chr) {
    var str = String(num);
    while (str.length < len) str = (chr || ' ') + str;
    return str;
  };
  
  var tumble = function (num, top, off) { // tumble numbers in a 0-index range
    top = to_i(top || 0);
    return (to_i(num) + top - 1) % top + (off || 0);
  };
  
  var months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  var weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];
  var oridinal = ['th', 'st', 'nd', 'rd'];
  
  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/
  
  $C.strftime = function (format, time) {
    if (!$C.is_a(format, String))
      throw new Error('Expected a String format.');
    
    if ($C.is_a(time, Date)) time = time.getTime();
    time = new Date($C.is_a(time, Number) ? time : $C.utc()).getTime();
    
    if (time != 0 && !time)
      throw new Error('Invalid time.');
    if (!(MIN_T <= time && time <= MAX_T))
      throw new Error('Time is out-of-range (years 1 to 9999).');
    
    return strf(format, time, false);
  };

  $C.strfutc = function (format, time) {
    if (!$C.is_a(format, String))
      throw new Error('Expected a String format.');
    
    if ($C.is_a(time, Date)) time = time.getTime();
    time = new Date($C.is_a(time, Number) ? time : $C.utc()).getTime();
    
    if (time != 0 && !time)
      throw new Error('Invalid time.');
    if (!(MIN_U <= time && time <= MAX_U))
      throw new Error('Time is out-of-range (years 1 to 9999).');
    
    return strf(format, time, true);
  };
  
  var strf = function (format, time, is_utc) {
    var day = 24 * 60 * 60 * 1000;
    
    var date = new Date(time);
    
    // January 1st
    var janCurr = new Date(is_utc ?
      $C.utc(date.getUTCFullYear() + 0) : $C.time(date.getFullYear() + 0));
    var janNext = new Date(is_utc ?
      $C.utc(date.getUTCFullYear() + 1) : $C.time(date.getFullYear() + 1));
    
    // 1st Sunday, 1st Monday, and Adjusted 1st Monday
    var sunDaysCurr = janCurr[is_utc ? 'getUTCDay' : 'getDay']();
    var sunDaysNext = janNext[is_utc ? 'getUTCDay' : 'getDay']();
    var monDaysCurr = tumble(sunDaysCurr, 7);
    var monDaysNext = tumble(sunDaysNext, 7);
    var monCurr = janCurr.getTime() -
      (day * (monDaysCurr - (monDaysCurr >= 4 ? 7 : 0)));
    var monNext = janNext.getTime() -
      (day * (monDaysNext - (monDaysNext >= 4 ? 7 : 0)));
    var sunday = janCurr.getTime() - (day * sunDaysCurr);
    var monday = janCurr.getTime() - (day * monDaysCurr);
    
    var base = {};
    // day, month, year
      base.date = date[is_utc ? 'getUTCDate' : 'getDate']();
      base.ord  = (10 <= base.date && base.date <= 19) ? 0 : (base.date % 10);
      base.mon  = date[is_utc ? 'getUTCMonth' : 'getMonth']();
      base.year = date[is_utc ? 'getUTCFullYear' : 'getFullYear']();
    // hour, minute, second
      base.hour = date[is_utc ? 'getUTCHours' : 'getHours']();
      base.min  = date[is_utc ? 'getUTCMinutes' : 'getMinutes']();
      base.sec  = date[is_utc ? 'getUTCSeconds' : 'getSeconds']();
      base.msec = (((time % 1000) + 1000) % 1000) * 1000;
    // week
      base.week = date[is_utc ? 'getUTCDay' : 'getDay']();
    // timezone
      base.off  = is_utc ? 0 : date.getTimezoneOffset();
      base.dst  = is_utc ? false : base.off !== janCurr.getTimezoneOffset();
      base.zone = -1 * base.off;
    // leap year
      base.leap = !(base.year % 4) && !!(base.year % 100) || !(base.year % 400);
    
    var locale_c = {
      local: '%a, %e %b %Y %H:%M:%S GMT%z',
      utc:   '%a, %e %b %Y %H:%M:%S GMT'
    };
    var format_c = [0].concat(locale_c[is_utc ? 'utc' : 'local'].split(''));
    var format_D = [0].concat('%m/%d/%y'.split(''));
    var format_F = [0].concat('%Y-%m-%d'.split(''));
    var format_r = [0].concat('%I:%M:%S %p'.split(''));
    var format_R = [0].concat('%H:%M'.split(''));
    var format_T = [0].concat('%H:%M:%S'.split(''));
    var format_v = [0].concat('%e-%b-%Y'.split(''));
    var format_x = format_F;
    var format_X = format_T;
    var splice = Array.prototype.splice;
    
    format = format.split('');
    var buffer = '';
    for (var i = 0; i < format.length; i += 1) {
      if (format[i] == '%') {
        switch (format[(i += 1)]) {
          case '%': buffer += '%'; break;
          case 'a': buffer += weekdays[base.week].substr(0, 3); break;
          case 'A': buffer += weekdays[base.week]; break;
          case 'b': buffer += months[base.mon].substr(0, 3); break;
          case 'B': buffer += months[base.mon]; break;
          case 'c': splice.apply(format, [i + 1].concat(format_c)); break;
          case 'C': buffer += rjust(to_i(base.year / 100), 2, '0'); break;
          case 'd': buffer += rjust(base.date, 2, '0'); break;
          case 'D': splice.apply(format, [i + 1].concat(format_D)); break;
          case 'e': buffer += rjust(base.date, 2); break;
          case 'E': break;
          case 'F': splice.apply(format, [i + 1].concat(format_F)); break;
          case 'g': buffer += rjust(((
                      (time < monCurr ? (base.year - 1) :
                        (time >= monNext ? (base.year + 1) : base.year)
                      )
                    ) % 100), 2, '0'); break;
          case 'G': buffer += rjust((
                      (time < monCurr ? (base.year - 1) :
                        (time >= monNext ? (base.year + 1) : base.year)
                      )
                    ), 4, '0'); break;
          case 'h': buffer += months[base.mon].substr(0, 3); break; // %b
          case 'H': buffer += rjust(base.hour, 2, '0'); break;
          case 'I': buffer += rjust(tumble(base.hour % 12, 12, 1), 2, '0'); break;
          case 'j': buffer += rjust(to_i((time - janCurr) / day) + 1, 3, '0'); break;
          case 'k': buffer += rjust(base.hour, 2); break;
          case 'l': buffer += rjust(tumble(base.hour % 12, 12, 1), 2); break;
          case 'm': buffer += rjust(base.mon + 1, 2, '0'); break;
          case 'M': buffer += rjust(base.min, 2, '0'); break;
          case 'n': buffer += '\n'; break;
          case 'N': buffer += rjust(base.msec / 1000, 3, '0'); break;
          case 'O': break;
          case 'p': buffer += meridiem[base.hour < 12 ? 0 : 1] || ''; break;
          case 'P': buffer += meridiem[base.hour < 12 ? 2 : 3] || ''; break;
          case 'r': splice.apply(format, [i + 1].concat(format_r)); break;
          case 'R': splice.apply(format, [i + 1].concat(format_R)); break;
          case 's': buffer += to_i(time / 1000); break;
          case 'S': buffer += rjust(base.sec, 2, '0'); break;
          case 't': buffer += '\t'; break;
          case 'T': splice.apply(format, [i + 1].concat(format_T)); break;
          case 'u': buffer += tumble(base.week, 7, 1); break;
          case 'U': buffer += rjust(to_i((time - sunday) / (7 * day)), 2, '0'); break;
          case 'v': splice.apply(format, [i + 1].concat(format_v)); break;
          case 'V': buffer += rjust((
                      to_i((
                        to_i(time / day) -
                        tumble(base.week, 7) -
                        to_i((time > monNext ? monNext : monCurr) / day)
                      ) / 7) + 1
                    ), 2, '0'); break;
          case 'w': buffer += base.week; break;
          case 'W': buffer += rjust(to_i((time - monday) / (7 * day)), 2, '0'); break;
          case 'x': splice.apply(format, [i + 1].concat(format_x)); break;
          case 'X': splice.apply(format, [i + 1].concat(format_X)); break;
          case 'y': buffer += rjust((base.year % 100), 2, '0'); break;
          case 'Y': buffer += rjust(base.year, 4, '0'); break;
          case 'z': buffer += ''.concat(
                      (base.zone < 0 ? '-' : '+'),
                      rjust(Math.abs(to_i(base.zone / 60)), 2, '0'),
                      rjust(Math.abs(base.zone % 60), 2, '0')
                    ); break;
          case 'Z': break;  /* unsupported */
          default : buffer += format[i];
        }
      } else {
        buffer += format[i];
      }
    }
    
    return buffer;
  };
  
})();
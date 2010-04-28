/**!
 *  Cogs JavaScript Library
 *  http://github.com/coiscir/cogs/
 *
 *  Copyright (c) 2009-2010 Jonathan Lonowski
 *  Released and distributed under the MIT License.
**/

"use strict";

new function Cogs() {
  var Cogs = window.Cogs = this;
  Cogs.fn = Cogs.constructor.prototype;
  
  
  function integer(num) {
    return num - (num % 1);
  }
  
  function justify(obj, len, pad) {
    var str = String(obj);
    while (str.length < len)
      str = (pad || ' ') + str;
    return str;
  }
  
  // rotate numbers within given range
  // i.e., tumble(num, 3) <=> [3,0,1,2][ [0,1,2,3].indexOf(num) ]
  // e.g., tumble(hr24 % 12, 12, 1) => hr12
  function tumble(num, top, bump) {
    num = integer(num || 0);
    top = integer(top || 0);
    return !top ? num :
      (num + top - 1) % top + integer(bump || 0);
  }
  
  
  /****************/
  /** Cookie Cog **/
  /****************/
  
  (function () {
    
    var PAIRS, SOURCE, DAY = 24 * 60 * 60 * 1000;;
    
    function preamble() {
      var i, pair, key, val, cookies,
        source = document.cookie.valueOf();
      
      if (SOURCE !== source) {
        PAIRS = {};
        SOURCE = source;
        cookies = SOURCE.replace(/\+/g, '%20').split(/\;\s*/);
        
        for (i = 0; i < cookies.length; i += 1) {
          pair = cookies[i].split(/=/, 2);
          key = decodeURIComponent(pair[0]);
          val = decodeURIComponent(pair[1] || '');
          
          PAIRS[key] = val;
        }
      }
      
      return PAIRS;
    }
    
    function create(name, value, options) {
      var cookie = [];
      
      if (options === true)
        options = {duration: -1};
      if (Cogs.is_a(options, Number))
        options = {duration: options};
      
      options = options || {};
      options = {
        duration: Cogs.is_a(options.duration, Number) ? options.duration : null,
        domain:   Cogs.is_a(options.domain,   String) ? options.domain   : null,
        path:     Cogs.is_a(options.path,     String) ? options.path     : null,
        secure:   Cogs.is_a(options.secure,  Boolean) ? options.secure   : null
      };
      
      cookie.push(
        encodeURIComponent(name) + '=' +
        encodeURIComponent(value)
      );
      
      if (Cogs.is_a(options.duration, Number))
        cookie.push('expires=' + 
          new Date(Cogs.utc() + options.duration * DAY).toUTCString()
        );
      
      if (options.domain)
        cookie.push('domain=' + encodeURIComponent(options.domain));
      
      if (options.path)
        cookie.push('path=' + encodeURIComponent(options.path));
      
      if (options.secure)
        cookie.push('secure');
      
      document.cookie = cookie.join('; ').replace(/%20/g, '+');
      
      return !Cogs.is_a(search(name), 'nil');
    }
    
    function search(name) {
      var pairs = preamble();
      
      if (Cogs.is_a(pairs[name], String))
        return pairs[name];
      else
        return null;
    }
    
    Cogs.fn.cookie = function cookie(name, value, options) {
      if (arguments.length <= 1)
        return search(name);
      else
        return create(name, value, options);
    };
    
  })();
  
  
  /**************/
  /** Time Cog **/
  /**************/
  
  (function () {
    
    Cogs.fn.time = function time(yr, mn, dy, hr, mi, sc, ms) {
      var date = new Date();
      
      if (arguments.length > 0) {
        yr = (+yr || 0);
        mn = (+mn || 1) - 1;
        dy = (+dy || 1);
        hr = (+hr || 0);
        mi = (+mi || 0);
        sc = (+sc || 0);
        ms = (+ms || 0);
        
        date.setFullYear(yr, mn, dy);
        date.setHours(hr, mi, sc, ms);
      }
      
      return date.getTime();
    };
    
    Cogs.fn.utc = function utc(yr, mn, dy, hr, mi, sc, ms) {
      var date = new Date();
      
      if (arguments.length > 0) {
        yr = (+yr || 0);
        mn = (+mn || 1) - 1;
        dy = (+dy || 1);
        hr = (+hr || 0);
        mi = (+mi || 0);
        sc = (+sc || 0);
        ms = (+ms || 0);
        
        date.setUTCFullYear(yr, mn, dy);
        date.setUTCHours(hr, mi, sc, ms);
      }
      
      return date.getTime();
    };
  
  })();
  
  (function () {
    
    var
      DAY = 24 * 60 * 60 * 1000,
      SWB = 24 * 60 * 60 / 1000,
      MIN_TIME = Cogs.time(1),
      MAX_TIME = Cogs.time(10000) - 1,
      MIN_UTC = Cogs.utc(1),
      MAX_UTC = Cogs.utc(10000) - 1,
      MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ],
      MONTHDAYS = [
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      ],
      WEEKDAYS = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ],
      ORDINALS = ['th', 'st', 'nd', 'rd'],
      MERIDIEM = ['AM', 'PM', 'am', 'pm'];
    
    function preface(fn, format, time, isUtc) {
      if (format == null || format === '') {
        return '';
      }
      if (time == null) {
        time = Cogs.time();
      }
      
      if (Cogs.isof(time, Date, Number)) {
        return fn(String(format || ''), preamble(time, isUtc));
      } else {
        throw new TypeError('Expected time to be a Date or Number.');
      }
    }
    
    function preamble(time, isUtc) {
      var base = {}, date,
        january1stCurr, january1stNext, january1stPrev, // January 1st, Midnight
        daysSundayCurr, daysSundayNext, daysSundayPrev, // January 1st, Day of Sunday Week
        daysMondayCurr, daysMondayCurr, daysMondayPrev, // January 1st, Day of Monday Week
        isoMondayCurr, isoMondayNext, isoMondayPrev,    // First Monday of ISO-8601 Year
        firstSunday, firstMonday;                       // Week Starts before January 1st
      
      date = new Date(time);
      time = date.getTime();
      
      // check time against valid date ranges
      if (isUtc) {
        if ((time < MIN_UTC) || (time > MAX_UTC)) {
          throw new Error('Timestamp is out of range (Years 0 - 9999) for UTC Time.');
        }
      } else {
        if ((time < MIN_TIME) || (time > MAX_TIME)) {
          throw new Error('Timestamp is out of range (Years 0 - 9999) for Local Time.');
        }
      }
      
      // determine reference values for date
      january1stCurr = new Date(isUtc ?
        Cogs.utc(date.getUTCFullYear() + 0) : Cogs.time(date.getFullYear() + 0));
      january1stNext = new Date(isUtc ?
        Cogs.utc(date.getUTCFullYear() + 1) : Cogs.time(date.getFullYear() + 1));
      january1stPrev = new Date(isUtc ?
        Cogs.utc(date.getUTCFullYear() - 1) : Cogs.time(date.getFullYear() - 1));
      
      daysSundayCurr = isUtc ?
        january1stCurr.getUTCDay() : january1stCurr.getDay();
      daysSundayNext = isUtc ?
        january1stNext.getUTCDay() : january1stNext.getDay();
      daysSundayPrev = isUtc ?
        january1stPrev.getUTCDay() : january1stPrev.getDay();
      
      daysMondayCurr = tumble(daysSundayCurr, 7);
      daysMondayNext = tumble(daysSundayNext, 7);
      daysMondayPrev = tumble(daysSundayPrev, 7);
      
      isoMondayCurr = january1stCurr.getTime() -
        (DAY * (daysMondayCurr - (daysMondayCurr >= 4 ? 7 : 0)));
      isoMondayNext = january1stNext.getTime() -
        (DAY * (daysMondayNext - (daysMondayNext >= 4 ? 7 : 0)));
      isoMondayPrev = january1stPrev.getTime() -
        (DAY * (daysMondayPrev - (daysMondayPrev >= 4 ? 7 : 0)));
      
      firstSunday = january1stCurr.getTime() - (DAY * daysSundayCurr);
      firstMonday = january1stCurr.getTime() - (DAY * daysMondayCurr);
      
      // build preamble baseline values
      with (base) {
        
        base.TIME = time;
        base.IS_UTC = isUtc;
      
        base.DATE = isUtc ? date.getUTCDate() : date.getDate();
        base.MONTH = isUtc ? date.getUTCMonth() : date.getMonth();
        base.YEAR = isUtc ? date.getUTCFullYear() : date.getFullYear();
        
        base.ORDINAL = ORDINALS[
          (10 <= DATE && DATE <= 19) ? 0 : (DATE % 10)
        ] || ORDINALS[0];
        
        base.IS_LEAP = !(YEAR % 4) && !!(YEAR % 100) || !(YEAR % 400);
        base.DAYSOFMONTH = MONTHDAYS[IS_LEAP ? 1 : 0][MONTH];
        
        base.HOUR = isUtc ? date.getUTCHours() : date.getHours();
        base.MINUTE = isUtc ? date.getUTCMinutes() : date.getMinutes();
        base.SECOND = isUtc ? date.getUTCSeconds() : date.getSeconds();
        base.MSEC = isUtc ? date.getUTCMilliseconds() : date.getMilliseconds();
        
        base.OFFSET = isUtc ? 0 : date.getTimezoneOffset();
        base.IS_DST = isUtc ? false : OFFSET !== january1stCurr.getTimezoneOffset();
        base.TIMEZONE = -1 * OFFSET;
        
        base.WEEKDAY = isUtc ? date.getUTCDay() : date.getDay();
        
        base.DAYOFYEAR = integer((TIME - january1stCurr.getTime()) / DAY) + 1;
        
        base.FIRST_SUNDAY = firstSunday;
        base.FIRST_MONDAY = firstMonday;
        
        base.ISO_MONDAY_CURR = isoMondayCurr;
        base.ISO_MONDAY_NEXT = isoMondayNext;
        base.ISO_MONDAY_PREV = isoMondayPrev;
      
      }
      
      return base;
    }
    
    
    /* strftime */
    
    function strf(format, base) {
      with (base) {
        
        return format.replace(/%(.)/g, function (match, convert) {
          switch (convert) {
            case 'c': return '%a, %e %b %Y %H:%M:%S GMT' + (IS_UTC ? '' : '%z');
            case 'D': return '%m/%d/%y';
            case 'F': return '%Y-%m-%d';
            case 'r': return '%I:%M:%S %p';
            case 'R': return '%H:%M';
            case 'T': return '%H:%M:%S';
            case 'v': return '%e-%b-%Y';
            case 'x': return '%Y-%m-%d';
            case 'X': return '%H:%M:%S';
            
            /* unsupported
            case 'E': ...;
            case 'O': ...;
            case 'Z': ...;
            */
            
            default:  return match;
          }
        }).replace(/%(.)/g, function (match, convert) {
          switch (convert) {
            case '%': return '%';
            case 'a': return WEEKDAYS[WEEKDAY].substr(0, 3);
            case 'A': return WEEKDAYS[WEEKDAY];
            case 'b': return MONTHS[MONTH].substr(0, 3);
            case 'B': return MONTHS[MONTH];
            case 'C': return justify(integer(YEAR / 100), 2, '0');
            case 'd': return justify(DATE, 2, '0');
            case 'e': return justify(DATE, 2, ' ');
            case 'g': return justify((
                        (TIME < ISO_MONDAY_CURR ? (YEAR - 1) :
                          (TIME >= ISO_MONDAY_NEXT ? (YEAR + 1) : YEAR)
                        )
                      ) % 100, 2, '0');
            case 'G': return justify((
                        (TIME < ISO_MONDAY_CURR ? (YEAR - 1) :
                          (TIME >= ISO_MONDAY_NEXT ? (YEAR + 1) : YEAR)
                        )
                      ), 4, '0');
            case 'h': return MONTHS[MONTH].substr(0, 3);
            case 'H': return justify(HOUR, 2, '0');
            case 'I': return justify(tumble(HOUR % 12, 12, 1), 2, '0');
            case 'j': return justify(DAYOFYEAR, 3, '0');
            case 'k': return justify(HOUR, 2, ' ');
            case 'l': return justify(tumble(HOUR % 12, 12, 1), 2, ' ');
            case 'm': return justify(MONTH + 1, 2, '0');
            case 'M': return justify(MINUTE, 2, '0');
            case 'n': return '\n';
            case 'N': return justify(MSEC, 3, '0');
            case 'p': return MERIDIEM[HOUR < 12 ? 0 : 1];
            case 'P': return MERIDIEM[HOUR < 12 ? 2 : 3];
            case 's': return integer(TIME / 1000);
            case 'S': return justify(SECOND, 2, '0');
            case 't': return '\t';
            case 'u': return tumble(WEEKDAY, 7, 1);
            case 'U': return justify(integer((TIME - FIRST_SUNDAY) / (7 * DAY)), 2, '0');
            case 'V': return justify((
                        integer((
                          integer(TIME / DAY) -
                          tumble(WEEKDAY, 7) -
                          integer((
                            (TIME >= ISO_MONDAY_NEXT ? ISO_MONDAY_NEXT : 
                              (TIME >= ISO_MONDAY_CURR ? ISO_MONDAY_CURR : ISO_MONDAY_PREV)
                            )
                          ) / DAY)
                        ) / 7) + 1
                      ), 2, '0');
            case 'w': return WEEKDAY;
            case 'W': return justify(integer((TIME - FIRST_MONDAY) / (7 * DAY)), 2, '0');
            case 'y': return justify((YEAR % 100), 2, '0');
            case 'Y': return justify(YEAR, 4, '0');
            case 'z': return (
                        (TIMEZONE < 0 ? '-' : '+') +
                        justify(Math.abs(integer(TIMEZONE / 60)), 2, '0') +
                        justify(Math.abs(TIMEZONE % 60), 2, '0')
                      );
            default:  return match;
          }
        });
        
      }
    }
    
    Cogs.fn.strftime = function strftime(format, time) {
      return preface(strf, format, time, false);
    };
    
    Cogs.fn.strfutc = function strfutc(format, time) {
      return preface(strf, format, time, true);
    };
    
    /* PHP's date() */
    
    function phpf(format, base) {
      with (base) {
        
        return format.replace(/(\\)?(.)/g, function (match, option, convert) {
          if (option === '\\') return match;
          
          switch (convert) {
            case 'c': return 'Y-m-d\\TH:i:sP';
            case 'r': return 'D, d M Y H:i:s O';
            
            /* unsupported */
            case 'e': return '';
            case 'T': return '';
            
            default:  return match;
          }
        }).replace(/(\\)?(.)/g, function (match, option, convert) {
          if (option === '\\') return convert;
          
          var colon = true; // +HHMM or +HH:MM
          
          switch (convert) {
          // Day
            case 'd': return justify(DATE, 2, '0');
            case 'D': return WEEKDAYS[WEEKDAY].substr(0, 3);
            case 'j': return DATE;
            case 'l': return WEEKDAYS[WEEKDAY];
            case 'N': return tumble(WEEKDAY, 7, 1);
            case 'S': return ORDINAL;
            case 'w': return WEEKDAY;
            case 'z': return DAYOFYEAR;
          // Week
            case 'W': return justify((
                        integer((
                          integer(TIME / DAY) -
                          tumble(WEEKDAY, 7) -
                          integer((
                            (TIME >= ISO_MONDAY_NEXT ? ISO_MONDAY_NEXT :
                              (TIME >= ISO_MONDAY_CURR ? ISO_MONDAY_CURR : ISO_MONDAY_PREV)
                            )
                          ) / DAY)
                        ) / 7) + 1
                      ), 2, '0');
          // Month
            case 'F': return MONTHS[MONTH];
            case 'm': return justify(MONTH + 1, 2, '0');
            case 'M': return MONTHS[MONTH].substr(0, 3);
            case 'n': return MONTH + 1;
            case 't': return DAYSOFMONTH;
          // Year
            case 'L': return IS_LEAP ? 1 : 0;
            case 'o': return justify((
                        (TIME < ISO_MONDAY_CURR ? (YEAR - 1) :
                          (TIME >= ISO_MONDAY_NEXT ? (YEAR + 1) : YEAR)
                        )
                      ), 4, '0');
            case 'Y': return justify(YEAR, 4, '0');
            case 'y': return justify(YEAR % 100, 2, '0');
          // Time
            case 'a': return MERIDIEM[HOUR < 12 ? 2 : 3];
            case 'A': return MERIDIEM[HOUR < 12 ? 0 : 1];
            case 'B': return (((
                        integer((
                          (HOUR * 3600) + (MINUTE * 60) + SECOND +
                          ((OFFSET + 60) * 60)
                        ) / SWB)
                      ) + 1000) % 1000, 3, '0');
            case 'g': return tumble(HOUR % 12, 12, 1);
            case 'G': return HOUR;
            case 'h': return justify(tumble(HOUR % 12, 12, 1), 2, '0');
            case 'H': return justify(HOUR, 2, '0');
            case 'i': return justify(MINUTE, 2, '0');
            case 's': return justify(SECOND, 2, '0');
            case 'u': return justify(MSEC * 1000, 6, '0');
          // Timezone
            case 'I': return IS_DST ? 1 : 0;
            case 'O': colon = false; /* continue */
            case 'P': return (
                        (TIMEZONE < 0 ? '-' : '+') +
                        justify(Math.abs(integer(TIMEZONE / 60)), 2, '0') +
                        (colon ? ':' : '') +
                        justify(Math.abs(TIMEZONE % 60), 2, '0')
                      );
            case 'Z': return TIMEZONE * 60;
          // Full Date/Time
            case 'U': return integer(TIME / 1000);
            
            default:  return convert;
          }
        });
        
      }
    };
    
    Cogs.fn.phpdate = function phpdate(format, time) {
      return preface(phpf, format, time, false);
    };
    
    Cogs.fn.phputc = function phputc(format, time) {
      return preface(phpf, format, time, true);
    };
    
  })();
  
  
  /**************/
  /** Type Cog **/
  /**************/
  
  (function () {
    
    var UND = 'undefined', NUL = 'null',
        ARR = 'array',     BLN = 'boolean',
        DTE = 'date',      ERR = 'error',
        FNC = 'function',  NUM = 'number',
        OBJ = 'object',    RGX = 'regexp',
        STR = 'string',    UNK = 'unknown',
        NIL = 'nil';
    
    Cogs.fn.type = function type(object) {
      switch (typeof object) {
        case UND: return UND;
        case BLN: return BLN;
        case NUM: return NUM;
        case STR: return STR;
        case FNC:
          if (object.constructor == RegExp) return RGX;
          return FNC;
        case OBJ:
          if (object === null) return NUL;
          if (object instanceof Error) return ERR;
          switch (object.constructor) {
            case Array:   return ARR;
            case Boolean: return BLN;
            case Date:    return DTE;
            case Number:  return NUM;
            case RegExp:  return RGX;
            case String:  return STR;
            default:      return OBJ;
          }
        default: return UNK;
      }
    };
    
    Cogs.fn.is_a = function is_a(object, compare) {
      switch (Cogs.type(compare)) {
        case UND: return object === compare;
        case NUL: return object === compare;
        case STR:
          switch (compare) {
            case NIL: return object == null;
            default:  return Cogs.type(object) === compare;
          }
        case FNC:
          switch (compare) {
            case Boolean: return Cogs.type(object) === BLN;
            case Number:  return Cogs.type(object) === NUM;
            case String:  return Cogs.type(object) === STR;
            default:      return object instanceof compare;
          }
        default: return false;
      }
    };
    
    Cogs.fn.isof = function isof(object, compare) {
      for (var i = 1; i < arguments.length; i += 1)
        if (true === Cogs.is_a(object, arguments[i]))
          return true;
      return false;
    };
    
  })();
}();

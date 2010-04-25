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
      MIN_TIME = Cogs.time(1),
      MAX_TIME = Cogs.time(10000) - 1,
      MIN_UTC = Cogs.utc(1),
      MAX_UTC = Cogs.utc(10000) - 1,
      MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ],
      WEEKDAYS = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ],
      ORDINALS = ['th', 'st', 'nd', 'rd'],
      MERIDIEM = ['AM', 'PM', 'am', 'pm'];
    
    function preamble(time, isUtc) {
      var base = {}, date,
        january1stCurr, january1stNext, // January 1st, Midnight
        daysSundayCurr, daysSundayNext, // January 1st, Day of Sunday Week
        daysMondayCurr, daysMondayCurr, // January 1st, Day of Monday Week
        isoMondayCurr, isoMondayNext,   // First Monday of ISO-8601 Year
        firstSunday, firstMonday;       // Week Starts before January 1st
      
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
      
      daysSundayCurr = isUtc ?
        january1stCurr.getUTCDay() : january1stCurr.getDay();
      daysSundayNext = isUtc ?
        january1stNext.getUTCDay() : january1stNext.getDay();
      
      daysMondayCurr = tumble(daysSundayCurr, 7);
      daysMondayNext = tumble(daysSundayNext, 7);
      
      isoMondayCurr = january1stCurr.getTime() -
        (DAY * (daysMondayCurr - (daysMondayCurr >= 4 ? 7 : 0)));
      isoMondayNext = january1stNext.getTime() -
        (DAY * (daysMondayNext - (daysMondayNext >= 4 ? 7 : 0)));
      
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
        
        base.HOUR = isUtc ? date.getUTCHours() : date.getHours();
        base.MINUTE = isUtc ? date.getUTCMinutes() : date.getMinutes();
        base.SECOND = isUtc ? date.getUTCSeconds() : date.getSeconds();
        base.MSEC = isUtc ? date.getUTCMilliseconds() : date.getMilliseconds();
        base.NSEC = base.MSEC * 1000;
        
        base.OFFSET = isUtc ? 0 : date.getTimezoneOffset();
        base.IS_DST = isUtc ? false : OFFSET !== january1stCurr.getTimezoneOffset();
        base.TIMEZONE = -1 * OFFSET;
        
        base.WEEKDAY = isUtc ? date.getUTCDay() : date.getDay();
        
        base.DAYOFYEAR = integer((TIME - january1stCurr.getTime()) / DAY);
        
        base.FIRST_SUNDAY = firstSunday;
        base.FIRST_MONDAY = firstMonday;
        
        base.ISO_MONDAY_CURR = isoMondayCurr;
        base.ISO_MONDAY_NEXT = isoMondayNext;
      
      }
      
      return base;
    }
    
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
        STR = 'string',    UNK = 'unknown';
    
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
        case STR: return Cogs.type(object) === compare;
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

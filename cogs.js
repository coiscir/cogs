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

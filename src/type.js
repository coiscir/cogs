/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Data-Type Cogs
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function Type() {

  var UND = 'undefined', NUL = 'null',
      ARR = 'array',     BLN = 'boolean',
      DTE = 'date',      ERR = 'error',
      FNC = 'function',  NUM = 'number',
      OBJ = 'object',    RGX = 'regexp',
      STR = 'string',    UNK = 'unknown';
  
  $C.type = function (object) {
    switch (typeof object) {
      case UND : return UND;
      case BLN : return BLN;
      case NUM : return NUM;
      case STR : return STR;
      case FNC :
        if (object.constructor === RegExp) return RGX;
        return FNC;
      case OBJ :
        if (object === null) return NUL;
        if (object instanceof Error) return ERR;
        if (object.constructor === Array)   return ARR;
        if (object.constructor === Boolean) return BLN;
        if (object.constructor === Date)    return DTE;
        if (object.constructor === Number)  return NUM;
        if (object.constructor === RegExp)  return RGX;
        if (object.constructor === String)  return STR;
        return OBJ;
      default : return UNK;
    }
  };
  
  $C.is_a = function (object, compare) {
    switch ($C.type(compare)) {
      case UND : return object === compare;
      case NUL : return object === compare;
      case STR : return $C.type(object) === compare;
      case FNC :
        switch (compare) { // promote primitives
          case Boolean : return $C.type(object) === BLN;
          case Number  : return $C.type(object) === NUM;
          case String  : return $C.type(object) === STR;
          default      : return object instanceof compare;
        }
      default : return false;
    }
  };
  
})();

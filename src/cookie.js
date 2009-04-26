/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Cookie Cogs
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function Cookie() {
  
  // read   = function (name)
  // write  = function (name, value, options)
  // expire = function (name, ..., true)
  
  $C.cookie = function (name, value, options) {
    if (!$C.is_a(name, String))
      throw new Error('Name is missing or not a String.');
    
    if (options === true) options = {duration: -1};
    
    options = options || {};
    options = {
      duration : $C.is_a(options.duration, Number) ? options.duration : false,
      domain   : $C.is_a(options.domain,   String) ? options.domain   : false,
      path     : $C.is_a(options.path,     String) ? options.path     : false,
      secure   : $C.is_a(options.secure,  Boolean) ? options.secure   : false
    };
    
    var mode = 'r';
    if ($C.is_a(value, String)) mode = 'w';
    if (options.duration < 0) mode = 'e';
    
    var ret = undefined;
    switch (mode) {
      case 'r':
        ret = search(name);
        if (ret === undefined)
          throw new Error('Cookie could not be read.');
        break;
      case 'w':
        ret = write(name, value, options);
        if (ret === false)
          throw new Error('Cookie could not be written.');
        break;
      case 'e':
        if (search(name) === undefined)
          throw new Error('Cannot expire an unwritten Cookie.');
        ret = !write(name, '', options);
        if (ret === false)
          throw new Error('Cookie could not be expired.');
        break;
      default:
        throw new Error('Invalid mode: "' + String(mode) + '"');
    }
    return ret;
  };
  
  var search = function (name) {
    var cookies = document.cookie.replace(/\+/g, '%20').split(/\;\s*/);
    for (var i = 0, pair; i < cookies.length; i += 1) {
      pair = cookies[i].split(/=/, 2);
      if (name === decodeURIComponent(pair[0]))
        return decodeURIComponent(pair[1] || '');
    }
  };
  
  var write = function (name, value, options) {
    var day = 24 * 60 * 60 * 1000;
    
    document.cookie = ''.concat(
      (
        encodeURIComponent(name) + '=' + encodeURIComponent(value)
      ).replace(/%20/g, '+'),
      (!options.duration ? '' : ('; expires=' +
        new Date(new Date().getTime() + options.duration * day).toUTCString()
      )),
      (!options.domain   ? '' : ('; domain='  + options.domain)),
      (!options.path     ? '' : ('; path='    + options.path)),
      (!options.secure   ? '' : ('; secure'))
    );
    
    return search(name) !== undefined;
  };
  
})();

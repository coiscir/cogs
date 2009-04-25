/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Query-String Cogs
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function Query() {
  
  $C.query = function (search, query) {
    if (!$C.is_a(search, String))
      throw new Error('Search is missing or not a String.');
    
    query = $C.is_a(query, String) ? query : window.location.search;
    var pairs = query.replace(/^\?/, '').replace(/\+/g, '%20').split(/\&/);
    
    for (var i = 0, pair, matches = []; i < pairs.length; i += 1) {
      pair = pairs[i].split(/=/, 2);
      if (search === decodeURIComponent(pair[0]))
        matches.push(decodeURIComponent(pair[1] || ''));
    }
    return matches;
  };
  
  $C.serialize = function (form) {
    var serial = [], add = function (key, value) {
      serial.push((
        encodeURIComponent(key) + '=' + encodeURIComponent(value)
      ).replace(/%20/g, '+'));
    };
    
    for (var i = 0, j, element; i < form.elements.length; i += 1) {
      element = form.elements[i];
      if (element.name.length > 0 && !element.disabled) {
        switch (element.type) {
          case 'file': break;
          case 'select-one': add(element.name, element.value); break;
          case 'select-multiple':
            for (j = 0; j < element.options.length; j += 1)
              if (element.options[j].selected && !element.options[j].disabled)
                add(element.name, element.options[j].value);
            break;
          case 'checkbox':
          case 'radio': if (!element.checked) break;
          default: add(element.name, element.value); break;
        }
      }
    }
    
    return serial.join('&');
  };
  
})();

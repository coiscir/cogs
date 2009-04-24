/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Query-String Cogs
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function Query() {
  
  $C.query = function (key) {
    if (!$C.is_a(key, String))
      throw new Error('Invalid argument. Expected: String key.');
    
    var qstring = window.location.search.replace(/^\?/, '');
    var queries = qstring.replace(/\+/g, '%20').split(/\&/);
    
    for (var i = 0, pair, matches = []; i < queries.length; i += 1) {
      pair = queries[i].split(/=/, 2);
      if (key === decodeURIComponent(pair[0]))
        matches.push(decodeURIComponent(pair[1] || ''));
    }
    return matches;
  };
  
})();

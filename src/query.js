/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Query-String Cogs
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function Query() {
  
  $C.query = function (search, query) {
    if (!$C.is_a(search, String))
      throw new Error('Search must be a String.');
    
    query = $C.is_a(query, String) ? query : window.location.search;
    var pairs = query.replace(/^\?/, '').replace(/\+/g, '%20').split(/\&/);
    
    for (var i = 0, pair, matches = []; i < pairs.length; i += 1) {
      pair = pairs[i].split(/=/, 2);
      if (search === decodeURIComponent(pair[0]))
        matches.push(decodeURIComponent(pair[1] || ''));
    }
    return matches;
  };
  
})();

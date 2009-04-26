/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Cogs JavaScript Library, version <%= COGS_VERSION %>
 *  (c) 2008-<%= CGOS_BUILD.year %> Jonathan Lonowski
 *
 *  http://github.com/coiscir/cogs/
 *
 *  Cogs is released and distributable under the terms of the MIT License.
***~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

$C = Cogs = new (function () {
  var $C = this;
  $C.Version = '<%= COGS_VERSION %>';
  
<%=inc(2, opt(true, false), 'cookie.js', 'query.js', 'time.js', 'type.js')%>
})();

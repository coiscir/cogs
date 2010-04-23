/**
 *  Cogs JavaScript Library
 *  http://github.com/coiscir/cogs/
 *
 *  Copyright (c) 2009-2010 Jonathan Lonowski
 *  Released and distributed under the MIT License.
**/

"use strict";new function Cogs(){var b=window.Cogs=this;b.fn=b.constructor.prototype;(function(){var f='undefined',j='null',k='array',c='boolean',l='date',m='error',g='function',d='number',h='object',i='regexp',e='string',n='unknown';b.fn.type=function o(a){switch(typeof a){case f:return f;case c:return c;case d:return d;case e:return e;case g:if(a.constructor==RegExp)return i;return g;case h:if(a===null)return j;if(a instanceof Error)return m;switch(a.constructor){case Array:return k;case Boolean:return c;case Date:return l;case Number:return d;case RegExp:return i;case String:return e;default:return h}default:return n}}})()}();

/**
 *  Cogs JavaScript Library
 *  http://github.com/coiscir/cogs/
 *
 *  Copyright (c) 2009-2010 Jonathan Lonowski
 *  Released and distributed under the MIT License.
**/

"use strict";new function Cogs(){var c=window.Cogs=this;c.fn=c.constructor.prototype;(function(){c.fn.time=function m(a,b,e,f,g,h,d){var i=new Date();if(arguments.length>0){a=(+a||0);b=(+b||1)-1;e=(+e||1);f=(+f||0);g=(+g||0);h=(+h||0);d=(+d||0);i.setFullYear(a,b,e);i.setHours(f,g,h,d)}return i.getTime()};c.fn.utc=function k(a,b,e,f,g,h,d){var i=new Date();if(arguments.length>0){a=(+a||0);b=(+b||1)-1;e=(+e||1);f=(+f||0);g=(+g||0);h=(+h||0);d=(+d||0);i.setUTCFullYear(a,b,e);i.setUTCHours(f,g,h,d)}return i.getTime()}})();(function(){var f='undefined',g='null',h='array',d='boolean',i='date',m='error',k='function',l='number',n='object',o='regexp',j='string',p='unknown';c.fn.type=function q(a){switch(typeof a){case f:return f;case d:return d;case l:return l;case j:return j;case k:if(a.constructor==RegExp)return o;return k;case n:if(a===null)return g;if(a instanceof Error)return m;switch(a.constructor){case Array:return h;case Boolean:return d;case Date:return i;case Number:return l;case RegExp:return o;case String:return j;default:return n}default:return p}};c.fn.is_a=function r(a,b){switch(c.type(b)){case f:return a===b;case g:return a===b;case j:return c.type(a)===b;case k:switch(b){case Boolean:return c.type(a)===d;case Number:return c.type(a)===l;case String:return c.type(a)===j;default:return a instanceof b}default:return false}};c.fn.isof=function s(a,b){for(var e=1;e<arguments.length;e+=1)if(true===c.is_a(a,arguments[e]))return true;return false}})()}();

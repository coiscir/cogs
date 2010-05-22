/**
 *  Cogs JavaScript Library
 *  http://github.com/coiscir/cogs/
 *
 *  Copyright (c) 2009-2010 Jonathan Lonowski
 *  Released and distributed under the MIT License.
**/

"use strict";new function Cogs(){var f=window.Cogs=this;f.fn=f.constructor.prototype;function k(c){return c-(c%1)}function g(c,d,b){var a=String(c);while(a.length<d)a=(b||' ')+a;return a}function o(c,d,b){c=k(c||0);d=k(d||0);return!d?c:(c+d-1)%d+k(b||0)}(function(){var i,j,q=24*60*60*1000;function n(){var c,d,b,a,h,e=document.cookie.valueOf();if(j!==e){i={};j=e;h=j.replace(/\+/g,'%20').split(/\;\s*/);for(c=0;c<h.length;c+=1){d=h[c].split(/=/,2);b=decodeURIComponent(d[0]);a=decodeURIComponent(d[1]||'');i[b]=a}}return i}function l(c,d,b){var a=[];if(b===true)b={duration:-1};if(f.is_a(b,Number))b={duration:b};b=b||{};b={duration:f.is_a(b.duration,Number)?b.duration:null,domain:f.is_a(b.domain,String)?b.domain:null,path:f.is_a(b.path,String)?b.path:null,secure:f.is_a(b.secure,Boolean)?b.secure:null};a.push(encodeURIComponent(c)+'='+encodeURIComponent(d));if(f.is_a(b.duration,Number))a.push('expires='+new Date(f.utc()+b.duration*q).toUTCString());if(b.domain)a.push('domain='+encodeURIComponent(b.domain));if(b.path)a.push('path='+encodeURIComponent(b.path));if(b.secure)a.push('secure');document.cookie=a.join('; ').replace(/%20/g,'+');return!f.is_a(p(c),'nil')}function p(c){var d=n();if(f.is_a(d[c],String))return d[c];else return null}f.fn.cookie=function r(c,d,b){if(arguments.length<=1)return p(c);else return l(c,d,b)}})();(function(){var n,l;function p(c){var d,b,a,h,e,i,j=!f.is_a(c,'nil'),q=(j?c:window.location.search).replace(/^\?+/,'');if(j||l!==q){b=q.replace(/\+/g,'%20').split(/&/);for(d=0,a={};d<b.length;d+=1){h=b[d].split(/=/,2);e=decodeURIComponent(h[0]).replace(/\[\]$/,'');i=decodeURIComponent(h[1]||'');if(f.is_a(a[e],'nil'))a[e]=[i];else a[e].push(i)}if(!j){n=a;l=c}}return a||n||{}}f.fn.query=function r(c,d){var b=p(d);if(f.is_a(b[c],'nil'))return null;else if(b[c].length>1)return[].concat(b[c]);else return b[c][0]}})();(function(){f.fn.time=function q(c,d,b,a,h,e,i){var j=new Date();if(arguments.length>0){c=(+c||0);d=(+d||1)-1;b=(+b||1);a=(+a||0);h=(+h||0);e=(+e||0);i=(+i||0);j.setFullYear(c,d,b);j.setHours(a,h,e,i)}return j.getTime()};f.fn.utc=function n(c,d,b,a,h,e,i){var j=new Date();if(arguments.length>0){c=(+c||0);d=(+d||1)-1;b=(+b||1);a=(+a||0);h=(+h||0);e=(+e||0);i=(+i||0);j.setUTCFullYear(c,d,b);j.setUTCHours(a,h,e,i)}return j.getTime()}})();(function(){var m=24*60*60*1000,E=24*60*60/1000,F=f.time(1),G=f.time(10000)-1,H=f.utc(1),I=f.utc(10000)-1,t=['January','February','March','April','May','June','July','August','September','October','November','December'],J=[[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]],u=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],B=['th','st','nd','rd'],v=['AM','PM','am','pm'];function w(c,d,b,a){if(d==null||d===''){return''}if(b==null){b=f.time()}if(f.isof(b,Date,Number)){return c(String(d||''),K(b,a))}else{throw new TypeError('Expected time to be a Date or Number.');}}function K(c,d){var b={},a,h,e,i,j,q,n,l,p,r,s,x,y,z,A;a=new Date(c);c=a.getTime();if(d){if((c<H)||(c>I)){throw new Error('Timestamp is out of range (Years 0 - 9999) for UTC Time.');}}else{if((c<F)||(c>G)){throw new Error('Timestamp is out of range (Years 0 - 9999) for Local Time.');}}h=new Date(d?f.utc(a.getUTCFullYear()+0):f.time(a.getFullYear()+0));e=new Date(d?f.utc(a.getUTCFullYear()+1):f.time(a.getFullYear()+1));i=new Date(d?f.utc(a.getUTCFullYear()-1):f.time(a.getFullYear()-1));j=d?h.getUTCDay():h.getDay();q=d?e.getUTCDay():e.getDay();n=d?i.getUTCDay():i.getDay();l=o(j,7);p=o(q,7);r=o(n,7);s=h.getTime()-(m*(l-(l>=4?7:0)));x=e.getTime()-(m*(p-(p>=4?7:0)));y=i.getTime()-(m*(r-(r>=4?7:0)));z=h.getTime()-(m*j);A=h.getTime()-(m*l);b.TIME=c;b.IS_UTC=d;b.DATE=d?a.getUTCDate():a.getDate();b.MONTH=d?a.getUTCMonth():a.getMonth();b.YEAR=d?a.getUTCFullYear():a.getFullYear();b.ORDINAL=B[(10<=b.DATE&&b.DATE<=19)?0:(b.DATE%10)]||B[0];b.IS_LEAP=!(b.YEAR%4)&&!!(b.YEAR%100)||!(b.YEAR%400);b.DAYSOFMONTH=J[b.IS_LEAP?1:0][b.MONTH];b.HOUR=d?a.getUTCHours():a.getHours();b.MINUTE=d?a.getUTCMinutes():a.getMinutes();b.SECOND=d?a.getUTCSeconds():a.getSeconds();b.MSEC=d?a.getUTCMilliseconds():a.getMilliseconds();b.OFFSET=d?0:a.getTimezoneOffset();b.IS_DST=d?false:b.OFFSET!==h.getTimezoneOffset();b.TIMEZONE=-1*b.OFFSET;b.WEEKDAY=d?a.getUTCDay():a.getDay();b.DAYOFYEAR=k((b.TIME-h.getTime())/m)+1;b.FIRST_SUNDAY=z;b.FIRST_MONDAY=A;b.ISO_MONDAY_CURR=s;b.ISO_MONDAY_NEXT=x;b.ISO_MONDAY_PREV=y;return b}function C(b,a){return b.replace(/%(.)/g,function(c,d){switch(d){case'c':return'%a, %e %b %Y %H:%M:%S GMT'+(a.IS_UTC?'':'%z');case'D':return'%m/%d/%y';case'F':return'%Y-%m-%d';case'r':return'%I:%M:%S %p';case'R':return'%H:%M';case'T':return'%H:%M:%S';case'v':return'%e-%b-%Y';case'x':return'%Y-%m-%d';case'X':return'%H:%M:%S';default:return c}}).replace(/%(.)/g,function(c,d){switch(d){case'%':return'%';case'a':return u[a.WEEKDAY].substr(0,3);case'A':return u[a.WEEKDAY];case'b':return t[a.MONTH].substr(0,3);case'B':return t[a.MONTH];case'C':return g(k(a.YEAR/100),2,'0');case'd':return g(a.DATE,2,'0');case'e':return g(a.DATE,2,' ');case'g':return g(((a.TIME<a.ISO_MONDAY_CURR?(a.YEAR-1):(a.TIME>=a.ISO_MONDAY_NEXT?(a.YEAR+1):a.YEAR)))%100,2,'0');case'G':return g(((a.TIME<a.ISO_MONDAY_CURR?(a.YEAR-1):(a.TIME>=a.ISO_MONDAY_NEXT?(a.YEAR+1):a.YEAR))),4,'0');case'h':return t[a.MONTH].substr(0,3);case'H':return g(a.HOUR,2,'0');case'I':return g(o(a.HOUR%12,12,1),2,'0');case'j':return g(a.DAYOFYEAR,3,'0');case'k':return g(a.HOUR,2,' ');case'l':return g(o(a.HOUR%12,12,1),2,' ');case'm':return g(a.MONTH+1,2,'0');case'M':return g(a.MINUTE,2,'0');case'n':return'\n';case'N':return g(a.MSEC,3,'0');case'p':return v[a.HOUR<12?0:1];case'P':return v[a.HOUR<12?2:3];case's':return k(a.TIME/1000);case'S':return g(a.SECOND,2,'0');case't':return'\t';case'u':return o(a.WEEKDAY,7,1);case'U':return g(k((a.TIME-a.FIRST_SUNDAY)/(7*m)),2,'0');case'V':return g((k((k(a.TIME/m)-o(a.WEEKDAY,7)-k(((a.TIME>=a.ISO_MONDAY_NEXT?a.ISO_MONDAY_NEXT:(a.TIME>=a.ISO_MONDAY_CURR?a.ISO_MONDAY_CURR:a.ISO_MONDAY_PREV)))/m))/7)+1),2,'0');case'w':return a.WEEKDAY;case'W':return g(k((a.TIME-a.FIRST_MONDAY)/(7*m)),2,'0');case'y':return g((a.YEAR%100),2,'0');case'Y':return g(a.YEAR,4,'0');case'z':return((a.TIMEZONE<0?'-':'+')+g(Math.abs(k(a.TIMEZONE/60)),2,'0')+g(Math.abs(a.TIMEZONE%60),2,'0'));default:return c}})}f.fn.strftime=function L(c,d){return w(C,c,d,false)};f.fn.strfutc=function M(c,d){return w(C,c,d,true)};function D(h,e){return h.replace(/(\\)?(.)/g,function(c,d,b){if(d==='\\')return c;switch(b){case'c':return'Y-m-d\\TH:i:sP';case'r':return'D, d M Y H:i:s O';case'e':return'';case'T':return'';default:return c}}).replace(/(\\)?(.)/g,function(c,d,b){if(d==='\\')return b;var a=true;switch(b){case'd':return g(e.DATE,2,'0');case'D':return u[e.WEEKDAY].substr(0,3);case'j':return e.DATE;case'l':return u[e.WEEKDAY];case'N':return o(e.WEEKDAY,7,1);case'S':return e.ORDINAL;case'w':return e.WEEKDAY;case'z':return e.DAYOFYEAR;case'W':return g((k((k(e.TIME/m)-o(e.WEEKDAY,7)-k(((e.TIME>=e.ISO_MONDAY_NEXT?e.ISO_MONDAY_NEXT:(e.TIME>=e.ISO_MONDAY_CURR?e.ISO_MONDAY_CURR:e.ISO_MONDAY_PREV)))/m))/7)+1),2,'0');case'F':return t[e.MONTH];case'm':return g(e.MONTH+1,2,'0');case'M':return t[e.MONTH].substr(0,3);case'n':return e.MONTH+1;case't':return e.DAYSOFMONTH;case'L':return e.IS_LEAP?1:0;case'o':return g(((e.TIME<e.ISO_MONDAY_CURR?(e.YEAR-1):(e.TIME>=e.ISO_MONDAY_NEXT?(e.YEAR+1):e.YEAR))),4,'0');case'Y':return g(e.YEAR,4,'0');case'y':return g(e.YEAR%100,2,'0');case'a':return v[e.HOUR<12?2:3];case'A':return v[e.HOUR<12?0:1];case'B':return(((k(((e.HOUR*3600)+(e.MINUTE*60)+e.SECOND+((e.OFFSET+60)*60))/E))+1000)%1000,3,'0');case'g':return o(e.HOUR%12,12,1);case'G':return e.HOUR;case'h':return g(o(e.HOUR%12,12,1),2,'0');case'H':return g(e.HOUR,2,'0');case'i':return g(e.MINUTE,2,'0');case's':return g(e.SECOND,2,'0');case'u':return g(e.MSEC*1000,6,'0');case'I':return e.IS_DST?1:0;case'O':a=false;case'P':return((e.TIMEZONE<0?'-':'+')+g(Math.abs(k(e.TIMEZONE/60)),2,'0')+(a?':':'')+g(Math.abs(e.TIMEZONE%60),2,'0'));case'Z':return e.TIMEZONE*60;case'U':return k(e.TIME/1000);default:return b}})};f.fn.phpdate=function N(c,d){return w(D,c,d,false)};f.fn.phputc=function O(c,d){return w(D,c,d,true)}})();(function(){var a='undefined',h='null',e='array',i='boolean',j='date',q='error',n='function',l='number',p='object',r='regexp',s='string',x='unknown',y='nil';f.fn.type=function z(c){switch(typeof c){case a:return a;case i:return i;case l:return l;case s:return s;case n:if(c.constructor==RegExp)return r;return n;case p:if(c===null)return h;if(c instanceof Error)return q;switch(c.constructor){case Array:return e;case Boolean:return i;case Date:return j;case Number:return l;case RegExp:return r;case String:return s;default:return p}default:return x}};f.fn.is_a=function A(c,d){switch(f.type(d)){case a:return c===d;case h:return c===d;case s:switch(d){case y:return c==null;default:return f.type(c)===d}case n:switch(d){case Boolean:return f.type(c)===i;case Number:return f.type(c)===l;case String:return f.type(c)===s;default:return c instanceof d}default:return false}};f.fn.isof=function m(c,d){for(var b=1;b<arguments.length;b+=1)if(true===f.is_a(c,arguments[b]))return true;return false}})()}();

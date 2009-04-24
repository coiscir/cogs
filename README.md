# Cogs
#### A JavaScript Utility Library

Cogs is a JavaScript library that attempts to simplify the necessary and routine
functions for web application development.

### Intended Platforms

Cogs is intended for the following platforms:

* Microsoft Internet Explorer 6.0 and higher
* Mozilla Firefox 2.0 and higher
* Google Chrome 1.0 and higher
* Apple Safari 2.0 and higher
* Opera 9.25 and higher

### Building Cogs

To build Cogs, you'll need to have the following:

  * A copy of the Cogs source tree, either by release or Git clone
  * Ruby 1.8.7 or later (<http://www.ruby-lang.org/>)
  * RubyGems 1.3.1 or later (<http://www.rubygems.org/>)
    * JSMin 1.0.1 or later (<http://rubyforge.org/projects/riposte/>)
    * Rake 0.8.3 or later (<http://rubyforge.org/projects/rake>)

From the Cogs source tree root directory:

  * `rake build` -- Build full and minified composite library scripts.
  * `rake clean` -- Clean up build files.

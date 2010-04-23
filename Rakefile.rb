require 'rubygems'
require 'rake'
require 'packr'

@root = File.dirname(__FILE__)
@dev = File.join(@root, "cogs.js")
@min = File.join(@root, "cogs-min.js")

task :default do
  options = {
    :shrink_vars => true
  }
  
  source = File.read(@dev)
  comment = (source.match(/\/\*\*!.*?\*\*\//m) or [''])[0].sub('/**!', '/**')
  
  File.open(@min, 'w+b') do |out|
    out << comment + $/ + $/ + Packr.pack(source, options).strip + $/
  end
  
  print ' + ' + @min.sub(@root, '.') + $/
end

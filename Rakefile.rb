Dir.chdir(File.expand_path(File.dirname(__FILE__)))

require 'rake'
require 'build/builder'

CGOS_BUILDING = Time.now.utc.freeze
COGS_VERSION  = CGOS_BUILDING.strftime('%Y.%m%d')

LIB = File.join('lib', 'cogs.js')
MIN = File.join('lib', 'cogs.min.js')
SRC = File.join('src', 'cogs.js')

task :default => :build

task :leadin do
  print $/
end

task :build => :leadin do
  print 'Build :: ' + COGS_VERSION + $/
  File.open(LIB, 'w+b') {|out| out << Builder.build(SRC, false)}
  File.open(MIN, 'w+b') {|out| out << Builder.build(SRC, true)}
  print ' + ' + LIB + $/ if File.exists?(LIB)
  print ' + ' + MIN + $/ if File.exists?(MIN)
  print $/
end

task :clean => :leadin do
  print 'Clean' + $/
  print ' - ' + LIB + $/ if File.exists?(LIB) && File.delete(LIB) > 0
  print ' - ' + MIN + $/ if File.exists?(MIN) && File.delete(MIN) > 0
  print $/
end

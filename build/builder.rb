require 'erb'
require 'jsmin'

module Builder
  module Reader
    def inc(*files)
      ### exclude leading options
      pad = files.first.is_a?(Numeric) ? files.shift : 0
      min = files.first === !!files.first ? files.shift : false
      
      ### glob, read, parse, and alter files
      Dir.glob(files.flatten).reject{ |file|
        !(File.file?(file) && File.readable?(file))
      }.map{ |file|
        Dir.chdir(File.dirname(file)) do
          txt = IO.readlines(File.basename(file)).to_s
          src = ERB.new(txt, nil, '<>').result(binding)
          src = JSMin.minify(src).gsub(/ ?\n ?/, ' ').sub(/^ +/, '') if (min)
          src = src.gsub(/^/, (' ' * pad))
        end
      }.join($/)
    end
  end
  
  class << self
    include Reader
    
    def build(file, option)
      raise 'Expected boolean option' if not option === !!option
      @option = option
      inc(file).gsub(/[ \t]+$/m, '').gsub(/\r\n|\r|\n/, "\n")
    end
    
    def opt(on, off)
      @option ? on : off
    end
  end
end

require 'filewatcher'

TARGET = 'wb-game-show.html'
BUILD_CMD = %(bin/build >#{TARGET})

task :default => :build

desc 'Build game'
task :build do
  sh BUILD_CMD
end

desc 'Watch for changes and rebuild game'
task :watch do
  begin
    sh BUILD_CMD
  rescue
  end
  FileWatcher.new(['src/**', 'config/**']).watch do
    begin
      sh BUILD_CMD
    rescue
    end
  end
end

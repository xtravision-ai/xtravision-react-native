# xtravision-react-native.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "xtravision-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  xtravision-react-native
                   DESC
  s.homepage     = "https://github.com/xtravision-ai/xtravision-react-native"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "xtravision" => "info@xtravision.ai" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/xtravision-ai/xtravision-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "GoogleMLKit/PoseDetection"
  # ...
  # s.dependency "..."
end


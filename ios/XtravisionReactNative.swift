import Vision
import MLKitPoseDetection
import MLKitVision
import CoreML

import UIKit
import AVFoundation

func uncapitalize(input: String) -> String {
  return input.prefix(1).lowercased() + input.dropFirst()
}

@objc(VisionCameraPoseDetector)
public class VisionCameraPoseDetector: NSObject, FrameProcessorPluginBase {

  static var PoseDetectorOption: PoseDetectorOptions = {
    let options = PoseDetectorOptions()
    options.detectorMode = .stream
    return options
  }()

  static var poseDetector = PoseDetector.poseDetector(options: PoseDetectorOption)

  @objc
  public static func callback(_ frame: Frame!, withArgs _: [Any]!) -> Any! {
    
    let image = VisionImage(buffer: frame.buffer)
    image.orientation = .up
    
    var map: [String: Any] = [:]
    do {
       let poses: [Pose] =  try poseDetector.results(in: image)
        debugPrint(poses)
        print(poses)
       if (!poses.isEmpty){
             for pose in poses {
              for element in pose.landmarks {
                let type = uncapitalize(input: element.type.rawValue)
                var obj: [String: Any] = [:]
                obj["visibility"] = element.inFrameLikelihood
                obj["x"] = element.position.x
                obj["y"] = element.position.y
                obj["z"] = element.position.z
                
                map[type] = obj
              }
             }
            return map
       }
       } catch {
           print("Error info: \(error)")
           return map
       }
    return map
  }
}

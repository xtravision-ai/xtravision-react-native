// Xtravision.m

// #import "Xtravision.h"


// @implementation Xtravision

// RCT_EXPORT_MODULE()

// RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument numberParameter:(nonnull NSNumber *)numberArgument callback:(RCTResponseSenderBlock)callback)
// {
//     // TODO: Implement some actually useful functionality
//     callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@", numberArgument, stringArgument]]);
// }

// @end

#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>

@interface VISION_EXPORT_SWIFT_FRAME_PROCESSOR(scanPose, VisionCameraPoseDetector)
@end

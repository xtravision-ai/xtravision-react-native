package com.xtravisionreactnative.xtravisionposeplugin;

import androidx.camera.core.ImageProxy;
import com.facebook.react.bridge.WritableNativeArray;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

public class XtraVisionPosePluginPlugin extends FrameProcessorPlugin {
  @Override
  public Object callback(ImageProxy image, Object[] params) {
    // code goes here
    WritableNativeArray array = new WritableNativeArray();
    return array;
  }

  public XtraVisionPosePluginPlugin() {
    super("scanPoseLandmarks");
  }
}
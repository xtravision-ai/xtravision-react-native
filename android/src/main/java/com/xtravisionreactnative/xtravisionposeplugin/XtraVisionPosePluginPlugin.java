package com.xtravisionreactnative.xtravisionposeplugin;

import android.annotation.SuppressLint;
import android.media.Image;
import android.util.Log;

import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.common.PointF3D;
import com.google.mlkit.vision.pose.Pose;
import com.google.mlkit.vision.pose.PoseDetection;
import com.google.mlkit.vision.pose.PoseDetector;
import com.google.mlkit.vision.pose.PoseLandmark;
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions;

import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import java.util.List;

public class XtraVisionPosePluginPlugin extends FrameProcessorPlugin {

  static final String TAG = "XtraVisionPosePluginPlugin";

  PoseDetectorOptions options =
    new PoseDetectorOptions.Builder()
      .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
      .build();
  PoseDetector poseDetector = PoseDetection.getClient(options);

  @SuppressLint("NewApi")
  @Override
  public Object callback(ImageProxy frame, Object[] params) { //Promise promise
    @SuppressLint("UnsafeOptInUsageError")
    Image mediaImage = frame.getImage();
    WritableMap map =  new WritableNativeMap();
//    Log.d("pose params", "pose params >> : " + params);
//    System.out.println(params);

    if (mediaImage != null) {
      InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
      Task<Pose> task = poseDetector.process(image);
      try {
        Pose pose = Tasks.await(task);
        List<PoseLandmark> landmarks = pose.getAllPoseLandmarks();
        for(PoseLandmark landmark: landmarks) {
          WritableMap result = new WritableNativeMap();
          String type = getTypeLabel(landmark.getLandmarkType());
          PointF3D point = landmark.getPosition3D();

          result.putDouble("visibility", landmark.getInFrameLikelihood());
          result.putDouble("x", point.getX());
          result.putDouble("y", point.getY());
          result.putDouble("z", point.getZ());
          map.putMap(type, result);
        }
      } catch (Exception e) {
        Log.e(XtraVisionPosePluginPlugin.TAG, "Something is going wrong: " + e.getMessage());
        e.printStackTrace();
      }
    }

    return map;
  }


  public XtraVisionPosePluginPlugin() {
    super("scanPoseLandmarks");
  }

  static String getTypeLabel(int landmarkType) {
    String result;
    switch (landmarkType) {
      case 0:
        result = "nose";
        break;
      case 1:
        result = "leftEyeInner";
        break;
      case 2:
        result = "leftEye";
        break;
      case 3:
        result = "leftEyeOuter";
        break;
      case 4:
        result = "rightEyeInner";
        break;
      case 5:
        result = "rightEye";
        break;
      case 6:
        result = "rightEyeOuter";
        break;
      case 7:
        result = "leftEar";
        break;
      case 8:
        result = "rightEar";
        break;
      case 9:
        result = "mouthLeft";
        break;
      case 10:
        result = "mouthRight";
        break;
      case 11:
        result = "leftShoulder";
        break;
      case 12:
        result = "rightShoulder";
        break;
      case 13:
        result = "leftElbow";
        break;
      case 14:
        result = "rightElbow";
        break;
      case 15:
        result = "leftWrist";
        break;
      case 16:
        result = "rightWrist";
        break;
      case 17:
        result = "leftPinkyFinger";
        break;
      case 18:
        result = "rightPinkyFinger";
        break;
      case 19:
        result = "leftIndexFinger";
        break;
      case 20:
        result = "rightIndexFinger";
        break;
      case 21:
        result = "leftThumb";
        break;
      case 22:
        result = "rightThumb";
        break;
      case 23:
        result = "leftHip";
        break;
      case 24:
        result = "rightHip";
        break;
      case 25:
        result = "leftKnee";
        break;
      case 26:
        result = "rightKnee";
        break;
      case 27:
        result = "leftAnkle";
        break;
      case 28:
        result = "rightAnkle";
        break;
      case 29:
        result = "leftHeel";
        break;
      case 30:
        result = "rightHeel";
        break;
      case 31:
        result = "leftToe";
        break;
      case 32:
        result = "rightToe";
        break;
      default:
        result = "unknown";
        break;
    }
    return result;
  }
}

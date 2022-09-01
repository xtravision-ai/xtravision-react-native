package com.xtravision;

import android.annotation.SuppressLint;
import android.graphics.Point;
import android.media.Image;
import android.util.Log;


import androidx.annotation.NonNull;
import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
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


public class XtraVisionPosePlugin extends FrameProcessorPlugin {

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

//    String authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjMwN2JkZi0yNjVmLTQxM2ItODU2ZC1mMDcyODVhMzc3NjkiLCJhcHBJZCI6Ijk1ZWFjZDQ1LTgyZjUtMTFlYy1hOWY1LWE0YmI2ZDZlZGM0ZSIsIm9yZ0lkIjoiZGQ4MzA1OWMtODJmMy0xMWVjLWE5ZjUtYTRiYjZkNmVkYzRlIiwiaWF0IjoxNjU4Mjk1MjA5LCJleHAiOjE2NTgzMDI0MDl9.P8cvuHOmQfqykXk3Zmks4wMeSVqvb-w5qv8AnBnc-h4";
//    String assessmentName = "ENDURANCE_FLAMINGO_FRONT";

     Log.d("pose params", "pose params >> : " + params);
    System.out.println(params);

    if (mediaImage != null) {
      InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
      Task<Pose> task = poseDetector.process(image);
      try {
// /////----//////
        Pose pose = Tasks.await(task);
        List<PoseLandmark> landmarks = pose.getAllPoseLandmarks();
//        List
//        map.putMap("landmarks", landmarks);
        for(PoseLandmark landmark: landmarks) {
//          Point p = landmark.getPosition()
//            p.
//            landmarks.add(PoseLandmark(landmark.getX(), ldmrk.getY(),ldmrk.getZ(),ldmrk.visibility))
            WritableMap result = new WritableNativeMap();
            String type = getTypeLabel(landmark.getLandmarkType());
            PointF3D point = landmark.getPosition3D();

            result.putDouble("visibility", landmark.getInFrameLikelihood());
            result.putDouble("x", point.getX());
            result.putDouble("y", point.getY());
            result.putDouble("z", point.getZ());
            map.putMap(type, result);
        }
        return map;
////------///


//        Task<List<Face>> task = faceDetector.process(image);
// //////
        // Task<Pose> task = poseDetector.process(image); //.getResult().getAllPoseLandmarks();
        // Pose pose = Tasks.await(task);
        // List<PoseLandmark> allPoseLandmarks = pose.getAllPoseLandmarks();
        // Log.d("PoseDetectionModule", "PoseLandmark: " + allPoseLandmarks);
        // return allPoseLandmarks;

// ////////
//        List<PoseLandmark> faces = Tasks.await(task.getResult().getAllPoseLandmarks());

//            Task<Pose> result =
//            poseDetector.process(image)
//            .addOnSuccessListener(
//              new OnSuccessListener<Pose>() {
//                  @Override
//                  public void onSuccess(Pose pose) {
//                      //WritableMap response = Arguments.createMap();
//                      //response.putMap("landmarks", pose.getAllPoseLandmarks());
//
//                      //WritableArray obj = Arguments.createArray();
//
//                      // Get all PoseLandmarks. If no person was detected, the list will be empty
//                      List<PoseLandmark> allPoseLandmarks = pose.getAllPoseLandmarks();
//
//                      //response.putMap("landmarks", allPoseLandmarks);
//
//                      Log.d("PoseDetectionModule", "PoseLandmark: " + allPoseLandmarks);
//                      //obj.putArray("landmarks", allPoseLandmarks);
//                      promise.resolve(allPoseLandmarks);
//                  }
//              })
//            .addOnFailureListener(
//              new OnFailureListener() {
//                  @Override
//                  public void onFailure(@NonNull Exception e) {
//                      promise.reject("Pose Detection failed", e);
//                  }
//              });
      } catch (Exception e) {
//        e.printStackTrace();
        return map;
      }
    }

    return map;
  }


  XtraVisionPosePlugin() {
    super("scanPose");
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

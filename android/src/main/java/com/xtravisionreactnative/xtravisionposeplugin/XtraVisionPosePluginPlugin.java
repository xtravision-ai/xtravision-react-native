package com.xtravisionreactnative.xtravisionposeplugin;

import android.annotation.SuppressLint;
import android.media.Image;
import android.util.Log;

import androidx.exifinterface.media.ExifInterface;

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
import com.google.mlkit.vision.pose.accurate.AccuratePoseDetectorOptions;

import com.mrousavy.camera.frameprocessor.Frame;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class XtraVisionPosePluginPlugin extends FrameProcessorPlugin {

  AccuratePoseDetectorOptions options =
    new AccuratePoseDetectorOptions.Builder()
      .setDetectorMode(AccuratePoseDetectorOptions.STREAM_MODE)
      .build();

  static final String TAG = "XtraVisionPosePluginPlugin";

  PoseDetector poseDetector = PoseDetection.getClient(options);

  @SuppressLint("LongLogTag")
  @Override
  public Object callback(@NotNull Frame frame,  @Nullable Map<String, Object> params) {
    @SuppressLint("UnsafeOptInUsageError")
    Image mediaImage = frame.getImage();
    WritableMap map =  new WritableNativeMap();
//   Log.d(XtraVisionPosePluginPlugin.TAG, "pose params >> : " + params);
     
    if (mediaImage != null) {
      try {
//        InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
//        InputImage image = InputImage.fromMediaImage(mediaImage, XtraVisionPosePluginPlugin.getRotationFromImage(mediaImage));
        // TODO: for time being we put 0 in rotation
        InputImage image = InputImage.fromMediaImage(mediaImage, 0);
        Task<Pose> task = poseDetector.process(image);

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

    return map.toHashMap();
  }

  @SuppressLint("LongLogTag")
  public XtraVisionPosePluginPlugin(@Nullable Map<String, Object> options) {
    // super("scanPoseLandmarks");
    super(options);
    Log.d(XtraVisionPosePluginPlugin.TAG, "XtraVisionPosePluginPlugin initialized with options: " + options);
  }

  @SuppressLint("LongLogTag")
  public static int getRotationFromImage(Image image)  {

    ByteBuffer buffer = image.getPlanes()[0].getBuffer();
//    if (buffer.remaining() < ExifInterface.MIN_EXIF_SIZE) {
//      // Not enough data to read Exif
//      Log.w(XtraVisionPosePluginPlugin.TAG, "Image buffer too small for Exif data");
//      return 0;
//    }

    try {
//      ExifInterface exifInterface = new ExifInterface(buffer);
      ExifInterface exifInterface = new ExifInterface(new ByteArrayInputStream(buffer.array()));

      int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);

      switch (orientation) {
        case ExifInterface.ORIENTATION_ROTATE_90:
          return 90;
        case ExifInterface.ORIENTATION_ROTATE_180:
          return 180;
        case ExifInterface.ORIENTATION_ROTATE_270:
          return 270;
//        case ExifInterface.ORIENTATION_ROTATE_RIGHT:
//          return 90; // Equivalent to 270 degrees clockwise rotation
        case ExifInterface.ORIENTATION_FLIP_HORIZONTAL:
          // Handle horizontal flip (optional)
          break;
        default:
          throw new IllegalArgumentException("Unexpected Exif orientation: " + orientation);
      }
    } catch (IndexOutOfBoundsException e) {
      Log.e(XtraVisionPosePluginPlugin.TAG, "Error reading Exif data: Buffer too small", e);
      return 0; // Default to 0 degrees if data incomplete
    } catch (IOException e) {
      Log.e(XtraVisionPosePluginPlugin.TAG, "Error reading Exif data", e);
//      throw e; // Rethrow IOException for further handling
    }

    return 0; // Should never reach here if Exif data is valid
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

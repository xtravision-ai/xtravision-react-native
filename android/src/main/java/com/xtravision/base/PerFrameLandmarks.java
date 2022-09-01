// PerFrameLandmarks.java
package com.xtravision.base;

import java.util.List;
import kotlin.jvm.internal.Intrinsics;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;


public final class PerFrameLandmarks {
  @NotNull
  private final List landmarks;

  @NotNull
  public final List getLandmarks() {
    return this.landmarks;
  }

  public PerFrameLandmarks(@NotNull List landmarks) {
    Intrinsics.checkNotNullParameter(landmarks, "landmarks");
//    super();
    this.landmarks = landmarks;
  }

  @NotNull
  public final List component1() {
    return this.landmarks;
  }

  @NotNull
  public final PerFrameLandmarks copy(@NotNull List landmarks) {
    Intrinsics.checkNotNullParameter(landmarks, "landmarks");
    return new PerFrameLandmarks(landmarks);
  }

  // $FF: synthetic method
  public static PerFrameLandmarks copy$default(PerFrameLandmarks var0, List var1, int var2, Object var3) {
    if ((var2 & 1) != 0) {
      var1 = var0.landmarks;
    }

    return var0.copy(var1);
  }

  @NotNull
  public String toString() {
    return "PerFrameLandmarks(landmarks=" + this.landmarks + ")";
  }

  public int hashCode() {
    List var10000 = this.landmarks;
    return var10000 != null ? var10000.hashCode() : 0;
  }

  public boolean equals(@Nullable Object var1) {
    if (this != var1) {
      if (var1 instanceof PerFrameLandmarks) {
        PerFrameLandmarks var2 = (PerFrameLandmarks)var1;
        if (Intrinsics.areEqual(this.landmarks, var2.landmarks)) {
          return true;
        }
      }

      return false;
    } else {
      return true;
    }
  }
}

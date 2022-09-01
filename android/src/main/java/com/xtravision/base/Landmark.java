package com.xtravision.base;

import kotlin.Metadata;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@Metadata(
  mv = {1, 5, 1},
  k = 1,
  d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0007\n\u0002\b\u000f\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0000\b\u0086\b\u0018\u00002\u00020\u0001B%\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u0012\u0006\u0010\u0006\u001a\u00020\u0003¢\u0006\u0002\u0010\u0007J\t\u0010\r\u001a\u00020\u0003HÆ\u0003J\t\u0010\u000e\u001a\u00020\u0003HÆ\u0003J\t\u0010\u000f\u001a\u00020\u0003HÆ\u0003J\t\u0010\u0010\u001a\u00020\u0003HÆ\u0003J1\u0010\u0011\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00032\b\b\u0002\u0010\u0006\u001a\u00020\u0003HÆ\u0001J\u0013\u0010\u0012\u001a\u00020\u00132\b\u0010\u0014\u001a\u0004\u0018\u00010\u0001HÖ\u0003J\t\u0010\u0015\u001a\u00020\u0016HÖ\u0001J\t\u0010\u0017\u001a\u00020\u0018HÖ\u0001R\u0011\u0010\u0006\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\b\u0010\tR\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\n\u0010\tR\u0011\u0010\u0004\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\tR\u0011\u0010\u0005\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\f\u0010\t¨\u0006\u0019"},
  d2 = {"Lcom/xtravision/base/Landmark;", "", "x", "", "y", "z", "visibility", "(FFFF)V", "getVisibility", "()F", "getX", "getY", "getZ", "component1", "component2", "component3", "component4", "copy", "equals", "", "other", "hashCode", "", "toString", "", "ReactNativeXtraVisionExample.xtravision.main"}
)
public final class Landmark {
  private final float x;
  private final float y;
  private final float z;
  private final float visibility;

  public final float getX() {
    return this.x;
  }

  public final float getY() {
    return this.y;
  }

  public final float getZ() {
    return this.z;
  }

  public final float getVisibility() {
    return this.visibility;
  }

  public Landmark(float x, float y, float z, float visibility) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.visibility = visibility;
  }

  public final float component1() {
    return this.x;
  }

  public final float component2() {
    return this.y;
  }

  public final float component3() {
    return this.z;
  }

  public final float component4() {
    return this.visibility;
  }

  @NotNull
  public final Landmark copy(float x, float y, float z, float visibility) {
    return new Landmark(x, y, z, visibility);
  }

  // $FF: synthetic method
  public static Landmark copy$default(Landmark var0, float var1, float var2, float var3, float var4, int var5, Object var6) {
    if ((var5 & 1) != 0) {
      var1 = var0.x;
    }

    if ((var5 & 2) != 0) {
      var2 = var0.y;
    }

    if ((var5 & 4) != 0) {
      var3 = var0.z;
    }

    if ((var5 & 8) != 0) {
      var4 = var0.visibility;
    }

    return var0.copy(var1, var2, var3, var4);
  }

  @NotNull
  public String toString() {
    return "Landmark(x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", visibility=" + this.visibility + ")";
  }

  public int hashCode() {
    return ((Float.hashCode(this.x) * 31 + Float.hashCode(this.y)) * 31 + Float.hashCode(this.z)) * 31 + Float.hashCode(this.visibility);
  }

  public boolean equals(@Nullable Object var1) {
    if (this != var1) {
      if (var1 instanceof Landmark) {
        Landmark var2 = (Landmark)var1;
        if (Float.compare(this.x, var2.x) == 0 && Float.compare(this.y, var2.y) == 0 && Float.compare(this.z, var2.z) == 0 && Float.compare(this.visibility, var2.visibility) == 0) {
          return true;
        }
      }

      return false;
    } else {
      return true;
    }
  }
}

package com.xtravision.base;

import kotlin.Metadata;
import org.jetbrains.annotations.Nullable;

@Metadata(
  mv = {1, 5, 1},
  k = 1,
  d1 = {"\u0000\u0018\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0010\u000e\n\u0000\bf\u0018\u00002\u00020\u0001J\b\u0010\u0002\u001a\u00020\u0003H&J\b\u0010\u0004\u001a\u00020\u0003H&J\b\u0010\u0005\u001a\u00020\u0003H&J\u0012\u0010\u0006\u001a\u00020\u00032\b\u0010\u0007\u001a\u0004\u0018\u00010\bH&¨\u0006\t"},
  d2 = {"Lcom/xtravision/base/MessageListener;", "", "onClose", "", "onConnectFailed", "onConnectSuccess", "onMessage", "text", "", "ReactNativeXtraVisionExample.xtravision.main"}
)
public interface MessageListener {
  void onConnectSuccess();

  void onConnectFailed();

  void onClose();

  void onMessage(@Nullable String var1);
}

package com.xtravision.base;

import android.util.Log;
import java.util.concurrent.TimeUnit;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okhttp3.OkHttpClient.Builder;
import okio.ByteString;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@Metadata(
  mv = {1, 5, 1},
  k = 1,
  d1 = {"\u0000T\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\b\n\u0002\u0018\u0002\n\u0000\bÆ\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002¢\u0006\u0002\u0010\u0002J\u0006\u0010\u0015\u001a\u00020\u0016J\u0006\u0010\u0017\u001a\u00020\u0016J\b\u0010\u0018\u001a\u00020\u0019H\u0002J\u001e\u0010\u001a\u001a\u00020\u00162\u0006\u0010\u001b\u001a\u00020\u00072\u0006\u0010\u001c\u001a\u00020\u00072\u0006\u0010\u001d\u001a\u00020\u0011J\u0006\u0010\f\u001a\u00020\rJ\u0006\u0010\u001e\u001a\u00020\u0016J\u000e\u0010\u001f\u001a\u00020\r2\u0006\u0010 \u001a\u00020\u0007J\u000e\u0010\u001f\u001a\u00020\r2\u0006\u0010!\u001a\u00020\"R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T¢\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T¢\u0006\u0002\n\u0000R\u0016\u0010\u0006\u001a\n \b*\u0004\u0018\u00010\u00070\u0007X\u0082\u0004¢\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082.¢\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\u0004X\u0082\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\rX\u0082\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u000e\u001a\u00020\u000fX\u0082.¢\u0006\u0002\n\u0000R\u000e\u0010\u0010\u001a\u00020\u0011X\u0082.¢\u0006\u0002\n\u0000R\u000e\u0010\u0012\u001a\u00020\u0013X\u0082.¢\u0006\u0002\n\u0000R\u000e\u0010\u0014\u001a\u00020\u0007X\u0082D¢\u0006\u0002\n\u0000¨\u0006#"},
  d2 = {"Lcom/xtravision/base/WebSocketManager;", "", "()V", "MAX_NUM", "", "MILLIS", "TAG", "", "kotlin.jvm.PlatformType", "client", "Lokhttp3/OkHttpClient;", "connectNum", "isConnect", "", "mWebSocket", "Lokhttp3/WebSocket;", "messageListener", "Lcom/xtravision/base/MessageListener;", "request", "Lokhttp3/Request;", "serverUrl", "close", "", "connect", "createListener", "Lokhttp3/WebSocketListener;", "init", "assessmentName", "authToken", "_messageListener", "reconnect", "sendMessage", "text", "byteString", "Lokio/ByteString;", "ReactNativeXtraVisionExample.xtravision.main"}
)
public final class WebSocketManager {
  private static final String serverUrl;
  private static final String TAG;
  private static final int MAX_NUM = 5;
  private static final int MILLIS = 5000;
  private static OkHttpClient client;
  private static Request request;
  private static MessageListener messageListener;
  private static WebSocket mWebSocket;
  private static boolean isConnect;
  private static int connectNum;
  @NotNull
  public static final WebSocketManager INSTANCE;

  public final void init(@NotNull String assessmentName, @NotNull String authToken, @NotNull MessageListener _messageListener) {
    Intrinsics.checkNotNullParameter(assessmentName, "assessmentName");
    Intrinsics.checkNotNullParameter(authToken, "authToken");
    Intrinsics.checkNotNullParameter(_messageListener, "_messageListener");
    String wssURL = serverUrl + "/" + assessmentName + "?authToken=" + authToken;
    client = (new Builder()).writeTimeout(5L, TimeUnit.SECONDS).readTimeout(5L, TimeUnit.SECONDS).connectTimeout(10L, TimeUnit.SECONDS).build();
    request = (new okhttp3.Request.Builder()).url(wssURL).build();
    messageListener = _messageListener;
  }

  public final void connect() {
    if (this.isConnect()) {
      Log.i(TAG, "web socket connected");
    } else {
      OkHttpClient var10000 = client;
      if (var10000 == null) {
        Intrinsics.throwUninitializedPropertyAccessException("client");
      }

      Request var10001 = request;
      if (var10001 == null) {
        Intrinsics.throwUninitializedPropertyAccessException("request");
      }

      var10000.newWebSocket(var10001, this.createListener());
    }
  }

  public final void reconnect() {
    if (connectNum <= 5) {
      try {
        Thread.sleep((long)5000);
        this.connect();
        int var10000 = connectNum++;
      } catch (InterruptedException var2) {
        var2.printStackTrace();
      }
    } else {
      Log.i(TAG, "reconnect over 5,please check url or network");
    }

  }

  public final boolean isConnect() {
    return isConnect;
  }

  public final boolean sendMessage(@NotNull String text) {
    Intrinsics.checkNotNullParameter(text, "text");
    Log.d("WebSocketManager>>>>>", text);
    boolean var10000;
    if (!this.isConnect()) {
      var10000 = false;
    } else {
      WebSocket var2 = mWebSocket;
      if (var2 == null) {
        Intrinsics.throwUninitializedPropertyAccessException("mWebSocket");
      }

      var10000 = var2.send(text);
    }

    return var10000;
  }

  public final boolean sendMessage(@NotNull ByteString byteString) {
    Intrinsics.checkNotNullParameter(byteString, "byteString");
    boolean var10000;
    if (!this.isConnect()) {
      var10000 = false;
    } else {
      WebSocket var2 = mWebSocket;
      if (var2 == null) {
        Intrinsics.throwUninitializedPropertyAccessException("mWebSocket");
      }

      var10000 = var2.send(byteString);
    }

    return var10000;
  }

  public final void close() {
    if (this.isConnect()) {
      WebSocket var10000 = mWebSocket;
      if (var10000 == null) {
        Intrinsics.throwUninitializedPropertyAccessException("mWebSocket");
      }

      var10000.cancel();
      var10000 = mWebSocket;
      if (var10000 == null) {
        Intrinsics.throwUninitializedPropertyAccessException("mWebSocket");
      }

      var10000.close(1001, "The client actively closes the connection ");
    }

  }

  private final WebSocketListener createListener() {
    return (WebSocketListener)(new WebSocketListener() {
      public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
        Intrinsics.checkNotNullParameter(webSocket, "webSocket");
        Intrinsics.checkNotNullParameter(response, "response");
        super.onOpen(webSocket, response);
        Log.d(WebSocketManager.access$getTAG$p(WebSocketManager.INSTANCE), "open:" + response);
        WebSocketManager.access$setMWebSocket$p(WebSocketManager.INSTANCE, webSocket);
        WebSocketManager.access$setConnect$p(WebSocketManager.INSTANCE, false);
        if (!WebSocketManager.access$isConnect$p(WebSocketManager.INSTANCE)) {
          WebSocketManager.INSTANCE.reconnect();
        } else {
          Log.i(WebSocketManager.access$getTAG$p(WebSocketManager.INSTANCE), "connect success.");
          WebSocketManager.access$getMessageListener$p(WebSocketManager.INSTANCE).onConnectSuccess();
        }

      }

      public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
        Intrinsics.checkNotNullParameter(webSocket, "webSocket");
        Intrinsics.checkNotNullParameter(text, "text");
        super.onMessage(webSocket, text);
        WebSocketManager.access$getMessageListener$p(WebSocketManager.INSTANCE).onMessage(text);
      }

      public void onMessage(@NotNull WebSocket webSocket, @NotNull ByteString bytes) {
        Intrinsics.checkNotNullParameter(webSocket, "webSocket");
        Intrinsics.checkNotNullParameter(bytes, "bytes");
        super.onMessage(webSocket, bytes);
        WebSocketManager.access$getMessageListener$p(WebSocketManager.INSTANCE).onMessage(bytes.base64());
      }

      public void onClosing(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
        Intrinsics.checkNotNullParameter(webSocket, "webSocket");
        Intrinsics.checkNotNullParameter(reason, "reason");
        super.onClosing(webSocket, code, reason);
        WebSocketManager.access$setConnect$p(WebSocketManager.INSTANCE, false);
        WebSocketManager.access$getMessageListener$p(WebSocketManager.INSTANCE).onClose();
      }

      public void onClosed(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
        Intrinsics.checkNotNullParameter(webSocket, "webSocket");
        Intrinsics.checkNotNullParameter(reason, "reason");
        super.onClosed(webSocket, code, reason);
        WebSocketManager.access$setConnect$p(WebSocketManager.INSTANCE, false);
        WebSocketManager.access$getMessageListener$p(WebSocketManager.INSTANCE).onClose();
      }

      public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @Nullable Response response) {
        Intrinsics.checkNotNullParameter(webSocket, "webSocket");
        Intrinsics.checkNotNullParameter(t, "t");
        super.onFailure(webSocket, t, response);
        if (response != null) {
          Log.i(WebSocketManager.access$getTAG$p(WebSocketManager.INSTANCE), "connect failed：");
        }

        Log.i(WebSocketManager.access$getTAG$p(WebSocketManager.INSTANCE), "connect failed throwable：" + t.getMessage());
        WebSocketManager.access$setConnect$p(WebSocketManager.INSTANCE, false);
        WebSocketManager.access$getMessageListener$p(WebSocketManager.INSTANCE).onConnectFailed();
        WebSocketManager.INSTANCE.reconnect();
      }
    });
  }

  private WebSocketManager() {
  }

  static {
    WebSocketManager var0 = new WebSocketManager();
    INSTANCE = var0;
    serverUrl = "wss://saasai.xtravision.ai/wss/v1/assessment/fitness";
    TAG = WebSocketManager.class.getSimpleName();
  }

  // $FF: synthetic method
  public static final String access$getTAG$p(WebSocketManager $this) {
    return TAG;
  }

  // $FF: synthetic method
  public static final WebSocket access$getMWebSocket$p(WebSocketManager $this) {
    WebSocket var10001 = mWebSocket;
    if (var10001 == null) {
      Intrinsics.throwUninitializedPropertyAccessException("mWebSocket");
    }

    return var10001;
  }

  // $FF: synthetic method
  public static final void access$setMWebSocket$p(WebSocketManager $this, WebSocket var1) {
    mWebSocket = var1;
  }

  // $FF: synthetic method
  public static final boolean access$isConnect$p(WebSocketManager $this) {
    return isConnect;
  }

  // $FF: synthetic method
  public static final void access$setConnect$p(WebSocketManager $this, boolean var1) {
    isConnect = var1;
  }

  // $FF: synthetic method
  public static final MessageListener access$getMessageListener$p(WebSocketManager $this) {
    MessageListener var10001 = messageListener;
    if (var10001 == null) {
      Intrinsics.throwUninitializedPropertyAccessException("messageListener");
    }

    return var10001;
  }

  // $FF: synthetic method
  public static final void access$setMessageListener$p(WebSocketManager $this, MessageListener var1) {
    messageListener = var1;
  }
}

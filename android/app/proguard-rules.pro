## Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }
-dontwarn io.flutter.embedding.**

## Gson (used by many Flutter plugins)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

## GetX (State Management)
-keep class com.get.** { *; }
-keepclassmembers class * extends com.get.GetxController {
    <methods>;
}

## Image Picker
-keep class androidx.lifecycle.** { *; }
-keep class androidx.core.content.FileProvider { *; }

## URL Launcher
-keep class io.flutter.plugins.urllauncher.** { *; }

## Cached Network Image
-keep class com.github.bumptech.glide.** { *; }
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

## OkHttp (used by networking)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

## Retrofit (if used indirectly)
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions

## Keep your app's model classes (IMPORTANT for JSON serialization)
-keep class com.senayitdentalclinic.mobile_app.** { *; }

## Keep all model classes that might be serialized/deserialized
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

## General Android
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

## Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

## Keep custom views
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}

## Parcelable
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}

## Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

## Enum
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

## Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

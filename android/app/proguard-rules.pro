# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# React Native specific rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep React Native modules
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }

# Keep JavaScript interface methods
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# Keep React Native dev tools
-keep class com.facebook.react.devsupport.** { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep Google Sign In
-keep class com.reactnativegooglesignin.** { *; }

# Keep Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Keep Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keep React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# Keep Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# Keep React Navigation
-keep class com.reactnavigation.** { *; }

# Keep Supabase
-keep class io.supabase.** { *; }

# Keep Styled Components
-keep class com.styledcomponents.** { *; }

# Remove debug logs in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
}

# Optimize string operations
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification

# Remove unused code
-dontwarn **
-ignorewarnings

# Keep essential Android classes
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.preference.Preference
-keep public class * extends android.view.View
-keep public class * extends android.app.Fragment

# Keep Parcelable classes
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep R classes
-keep class **.R$* {
    public static <fields>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep JavaScript interface methods
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# Enable optimization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification

# Keep essential classes
-keep class com.basicapp.MainActivity { *; }
-keep class com.basicapp.MainApplication { *; }

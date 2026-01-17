# Android Studio Setup Guide for Aramancia Tracker

This guide will walk you through setting up Google Android Studio to develop and deploy the Aramancia Tracker app on Android devices.

## Prerequisites

- Node.js 18+ and npm installed
- Git installed
- Google Android Studio (latest version)
- Android SDK and Platform Tools
- Java Development Kit (JDK) 17 or higher

## Table of Contents

1. [Install Android Studio](#1-install-android-studio)
2. [Install Capacitor](#2-install-capacitor)
3. [Configure the Android Project](#3-configure-the-android-project)
4. [Build and Run](#4-build-and-run)
5. [Development Workflow](#5-development-workflow)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Install Android Studio

### Download and Install

1. **Download Android Studio**
   - Visit: https://developer.android.com/studio
   - Download the latest stable version for your operating system
   - Run the installer

2. **Install Required Components**
   During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

3. **Configure Android SDK**
   - Open Android Studio
   - Go to `Settings/Preferences` → `Appearance & Behavior` → `System Settings` → `Android SDK`
   - Install the following:
     - Android SDK Platform 33 (Android 13) or latest
     - Android SDK Build-Tools
     - Android SDK Platform-Tools
     - Android SDK Command-line Tools
     - Android Emulator

4. **Set Up Environment Variables**

   **Linux/macOS:**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/emulator
   ```

   **Windows:**
   ```
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```
   Add to PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   %ANDROID_HOME%\emulator
   ```

5. **Verify Installation**
   ```bash
   adb --version
   ```

---

## 2. Install Capacitor

Capacitor is a cross-platform native runtime that makes it easy to build web apps that run on iOS, Android, and the web.

### Install Capacitor CLI and Dependencies

```bash
# Navigate to project directory
cd aramancia-tracker

# Install Capacitor core and CLI
npm install @capacitor/core @capacitor/cli

# Install Android platform
npm install @capacitor/android

# Initialize Capacitor (if not already done)
npx cap init "Aramancia Tracker" "com.aramancia.tracker" --web-dir=dist
```

### Configure Capacitor

Edit `capacitor.config.ts` (or create it if it doesn't exist):

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aramancia.tracker',
  appName: 'Aramancia Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development, you can use:
    // url: 'http://YOUR_LOCAL_IP:5173',
    // cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  }
};

export default config;
```

### Add Android Platform

```bash
# Add Android platform
npx cap add android
```

This will create an `android/` directory in your project with a native Android project.

---

## 3. Configure the Android Project

### Update package.json Scripts

Add these helpful scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "android:sync": "npx cap sync android",
    "android:open": "npx cap open android",
    "android:run": "npm run build && npx cap sync android && npx cap open android",
    "android:dev": "npx cap run android -l --external",
    "android:build": "npm run build && npx cap sync android && cd android && ./gradlew assembleRelease"
  }
}
```

### Configure AndroidManifest.xml

The file is located at `android/app/src/main/AndroidManifest.xml`.

Key permissions to add for the tracker app:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Network Access -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Storage (if needed for offline data) -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
                     android:maxSdkVersion="32" />
    
    <!-- Prevent screen from sleeping during use -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">
        <!-- Activities configuration -->
    </application>
</manifest>
```

### Configure App Icons

1. Prepare app icon (1024x1024 PNG)
2. Use Android Studio's Image Asset Studio:
   - Right-click `android/app/src/main/res`
   - Select `New` → `Image Asset`
   - Choose icon type: "Launcher Icons (Adaptive and Legacy)"
   - Upload your icon
   - Generate icons

### Update Splash Screen

Edit `android/app/src/main/res/values/styles.xml`:

```xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">#0a0a0a</item>
        <item name="colorPrimaryDark">#000000</item>
        <item name="colorAccent">#FFFFFF</item>
        <item name="android:statusBarColor">#000000</item>
        <item name="android:navigationBarColor">#000000</item>
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>
```

---

## 4. Build and Run

### Development Build

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync with Android:**
   ```bash
   npm run android:sync
   ```

3. **Open in Android Studio:**
   ```bash
   npm run android:open
   ```

4. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Select a device or emulator from the device dropdown
   - Click the green "Run" button (▶️)

### Live Reload Development

For faster development with live reload:

```bash
# Start Vite dev server
npm run dev

# In another terminal, run on device with live reload
npm run android:dev
```

This will:
- Build the app pointing to your local dev server
- Install on device/emulator
- Auto-reload when you make changes

### Production Build

1. **Generate a signed APK:**

   First, create a keystore:
   ```bash
   keytool -genkey -v -keystore aramancia-release.keystore -alias aramancia -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing in Android Studio:**
   - `Build` → `Generate Signed Bundle/APK`
   - Select APK
   - Create or choose keystore
   - Fill in passwords and alias
   - Select release build variant
   - Build

3. **Or use Gradle command line:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   APK will be at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 5. Development Workflow

### Recommended Workflow

1. **Make changes to your React/TypeScript code**
2. **Test in browser first:**
   ```bash
   npm run dev
   ```

3. **Build and sync to Android:**
   ```bash
   npm run build
   npm run android:sync
   ```

4. **Test on device/emulator in Android Studio**

### Using Android Emulator

1. **Create an AVD (Android Virtual Device):**
   - Open Android Studio
   - `Tools` → `Device Manager`
   - Click "Create Device"
   - Select device (e.g., Pixel 5)
   - Select system image (API 33+, x86_64)
   - Finish setup

2. **Start emulator and run app:**
   ```bash
   # Start emulator (or use Android Studio UI)
   emulator -avd Pixel_5_API_33
   
   # Run app
   npm run android:run
   ```

### Debugging

1. **Chrome DevTools:**
   - Open Chrome and navigate to: `chrome://inspect`
   - Select your device
   - Click "Inspect" on your app

2. **Android Studio Logcat:**
   - View → Tool Windows → Logcat
   - Filter by your app package name

3. **VS Code Debugging:**
   Install the "Android WebView Debugging" extension

### Common Commands

```bash
# Sync web assets to native project
npx cap sync

# Copy web assets only
npx cap copy

# Update Capacitor plugins
npx cap update

# Check Capacitor setup
npx cap doctor

# Run on specific device
npx cap run android --target=DEVICE_ID

# List available devices
adb devices
```

---

## 6. Troubleshooting

### Build Errors

**Problem:** Gradle build fails
```bash
# Clear Gradle cache
cd android
./gradlew clean

# Or in Android Studio: Build → Clean Project
```

**Problem:** Dependency resolution issues
```bash
# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=8.0

# Invalidate caches in Android Studio
File → Invalidate Caches → Invalidate and Restart
```

### Performance Issues

**Problem:** App feels slow on Android

1. **Enable hardware acceleration** - Already configured in this project's CSS
2. **Reduce animation duration** - Adjust in `index.css`
3. **Optimize video background:**
   ```typescript
   // Consider removing video on low-end devices
   const isLowEndDevice = navigator.hardwareConcurrency <= 4;
   ```

4. **Use production build** - Development builds are slower

### Device Connection Issues

**Problem:** Device not detected

```bash
# Restart ADB server
adb kill-server
adb start-server

# Check devices
adb devices

# For Linux, might need udev rules
# Create file: /etc/udev/rules.d/51-android.rules
# Add: SUBSYSTEM=="usb", ATTR{idVendor}=="YOUR_VENDOR_ID", MODE="0666", GROUP="plugdev"
```

**Problem:** Permission denied errors

Enable USB debugging on your Android device:
- Settings → About Phone → Tap "Build Number" 7 times
- Settings → Developer Options → Enable USB Debugging

### Live Reload Not Working

1. **Check device and computer are on same network**
2. **Check firewall settings** - Allow port 5173
3. **Use correct IP address in capacitor.config.ts:**
   ```bash
   # Find your IP
   # Linux/Mac:
   ifconfig
   # Windows:
   ipconfig
   ```

4. **Update capacitor.config.ts:**
   ```typescript
   server: {
     url: 'http://YOUR_IP:5173',
     cleartext: true
   }
   ```

---

## Performance Optimizations Applied

This project already includes several Android-optimized features:

✅ **Hardware-accelerated animations** with `translate3d()` and `will-change`
✅ **Optimized CSS transitions** using cubic-bezier easing
✅ **Touch-optimized interactions** with proper touch targets (48x48px minimum)
✅ **Reduced motion support** for accessibility
✅ **Responsive breakpoints** for different device sizes
✅ **PWA capabilities** with service worker and offline support
✅ **Safe area insets** for notched devices
✅ **Passive event listeners** for scroll performance

---

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)

---

## Support

For issues specific to this project, please check:
- Project README.md
- .agent/logs/work-log.md (development history)
- GitHub Issues

For Capacitor/Android issues:
- [Capacitor Community Discord](https://discord.com/invite/UPYXaVz)
- [Stack Overflow - Capacitor Tag](https://stackoverflow.com/questions/tagged/capacitor)

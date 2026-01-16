# Capacitor Android Project Audit

**Date:** 2026-01-15
**Status:** Needs fixes before deployment

## Current State

### Installed Dependencies
- `@capacitor/cli`: 8.0.0
- `@capacitor/core`: 8.0.0
- `@capacitor/android`: 8.0.0
- `@capacitor/ios`: Not installed

### Platform Status
- ✅ Android platform exists
- ❌ `app/src/main/assets` directory is **MISSING** (critical error from `cap doctor`)

### Configuration Issues

#### 1. Capacitor Config (`capacitor.config.ts`)
**Status:** Minimal configuration

**Issues:**
- ❌ No plugins configured
- ❌ No server configuration
- ❌ No plugin-specific settings

**Current Config:**
```typescript
{
  appId: 'com.daytimeblues.fuyuki',
  appName: 'Fuyuki Warlock Tracker',
  webDir: 'dist'
}
```

**Missing Plugins:**
- `@capacitor/haptics` - For tactile feedback
- `@capacitor/app` - For app state events
- `@capacitor/keyboard` - For keyboard management

#### 2. Android Manifest (`android/app/src/main/AndroidManifest.xml`)
**Status:** Basic configuration present

**Issues:**
- ❌ Application ID mismatch
  - Config: `com.daytimeblues.fuyuki`
  - Manifest: `com.daytimeblues.aramancia`
- ❌ No vibration permission for haptics
  - Missing: `android.permission.VIBRATE`
- ✅ Internet permission present
- ✅ Basic activity configuration looks correct

#### 3. Android Build Config (`android/app/build.gradle`)
**Status:** Basic setup

**Issues:**
- ❌ Application ID mismatch (same as manifest)
- ✅ Basic build configuration looks okay

**Current Settings:**
```gradle
applicationId "com.daytimeblues.aramancia"
minSdkVersion rootProject.ext.minSdkVersion
targetSdkVersion rootProject.ext.targetSdkVersion
versionCode 1
versionName "1.0"
```

## Required Fixes

### Priority 1 - Critical (Blocking)

1. **Sync Capacitor to create missing directories**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Fix Application ID Mismatch**
   - Update `android/app/build.gradle` to use `com.daytimeblues.fuyuki`
   - Or verify which ID should be used

3. **Add Haptics Plugin**
   ```bash
   npm install @capacitor/haptics
   npm install -D @capacitor/haptics
   ```

### Priority 2 - High (Should Fix)

4. **Add Vibration Permission**
   - Add `<uses-permission android:name="android.permission.VIBRATE" />` to AndroidManifest.xml

5. **Update Capacitor Config**
   ```typescript
   const config: CapacitorConfig = {
     appId: 'com.daytimeblues.fuyuki',
     appName: 'Fuyuki Warlock Tracker',
     webDir: 'dist',
     server: {
       androidScheme: 'https',
     },
     plugins: {
       Haptics: {
         enabled: true,
       },
     },
   };
   ```

### Priority 3 - Medium (Nice to Have)

6. **Verify SDK Versions**
   - Check minSdk and targetSdk are appropriate
   - Recommend: minSdk 26+, targetSdk 34+

7. **Add App State Management**
   - Install and configure `@capacitor/app`

8. **Add Keyboard Plugin**
   - Install and configure `@capacitor/keyboard`

## Summary

**Overall Status:** ⚠️ **Needs Attention**

- 1 Critical blocking issue (missing assets directory)
- 4 High priority issues (ID mismatch, plugins, permissions)
- 3 Medium priority improvements

**Estimated Fix Time:** 30-60 minutes

**Next Steps:**
1. Run `npm run build && npx cap sync android`
2. Fix application ID mismatch
3. Install and configure haptics plugin
4. Add vibration permission
5. Update Capacitor config with plugins

---

*Generated: 2026-01-15*
*Capacitor Version: 8.0.0*

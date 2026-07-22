<!--
author: Masub Makhdoom
email: masubmakhdoom2@gmail.com
language: en
narrator: US English Female
comment: Training lesson for creating a modern Android WebView app from a LiaScript course
-->

# Training: Create a Latest Android App for a LiaScript Course

## Learning Goal

In this training, you will learn how to create a **modern Android app** for a LiaScript course.

The final app will:

* open a LiaScript course inside Android app
* use Android WebView
* use modern Android SDK
* avoid old Android app warnings
* create an APK file for Android phone installation

---

## Final App Structure

```text
LiaScript course
→ GitHub Pages web link
→ Android WebView app
→ Modern APK
→ Android phone installation
```

---

# 1. Required Tools

Before starting, you need these tools:

```text
1. Android Studio
2. Android SDK
3. Java / JDK support
4. Gradle
5. Kotlin
6. GitHub Pages LiaScript course link
7. Android phone
8. USB cable or file transfer method
```

---

# 2. Software Used in This App

For this project, we used:

```text
Android Studio
Kotlin
Gradle Kotlin DSL
Android WebView
compileSdk = 35
targetSdk = 35
minSdk = 23
Java 17
Kotlin JVM Toolchain 17
```

---

# 3. Course Link Used in the App

This Android app opens the LiaScript course from GitHub Pages:

```text
https://masub27.github.io/a1-iphone-part1/
```

This online link was used because the local offline WebView version showed a white screen.

---

# 4. Create Android Studio Project

Open Android Studio.

Select:

```text
New Project
→ Empty Activity / Empty Views Activity
```

Use these settings:

```text
Project name: A1.1 German Part 1
Package name: io.github.masubmakhdoom.a1part1modern
Language: Kotlin
Minimum SDK: 23
```

Project location:

```text
/Users/masubmakhdoom/AndroidStudioProjects/A11GermanPart1
```

---

# 5. Open Project in Terminal

Open Terminal and go to the Android project folder:

```bash
cd "/Users/masubmakhdoom/AndroidStudioProjects/A11GermanPart1"
```

---

# 6. Fix Project-Level Gradle File

The project-level Gradle file is:

```text
build.gradle.kts
```

Important:

```text
This file should NOT contain android { ... }
```

Run this command:

```bash
cat > build.gradle.kts <<'EOF'
plugins {
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}
EOF
```

---

# 7. Fix App-Level Gradle File

The app-level Gradle file is:

```text
app/build.gradle.kts
```

This file contains Android settings such as:

```text
compileSdk
targetSdk
minSdk
versionCode
versionName
```

Run this command:

```bash
cat > app/build.gradle.kts <<'EOF'
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "io.github.masubmakhdoom.a1part1modern"
    compileSdk = 35

    defaultConfig {
        applicationId = "io.github.masubmakhdoom.a1part1modern"
        minSdk = 23
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    jvmToolchain(17)
}
EOF
```

---

# 8. Why Java 17 Was Added

During build, we got this error:

```text
Inconsistent JVM-target compatibility
compileDebugJavaWithJavac = 1.8
compileDebugKotlin = 21
```

To fix it, we used:

```kotlin
compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

kotlin {
    jvmToolchain(17)
}
```

This makes Java and Kotlin use the same version.

---

# 9. Fix Android Theme

We got errors related to MaterialComponents theme.

Example error:

```text
Theme.MaterialComponents.DayNight.DarkActionBar not found
colorPrimaryVariant not found
```

So we replaced the theme with a simple Android theme.

---

## 9.1 Create Normal Theme

Run:

```bash
mkdir -p app/src/main/res/values

cat > app/src/main/res/values/themes.xml <<'EOF'
<resources>
    <style name="Theme.A11GermanPart1" parent="@android:style/Theme.Material.Light.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:statusBarColor">#FFFFFF</item>
        <item name="android:navigationBarColor">#FFFFFF</item>
    </style>
</resources>
EOF
```

---

## 9.2 Create Dark Theme

Run:

```bash
mkdir -p app/src/main/res/values-night

cat > app/src/main/res/values-night/themes.xml <<'EOF'
<resources>
    <style name="Theme.A11GermanPart1" parent="@android:style/Theme.Material.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:statusBarColor">#000000</item>
        <item name="android:navigationBarColor">#000000</item>
    </style>
</resources>
EOF
```

---

# 10. Android Manifest File

The Android Manifest file controls:

```text
App name
Internet permission
Main activity
Launcher icon behavior
```

File location:

```text
app/src/main/AndroidManifest.xml
```

Run this command:

```bash
cat > app/src/main/AndroidManifest.xml <<'EOF'
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:supportsRtl="true"
        android:theme="@style/Theme.A11GermanPart1"
        android:label="A1 German Modern Online">

        <activity
            android:name=".MainActivity"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

    </application>

</manifest>
EOF
```

---

# 11. Important Manifest Parts

## Internet Permission

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

This is necessary because the app opens an online GitHub Pages course.

---

## App Name

```xml
android:label="A1 German Modern Online"
```

This is the name students see on the Android phone.

---

## Main Activity

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
```

This tells Android which screen opens first.

---

# 12. Create MainActivity WebView Code

The MainActivity file controls what the app shows.

File location:

```text
app/src/main/java/io/github/masubmakhdoom/a1part1modern/MainActivity.kt
```

Run this command:

```bash
mkdir -p app/src/main/java/io/github/masubmakhdoom/a1part1modern

cat > app/src/main/java/io/github/masubmakhdoom/a1part1modern/MainActivity.kt <<'EOF'
package io.github.masubmakhdoom.a1part1modern

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : Activity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        webView.loadUrl("https://masub27.github.io/a1-iphone-part1/")
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
EOF
```

---

# 13. Important WebView Code Explanation

## Enable JavaScript

```kotlin
settings.javaScriptEnabled = true
```

LiaScript needs JavaScript to work.

---

## Enable Storage

```kotlin
settings.domStorageEnabled = true
settings.databaseEnabled = true
```

This helps web content store data and run properly.

---

## Allow Media Playback

```kotlin
settings.mediaPlaybackRequiresUserGesture = false
```

This helps audio and video work better inside WebView.

---

## Load LiaScript Course

```kotlin
webView.loadUrl("https://masub27.github.io/a1-iphone-part1/")
```

This opens the LiaScript course inside the Android app.

---

# 14. Build the APK

Run:

```bash
./gradlew clean
./gradlew assembleDebug
```

Wait until Terminal shows:

```text
BUILD SUCCESSFUL
```

---

# 15. Copy APK to Desktop

Run:

```bash
cp app/build/outputs/apk/debug/app-debug.apk \
"/Users/masubmakhdoom/Desktop/A1_German_Modern_Online.apk"
```

Check if APK exists:

```bash
ls -lh "/Users/masubmakhdoom/Desktop/A1_German_Modern_Online.apk"
```

---

# 16. Install APK on Android Phone

Send this APK file to the Android phone:

```text
A1_German_Modern_Online.apk
```

Before installing, uninstall the old app:

```text
A1 German Part 1
```

Then install the new APK.

The app name should appear as:

```text
A1 German Modern Online
```

---

# 17. Testing Checklist

After installation, test these points:

```text
1. App opens
2. Course loads
3. No white screen
4. Audio works
5. Video works
6. Links open
7. Quizzes work
8. Back button works
9. Screen size is clear
10. Internet connection is available
```

---

# 18. Common Errors and Fixes

## Error 1: Unresolved reference android

Problem:

```text
android { ... } was pasted into the wrong file
```

Fix:

```text
Put android { ... } only inside app/build.gradle.kts
```

---

## Error 2: Kotlin plugin alias error

Problem:

```text
alias(libs.plugins.kotlin.android) not found
```

Fix:

```text
Use direct plugin names instead of libs aliases
```

Used code:

```kotlin
plugins {
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}
```

---

## Error 3: MaterialComponents theme not found

Problem:

```text
Theme.MaterialComponents.DayNight.DarkActionBar not found
```

Fix:

```text
Use simple Android built-in theme
```

---

## Error 4: JVM target mismatch

Problem:

```text
Java target = 1.8
Kotlin target = 21
```

Fix:

```text
Set both to Java 17
```

---

## Error 5: App opens white screen

Problem:

```text
Local LiaScript files did not load correctly inside Android WebView
```

Fix:

```text
Use GitHub Pages online LiaScript course link
```

Used link:

```text
https://masub27.github.io/a1-iphone-part1/
```

---

# 19. Final Result

At the end, we created:

```text
A1_German_Modern_Online.apk
```

The app uses:

```text
Android WebView
Kotlin
targetSdk 35
GitHub Pages LiaScript course
```

Final installed app name:

```text
A1 German Modern Online
```

---

# 20. Summary for Students

In this training, we learned how to convert a LiaScript course into a modern Android app by using a WebView wrapper.

The final process was:

```text
Create LiaScript course
Publish course on GitHub Pages
Create Android Studio project
Add WebView code
Set targetSdk 35
Build APK
Install APK on Android phone
Test course
```

This method is useful because students can access a LiaScript course as a real Android app.

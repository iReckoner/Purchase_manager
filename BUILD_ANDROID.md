# Building the Android APK

This guide explains how to build the Android APK for the application.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed (as you likely already do for the Angular app).
2.  **Android Studio**: You need to install Android Studio to get the Android SDK and tools.
    *   Download from: [developer.android.com/studio](https://developer.android.com/studio)
    *   During installation, make sure to install the **Android SDK**, **Android SDK Command-line Tools**, and **Android SDK Build-Tools**.
3.  **Environment Variables**:
    *   Set `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) to the location of your Android SDK.
    *   Add `$ANDROID_HOME/platform-tools` and `$ANDROID_HOME/tools/bin` to your `PATH`.

## Building the APK

We have added a convenience script to `package.json` that builds the Angular app, syncs it with Capacitor, and then builds the Android debug APK.

1.  Open your terminal in the project root.
2.  Run the following command:

    ```bash
    npm run build:android
    ```

    This command performs the following steps:
    *   `ng build`: Builds the Angular web application.
    *   `npx cap sync`: Copies the web assets to the Android project.
    *   `./gradlew assembleDebug`: Uses Gradle to build the Android APK.

## Locating the APK

Once the build completes successfully, the APK file will be located at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

You can transfer this file to your Android device and install it.

## Troubleshooting

*   **SDK Location Not Found**: If you see an error like `SDK location not found`, ensure you have the `ANDROID_HOME` environment variable set, or create a `local.properties` file in the `android` directory with the following content:
    ```properties
    sdk.dir=/path/to/your/android/sdk
    ```
    (Replace `/path/to/your/android/sdk` with the actual path).

*   **Gradle Errors**: If you encounter network issues downloading Gradle or dependencies, check your internet connection and proxy settings.

*   **Permission Denied**: If you get a permission error running `./gradlew`, try running `chmod +x android/gradlew` (on Linux/macOS).

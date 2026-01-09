# Building the iOS App

This guide explains how to build the iOS version of the application.

## Prerequisites

**Important**: Building iOS applications requires macOS and Xcode. You cannot build the iOS app on Windows or Linux.

1.  **macOS**: A Mac computer running a recent version of macOS.
2.  **Xcode**: Install Xcode from the Mac App Store.
3.  **CocoaPods**: Install CocoaPods to manage iOS dependencies.
    ```bash
    sudo gem install cocoapods
    ```

## Building and Running on iOS

We have added a convenience script to prepare the iOS project.

1.  Open your terminal in the project root.
2.  Run the following command to build the web assets and sync them to the iOS project:

    ```bash
    npm run build:ios
    ```

    This command performs:
    *   `ng build`: Builds the Angular web application.
    *   `npx cap sync ios`: Copies the web assets to the `ios/` directory and updates native plugins.

3.  Open the project in Xcode:

    ```bash
    npx cap open ios
    ```

4.  **In Xcode**:
    *   Select your connected device or a simulator from the top toolbar.
    *   Wait for the automatic indexing and Pods installation to complete.
    *   Click the **Play** button (or press `Cmd + R`) to build and run the app.

## Troubleshooting

*   **CocoaPods Errors**: If you encounter issues with `pod install`, try running:
    ```bash
    cd ios
    pod install
    cd ..
    ```
*   **Signing Issues**: You may need to select a Development Team in Xcode.
    *   Click on the **App** project in the left navigator.
    *   Select the **App** target.
    *   Go to the **Signing & Capabilities** tab.
    *   Select your team in the **Team** dropdown.

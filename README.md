# Mobile Code Test

This is a React Native application built as a mobile code test. It displays a list of booking details, including journey segments, and indicates whether the booking is active or expired.

## Features

*   **Booking List:** Displays a list of booking segments.
*   **Expiry Status:** Shows the time remaining for a booking, or marks it as expired.
*   **Pull-to-Refresh:** Allows the user to refresh the booking data.
*   **Caching:** Uses `AsyncStorage` to cache the booking data for offline access.

## Tech Stack

*   React Native
*   TypeScript
*   Jest

## Getting Started

To get started with this project, follow these steps:

1.  **Install dependencies:**
    ```sh
    npm install
    ```

2.  **Install iOS dependencies:**
    ```sh
    cd ios && pod install && cd ..
    ```

3.  **Run the app:**
    *   **iOS:**
        ```sh
        npm run ios
        ```
    *   **Android:**
        ```sh
        npm run android
        ```

## Testing

This project uses [Jest](https://jestjs.io/) for unit and component testing. The tests are located in the `__tests__` directory.

To run the tests, use the following command:

```sh
# Using npm
npm test
```
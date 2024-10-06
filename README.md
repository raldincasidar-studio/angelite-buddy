# Angelite Buddy

**Angelite Buddy** is an online dating app built using Nuxt.js 3. It incorporates collaborative filtering and Elo rating algorithms to recommend potential matches based on users' interests and interactions. The app is packaged with Capacitor, making it easily deployable as a cross-platform mobile app.

## Table of Contents

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Prerequisites](#prerequisites)
-   [Setup Instructions](#setup-instructions)
    -   [1. Clone the repository](#1-clone-the-repository)
    -   [2. Install dependencies](#2-install-dependencies)
    -   [3. Run the app in development mode](#3-run-the-app-in-development-mode)
    -   [4. Build the app for production](#4-build-the-app-for-production)
    -   [5. Running on mobile using Capacitor](#5-running-on-mobile-using-capacitor)
-   [Collaborative Filtering and Elo Algorithm](#collaborative-filtering-and-elo-algorithm)
-   [Contributing](#contributing)
-   [License](#license)

## Project Overview

Angelite Buddy is a dating app that provides smart user matching using a combination of:

-   **Collaborative Filtering Algorithm**: Recommends potential matches based on users' common interests and previous interactions.
-   **Elo Rating System**: An adjustable ranking system that updates user ratings after each interaction to reflect match quality.

The app is designed to run on both the web and mobile platforms using Capacitor, which allows you to deploy it across iOS and Android devices.

## Features

-   User registration and profile creation.
-   Matching users based on shared interests and interaction history.
-   Like/Dislike functionality with real-time Elo rating updates.
-   Mobile-ready using Capacitor for deployment to iOS and Android.

## Technologies Used

-   **Nuxt.js 3**: A powerful framework built on top of Vue.js.
-   **Vue.js**: Frontend library for building user interfaces.
-   **Capacitor**: A cross-platform native runtime for building web apps that run natively on iOS, Android, and the web.
-   **Vuetify**: A material design component framework for Vue.
-   **Collaborative Filtering Algorithm**: Recommends potential matches based on user behavior and preferences.
-   **Elo Rating Algorithm**: Adjusts user rankings based on interactions to fine-tune matching.

## Prerequisites

Ensure that you have the following tools installed before setting up the project:

-   **Node.js** (v16.x or later)
-   **npm** (comes with Node.js) or **yarn** (optional)
-   **Capacitor CLI** (v5.x or later)
-   **Android Studio** and/or **Xcode** (for mobile builds)
-   **Nuxt.js 3** globally installed (`npm install -g nuxt`)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/angelite-buddy.git
cd angelite-buddy
```

### 2. Install dependencies

Install the required dependencies using npm or yarn.

```bash
npm install
```

Or, if you prefer Yarn:

```bash
yarn install
```

### 3. Run the app in development mode

To start the development server, use the following command:

```bash
npm run dev
```

This will start the Nuxt development server. You can access the app by visiting [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build the app for production

To build the app for production, run the following command:

```bash
npm run build
```

This will generate optimized, minified static files for the web.

### 5. Running on mobile using Capacitor

Angelite Buddy is integrated with Capacitor to enable cross-platform mobile deployment. To run the app on mobile devices, follow these steps:

1. **Install Capacitor and set up platforms** (iOS and Android):

    ```bash
    npm install @capacitor/core @capacitor/cli
    ```

2. **Add Android or iOS platforms**:

    For Android:

    ```bash
    npx cap add android
    ```

    For iOS:

    ```bash
    npx cap add ios
    ```

3. **Sync Nuxt.js build with Capacitor**:

    Every time you build your app (e.g., `npm run build`), you need to sync it with the Capacitor app:

    ```bash
    npx cap sync
    ```

4. **Run the app on a mobile device**:

    For Android:

    ```bash
    npx cap open android
    ```

    For iOS:

    ```bash
    npx cap open ios
    ```

    This will open either Android Studio or Xcode, from which you can run the app on a simulator or connected device.

5. **Live Reload on Mobile**:
   To enable live reload with Capacitor while developing for mobile:

    ```bash
    npm run dev
    ```

    Then, open Android or iOS as mentioned above (`npx cap open android` or `npx cap open ios`), and the app will connect to the development server for live updates.

## Collaborative Filtering and Elo Algorithm

-   **Collaborative Filtering Algorithm**: Users are recommended matches based on their past interactions and shared interests. The algorithm uses cosine similarity to find users with overlapping preferences.
-   **Elo Rating Algorithm**: The Elo rating system dynamically adjusts user ratings based on the outcome of interactions (likes/dislikes). Higher Elo ratings indicate more favorable matches.

Example Elo rating formula used:
\[ R\_{new} = R + K \times (\text{score} - E) \]
Where:

-   \( R \) is the current Elo rating.
-   \( K \) is the constant factor (usually 32).
-   \( \text{score} \) is 1 for a win (like) or 0 for a loss (dislike).
-   \( E \) is the expected score, calculated as:
    \[ E = \frac{1}{1 + 10^{(R\_{opponent} - R) / 400}} \]

This system ensures users who give/receive many likes or dislikes are ranked higher or lower accordingly, which improves matchmaking quality over time.

## Contributing

If you'd like to contribute to Angelite Buddy, feel free to fork the repository and submit a pull request. We welcome contributions to improve the algorithms, UI/UX, or any other aspect of the project.

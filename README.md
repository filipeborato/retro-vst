# Retro VST Effects – Create React App

This project started with [Create React App](https://github.com/facebook/create-react-app), but has evolved into a real-time audio effects platform, integrating login functionality, a secure backend, plugin and parameter handling.

## General Project Structure

- **src/**
- **components/**
  - **Navbar.js**: Navigation bar with username, credits and login/logout button.
  - **PluginGrid.js**: Displays the list of available plugins.
  - **PluginModal.js**: Modal to display and manipulate parameters of a specific plugin. Includes:
    - Audio file upload.
    - Parameters (sliders, toggles and selects) with labels for the user.
    - Preview and Process buttons with loading state.
    - Integration with backend to send file and parameters.
  - **LoginModal.js**: Modal for login and signup, displaying authentication errors and using token for /profile route.
  - **WaveformSelector.js** (optional): Display and selection of audio preview point.
  - **Plugin.json**: Plugin configuration file. Each plugin has:
    - **id**: identifier.
    - **label**: display text (e.g. “Filter Stereo”, “The Function”).
    - **name**: identifier for the backend (e.g. “filter-stereo”).
    - **description**: descriptive text.
    - **parameters**: array of parameters (sliders, toggles, selects) with fields { name, type, min, max, defaultValue, ... }. - **styles/**: CSS files for styling (Navbar.css, PluginModal.css, etc.).
  - **App.js**: Main component.
  - Manages global state (user profile, selected plugins, etc.).
  - Calls LoginModal, PluginModal, etc.

  - **public/**: Public folder with index.html.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the application in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view in the browser.

The page reloads when you make changes to the code.\
You will also see lint errors in the console.

### `npm test`

Starts the test runner in interactive observation mode.\
See the [running tests](https://facebook.github.io/create-react-app/docs/running-tests) section for more information.

### `npm run build`

Builds the application for production in the `build` folder.\
Properly packages React in production mode and optimizes for better performance.

Files are minified and names include hashes.\
Your application is ready to deploy!

See the [deployment](https://facebook.github.io/create-react-app/docs/deployment) section for more information.

### `npm run eject`

**Warning: this is a one-way operation. Once you eject, you can’t go back!**

If you’re not happy with your build and tooling setup, you can run eject at any time. This command will remove the single build dependency from your project.

After that, all configuration files and transitive dependencies (webpack, Babel, ESLint, etc.) will be copied directly into your project, giving you full control. At this point, you’re on your own.

You never need to use eject. The feature set provided by Create React App is good for small to medium deployments, and you shouldn’t feel obligated to use it. However, it’s there for when you need to customize your setup.

## Main Project Features

1. **Login/Signup with Token and /profile Route**:
- When logging in or signing up, the user receives a token.\
- The token is stored in cookies (or localStorage) for subsequent requests.\
- Use of protected `/profile` route to retrieve user data (e.g. name and balance).

2. **Dynamic Navbar**:
- Displays user data (name, credits) and the logout button if the user is logged in.\
- Displays "Guest" and the "Login / Signup" button if there is no profile loaded.

3. **PluginGrid**:
- List of plugins (read from `Plugin.json`).\
- Each plugin has `id`, `label` (for display), `name` (for the backend), `description` and a list of `parameters`.

4. **PluginModal**:
- When clicking on a plugin in the grid, opens a modal.
- Displays title (`plugin.label` field) and description (`plugin.description`).
- Lists parameters:
- **Sliders** with range (min, max, step).\
- **Toggles** (ON/OFF).\
- **Selects** with options.
- Allows upload of an audio file (with extension and size validations).
- When the user clicks **Preview** or **Process**:
- Blocks the interface with `isLoading=true`.\
- Normalizes slider values ​​(0..1) if necessary or sends directly.
- Assembles query string using `encodeURIComponent(param.name)=value`.\
- Sends the file to the backend.
- Upon receiving the response (blob), starts downloading the resulting file.
- Displays success or error alerts.

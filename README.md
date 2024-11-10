# Tweak App

Welcome to the Tweak App repository! This guide will help you get started with setting up the app on your local machine and running it on an iOS simulator.

## Prerequisites

- [Node.js](https://nodejs.org) version 20 or greater installed on your system.
- [Xcode](https://developer.apple.com/xcode/) version 15.3 installed for running the iOS simulator.
- [npm](https://www.npmjs.com/) (usually comes with Node.js).

## Installation Steps

1. **Clone the Repository**

   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/woolner/tweak-app
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd tweak-app
   ```

3. **Install Dependencies**

   Install all the necessary packages by running:

   ```bash
   npm install
   ```

4. **Run Tests in Watch Mode**

   To run tests in watch mode, use the following command:

   ```bash
   npm run test:watch
   ```

5. **Run the iOS Application**

   To launch the app in an iOS simulator, run the following command:

   ```bash
   npm run ios
   ```

6. **Temporary Database Setup**
   The first time the app is loaded, the migrations and DB seeds will run. Reload the simulator to see the database populated.

## Additional Notes

- Ensure Xcode is installed and properly configured for running the iOS simulator.
- If you encounter any errors during the installation or running steps, please check the logs for details, and ensure all dependencies are up to date.

## Still Todo

1. **Finish Timed Fading Between Looks**

   - Currently working on fading sACN output between levels
   - Next, add fading for fixtures levels/styling colors to UI

2. **Complete Control Panel**

- Ensure all buttons in control panel work.
- Consider refactoring to simplify (Remove CommandLineService?)
- Add error handling

3. **Handle Tint and Other Color Details**

4. **Scene Creation and Deletion**

   - Add ability to create and delete Scenes

5. **Add Documentation**

   - Docs to help end users setup and use app
   - Docs for developers to understand functionality

6. **Draggable Fixture Icons**

   - Layout area fixture canvas, should use icons and that can be dragged and dropped

7. **Seed Database with the most common fixtures and profiles**

8. **Implement Undo/Redo**
   - Be able to undo recorded looks
   - Be able to uno fixture output levels

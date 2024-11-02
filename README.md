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
   Once the app is up and running, press the "Run Migrations" button, followed by the "Seed Database" button to load the lighting fixtures.

## Additional Notes

- Ensure Xcode is installed and properly configured for running the iOS simulator.
- If you encounter any errors during the installation or running steps, please check the logs for details, and ensure all dependencies are up to date.

## Contributing

Feel free to submit pull requests or open issues if you find any bugs or have suggestions for new features.

## License

This project is licensed under the MIT License.

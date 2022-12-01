# How to run `example` app. 
Clone the git repo:
```sh
# Clone repo
git clone https://github.com/xtravision-ai/xtravision-react-native.git
# Jump in to repo
cd xtravision-react-native
# Install all dependencies and build the package 
yarn
# Now jump into example folder to start testing
cd example
```

Do the below changes in App.tsx manually (example/src/App.tsx):  
```java
// Your Auth Token
const authToken = '_AUTH_TOKEN_';
// assessment name you want to test
const assessmentName = '_ASSESSMENT_NAME_'; // Plz refer Assessment list 
const cameraPosition = 'back'; // Device camera back or front
```

Once above changes are completed then you can run below command in `example` directory.
```sh
# Install all dependencies and build the package 
yarn
# It will start your metro server (to see live logs), create android build and install in your connected Android Phone. Plz make sure your phone is already connected with your laptop with usb debugging mode. (Check with `adb devices` command)  
yarn run android
```
 



### Assessment List:
- [Please refer this link] (https://github.com/xtravision-ai/xtravision-react-native#assessment-list)


-------

## Note:
- Sometimes build will not work, then you need to clean android project using below command in example directory
```sh
cd android && ./gradlew clean
# back to to root dir and create android build
cd .. && yarn run android
```

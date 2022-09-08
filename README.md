# xtravision-react-native

React Native SDK for XtraVision

# What is XtraVision-react?

It is an sdk for fitness related data assessments like calories, rep-count, yoga pose-matching etc

# Example

[Example](https://github.com/xtravision-ai/xtravision-react-native/tree/main)

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
const AUTH_TOKEN = '_AUTH_TOKEN_';
// assessment name you want to test
const ASSESSMENT = '_ASSESSMENT_NAME_'; // Plz refer Assessment list 
```

Once above changes are completed then you can run below command in `example` directory.
```sh
# Install all dependencies and build the package 
yarn
# It will start your metro server (to see live logs), create android build and install in your connected Android Phone. Plz make sure your phone is already connected with your laptop with usb debugging mode. (Check with `adb devices` command)  
yarn run android
```

After successful installation, you can see Xtra Server response in metro server terminal. 

### Assessment List
1. PUSH_UPS
2. SIT_UPS
3. V_SIT_AND_REACH
4. STANDING_BROAD_JUMP

-------

## Note:
- Change Camera as per your need:  
```java
  //Camera front or back
  const device = devices.back; // devices.back
```
- Sometimes build will not work, then you need to clean android project using below command in example directory
```sh
cd android && ./gradlew clean
# back to to root dir and create android build
cd .. && yarn run android
```

# For Standing Broad Jump 

set the height variable in the code
turn off auto rotation, turn it right and use the red dot on the screen as the starting point


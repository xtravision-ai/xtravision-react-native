
export const CameraPermissionStatus = { 
    // Your app is authorized to use said permission.
    AUTHORIZED:'granted',
    // Your app has not yet requested permission from the user
    NOT_DETERMINED: "not-determined",
    // Your app has already requested permissions from the user, but was explicitly denied. You cannot use the request functions again, but you can use the Linking API to redirect the user to the Settings App where he can manually grant the permission.
    DENIED: "denied",
    // (iOS only) Your app cannot use the Camera or Microphone because that functionality has been restricted, possibly due to active restrictions such as parental controls being in place.
    RESTRICTED: "restricted" 
}

export const CameraPosition = { 
    FRONT:"front",
    BACK: "back",
}
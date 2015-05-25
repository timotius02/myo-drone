#Myo-Drone
A Node.js script that allows the Myo armband to control the AR Drone.
Requirements: [Myo Connect](https://developer.thalmic.com/downloads)

To run script, clone repo and run:
```shell
npm install
```
###Keys:
*ctrl + 'c' : exits the program
*'l' : lands the drone and locks armband
*'d' : disables emergency

###Gestures:
*Double Tap (if locked) : unlock
*Fist : takeoff
*Fingers Spread : reset zero position

###Movements:
*Move Up/Down : Drone moves up/down
*Twist Left/Right : Drone moves left/right
*Move Hand Left : Drone moves back
*Move Hand Right : Drone moves forward
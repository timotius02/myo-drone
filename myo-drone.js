var arDrone = require('ar-drone');
var Myo = require('myo');
var keypress = require('keypress');

var client = arDrone.createClient();
var myMyo = Myo.create();

keypress(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', function(ch, key) {
    // press ctrl + c to exit the program
    if (key && key.ctrl && key.name == 'c') {
        process.exit();
    }
    // press 'l' to land
    else if (key.name == 'l') {
        console.log("landing");
        client.land();
        take_command = false;
    }
    // press 'd' to exit emergency state
    else if (key.name == 'd') {
        client.disableEmergency();
        console.log("disable emergency");
    }
});

var take_command = false;
var curAngles;
// speeds can be anything between 0 and 1
var yawSpeed = 0.5;
var pitchSpeed = 0.5;
var rollSpeed = 0.5;



var getAngles = function(orientation) {
    // gives us the roll, pitch, and yaw
    var values = {
        roll: Math.atan2(2.0 * (orientation.w * orientation.x + orientation.y * orientation.z), 1.0 - 2.0 * (orientation.x * orientation.x + orientation.y * orientation.y)),
        pitch: Math.asin(Math.max(-1.0, Math.min(1.0, 2.0 * (orientation.w * orientation.y - orientation.z * orientation.x)))),
        yaw: Math.atan2(2.0 * (orientation.w * orientation.z + orientation.x * orientation.y), 1.0 - 2.0 * (orientation.y * orientation.y + orientation.z * orientation.z))
    };
    return values;

};

console.log("begin");
myMyo.on('connected', function() {
    console.log("connected");
    myMyo.setLockingPolicy('none');
});


myMyo.on('disconnect', function() {
    console.log("disconnect");
});

myMyo.on('pose', function(pose_name, edge) {
    if (edge) {
        if (pose_name === 'fist') {
            client.disableEmergency(); // in case drone crashed on previous run
            client.takeoff();
            take_command = true;
            myMyo.zeroOrientation();
            console.log("taking flight");
        } 

        else if (pose_name === 'thumb_to_pinky') {
            take_command = false;
            client.land();
            console.log("landing");
        } 

        else if(pose_name === 'fingers_spread') {
            myMyo.zeroOrientation();
            console.log("position reset");
        }
    }

});

myMyo.on('orientation', function(frame) {
    if (take_command === true) {
        curAngles = getAngles(frame);

        var pitchAbs = Math.abs(curAngles.pitch);
        var yawAbs = Math.abs(curAngles.yaw);
        var rollAbs = Math.abs(curAngles.roll);

        if (pitchAbs * 10 > 1 && pitchAbs > yawAbs) {
            if (curAngles.pitch > 0) {
                console.log("down");
                client.down(pitchSpeed);
            } else {
                console.log("up");
                client.up(pitchSpeed);
            }
          
        } else if (yawAbs * 10 > 1 && yawAbs > pitchAbs) {
            if (curAngles.yaw > 0) {
                console.log("back");
                client.back(yawSpeed);
            } else {
                console.log("front");
                client.front(yawSpeed);
            }
        } else if (Math.abs(curAngles.roll) > 1) {
            if (curAngles.roll  > 0) {
                console.log("right");
                client.right(rollSpeed);
            } else {
                console.log("left");
                client.left(rollSpeed);
            }
        } else {
            // console.log("stop");
            client.stop();
        }
    }
});

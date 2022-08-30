const Gpio = require('pigpio').Gpio;
const get_distance = require("./distance.js").get_distance
const gpio_set_angle = require("./servo.js").gpio_set_angle

const pan_servo = new Gpio(1, { mode: Gpio.OUTPUT });
const tilt_servo = new Gpio(2, { mode: Gpio.OUTPUT });

const min_pan = 70;
const max_pan = 180 - min_pan;

const min_tilt = 30;
const max_tilt = 70;

const pixel_size = 10;

let pan_angle = min_pan;
let tilt_angle = min_tilt;

let pan_angle_v = 2; // 1
let tilt_angle_v = 2; // 1


let start_time = (new Date()).getTime();



let scan = {};

let Canvas = require('canvas');
console.log(Canvas)
canvas = new Canvas.Canvas((max_pan - min_pan) / pan_angle_v * pixel_size, (max_tilt - min_tilt) / tilt_angle_v * pixel_size);
ctx = canvas.getContext('2d');

let min_d = 1000000;
let max_d = -1000000;

let tick = async () => {
    pan_angle += pan_angle_v;
    if (pan_angle > max_pan) {
        pan_angle_v *= -1;
        pan_angle += pan_angle_v;
        tilt_angle += tilt_angle_v;
    }
    if (pan_angle < min_pan) {
        pan_angle_v *= -1;
        pan_angle += pan_angle_v;
        tilt_angle += tilt_angle_v;
    }



    gpio_set_angle(pan_servo, pan_angle)
    gpio_set_angle(tilt_servo, tilt_angle)

    let d = await get_distance(trigger, echo)

    max_d = Math.max(d, max_d);
    min_d = Math.min(d, min_d);

    if (!scan[pan_angle]) scan[pan_angle] = {};
    scan[pan_angle][tilt_angle] = d;


    if (tilt_angle > max_tilt) {


        for (const x_pan in scan) {
            let x = (x_pan - min_pan) / Math.abs(pan_angle_v);

            for (const y_tilt in scan[x_pan]) {
                let y = (y_tilt - min_tilt) / Math.abs(tilt_angle_v);
                // console.log(min_pan, x_pan, x)
                // console.log(min_tilt, y_tilt, y)

                let c = distance_to_color(scan[x_pan][y_tilt], min_d, max_d)
                console.log(pixel_size * x, pixel_size * y, c)
                ctx.fillStyle = c
                ctx.fillRect(pixel_size * x, pixel_size * y, pixel_size, pixel_size)
            }
        }


        console.log("DONE!")
        console.log(canvas.toDataURL())
    } else {

        let p = (tilt_angle - min_tilt) / (max_tilt - min_tilt)

        let current_time = (new Date()).getTime()
        let elapsed_time = current_time - start_time;
        console.log(elapsed_time / 1000 + "s elapsed")
        console.log((p * 100).toFixed(2) + "%; ETA: " + (((elapsed_time / (p)) - elapsed_time) / 1000).toFixed(2) + "s")
        setTimeout(tick, 10);
    }
}



function distance_to_color(d, min, max) {
    console.log(d, min, max)
    let normalized = (d - min) / (max - min);
    return rgbToHex(normalized * 255, 0, 255 - normalized * 255)
}

function rgbToHex(r_, g_, b_) {
    let r = Math.min(0xff, r_.toFixed(0))
    let g = Math.min(0xff, g_.toFixed(0))
    let b = Math.min(0xff, b_.toFixed(0))

    hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}


let test = false;
if (test) {

    for (let i = 0; i < 100; i++) {
        console.log(distance_to_color(i, 0, 100))
    }

} else {
    gpio_set_angle(pan_servo, pan_angle)
    gpio_set_angle(tilt_servo, tilt_angle)



    setTimeout(tick, 1000);

}

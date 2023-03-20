const fs = require("fs")

const Gpio = require('pigpio').Gpio;
const get_distance = require("./distance.js").get_distance
const gpio_set_angle = require("./servo.js").gpio_set_angle

const pan_servo = new Gpio(1, { mode: Gpio.OUTPUT });
const tilt_servo = new Gpio(2, { mode: Gpio.OUTPUT });

const min_pan = 60;
const max_pan = 180 - min_pan;

const min_tilt = 30;
const max_tilt = 70;

const read_precision = 40;


const pan_angle_v = 1; // 1
const tilt_angle_v = 1; // 1

let start_time = (new Date()).getTime();



async function main() {
    console.log("main start")
    {
        let v_scan = [];

        let x = -1;
        let y = -1;
        for (let pan_angle = min_pan; pan_angle < max_pan; pan_angle += pan_angle_v) {
            x++;

            y = -1;
            for (let tilt_angle = min_tilt; tilt_angle < max_tilt; tilt_angle += tilt_angle_v) {
                y++;
                // console.log("v_scan:", x, y)

                gpio_set_angle(pan_servo, pan_angle)
                gpio_set_angle(tilt_servo, tilt_angle)
                if (y == 0) await new Promise((r) => setTimeout(r, 400))

                let d = await get_distance(read_precision)
                // console.log(d)

                if (v_scan[x] == undefined)
                    v_scan[x] = [];
                v_scan[x][y] = d;
            }
            let p = (pan_angle + pan_angle_v - min_pan) / (max_pan - min_pan)
            p = p / 2
            let current_time = (new Date()).getTime()
            let elapsed_time = current_time - start_time;
            // console.log(elapsed_time / 1000 + "s elapsed")
            console.log((p * 100).toFixed(2) + "%; ETA: " + (((elapsed_time / (p)) - elapsed_time) / 1000).toFixed(2) + "s | " + (((elapsed_time / (p)) - elapsed_time) / 1000 / 60).toFixed(2) + "m")
        }



        fs.writeFileSync("v_scan.json", JSON.stringify(v_scan));
    }
    {

        let h_scan = [];

        let x = -1;
        let y = -1;


        for (let tilt_angle = min_tilt; tilt_angle < max_tilt; tilt_angle += tilt_angle_v) {

            y++;
            x = -1;
            for (let pan_angle = min_pan; pan_angle < max_pan; pan_angle += pan_angle_v) {
                x++;
                // console.log("h_scan:", x, y)

                gpio_set_angle(pan_servo, pan_angle)
                gpio_set_angle(tilt_servo, tilt_angle)
                if (x == 0) await new Promise((r) => setTimeout(r, 400))

                let d = await get_distance(read_precision)
                // console.log(d)

                if (h_scan[x] == undefined)
                    h_scan[x] = [];

                h_scan[x][y] = d;
            }
            let p = (tilt_angle + tilt_angle_v - min_tilt) / (max_tilt - min_tilt)
            p = 0.5 + p / 2
            let current_time = (new Date()).getTime()
            let elapsed_time = current_time - start_time;
            // console.log(elapsed_time / 1000 + "s elapsed")
            console.log((p * 100).toFixed(2) + "%; ETA: " + (((elapsed_time / (p)) - elapsed_time) / 1000).toFixed(2) + "s")
        }



        fs.writeFileSync("h_scan.json", JSON.stringify(h_scan));
    }


    console.log("DONE!");
}


let test = false;
if (test) {

    for (let i = 0; i < 100; i++) {
        console.log(distance_to_color(i, 0, 100))
    }

} else {
    gpio_set_angle(pan_servo, min_pan)
    gpio_set_angle(tilt_servo, min_tilt)
    setTimeout(main, 1000);
}

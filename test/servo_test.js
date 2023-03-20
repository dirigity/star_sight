const Gpio = require('pigpio').Gpio;

const servo = new Gpio(1, { mode: Gpio.OUTPUT });
const gpio_set_angle = require("./../servo").gpio_set_angle;


let tick = async () => {
    let a = 90 * (1 + Math.sin((new Date().getTime()) / 10000))
    gpio_set_angle(servo, a);
    console.log(a)
}

setInterval(tick, 10);

// setInterval(() => {
//     gpio_set_angle(servo, 0);

// }, 100); 
const Gpio = require('pigpio').Gpio;

const servo = new Gpio(2, { mode: Gpio.OUTPUT });

function angle_to_dt(angle) {
    return (500 + 2000 * angle / 180).toFixed(0);
}

function gpio_set_angle(gpio, angle) {
    let dt = angle_to_dt(angle);

    if (gpio.sleep_timer) {
        clearTimeout(gpio.sleep_timer);
    }

    gpio.servoWrite(dt)
    gpio["sleep_timer"] = setTimeout(() => {
        gpio.servoWrite(0)
    }, 500)
}


let tick = async () => {
    let a = 90 * (1 + Math.sin((new Date().getTime()) / 10000))
    gpio_set_angle(servo, a);
    console.log(a)
}

setInterval(tick, 10);

// setInterval(() => {
//     gpio_set_angle(servo, 0);

// }, 100); 
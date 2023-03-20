const Gpio = require('pigpio').Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

const trigger = new Gpio(4, { mode: Gpio.OUTPUT });
const echo = new Gpio(3, { mode: Gpio.INPUT, alert: true });

async function get_distance(read_precision) {
    let d = [];
    for (let i = 0; i < read_precision; i++) {
        d.push(await read_distance())
    }

    d.sort((a, b) => a - b)

    return d
}

let ret = null;

async function read_distance() {

    // await new Promise((r) => setTimeout(r, 1000))

    // console.log("trigg high")

    trigger.digitalWrite(0);
    trigger.trigger(10, 1)
    return await new Promise((r) => {

        let retry = setTimeout(async () => {

            console.log("pulse timeout")
            let d = await read_distance()
            r(d)
        }, 3000)
        ret = (e) => {
            clearTimeout(retry)
            r(e)
        };
    })
}

echo.on('alert', (level, tick) => {
    // console.log("echo back")
    if (level == 1) {
        startTick = tick;
    } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        ret(diff / 2 / MICROSECDONDS_PER_CM);
    }
});

module.exports = {
    "get_distance": get_distance
}

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

const trigger = new Gpio(4, { mode: Gpio.OUTPUT });
const echo = new Gpio(3, { mode: Gpio.INPUT, alert: true });
const read_precision = 10;

async function get_distance() {
    let d = [];
    for (let i = 0; i < read_precision; i++) {
        d.push(await read_distance())
    }

    d.sort()

    return d[Math.floor(read_precision / 2)]
}

function read_distance() {
    trigger.digitalWrite(0);
    trigger.trigger(10, 1)
    return new Promise((r) => {
        echo.on('alert', (level, tick) => {
            if (level == 1) {
                startTick = tick;
            } else {
                const endTick = tick;
                const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
                r(diff / 2 / MICROSECDONDS_PER_CM);
            }
        });
    })
}

module.exports = {
    "get_distance": get_distance
}
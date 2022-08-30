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

module.exports = {
    "gpio_set_angle": gpio_set_angle
}
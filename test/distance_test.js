const get_distance = require("../distance").get_distance;

let tick = async () => {
    console.log("d: ", (await get_distance(1)))
    setTimeout(tick, 10);
}

tick();
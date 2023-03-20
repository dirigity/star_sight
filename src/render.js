const Canvas = require("canvas")
const fs = require("fs")

const pixel_size = 10;

const ERROR = -1;
const ERROR_COL = "#FF00FF";

const discrimination_factor = 0.01;
const max_err = 1000;

function distance_to_color(d, min, max) {
    if (d == ERROR) {
        return ERROR_COL
    }
    // console.log(d, min, max)
    let normalized = Math.min(1, Math.max(0, 1 - ((d - min) / (max - min))));
    return rgbToHex(normalized * 255, normalized * 255, normalized * 255)
}


function get_value(arr) {
    arr.sort((a, b) => a - b)
    if (Math.abs(arr[0] - arr[arr.length - 1]) > max_err) {
        return ERROR
    }
    if (arr.length > 6)
        arr.slice(2, -2)


    // return arr[Math.floor(arr.length / 2)]

    let ret = 0;
    for (let d of arr) {
        ret += d;
    }

    ret /= arr.length;

    return ret;

}

function main(pre) {

    const scan = JSON.parse(fs.readFileSync(pre + "scan.json"))

    canvas = new Canvas.Canvas(scan.length * pixel_size, scan[0].length * pixel_size);
    ctx = canvas.getContext('2d');



    let buffer = [];

    let planar_buff = [];
    for (const x in scan) {
        for (const y in scan[x]) {
            d = get_value(scan[x][y])
            if (d != ERROR) {
                planar_buff.push(d);
            }
            if (buffer[x] == undefined) buffer[x] = []
            buffer[x][y] = d;
        }
    }

    planar_buff.sort((a, b) => a - b)
    const discrimination = Math.floor(planar_buff.length * discrimination_factor);

    let min_d = planar_buff[discrimination];
    let max_d = planar_buff[planar_buff.length - 1 - discrimination];

    for (const x in buffer) {
        for (const y in buffer[x]) {
            const d = buffer[x][y];
            const c = distance_to_color(d, min_d, max_d)

            ctx.fillStyle = c
            ctx.fillRect(pixel_size * (scan.length - x), pixel_size * (scan[0].length - y), pixel_size, pixel_size)
        }
    }


    console.log("DONE!")
    fs.writeFileSync(pre + "render.txt", canvas.toDataURL())
}

function rgbToHex(r_, g_, b_) {
    let r = Math.min(0xff, r_.toFixed(0))
    let g = Math.min(0xff, g_.toFixed(0))
    let b = Math.min(0xff, b_.toFixed(0))

    hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}


main("v_");
main("h_");
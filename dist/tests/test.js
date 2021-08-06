"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const svg2img = require("svg2img");
async function testOne(filename, density = [300, 400, 500], offset) {
    const svg = await promises_1.readFile(path_1.resolve(__dirname, `./${filename}`), "utf8");
    density.forEach((densite, index) => {
        const pattern = index_1.default(svg, 1600, 1200, densite, offset);
        svg2img(pattern, { width: 1600, height: 1200 }, function (err, img) {
            promises_1.writeFile(path_1.resolve(__dirname, `./generateSvgs/jpg/${filename.slice(0, filename.length - 4)}_densite-${index + 1}.jpg`), img);
        });
    });
}
testOne("mouth.svg", [300], { x: 50, y: 50 });
//# sourceMappingURL=test.js.map
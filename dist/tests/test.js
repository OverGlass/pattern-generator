"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const svg2img = require("svg2img");
const svgToImg = require("svg-to-img");
async function testOne(filename, density = [300, 400, 500], offset) {
    density.forEach(async (densite, index) => {
        const pattern = index_1.default(filename, 1600, 1200, densite, offset);
        await svgToImg.from(pattern).toJpeg({
            width: 1600,
            height: 1200,
            path: path_1.resolve(__dirname, `./${filename.split("/").slice(-1)[0]}-density-${index}.jpg`),
        });
    });
}
const last = (arr) => arr[arr.length - 1];
(async () => {
    const mouth = path_1.resolve(__dirname, "./camo_enfant_1.svg");
    const wolf = path_1.resolve(__dirname, "./n121.image.01.png");
    const date = new Date();
    const pattern = index_1.default(mouth, 1600, 1200, 500);
    console.log(`${new Date() - date}ms`);
    try {
        svg2img(pattern, {
            width: 1600,
            height: 1200,
        }, async (err, img) => {
            try {
                await promises_1.writeFile(path_1.resolve(__dirname, `./test.jpg`), img);
            }
            catch (e) {
                console.log(err, e);
            }
        });
    }
    catch (e) {
        console.log(e);
    }
})();
//# sourceMappingURL=test.js.map
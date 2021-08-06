"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const svg2img = require("svg2img");
async function testOne(filename, density = [300, 400, 500]) {
    const svg = await promises_1.readFile(path_1.resolve(__dirname, `./${filename}`), "utf8");
    density.forEach((densite, index) => {
        const pattern = index_1.default(svg, 1600, 1200, densite);
        svg2img(pattern, { width: 1600, height: 1200 }, function (err, img) {
            promises_1.writeFile(path_1.resolve(__dirname, `./generateSvgs/jpg/${filename.slice(0, filename.length - 4)}_densite-${index + 1}.jpg`), img);
        });
    });
}
async function testAll() {
    const svgFiles = (await promises_1.readdir(path_1.resolve(__dirname, "./"))).filter(file => file.endsWith(".svg"));
    console.log(svgFiles);
    svgFiles.forEach(async (file) => {
        testOne(file);
    });
}
testOne("nageur_2.svg");
//# sourceMappingURL=test.js.map
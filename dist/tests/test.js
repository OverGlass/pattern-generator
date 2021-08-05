"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const svg2img = require("svg2img");
(async () => {
    const svgFiles = (await promises_1.readdir(path_1.resolve(__dirname, "./"))).filter(file => file.endsWith(".svg"));
    console.log(svgFiles);
    svgFiles.forEach(async (file) => {
        const svg = await promises_1.readFile(path_1.resolve(__dirname, `./${file}`), "utf8");
        [300, 400, 500].forEach((densite, index) => {
            const pattern = index_1.default(svg, 1600, 1200, densite);
            svg2img(pattern, { width: 1600, height: 1200 }, function (err, img) {
                promises_1.writeFile(path_1.resolve(__dirname, `./generateSvgs/jpg/${file.slice(0, file.length - 4)}_densite-${index + 1}.jpg`), img);
            });
        });
    });
})();
//# sourceMappingURL=test.js.map
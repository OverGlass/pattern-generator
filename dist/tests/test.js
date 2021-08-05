"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const promises_1 = require("fs/promises");
const path_1 = require("path");
(async () => {
    const svgFiles = (await promises_1.readdir(path_1.resolve(__dirname, "./"))).filter(file => file.endsWith(".svg"));
    console.log(svgFiles);
    svgFiles.forEach(async (file) => {
        const svg = await promises_1.readFile(path_1.resolve(__dirname, `./${file}`), "utf8");
        const pattern = index_1.default(svg, 800, 800, 50);
        await promises_1.writeFile(path_1.resolve(__dirname, `./generateSvgs/${file}`), pattern);
    });
})();
//# sourceMappingURL=test.js.map
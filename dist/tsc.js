define("index", ["require", "exports", "fs/promises"], function (require, exports, promises_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makePattern = void 0;
    async function makePattern(path, width, height, offset = { x: 0, y: 0 }) {
        const pattern = await getSvg(path);
        const patternSize = getSvgSize(pattern);
        const b64 = convertSvgToBase64(pattern);
        const coords = calcCoords(patternSize, {
            width,
            height,
        }, offset);
        const generatePattern = coords.map(coord => createImageSvgTag(b64, coord, patternSize));
        const newSvg = createNewSvg(width, height, generatePattern.join("\n"));
        return newSvg;
    }
    exports.makePattern = makePattern;
    async function getSvg(path) {
        return await promises_1.readFile(path, "utf8");
    }
    function getSvgSize(svg) {
        const regex = /<svg[^>]*viewBox="([^"]*)"/;
        const viewBox = regex.exec(svg)[1].split(/\s+/);
        return {
            width: Number(viewBox[2]),
            height: Number(viewBox[3]),
        };
    }
    function convertSvgToBase64(svg) {
        const b64 = Buffer.from(svg).toString("base64");
        return `data:image/svg+xml;base64,${b64}`;
    }
    function calcCoords(patternSize, newSvgSize, offset) {
        const { width, height } = patternSize;
        const { width: newWidth, height: newHeight } = newSvgSize;
        const nbOfColumn = Math.floor((newWidth + width) / (width - offset.x));
        const nbOfRow = Math.floor((newHeight + height) / (height - offset.y));
        const coords = [...Array(nbOfRow).keys()]
            .reduce((acc, y) => {
            return [
                ...acc,
                [...Array(nbOfColumn).keys()].map(i => ({
                    x: i * width +
                        (i == 0 ? 0 : -offset.x * i) +
                        -offset.x,
                    y: height * y +
                        (y == 0 ? 0 : -offset.y * y) +
                        -offset.y,
                })),
            ];
        }, [])
            .flat();
        return coords;
    }
    function createNewSvg(width, height, content) {
        return `
    <svg version="1.1"
      baseProfile="full"
      width="${width}px" height="${height}px"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>

  `;
    }
    function createImageSvgTag(base64Svg, coords, sizes) {
        return `
    <image 
      x="${coords.x}" 
      y="${coords.y}" 
      width="${sizes.width}" 
      height="${sizes.height}" 
      xlink:href="${base64Svg}"/>
  `;
    }
});
define("tests/test", ["require", "exports", "index", "fs/promises"], function (require, exports, index_1, promises_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const pattern = await index_1.makePattern("./test.svg", 3000, 3000);
    await promises_2.writeFile("./test.svg", pattern);
});
//# sourceMappingURL=tsc.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgo_1 = require("svgo");
function makePattern(svg, width, height, patternWidth = 500) {
    const pattern = svgo_1.optimize(svg).data;
    const patternSize = getSvgSize(pattern, patternWidth);
    const b64 = convertSvgToBase64(pattern);
    const coords = calcCoords(patternSize, {
        width,
        height,
    });
    const generatePattern = coords.map(coord => createImageSvgTag(b64, coord, patternSize));
    const newSvg = createNewSvg(width, height, generatePattern.join("\n"));
    return svgo_1.optimize(newSvg).data;
}
exports.default = makePattern;
function getSvgSize(svg, patternWidth) {
    const regex = /<svg[^>]*viewBox="([^"]*)"/;
    const viewBox = regex.exec(svg);
    if (!viewBox)
        throw Error(`Cannot find viewBox in svg`);
    const viewBoxArr = viewBox[1].split(/\s+/).map(Number);
    return {
        width: patternWidth,
        height: (viewBoxArr[3] * patternWidth) / viewBoxArr[2],
    };
}
function convertSvgToBase64(svg) {
    const b64 = Buffer.from(svg).toString("base64");
    return `data:image/svg+xml;base64,${b64}`;
}
function calcCoords(patternSize, newSvgSize) {
    const { width, height } = patternSize;
    const { width: newWidth, height: newHeight } = newSvgSize;
    const nbOfColumn = Math.floor((newWidth + width) / width);
    const nbOfRow = Math.floor((newHeight + height) / height);
    const coords = [...Array(nbOfRow).keys()]
        .map(y => {
        return [...Array(nbOfColumn).keys()].map(i => ({
            x: i * width - width / 2 - (i === 0 ? 0 : +1 * i),
            y: y * height -
                height / 2 -
                (y === 0 ? 0 : +1.5 * y),
        }));
    })
        .flat();
    return coords;
}
function createNewSvg(width, height, content) {
    return `
    <svg version="1.1"
      baseProfile="full"
      width="100%" height="100%"
      viewBox="0 0 ${width} ${height}"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <rect id="rect" width="100%" height="100%" fill="none" />
        <clipPath id="clip">
            <use xlink:href="#rect"/>
        </clipPath>
      </defs>
      <use xlink:href="#rect"/>
      <g clip-path="url(#clip)">
        ${content}
      </g>
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
//# sourceMappingURL=index.js.map
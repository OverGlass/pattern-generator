"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makePattern(svg, width, height, offset = { x: 0, y: 0 }) {
    const pattern = svg;
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
exports.default = makePattern;
function getSvgSize(svg) {
    const regex = /<svg[^>]*viewBox="([^"]*)"/;
    const viewBox = regex.exec(svg);
    if (!viewBox)
        throw Error(`Cannot find viewBox in svg`);
    const viewBoxArr = viewBox[1].split(/\s+/).map(Number);
    return {
        width: 500,
        height: (viewBoxArr[3] * 500) / viewBoxArr[2],
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
        .map(y => {
        return [...Array(nbOfColumn).keys()].map(i => ({
            x: i * width +
                (i == 0 ? 0 : -offset.x * i) +
                -offset.x,
            y: height * y +
                (y == 0 ? 0 : -offset.y * y) +
                -offset.y,
        }));
    })
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
//# sourceMappingURL=index.js.map
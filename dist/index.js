"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgo_1 = require("svgo");
function makePattern(svg, width, height, patternWidth = 500) {
    const pattern = svgo_1.optimize(svg).data;
    const patternSize = getSvgSize(pattern, patternWidth);
    const b64 = convertSvgToBase64(pattern);
    const newSvg = createNewSvg(width, height, createImageSvgTag(b64, patternSize));
    return newSvg;
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
      <defs>
        ${content}
      </defs>
      <use xlink:href="#rect"/>
      <g clip-path="url(#clip)">
        <rect x="0" y="0" width="100%" height="100%" fill="url(#polka-dots)"></rect>
      </g>
    </svg>

  `;
}
function createImageSvgTag(base64Svg, sizes) {
    return `
    <pattern id="polka-dots" x="0" y="0" width="${sizes.width}" height="${sizes.height}" patternUnits="userSpaceOnUse">
      <image 
        width="${sizes.width}" 
        height="${sizes.height}"
        xlink:href="${base64Svg}"/>
    </pattern>

  `;
}
//# sourceMappingURL=index.js.map
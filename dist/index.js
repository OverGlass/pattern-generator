"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgo_1 = require("svgo");
const image_size_1 = require("image-size");
const fs_1 = require("fs");
const defaultOptions = {
    patternWidth: 500,
    patternOffset: { x: 0, y: 0 },
    patternFileType: undefined,
    backgroundColor: "#fff",
};
function makePattern(path, width, height, options = defaultOptions) {
    const opt = { ...defaultOptions, ...options };
    const patternSize = getImageSize(path, opt.patternWidth);
    const coords = calcCoords(patternSize, {
        width,
        height,
    }, opt.patternOffset);
    const ext = opt.patternFileType || path.split(".").pop();
    if (!ext)
        throw Error("Cannot get file extension");
    const href = convertSvgToBase64(path, ext === "svg" ? "svg+xml" : ext);
    const generatePattern = coords.map(coord => createImageSvgTag(coord));
    const newSvg = createNewSvg(width, height, opt.backgroundColor, generatePattern.join("\n"), {
        path: href,
        sizes: patternSize,
    });
    return svgo_1.optimize(newSvg).data;
}
exports.default = makePattern;
function getImageSize(path, patternWidth) {
    const { height, width } = image_size_1.default(path);
    if (!height || !width)
        throw Error(`Cannot get image size`);
    return {
        width: patternWidth,
        height: (height * patternWidth) / width,
    };
}
function calcCoords(patternSize, newSvgSize, offset) {
    const { width, height } = patternSize;
    const { width: newWidth, height: newHeight } = newSvgSize;
    const nbOfColumn = Math.floor((newWidth + width * 2) / (width - offset.x));
    const nbOfRow = Math.floor((newHeight + height * 2) / (height - offset.y));
    const coords = [...Array(nbOfRow).keys()]
        .map(y => {
        return [...Array(nbOfColumn).keys()].map(i => ({
            x: i * width -
                width / 2 -
                (i === 0 ? 0 : offset.x * i),
            y: y * height -
                height / 2 -
                (y === 0 ? 0 : offset.y * y),
        }));
    })
        .flat();
    return coords;
}
function createNewSvg(width, height, backgroundColor, content, patternParams) {
    return `
    <svg version="1.1"
      baseProfile="full"
      width="100%" height="100%"
      viewBox="0 0 ${width} ${height}"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <rect id="rect" width="100%" height="100%" fill="${backgroundColor}" />
        <clipPath id="clip">
            <use xlink:href="#rect"/>
        </clipPath>
        <image
          id="pattern"
          width="${patternParams.sizes.width}"
          height="${patternParams.sizes.height}"
          href="${patternParams.path}"/>
      </defs>
      <use xlink:href="#rect"/>
      <g clip-path="url(#clip)">
        ${content}
      </g>
    </svg>

  `;
}
function createImageSvgTag(coords) {
    return `
      <use
        xlink:href="#pattern"
        x="${coords.x}"
        y="${coords.y}"
      />
  `;
}
function convertSvgToBase64(svg, mimeType) {
    const svgF = fs_1.readFileSync(svg, "utf-8");
    const b64 = Buffer.from(svgF).toString("base64");
    return `data:image/${mimeType};base64,${b64}`;
}
//# sourceMappingURL=index.js.map
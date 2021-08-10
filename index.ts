import { optimize } from "svgo";
import sizeOf from "image-size";
import { readFileSync } from "fs";

type sizes = {
  width: number;
  height: number;
};

type coords = {
  x: number;
  y: number;
};

export default function makePattern(
  path: string,
  width: number,
  height: number,
  patternWidth: number = 500,
  patternOffset: coords = { x: 0, y: 0 },
  backgroundColor: string = "#fff"
) {
  const patternSize = getImageSize(path, patternWidth);
  const coords = calcCoords(
    patternSize,
    {
      width,
      height,
    },
    patternOffset
  );
  const isSvg =
    path.slice(path.length - 3, path.length) === "svg";
  const href = isSvg ? convertSvgToBase64(path) : path;
  const generatePattern = coords.map(coord =>
    createImageSvgTag(href, coord, patternSize)
  );
  const newSvg = createNewSvg(
    width,
    height,
    backgroundColor,
    generatePattern.join("\n")
  );
  return optimize(newSvg).data;
}

function getImageSize(path: string, patternWidth: number) {
  const { height, width } = sizeOf(path);
  if (!height || !width)
    throw Error(`Cannot get image size`);
  return {
    width: patternWidth,
    height: (height * patternWidth) / width,
  };
}

function calcCoords(
  patternSize: sizes,
  newSvgSize: sizes,
  offset: coords
): coords[] {
  const { width, height } = patternSize;
  const { width: newWidth, height: newHeight } = newSvgSize;
  const nbOfColumn = Math.floor(
    (newWidth + width * 2) / (width - offset.x)
  );
  const nbOfRow = Math.floor(
    (newHeight + height * 2) / (height - offset.y)
  );
  const coords = [...Array(nbOfRow).keys()]
    .map(y => {
      return [...Array(nbOfColumn).keys()].map(i => ({
        x:
          i * width -
          width / 2 -
          (i === 0 ? 0 : offset.x * i),
        y:
          y * height -
          height / 2 -
          (y === 0 ? 0 : offset.y * y),
      }));
    })
    .flat();
  return coords;
}

function createNewSvg(
  width: number,
  height: number,
  backgroundColor: string,
  content: string
): string {
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
      </defs>
      <use xlink:href="#rect"/>
      <g clip-path="url(#clip)">
        ${content}
      </g>
    </svg>

  `;
}

function createImageSvgTag(
  path: string,
  coords: coords,
  sizes: sizes
) {
  return `
      <image
        x="${coords.x}"
        y="${coords.y}"
        width="${sizes.width}"
        height="${sizes.height}"
        href="${path}"/>
  `;
}

function convertSvgToBase64(svg: string) {
  const svgF = readFileSync(svg, "utf-8");
  const b64 = Buffer.from(svgF).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

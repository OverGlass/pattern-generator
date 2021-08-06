import { optimize } from "svgo";

type sizes = {
  width: number;
  height: number;
};

type coords = {
  x: number;
  y: number;
};

export default function makePattern(
  svg: string,
  width: number,
  height: number,
  patternWidth: number = 500,
  patternOffset: coords = { x: 0, y: 0 }
) {
  const pattern = optimize(svg).data;
  const patternSize = getSvgSize(pattern, patternWidth);
  const b64 = convertSvgToBase64(pattern);
  const coords = calcCoords(
    patternSize,
    {
      width,
      height,
    },
    patternOffset
  );
  const generatePattern = coords.map(coord =>
    createImageSvgTag(b64, coord, patternSize)
  );
  const newSvg = createNewSvg(
    width,
    height,
    generatePattern.join("\n")
  );
  return optimize(newSvg).data;
}

function getSvgSize(svg: string, patternWidth: number) {
  const regex = /<svg[^>]*viewBox="([^"]*)"/;
  const viewBox = regex.exec(svg);
  if (!viewBox) throw Error(`Cannot find viewBox in svg`);
  const viewBoxArr = viewBox[1].split(/\s+/).map(Number);
  return {
    width: patternWidth,
    height: (viewBoxArr[3] * patternWidth) / viewBoxArr[2],
  };
}

function convertSvgToBase64(svg: string): string {
  const b64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

function calcCoords(
  patternSize: sizes,
  newSvgSize: sizes,
  offset: coords
): coords[] {
  const { width, height } = patternSize;
  const { width: newWidth, height: newHeight } = newSvgSize;
  const nbOfColumn = Math.floor((newWidth + width) / width);
  const nbOfRow = Math.floor((newHeight + height) / height);
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

function createImageSvgTag(
  base64Svg: string,
  coords: coords,
  sizes: sizes
) {
  return `
      <image
        x="${coords.x}" 
        y="${coords.y}"
        width="${sizes.width}" 
        height="${sizes.height}"
        xlink:href="${base64Svg}"/>
  `;
}

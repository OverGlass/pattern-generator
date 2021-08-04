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

function convertSvgToBase64(svgXml) {
  const b64 = btoa(unescape(encodeURIComponent(svgXml)));
  return `data:image/svg+xml;base64,${b64}`;
}

function getSvgSize(svgXml) {
  const regex = /<svg[^>]*viewBox="([^"]*)"/;
  const viewBox = regex.exec(svgXml)[1].split(/\s+/);
  return {
    width: Number(viewBox[2]),
    height: Number(viewBox[3]),
  };
}

function createImageSvgTag(base64, coords, sizes) {
  return `
    <image x="${coords.x}" y="${coords.y}" width="${sizes.width}" height="${sizes.height}" xlink:href="${base64}"/>
  `;
}

async function getSvg(path) {
  return await Deno.readTextFile(path);
}

function calcCoords(motifSize, newSvgSize, offset) {
  const { width, height } = motifSize;
  const { width: newWidth, height: newHeight } = newSvgSize;
  const nbOfColumn = Math.floor(
    (newWidth + width) / (width - offset.x)
  );
  const nbOfRow = Math.floor(
    (newHeight + height) / (height - offset.y)
  );
  const coords = [...Array(nbOfRow).keys()]
    .reduce((acc, y) => {
      return [
        ...acc,
        [...Array(nbOfColumn).keys()].map(i => ({
          x:
            i * width +
            (i == 0 ? 0 : -offset.x * i) +
            -offset.x,
          y:
            height * y +
            (y == 0 ? 0 : -offset.y * y) +
            -offset.y,
        })),
      ];
    }, [])
    .flat();
  return coords;
}

async function makeMotif(path, width, height, offset) {
  const motif = await getSvg(path);
  const motifSize = getSvgSize(motif);
  const b64 = convertSvgToBase64(motif);
  const coords = calcCoords(
    motifSize,
    {
      width,
      height,
    },
    offset
  );
  console.log(coords);
  const generatePattern = coords.map(coord =>
    createImageSvgTag(b64, coord, motifSize)
  );
  const newSvg = createNewSvg(
    width,
    height,
    generatePattern.join("\n")
  );
  return newSvg;
}

await Deno.writeTextFile(
  "./testgen.svg",
  await makeMotif("./test.svg", 3000, 3000, {
    x: 110,
    y: 250,
  })
);

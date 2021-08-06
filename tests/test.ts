import makePattern from "../index";
import { writeFile, readFile, readdir } from "fs/promises";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
const svg2img = require("svg2img");

type coords = {
  x: number;
  y: number;
};

async function testOne(
  filename: string,
  density: number[] = [300, 400, 500],
  offset: coords
) {
  const svg = await readFile(
    resolve(__dirname, `./${filename}`),
    "utf8"
  );
  density.forEach((densite, index) => {
    const pattern = makePattern(
      svg,
      1600,
      1200,
      densite,
      offset
    );

    svg2img(
      pattern,
      { width: 1600, height: 1200 },
      function (err: any, img: any) {
        writeFile(
          resolve(
            __dirname,
            `./generateSvgs/jpg/${filename.slice(
              0,
              filename.length - 4
            )}_densite-${index + 1}.jpg`
          ),
          img
        );
      }
    );
  });
}

testOne("mouth.svg", [300], { x: 50, y: 50 });
//  makePattern(svg, 1600, 1200, 300, { x: 50, y: 50 });

import makePattern from "../index";
import { writeFile, readFile, readdir } from "fs/promises";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
const svg2img = require("svg2img");

type coords = {
  x: number;
  y: number;
};

(async () => {
  const mouth = resolve(__dirname, "./camo_enfant_1.svg");
  const wolf = resolve(__dirname, "./n121.image.01.png");

  const date = new Date();

  const pattern = makePattern(mouth, 1600, 1200, 500);

  try {
    svg2img(
      pattern,
      {
        width: 1600,
        height: 1200,
      },
      async (err: any, img: any) => {
        try {
          await writeFile(
            resolve(__dirname, `./test.jpg`),
            img
          );
        } catch (e) {
          console.log(err, e);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
  // @ts-ignore
  console.log(`${new Date() - date}ms`);
})();

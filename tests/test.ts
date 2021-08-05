import makePattern from "../index";
import { writeFile, readFile, readdir } from "fs/promises";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
const svg2img = require("svg2img");
(async () => {
  // get all the .svg files in this directory
  const svgFiles = (
    await readdir(resolve(__dirname, "./"))
  ).filter(file => file.endsWith(".svg"));
  console.log(svgFiles);

  // create a pattern from each file
  svgFiles.forEach(async file => {
    const svg = await readFile(
      resolve(__dirname, `./${file}`),
      "utf8"
    );

    [300, 400, 500].forEach((densite, index) => {
      const pattern = makePattern(svg, 1600, 1200, densite);

      svg2img(
        pattern,
        { width: 1600, height: 1200 },
        function (err: any, img: any) {
          writeFile(
            resolve(
              __dirname,
              `./generateSvgs/jpg/${file.slice(
                0,
                file.length - 4
              )}_densite-${index + 1}.jpg`
            ),
            img
          );
        }
      );
    });
  });
})();

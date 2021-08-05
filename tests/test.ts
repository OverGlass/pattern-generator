import makePattern from "../index";
import { writeFile, readFile, readdir } from "fs/promises";
import { resolve } from "path";
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

    const pattern = makePattern(svg, 3000, 3000);

    await writeFile(
      resolve(__dirname, `./generateSvgs/${file}`),
      pattern
    );
  });
})();

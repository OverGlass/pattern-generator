import makePattern from "../index";
import { writeFile, readFile } from "fs/promises";
import { resolve } from "path";
(async () => {
  const svg = await readFile(
    resolve(__dirname, "./test.svg"),
    "utf8"
  );

  const pattern = makePattern(svg, 3000, 3000);

  await writeFile(
    resolve(__dirname, "./testgen.svg"),
    pattern
  );
})();

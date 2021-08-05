import { makePattern } from "../index";
import { writeFile } from "fs/promises";
import { resolve } from "path";
(async () => {
  const pattern = await makePattern(
    resolve(__dirname, "./test.svg"),
    3000,
    3000
  );
  await writeFile(
    resolve(__dirname, "./testgen.svg"),
    pattern
  );
})();

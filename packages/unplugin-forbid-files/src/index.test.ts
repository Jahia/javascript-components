import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { rollup } from "rollup";
import unpluginForbidFiles from "./index.js";

describe("unplugin-forbid-files", () => {
  test("test", async () => {
    const bundle = await rollup({
      input: "./__fixtures__/client/index.js",
      plugins: [
        unpluginForbidFiles.rollup((id) => {
          console.log(id);
          return false;
        }),
      ],
    });
  });
});

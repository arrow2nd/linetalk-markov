import { parseTalks } from "./src/parse-talks.js";
import { addDic } from "./src/wakachi.js";

const parsed = parseTalks();

parsed.forEach(async (v, k) => {
  const dic = new Map([["_TOP_", []]]);

  // データ量があまりに多いので Promise.all で捌こうとすると
  // "internal error: entered unreachable code" で死ぬ
  for (const { message } of v) {
    await addDic(dic, message);
  }

  Deno.writeTextFileSync(
    `./dic/${k}.json`,
    JSON.stringify([...dic], null, "\t")
  );
});

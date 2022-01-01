import { markov } from "./src/markov.js";

// 生成数
const counts = Deno.args[0] || 10;

for (const { name } of Deno.readDirSync("./dic")) {
  // json以外
  if (!name.endsWith(".json")) continue;

  console.log(`【${name} から文章を生成】\n`);

  for (let i = 0; i < counts; i++) {
    console.log(` ・${markov(name)}`);
  }

  console.log("\n");
}

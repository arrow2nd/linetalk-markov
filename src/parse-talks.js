import { parse } from "https://github.com/arrow2nd/line-talk-parser/raw/main/mod.ts";

/**
 * トーク履歴をユーザー別にパース
 * @returns トークデータ
 */
export function parseTalks() {
  const results = new Map();

  for (const f of Deno.readDirSync("./talks")) {
    if (!f.name.endsWith(".txt")) continue;

    const talk = Deno.readTextFileSync("./talks/" + f.name);
    for (const t of parse(talk)) {
      // 未登録のユーザー名
      if (!results.has(t.user)) {
        results.set(t.user, []);
      }

      results.set(t.user, [...results.get(t.user), t]);
    }
  }

  return results;
}

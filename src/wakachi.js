import { MeCab } from "https://deno.land/x/deno_mecab/mod.ts";

const mecab = new MeCab(["mecab"]);

/**
 * 辞書に追加
 *
 * @param {Map} dic 辞書オブジェクト
 * @param {String} line テキスト
 */
export async function addDic(dic, line) {
  const results = await mecab.wakati(line);

  for (let i = 0; i < results.length; i++) {
    const w = results[i];

    // 項目がない場合新規作成
    if (!dic.has(w)) {
      dic.set(w, []);
    }

    // 先頭の単語ならTOPに追加
    if (i === 0) {
      dic.set("_TOP_", [...dic.get("_TOP_"), w]);
    }

    // 末尾の単語ならENDを追加して処理を終了
    if (i >= results.length - 1) {
      dic.set(w, [...dic.get(w), "_END_"]);
      break;
    }

    // 辞書に次の単語を追加
    dic.set(w, [...dic.get(w), results[i + 1]]);
  }

  console.log("[ OK ] " + line);
}

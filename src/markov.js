/**
 * マルコフ連鎖で文章を生成する
 * @param {String} filename 辞書ファイル名
 */
export function markov(filename) {
  const dic = new Map(JSON.parse(Deno.readTextFileSync(`./dic/${filename}`)));

  let text = "";
  let word = "_TOP_";

  while (true) {
    const rnd = Math.floor(Math.random() * dic.get(word).length);

    word = dic.get(word)[rnd];
    if (word === "_END_") break;

    text += word;
  }

  return text;
}

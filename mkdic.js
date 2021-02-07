'use strict'
const fs = require('fs')
const MeCab = require('mecab-async')
const mecab = new MeCab()
MeCab.command = 'mecab -d /usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd'

/**
 * マルコフ連鎖用の辞書を作成
 *
 * @param {String} user     ユーザー名
 * @param {Array}  talklist トーク履歴
 */
async function MakeDictionary (user, talklist) {
  const dic = { _TOP_: [] }

  // 辞書作成
  await Promise.all(talklist.map(line => add(dic, line)))

  // 書き出し
  fs.writeFileSync(`./dictionary/${user}.json`, JSON.stringify(dic, null, '\t'))
}

/**
 * 辞書に追加
 *
 * @param {Object} dic  辞書オブジェクト
 * @param {String} line テキスト
 */
function add (dic, line) {
  return new Promise((resolve, reject) => {
    const result = mecab.wakachiSync(line)

    for (let i = 0; i < result.length; i++) {
      const w = result[i]

      // 項目がない場合作成
      if (!dic[w]) dic[w] = []

      // 先頭の単語ならTOPに追加
      if (i === 0) {
        dic._TOP_.push(w)
      }
      // 末尾の単語ならENDを追加して処理を終了
      if (i >= result.length - 1) {
        dic[w].push('_END_')
        break
      };

      // 辞書に追加
      dic[w].push(result[i + 1])
    }

    console.log(line)
    resolve()
  })
}

module.exports = { MakeDictionary }

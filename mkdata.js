'use strict';
const fs = require('fs');
const dic = require('./mkdic.js');

(async () => {
    // talk_history以下のファイルを取得
    const talkHistFiles = fs.readdirSync('./talk_history').filter(file => {
        return file.match(/.*.txt$/);
    });

    // tmpディレクトリを作成
    fs.mkdirSync('./tmp');
    
    // トークを履歴を整形して保存
    for (let file of talkHistFiles) {
        const data = fs.readFileSync(`./talk_history/${file}`, 'utf-8').split('\n');
        const after = divideByUserTalkHistory(data);

        // tmp以下に書き出し
        write(after);
        console.log(`解析完了 (${file})`);
    }

    // tmp以下のファイルを取得
    const tmpFiles = fs.readdirSync('./tmp').filter(file => {
        return file.match(/.*.txt$/);
    });

    for (let file of tmpFiles) {
        const name = file.match(/(.*).txt$/)[1];
        const data = fs.readFileSync(`./tmp/${name}.txt`, 'utf-8').split('\n');

        // 辞書作成
        await dic.MakeDictionary(name, data);

        // ファイルを削除
        fs.unlinkSync(`./tmp/${file}`);

        console.log(`辞書作成完了 (${name})`);
    }

    // tmpディレクトリを削除
    fs.rmdirSync('./tmp');

    console.log('success!!');
})();

/**
 * トーク履歴をユーザー別に分ける（コードは💩）
 * 
 * @param  {Array}  data トーク履歴
 * @return {Object}      整形したデータ
 */
function divideByUserTalkHistory(data) {
    let talkHist = {};
    let user = '';
    let text = '';

    for (let line of data) {
        // 日付なら除外
        if (line.match(/^\d+\/\d+\/\d+/)) continue;
    
        // LINE依存の絵文字・全角空白を削除
        line = line.replace(/(\(.+\)|　)/g, '');

        // 行先頭が時刻ならトークとみなす
        if (line.match(/^\d+:\d+/)) {
            const words = line.split('\t');
            user = words[1];
            text = words[2];
            
            // 除外
            if (isIgnoreText(text)) continue;

            // ユーザーが存在しない場合作成
            if (!talkHist[user]) {
                talkHist[user] = [];
            }

            talkHist[user].push(text);
        } else if (user && line.length) {
            // 改行分を前の文章に追加
            const len = talkHist[user].length - 1;
            talkHist[user][len] += ' ' + line;
        }
    }

    return talkHist;
}

/**
 * 除外チェック
 * 
 * @param  {String}  text テキスト
 * @return {Boolean}      除外対象かどうか
 */
function isIgnoreText(text) {
    // 2文字以下、スタンプ等
    if (text.length <= 2 || text.match(/^\[.+\]/)) return true;

    // 通話関係のメッセージ
    const ignoreText = ['通話時間 \\d{1,2}', '通話に応答がありませんでした。', '通話をキャンセルしました。'];
    for (let v of ignoreText) {
        if (text.match(v)) return true;
    }

    return false;
}

/**
 * 一旦トークをユーザー別に書き出す
 * 
 * @param {Object} dic トークデータ
 */
function write(dic) {
    for (let key in dic) {
        dic[key].forEach(v => {
            if (v.match(/https?:\/\//)) return; // URLは除外
            fs.appendFileSync(`./tmp/${key}.txt`, `${v}\n`);
        });
    };
};

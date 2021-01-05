'use strict';
const fs = require('fs');

// dictionary以下のファイルを取得
const dicFiles = fs.readdirSync('./dictionary').filter(file => {
    return file.match(/.*.json$/);
});

for (let file of dicFiles) {
    console.log(`\n【${file} から文章を生成】\n`);
    
    for (let i = 0; i < 15; i++) {
        console.log(` ・${makeSentence(file)}`);
    }
}

/**
 * マルコフ連鎖で文章を生成する
 * 
 * @param {String} file 辞書ファイル名
 */
function makeSentence(file) {
    const dic = JSON.parse(fs.readFileSync(`./dictionary/${file}`)); 
    let text = '';
    let rnd = Math.floor(Math.random() * dic['_TOP_'].length);
    let word = dic['_TOP_'][rnd];
    
    while (word != '_END_') {
        text += word;
        rnd = Math.floor(Math.random() * dic[word].length);
        word = dic[word][rnd];
    }
    
    return text;
}

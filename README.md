# markov-talk

LINE のトーク履歴からマルコフ連鎖っぽいもので文章を生成するやつ

## 使い方

1. LINEのトーク履歴(.txt)を取得する
2. `./talks`以下に配置する
3. スクリプトを実行
  
    ```sh
   # 辞書を作成
   deno run -A ./create-dic.js
   
   # => ちょっと待つ...
   
   # 文章を作成する
   deno -run -A ./main.js 10
   
   # => 10件生成されます
   ```
  

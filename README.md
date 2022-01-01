# markov-talk

LINE のトーク履歴からマルコフ連鎖っぽいもので文章を生成するやつ

## 使い方

```sh
# 辞書を作成
deno run -A ./create-dic.js

# => ちょっと待つ...

# 文章を作成する
deno -run -A ./main.js 10

# => 10件生成されます
```

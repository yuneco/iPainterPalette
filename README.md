# これは何？
+ スマホやタブレットからPainterを操作するためのツールです
+ ブラシの切り替えやメニューコマンドの実行ができます
+ あくまでも技術的な実験用のプロジェクトです。不備等ご了承ください

# 前提
+ Painter12以降（多分）がインストールされている事
+ nodeがインストールされている事。nodeの説明はしません

```bash
npm install
```
+ ここまでの説明がわかる事

# 導入方法
+ Painterの設定 
 + Painterを起動して、設定＞接続 から、「付属アプリケーションによる接続を許可」をチェック
 + 認証コードに適当な英数字を設定
 + 表示されているIPとポート番号をメモ
+ ダウンロードと配置
 + このページ右上からzipで一式ダウンロードして任意の場所に展開
 + もし、上で控えたポート番号が「26735」でないなら、server.jsを開いて書き換え
+ 起動 …2度目以降はここから
 + node server.js で起動
+ スマホから使う
 + スマホでsafari/chromeを起動して「http://メモしたIP:8080/local/index.html」を開く※ポート番号はメモした値ではなく、8080
 + メモした認証コードを入れて、connect
 + 後は適当に

#対応してるコマンド
 ブラシ選択・メニューコマンド実行・テクスチャ選択 くらいです。他使いたい方は自力で頑張ってください

#終了方法
ctrl+C または、ターミナル/コマンドプロンプトを終了

#エラー時の対応
運が悪いとターミナル/コマンドプロンプトにエラーが出てserver.jsが終了するかも。その時はもう一度立ち上げてください。

#使用ライブラリと謝辞
下記のライブラリ同梱して使用しています
- ecl.js
// Escape Codec Library: ecl.js (Ver.041208)a
// Copyright (C) http://nurucom-archives.hp.infoseek.co.jp/digital/
- unorm.js https://github.com/walling/unorm
- vue.js https://vuejs.org/
特に文字コード周りは上の2つ抜きにはどうしようもなかったです。多謝。

# 連絡先
何か不都合等ございましたら@yuneco までお願い致します。

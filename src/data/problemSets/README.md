# problemSets

問題データが増えたら、このフォルダに分野別ファイルを追加します。

例:

- `algebraProblems.ts`
- `geometryProblems.ts`
- `probabilityProblems.ts`

`src/data/problems.ts` はアプリ側の入口として残し、ページやコンポーネントはそこだけを参照します。
こうしておくと、Codexで拡張していくときも巨大な1ファイルを毎回読む必要が少なくなります。

問題を追加・分割したあとは `npm run build` を実行します。
問題ID、選択肢ID、正解ID、罠ID、表示用ルートの手数がずれている場合は build 時に検出されます。

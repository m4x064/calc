# 計算の眼 Web：First Move Trainer

答えを入力する数学アプリではなく、問題を見て「最初の一手」を選び、数学的視界を診断するMVPです。

## 起動方法

macOSでは、このフォルダの `start.command` をダブルクリックすると起動できます。
初回だけ自動で `npm install` が走り、そのあとブラウザで `http://127.0.0.1:3000` を開きます。

手動で起動する場合:

このフォルダをターミナルで開いて、依存関係を入れてから起動します。

macOS / Linux:

```bash
npm install
npm run dev
```

Windows PowerShell:

```powershell
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 操作

- `/diagnosis` で診断を開始します。
- 診断途中で `Esc` を押すと、進行状況を保存してトップへ戻ります。
- トップに「続きから再開」が出て、同じ問題・同じ選択状態から再開できます。
- 「最初から」を押すと途中保存を消して新しく始めます。

## 構成

```text
src/
  app/
    page.tsx             トップページ
    diagnosis/page.tsx   診断
    result/page.tsx      localStorageから結果表示
    cards/page.tsx       変形カード図鑑
    trial/page.tsx       嘘解法裁判
  components/
    HomeActions.tsx      続きから再開/最初から開始
    MainNav.tsx
    MathExpression.tsx   KaTeX数式表示
    RouteSteps.tsx       美しい変形ルート表示
    ScoreBar.tsx
  data/
    problems.ts          問題データ入口
    cards.ts             変形カード自動生成
    problemSets/
      allProblems.ts     現在の30問
      README.md          問題セット分割方針
  lib/
    diagnosis.ts         スコア集計と診断タイプ判定
    storage.ts           localStorage保存
```

## 問題データの追加方法

`src/data/problemSets/` に分野別の問題ファイルを追加し、`src/data/problems.ts` からまとめて export します。
小規模な追加なら、まず `src/data/problemSets/allProblems.ts` の `problems` 配列に `EyeProblem` を追加しても動きます。

各問題は `expression`, `choices`, `correctChoiceId`, `beautifulRoute`, `heavyRoute`, `authorIntent`, `cards` を持ちます。
選択肢のスコアは `quality` と `correctChoiceId` から自動計算します。

## 今後の拡張方針

問題数が増えたら、`algebraProblems.ts`, `geometryProblems.ts`, `probabilityProblems.ts` のように分けます。
ページ側は `src/data/problems.ts` だけを見るので、UIを壊さずデータを増やせます。

## 確認コマンド

```powershell
npm run lint
npm run build
```

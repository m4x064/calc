#!/bin/zsh
set -u

cd "$(dirname "$0")"

PORT=3000
URL="http://127.0.0.1:${PORT}"

pause_before_exit() {
  read "?Enterキーで閉じます"
}

if ! command -v npm >/dev/null 2>&1; then
  echo "npm が見つかりません。Node.js をインストールしてから、もう一度実行してください。"
  echo "https://nodejs.org/"
  pause_before_exit
  exit 1
fi

if lsof -nP -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "すでに ${URL} で何かが起動しています。ブラウザを開きます。"
  open "${URL}"
  echo "このウィンドウは閉じても大丈夫です。"
  pause_before_exit
  exit 0
fi

if [ ! -d node_modules ]; then
  echo "初回セットアップとして npm install を実行します。"
  npm install

  if [ $? -ne 0 ]; then
    echo "npm install に失敗しました。表示されたエラーを確認してください。"
    pause_before_exit
    exit 1
  fi
fi

echo "開発サーバーを起動します。"
npm run dev -- --hostname 127.0.0.1 --port "${PORT}" &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

for _ in {1..60}; do
  if curl -fsS "${URL}" >/dev/null 2>&1; then
    echo "ブラウザを開きます: ${URL}"
    open "${URL}"
    break
  fi

  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    echo "サーバー起動に失敗しました。"
    wait "${SERVER_PID}"
    pause_before_exit
    exit 1
  fi

  sleep 1
done

echo "サーバーを止めるときは、このウィンドウで Ctrl+C を押してください。"
wait "${SERVER_PID}"

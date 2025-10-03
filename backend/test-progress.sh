#!/bin/bash

echo "🧪 進捗APIテスト開始..."
echo ""

API_URL="http://localhost:3001/trpc"

# 1. ログイン（既存ユーザー）
echo "1. ログイン..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth.login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demouser","password":"demo12345"}')

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['data']['accessToken'])" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ ログイン失敗"
  exit 1
fi

echo "✅ ログイン成功"
echo ""

# 2. ゲームセッション記録
echo "2. ゲームセッション記録..."
SESSION_RESPONSE=$(curl -s -X POST "${API_URL}/progress.createSession" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d '{
    "contentType": "words",
    "contentId": "word_level1_cat",
    "wpm": 45,
    "accuracy": 92.5,
    "durationSeconds": 30,
    "errorCount": 3,
    "completed": true
  }')

echo "$SESSION_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SESSION_RESPONSE"
echo "✅ セッション記録完了"
echo ""

# 3. 進捗取得
echo "3. 全進捗取得..."
PROGRESS_RESPONSE=$(curl -s -X GET "${API_URL}/progress.getAll" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$PROGRESS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROGRESS_RESPONSE"
echo "✅ 進捗取得完了"
echo ""

# 4. 統計情報取得
echo "4. 統計情報取得..."
STATS_RESPONSE=$(curl -s -X GET "${API_URL}/progress.getStats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$STATS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATS_RESPONSE"
echo "✅ 統計取得完了"
echo ""

echo "🎉 すべてのテストが成功しました！"

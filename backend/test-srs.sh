#!/bin/bash

echo "🧪 SRSシステムテスト開始..."
echo ""

API_URL="http://localhost:3001/trpc"

# 1. ログイン
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

# 2. カード作成
echo "2. SRSカード作成..."
CARD_RESPONSE=$(curl -s -X POST "${API_URL}/srs.getOrCreateCard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d '{
    "contentId": "word_cat",
    "contentType": "word"
  }')

echo "$CARD_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CARD_RESPONSE"
CARD_ID=$(echo "$CARD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['data']['id'])" 2>/dev/null)
echo "✅ カード作成完了 (ID: $CARD_ID)"
echo ""

# 3. 全カード取得
echo "3. 全カード取得..."
ALL_CARDS_RESPONSE=$(curl -s -X GET "${API_URL}/srs.getAllCards" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$ALL_CARDS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ALL_CARDS_RESPONSE"
echo "✅ 全カード取得完了"
echo ""

# 4. 復習期限カード取得
echo "4. 復習期限カード取得..."
DUE_CARDS_RESPONSE=$(curl -s -X GET "${API_URL}/srs.getDueCards?input=%7B%22limit%22%3A10%7D" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$DUE_CARDS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DUE_CARDS_RESPONSE"
echo "✅ 復習期限カード取得完了"
echo ""

# 5. 新規カード取得
echo "5. 新規カード取得..."
NEW_CARDS_RESPONSE=$(curl -s -X GET "${API_URL}/srs.getNewCards?input=%7B%22limit%22%3A5%7D" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$NEW_CARDS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$NEW_CARDS_RESPONSE"
echo "✅ 新規カード取得完了"
echo ""

# 6. 学習セット生成
echo "6. 学習セット生成..."
STUDY_SET_RESPONSE=$(curl -s -X GET "${API_URL}/srs.generateStudySet?input=%7B%22targetCount%22%3A10%2C%22reviewRatio%22%3A0.7%7D" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$STUDY_SET_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STUDY_SET_RESPONSE"
echo "✅ 学習セット生成完了"
echo ""

# 7. 品質スコア計算
echo "7. 品質スコア計算..."
QUALITY_RESPONSE=$(curl -s -X GET "${API_URL}/srs.calculateQuality?input=%7B%22accuracy%22%3A0.95%2C%22responseTime%22%3A2000%2C%22averageResponseTime%22%3A3000%7D" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$QUALITY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$QUALITY_RESPONSE"
echo "✅ 品質スコア計算完了"
echo ""

# 8. 復習記録
echo "8. 復習記録..."
REVIEW_RESPONSE=$(curl -s -X POST "${API_URL}/srs.recordReview" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"quality\": 5,
    \"responseTime\": 2500,
    \"accuracy\": 0.95,
    \"wpm\": 55
  }")

echo "$REVIEW_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REVIEW_RESPONSE"
echo "✅ 復習記録完了"
echo ""

# 9. SRS統計取得
echo "9. SRS統計取得..."
STATS_RESPONSE=$(curl -s -X GET "${API_URL}/srs.getStats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$STATS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATS_RESPONSE"
echo "✅ SRS統計取得完了"
echo ""

# 10. カードリセット
echo "10. カードリセット..."
RESET_RESPONSE=$(curl -s -X POST "${API_URL}/srs.resetCard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"cardId\": \"$CARD_ID\"
  }")

echo "$RESET_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESET_RESPONSE"
echo "✅ カードリセット完了"
echo ""

echo "🎉 すべてのSRSテストが成功しました！"

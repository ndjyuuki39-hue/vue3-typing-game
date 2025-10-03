#!/bin/bash

echo "🧪 認証APIテスト開始..."
echo ""

# カラー定義
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3001/trpc"

# 1. ユーザー登録テスト
echo -e "${BLUE}1. ユーザー登録テスト${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth.register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq .

# アクセストークン抽出
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.result.data.accessToken')

if [ "$ACCESS_TOKEN" != "null" ]; then
  echo -e "${GREEN}✅ ユーザー登録成功！${NC}"
  echo "Access Token: ${ACCESS_TOKEN:0:20}..."
else
  echo -e "${RED}❌ ユーザー登録失敗${NC}"
  exit 1
fi

echo ""
echo "---"
echo ""

# 2. ログインテスト
echo -e "${BLUE}2. ログインテスト${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth.login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.result.data.accessToken')

if [ "$NEW_ACCESS_TOKEN" != "null" ]; then
  echo -e "${GREEN}✅ ログイン成功！${NC}"
else
  echo -e "${RED}❌ ログイン失敗${NC}"
  exit 1
fi

echo ""
echo "---"
echo ""

# 3. 認証が必要なAPI（/auth.me）テスト
echo -e "${BLUE}3. 認証が必要なAPIテスト (/auth.me)${NC}"
ME_RESPONSE=$(curl -s -X GET "${API_URL}/auth.me" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${NEW_ACCESS_TOKEN}")

echo "$ME_RESPONSE" | jq .

USER_ID=$(echo "$ME_RESPONSE" | jq -r '.result.data.id')

if [ "$USER_ID" != "null" ]; then
  echo -e "${GREEN}✅ 認証API成功！${NC}"
else
  echo -e "${RED}❌ 認証API失敗${NC}"
  exit 1
fi

echo ""
echo "---"
echo ""

echo -e "${GREEN}🎉 すべてのテストが成功しました！${NC}"

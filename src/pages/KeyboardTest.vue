<template>
  <div class="keyboard-test">
    <h1>🎹 KeyboardGuide 特殊文字テスト</h1>

    <div class="test-controls">
      <h2>テストパターン</h2>
      <div class="button-group">
        <button
          v-for="test in testPatterns"
          :key="test.name"
          @click="setHighlight(test.char)"
          :class="{ active: currentChar === test.char }"
          class="test-button"
        >
          {{ test.name }}: {{ test.char }}
        </button>
      </div>

      <div class="current-char">
        <strong>現在のハイライト文字: </strong>
        <span class="char-display">{{ currentChar || 'なし' }}</span>
        <span v-if="currentChar" class="char-info">
          ({{ isSpecial ? 'シフト文字' : '通常文字' }})
        </span>
      </div>
    </div>

    <div class="keyboard-container">
      <KeyboardGuide :highlightKey="currentChar" />
    </div>

    <div class="instructions">
      <h3>テスト説明</h3>
      <ul>
        <li><strong>小文字</strong>: a, 1 など → 該当キーのみハイライト</li>
        <li><strong>大文字</strong>: A, B など → ベースキー + シフトキーがハイライト＆アニメーション</li>
        <li><strong>特殊文字</strong>: !, ? など → ベースキー + シフトキーがハイライト＆アニメーション</li>
        <li><strong>シフトキー</strong>: 大文字・特殊文字選択時に金色でアニメーション</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import KeyboardGuide from '@/components/organisms/KeyboardGuide.vue'

const currentChar = ref<string>('')

const testPatterns = [
  { name: '小文字 a', char: 'a' },
  { name: '大文字 A', char: 'A' },
  { name: '大文字 B', char: 'B' },
  { name: '通常文字 1', char: '1' },
  { name: '感嘆符', char: '!' },
  { name: '疑問符', char: '?' },
  { name: 'ダブルクォート', char: '"' },
  { name: 'シングルクォート', char: "'" },
  { name: '左括弧', char: '(' },
  { name: '右括弧', char: ')' },
  { name: '小なり', char: '<' },
  { name: '大なり', char: '>' },
  { name: 'プラス', char: '+' },
  { name: 'アスタリスク', char: '*' },
  { name: 'アンダースコア', char: '_' },
  { name: 'パイプ', char: '|' },
  { name: '波線', char: '~' },
  { name: 'ハッシュ', char: '#' }
]

const specialCharMap = {
  '!': '1', '"': '2', '#': '3', '$': '4', '%': '5', '&': '6',
  "'": '7', '(': '8', ')': '9', '=': '-', '~': '^', '|': '¥',
  '`': '@', '{': '[', '+': ';', '*': ':', '}': ']',
  '<': ',', '>': '.', '?': '/', '_': '\\'
}

const isSpecial = computed(() => {
  return Object.keys(specialCharMap).includes(currentChar.value)
})

const setHighlight = (char: string) => {
  currentChar.value = char
}
</script>

<style lang="scss" scoped>
.keyboard-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  color: white;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  background: linear-gradient(45deg, #007bff, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.test-controls {
  max-width: 1000px;
  margin: 0 auto 2rem;

  h2 {
    color: #00d4ff;
    margin-bottom: 1rem;
  }
}

.button-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.test-button {
  padding: 0.75rem 1rem;
  background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
  border: 1px solid #555;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
    border-color: #007bff;
  }

  &.active {
    background: linear-gradient(145deg, #007bff, #0056b3);
    border-color: #007bff;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
  }
}

.current-char {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #444;
  font-size: 1.1rem;

  .char-display {
    color: #00ff88;
    font-size: 1.3em;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    background: rgba(0, 255, 136, 0.1);
    border-radius: 4px;
  }

  .char-info {
    color: #ffc107;
    font-style: italic;
    margin-left: 0.5rem;
  }
}

.keyboard-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.instructions {
  max-width: 600px;
  margin: 2rem auto 0;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #444;

  h3 {
    color: #00d4ff;
    margin-bottom: 1rem;
  }

  ul {
    line-height: 1.6;
  }

  li {
    margin-bottom: 0.5rem;

    strong {
      color: #ffc107;
    }
  }
}
</style>
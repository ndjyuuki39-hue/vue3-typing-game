<template>
  <div class="keyboard-guide">
    <div class="keyboard">
      <!-- 数字キー行 -->
      <div class="keyboard-row">
        <div
          v-for="key in numberKeys"
          :key="key"
          class="key"
          :class="getKeyClass(key)"
        >
          {{ key }}
        </div>
      </div>

      <!-- 上段キー行（QWERTY） -->
      <div class="keyboard-row">
        <div
          v-for="key in topRowKeys"
          :key="key"
          class="key"
          :class="getKeyClass(key)"
        >
          {{ key }}
        </div>
      </div>

      <!-- 中段キー行（ASDF） -->
      <div class="keyboard-row">
        <div
          v-for="key in homeRowKeys"
          :key="key"
          class="key"
          :class="[getKeyClass(key), { 'key--home': isHomeKey(key) }]"
        >
          {{ key }}
          <span v-if="isHomeKey(key)" class="key-marker">●</span>
        </div>
      </div>

      <!-- 下段キー行（ZXCV） -->
      <div class="keyboard-row">
        <div
          v-for="key in bottomRowKeys"
          :key="key"
          class="key"
          :class="getKeyClass(key)"
        >
          {{ key }}
        </div>
      </div>

      <!-- スペースバー -->
      <div class="keyboard-row">
        <div
          class="key key--space"
          :class="getKeyClass(' ')"
        >
          SPACE
        </div>
      </div>
    </div>

    <!-- 指ガイド凡例 -->
    <div class="finger-guide">
      <div class="finger-guide-title">{{ t('keyboard.fingerGuide') }}</div>
      <div class="finger-guide-legend">
        <div class="finger-item">
          <span class="finger-color finger-color--pinky-left"></span>
          <span class="finger-label">{{ t('keyboard.fingers.pinkyLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--ring-left"></span>
          <span class="finger-label">{{ t('keyboard.fingers.ringLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--middle-left"></span>
          <span class="finger-label">{{ t('keyboard.fingers.middleLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--index-left"></span>
          <span class="finger-label">{{ t('keyboard.fingers.indexLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--thumb"></span>
          <span class="finger-label">{{ t('keyboard.fingers.thumb') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--index-right"></span>
          <span class="finger-label">{{ t('keyboard.fingers.indexRight') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--middle-right"></span>
          <span class="finger-label">{{ t('keyboard.fingers.middleRight') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--ring-right"></span>
          <span class="finger-label">{{ t('keyboard.fingers.ringRight') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--pinky-right"></span>
          <span class="finger-label">{{ t('keyboard.fingers.pinkyRight') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  highlightKey?: string
  typedKeys?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  highlightKey: '',
  typedKeys: () => []
})

const { t } = useI18n()

// キーボードレイアウト
const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const topRowKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
const homeRowKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';']
const bottomRowKeys = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']

// ホームポジションキー
const isHomeKey = (key: string): boolean => {
  return ['F', 'J'].includes(key.toUpperCase())
}

// 指の割り当て
const fingerMap: Record<string, string> = {
  // 左手小指
  '1': 'pinky-left',
  'Q': 'pinky-left',
  'A': 'pinky-left',
  'Z': 'pinky-left',
  
  // 左手薬指
  '2': 'ring-left',
  'W': 'ring-left',
  'S': 'ring-left',
  'X': 'ring-left',
  
  // 左手中指
  '3': 'middle-left',
  'E': 'middle-left',
  'D': 'middle-left',
  'C': 'middle-left',
  
  // 左手人差し指
  '4': 'index-left',
  '5': 'index-left',
  'R': 'index-left',
  'T': 'index-left',
  'F': 'index-left',
  'G': 'index-left',
  'V': 'index-left',
  'B': 'index-left',
  
  // 右手人差し指
  '6': 'index-right',
  '7': 'index-right',
  'Y': 'index-right',
  'U': 'index-right',
  'H': 'index-right',
  'J': 'index-right',
  'N': 'index-right',
  'M': 'index-right',
  
  // 右手中指
  '8': 'middle-right',
  'I': 'middle-right',
  'K': 'middle-right',
  ',': 'middle-right',
  
  // 右手薬指
  '9': 'ring-right',
  'O': 'ring-right',
  'L': 'ring-right',
  '.': 'ring-right',
  
  // 右手小指
  '0': 'pinky-right',
  'P': 'pinky-right',
  ';': 'pinky-right',
  '/': 'pinky-right',
  
  // 親指（スペース）
  ' ': 'thumb'
}

// キーのクラスを取得
const getKeyClass = (key: string): string[] => {
  const classes = []
  const upperKey = key.toUpperCase()
  
  // 指の色クラス
  const finger = fingerMap[upperKey]
  if (finger) {
    classes.push(`key--${finger}`)
  }
  
  // ハイライト
  if (props.highlightKey && props.highlightKey.toUpperCase() === upperKey) {
    classes.push('key--highlight')
  }
  
  // タイプ済み
  if (props.typedKeys.includes(key)) {
    classes.push('key--typed')
  }
  
  return classes
}
</script>

<style lang="scss" scoped>
.keyboard-guide {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
}

.key {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  position: relative;
  transition: all var(--transition-fast);
  cursor: default;

  &--space {
    width: 300px;
  }

  &--home {
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: var(--text-tertiary);
      border-radius: 50%;
    }
  }

  // 指の色分け
  &--pinky-left {
    background: rgba(255, 99, 132, 0.2);
    border-color: rgb(255, 99, 132);
  }

  &--ring-left {
    background: rgba(255, 159, 64, 0.2);
    border-color: rgb(255, 159, 64);
  }

  &--middle-left {
    background: rgba(255, 205, 86, 0.2);
    border-color: rgb(255, 205, 86);
  }

  &--index-left {
    background: rgba(75, 192, 192, 0.2);
    border-color: rgb(75, 192, 192);
  }

  &--thumb {
    background: rgba(153, 102, 255, 0.2);
    border-color: rgb(153, 102, 255);
  }

  &--index-right {
    background: rgba(54, 162, 235, 0.2);
    border-color: rgb(54, 162, 235);
  }

  &--middle-right {
    background: rgba(75, 192, 75, 0.2);
    border-color: rgb(75, 192, 75);
  }

  &--ring-right {
    background: rgba(255, 159, 243, 0.2);
    border-color: rgb(255, 159, 243);
  }

  &--pinky-right {
    background: rgba(201, 203, 207, 0.2);
    border-color: rgb(201, 203, 207);
  }

  // ハイライト状態
  &--highlight {
    animation: pulse 1s infinite;
    transform: scale(1.1);
    z-index: 1;
    box-shadow: 0 0 20px var(--accent-blue);
  }

  // タイプ済み状態
  &--typed {
    background: var(--accent-green) !important;
    border-color: var(--accent-green) !important;
    color: white;
  }
}

.key-marker {
  position: absolute;
  bottom: 2px;
  font-size: 8px;
  color: var(--text-tertiary);
}

.finger-guide {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
}

.finger-guide-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.finger-guide-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.finger-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.finger-color {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  border: 2px solid;

  &--pinky-left {
    background: rgba(255, 99, 132, 0.2);
    border-color: rgb(255, 99, 132);
  }

  &--ring-left {
    background: rgba(255, 159, 64, 0.2);
    border-color: rgb(255, 159, 64);
  }

  &--middle-left {
    background: rgba(255, 205, 86, 0.2);
    border-color: rgb(255, 205, 86);
  }

  &--index-left {
    background: rgba(75, 192, 192, 0.2);
    border-color: rgb(75, 192, 192);
  }

  &--thumb {
    background: rgba(153, 102, 255, 0.2);
    border-color: rgb(153, 102, 255);
  }

  &--index-right {
    background: rgba(54, 162, 235, 0.2);
    border-color: rgb(54, 162, 235);
  }

  &--middle-right {
    background: rgba(75, 192, 75, 0.2);
    border-color: rgb(75, 192, 75);
  }

  &--ring-right {
    background: rgba(255, 159, 243, 0.2);
    border-color: rgb(255, 159, 243);
  }

  &--pinky-right {
    background: rgba(201, 203, 207, 0.2);
    border-color: rgb(201, 203, 207);
  }
}

.finger-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

// アニメーション
@keyframes pulse {
  0%, 100% {
    transform: scale(1.1);
    box-shadow: 0 0 20px var(--accent-blue);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 30px var(--accent-blue);
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .key {
    width: 36px;
    height: 36px;
    font-size: var(--text-sm);
  }

  .key--space {
    width: 200px;
  }

  .finger-guide-legend {
    font-size: var(--text-xs);
  }
}
</style>
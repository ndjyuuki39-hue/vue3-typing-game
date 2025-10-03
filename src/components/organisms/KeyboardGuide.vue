<template>
  <div class="keyboard-guide">
    <div class="keyboard">

      <!-- 数字キー行（JIS配列） -->
      <div class="keyboard-row number-row">
        <div
          v-for="key in numberRowKeys"
          :key="key.main"
          class="key"
          :class="[
            key.main === '半角/全角' ? 'key--hankaku-zenkaku' : 'key--number',
            ...getKeyClass(key.main)
          ]"
        >
          <div class="key-top">{{ key.shift }}</div>
          <div class="key-main">{{ key.main }}</div>
        </div>
        <div class="key key--backspace" :class="getKeyClass('Backspace')">
          BS
        </div>
      </div>

      <!-- 上段キー行（QWERTY + JIS記号） -->
      <div class="keyboard-row top-row" style="position: relative;">
        <div class="key key--tab" :class="getKeyClass('Tab')">
          Tab
        </div>
        <div
          v-for="key in topRowKeys"
          :key="key.main"
          class="key"
          :class="getKeyClass(key.main)"
        >
          <div class="key-top">{{ key.shift }}</div>
          <div class="key-main">{{ key.main }}</div>
        </div>
        <!-- エンターキーを絶対配置で独立させる -->
        <div class="key key--enter-l" :class="getKeyClass('Enter')" style="position: absolute; right: 0; top: 0;">
          <span class="enter-label">Enter</span>
        </div>
        <!-- エンターキーのスペースを確保するためのダミー -->
        <div style="min-width: 68px; height: 40px;"></div>
      </div>

      <!-- 中段キー行（ASDF + JIS記号） -->
      <div class="keyboard-row caps-row">
        <div class="key key--caps" :class="getKeyClass('CapsLock')">
          Caps

        </div>
        <div
          v-for="key in capsRowKeys"
          :key="key.main"
          class="key"
          :class="[getKeyClass(key.main), { 'key--home': isHomeKey(key.main) }]"
        >
          <div class="key-top">{{ key.shift }}</div>
          <div class="key-main">{{ key.main }}</div>
          <span v-if="isHomeKey(key.main)" class="key-marker"></span>
        </div>
        <!-- エンターキーの下半分の幅を考慮したダミー（37%の部分） -->
        <div style="min-width: 44px; height: 40px; visibility: hidden;"></div>
      </div>

      <!-- 下段キー行（ZXCV + JIS記号） -->
      <div class="keyboard-row bottom-row">
        <div class="key key--shift-left" :class="getKeyClass('ShiftLeft')">
          Shift
        </div>
        <div
          v-for="key in bottomRowKeys"
          :key="key.main"
          class="key"
          :class="getKeyClass(key.main)"
        >
          <div class="key-top">{{ key.shift }}</div>
          <div class="key-main">{{ key.main }}</div>
        </div>
        <div class="key key--shift-right" :class="getKeyClass('ShiftRight')">
          Shift
        </div>
      </div>

      <!-- 最下段: Ctrl, Win, Alt, Space, etc -->
      <div class="keyboard-row space-row">
        <div class="key key--ctrl" :class="getKeyClass('ControlLeft')">
          Ctrl
        </div>
        <div class="key key--win" :class="getKeyClass('MetaLeft')">
          Win
        </div>
        <div class="key key--alt" :class="getKeyClass('AltLeft')">
          Alt
        </div>
        <div class="key key--muhenkan" :class="getKeyClass('NonConvert')">
          無変換
        </div>
        <div class="key key--space" :class="getKeyClass(' ')">
          
        </div>
        <div class="key key--henkan" :class="getKeyClass('Convert')">
          変換
        </div>
        <div class="key key--kana" :class="getKeyClass('KanaMode')">
          かな
        </div>
        <div class="key key--alt" :class="getKeyClass('AltRight')">
          Alt
        </div>
        <div class="key key--fn" :class="getKeyClass('Fn')">
          fn
        </div>
        <div class="key key--ctrl" :class="getKeyClass('ControlRight')">
          Ctrl
        </div>
      </div>
    </div>

    <!-- 指ガイド凡例 -->
    <div class="finger-guide">
      <div class="finger-guide-title">{{ t('game.keyboard.fingerGuide') }}</div>
      <div class="finger-guide-legend">
        <div class="finger-item">
          <span class="finger-color finger-color--pinky-left"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.pinkyLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--ring-left"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.ringLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--middle-left"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.middleLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--index-left"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.indexLeft') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--thumb"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.thumb') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--index-right"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.indexRight') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--middle-right"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.middleRight') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--ring-right"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.ringRight') }}</span>
        </div>
        <div class="finger-item">
          <span class="finger-color finger-color--pinky-right"></span>
          <span class="finger-label">{{ t('game.keyboard.fingers.pinkyRight') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

// JIS キーボードレイアウト
const numberRowKeys = [
  { main: '半角/全角', shift: '' }, // JIS特有の半角全角切り替えキー
  { main: '1', shift: '!' },
  { main: '2', shift: '"' },
  { main: '3', shift: '#' },
  { main: '4', shift: '$' },
  { main: '5', shift: '%' },
  { main: '6', shift: '&' },
  { main: '7', shift: '\'' },
  { main: '8', shift: '(' },
  { main: '9', shift: ')' },
  { main: '0', shift: '' },
  { main: '-', shift: '=' },
  { main: '^', shift: '~' },
  { main: '¥', shift: '|' }
]

const topRowKeys = [
  { main: 'Q', shift: '' },
  { main: 'W', shift: '' },
  { main: 'E', shift: '' },
  { main: 'R', shift: '' },
  { main: 'T', shift: '' },
  { main: 'Y', shift: '' },
  { main: 'U', shift: '' },
  { main: 'I', shift: '' },
  { main: 'O', shift: '' },
  { main: 'P', shift: '' },
  { main: '@', shift: '`' },
  { main: '[', shift: '{' }
]

const capsRowKeys = [
  { main: 'A', shift: '' },
  { main: 'S', shift: '' },
  { main: 'D', shift: '' },
  { main: 'F', shift: '' },
  { main: 'G', shift: '' },
  { main: 'H', shift: '' },
  { main: 'J', shift: '' },
  { main: 'K', shift: '' },
  { main: 'L', shift: '' },
  { main: ';', shift: '+' },
  { main: ':', shift: '*' },
  { main: ']', shift: '}' }
]

const bottomRowKeys = [
  { main: 'Z', shift: '' },
  { main: 'X', shift: '' },
  { main: 'C', shift: '' },
  { main: 'V', shift: '' },
  { main: 'B', shift: '' },
  { main: 'N', shift: '' },
  { main: 'M', shift: '' },
  { main: ',', shift: '<' },
  { main: '.', shift: '>' },
  { main: '/', shift: '?' },
  { main: '\\', shift: '_' }
]

// ホームポジションキー
const isHomeKey = (key: string): boolean => {
  return ['F', 'J'].includes(key.toUpperCase())
}

// JIS配列指の割り当て
const fingerMap: Record<string, string> = {
  // 左手小指
  '半角/全角': 'pinky-left', '1': 'pinky-left', 'Q': 'pinky-left', 'A': 'pinky-left', 'Z': 'pinky-left',
  'Tab': 'pinky-left', 'CapsLock': 'pinky-left', 'ShiftLeft': 'pinky-left',
  'ControlLeft': 'pinky-left',
  
  // 左手薬指
  '2': 'ring-left', 'W': 'ring-left', 'S': 'ring-left', 'X': 'ring-left',
  
  // 左手中指
  '3': 'middle-left', 'E': 'middle-left', 'D': 'middle-left', 'C': 'middle-left',
  
  // 左手人差し指
  '4': 'index-left', '5': 'index-left', 'R': 'index-left', 'T': 'index-left',
  'F': 'index-left', 'G': 'index-left', 'V': 'index-left', 'B': 'index-left',
  
  // 右手人差し指
  '6': 'index-right', '7': 'index-right', 'Y': 'index-right', 'U': 'index-right',
  'H': 'index-right', 'J': 'index-right', 'N': 'index-right', 'M': 'index-right',
  
  // 右手中指
  '8': 'middle-right', 'I': 'middle-right', 'K': 'middle-right', ',': 'middle-right',
  
  // 右手薬指
  '9': 'ring-right', 'O': 'ring-right', 'L': 'ring-right', '.': 'ring-right',
  
  // 右手小指
  '0': 'pinky-right', '-': 'pinky-right', '^': 'pinky-right', '¥': 'pinky-right',
  'P': 'pinky-right', '@': 'pinky-right', '[': 'pinky-right',
  ';': 'pinky-right', ':': 'pinky-right', ']': 'pinky-right',
  '/': 'pinky-right', '\\': 'pinky-right',
  'Backspace': 'pinky-right', 'Enter': 'pinky-right', 'ShiftRight': 'pinky-right',
  'ControlRight': 'pinky-right',
  
  // 親指
  ' ': 'thumb', 'Convert': 'thumb', 'NonConvert': 'thumb',
  'MetaLeft': 'thumb', 'AltLeft': 'thumb', 'AltRight': 'thumb',
  'KanaMode': 'thumb', 'Fn': 'thumb'
}

// 特殊文字→ベースキーマッピング (JIS配列)
const specialCharMap: Record<string, string> = {
  // 数字行の特殊文字
  '!': '1',
  '"': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '&': '6',
  "'": '7',
  '(': '8',
  ')': '9',
  '=': '-',
  '~': '^',
  '|': '¥',

  // トップ行の特殊文字
  '`': '@',
  '{': '[',

  // キャップス行の特殊文字
  '+': ';',
  '*': ':',
  '}': ']',

  // ボトム行の特殊文字
  '<': ',',
  '>': '.',
  '?': '/',
  '_': '\\'
}

// 文字がシフト文字かどうかを判定（特殊文字 + 大文字）
const isShiftCharacter = (char: string): boolean => {
  return Object.keys(specialCharMap).includes(char) || /^[A-Z]$/.test(char)
}

// シフト文字からベースキーを取得（特殊文字 + 大文字対応）
const getBaseKey = (char: string): string => {
  // 特殊文字の場合はマップから取得
  if (specialCharMap[char]) {
    return specialCharMap[char]
  }
  // 大文字の場合は小文字に変換
  if (/^[A-Z]$/.test(char)) {
    return char.toLowerCase()
  }
  return char
}

// キーのクラスを取得（特殊文字とシフトキー対応）
const getKeyClass = (key: string): string[] => {
  const classes = []
  const checkKey = key === ' ' ? key : key.toUpperCase()

  // 指の色クラス
  const finger = fingerMap[checkKey] || fingerMap[key]
  if (finger) {
    classes.push(`key--${finger}`)
  }

  // ハイライト処理（特殊文字対応）
  if (props.highlightKey) {
    const highlightChar = props.highlightKey
    const highlightKey = highlightChar === ' ' ? highlightChar : highlightChar.toUpperCase()

    // 通常の文字のハイライト
    if (highlightKey === checkKey || highlightKey === key) {
      classes.push('key--highlight')
    }

    // 特殊文字の場合：ベースキーをハイライト
    if (isShiftCharacter(highlightChar)) {
      const baseKey = getBaseKey(highlightChar)
      if (baseKey.toUpperCase() === checkKey || baseKey === key) {
        classes.push('key--highlight')
      }
    }

    // シフトキーのハイライト（特殊文字入力時）
    if (isShiftCharacter(highlightChar) && (key === 'ShiftLeft' || key === 'ShiftRight')) {
      classes.push('key--shift-active')
    }
  }

  // タイプ済み
  if (props.typedKeys.includes(key) || props.typedKeys.includes(key.toLowerCase())) {
    classes.push('key--typed')
  }

  return classes
}
</script>

<style lang="scss" scoped>
.keyboard-guide {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 20px;
  padding: clamp(12px, 2vh, 24px); // 画面高さに応じてパディング調整
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 100%; // コンテナに収まるように制限
  overflow: hidden;
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.5vh, 6px); // 画面高さに応じてgap調整
  margin-bottom: clamp(10px, 2vh, 20px);
  padding: clamp(8px, 1.5vh, 16px);
  background: linear-gradient(135deg, #252525, #1c1c1c);
  border-radius: 16px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
  max-width: none; // 拡大制限を解除
  margin: 0 auto clamp(10px, 2vh, 20px);
}

.keyboard-row {
  display: flex;
  gap: 4px;
  
  // 全行センタリング
  justify-content: center;
}

.key {
  min-width: 44px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #4a4a4a, #2a2a2a);
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #e0e0e0;
  position: relative;
  transition: all 0.15s ease;
  cursor: default;
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: linear-gradient(145deg, #5a5a5a, #3a3a3a);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  // キーサイズバリエーション
  &--hankaku-zenkaku {
    min-width: 56px;
    font-size: 9px;
    background: linear-gradient(145deg, #6f42c1, #5a2d91);
    color: white;
  }
  
  &--number {
    min-width: 44px;
  }
  
  &--tab {
    min-width: 80px;
  }
  
  &--caps {
    min-width: 104px;
    font-size: 10px;
  }
  
  &--shift-left {
    min-width: 128px;
  }
  
  &--shift-right {
    min-width: 68px;
  }
  
  &--backspace {
    min-width: 44px;
    background: linear-gradient(145deg, #dc3545, #bb2d3b);
    color: white;
    font-size: 11px;
  }
  
  
  &--space {
    min-width: 242px;
    background: linear-gradient(145deg, #6c757d, #495057);
  }
  
  &--ctrl, &--win, &--alt, &--fn {
    min-width: 53px;
    font-size: 10px;
  }
  
  &--muhenkan, &--henkan, &--kana {
    min-width: 44px;
    font-size: 9px;
  }

  &--home {
    .key-marker {
      position: absolute;
      bottom: 3px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 3px;
      background: #ffc107;
      border-radius: 50%;
      box-shadow: 0 0 4px #ffc107;
    }
  }

  .key-top {
    font-size: 9px;
    line-height: 1;
    color: #aaa;
    margin-bottom: 1px;
  }
  
  .key-main {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  // 指の色分け（リアルなグラデーション）
  &--pinky-left {
    background: linear-gradient(145deg, rgba(255, 99, 132, 0.8), rgba(255, 99, 132, 0.4));
    border: 2px solid rgba(255, 99, 132, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(255, 99, 132, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--ring-left {
    background: linear-gradient(145deg, rgba(255, 159, 64, 0.8), rgba(255, 159, 64, 0.4));
    border: 2px solid rgba(255, 159, 64, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(255, 159, 64, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--middle-left {
    background: linear-gradient(145deg, rgba(255, 205, 86, 0.8), rgba(255, 205, 86, 0.4));
    border: 2px solid rgba(255, 205, 86, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(255, 205, 86, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    color: #333;
  }

  &--index-left {
    background: linear-gradient(145deg, rgba(75, 192, 192, 0.8), rgba(75, 192, 192, 0.4));
    border: 2px solid rgba(75, 192, 192, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(75, 192, 192, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--thumb {
    background: linear-gradient(145deg, rgba(153, 102, 255, 0.8), rgba(153, 102, 255, 0.4));
    border: 2px solid rgba(153, 102, 255, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(153, 102, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--index-right {
    background: linear-gradient(145deg, rgba(54, 162, 235, 0.8), rgba(54, 162, 235, 0.4));
    border: 2px solid rgba(54, 162, 235, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(54, 162, 235, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--middle-right {
    background: linear-gradient(145deg, rgba(40, 167, 69, 0.8), rgba(40, 167, 69, 0.4));
    border: 2px solid rgba(40, 167, 69, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(40, 167, 69, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--ring-right {
    background: linear-gradient(145deg, rgba(255, 159, 243, 0.8), rgba(255, 159, 243, 0.4));
    border: 2px solid rgba(255, 159, 243, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(255, 159, 243, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--pinky-right {
    background: linear-gradient(145deg, rgba(201, 203, 207, 0.8), rgba(201, 203, 207, 0.4));
    border: 2px solid rgba(201, 203, 207, 0.9);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(201, 203, 207, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    color: #333;
  }

  // ハイライト状態（強化されたアニメーション）
  &--highlight {
    animation: keyPulse 0.8s infinite alternate;
    transform: translateY(-2px);
    z-index: 10;
    box-shadow: 
      0 6px 16px rgba(0, 123, 255, 0.6),
      0 0 24px rgba(0, 123, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    border: 2px solid #007bff;
    background: linear-gradient(145deg, rgba(0, 123, 255, 0.9), rgba(0, 123, 255, 0.6)) !important;
  }

  // タイプ済み状態
  &--typed {
    background: linear-gradient(145deg, #28a745, #20c997) !important;
    border: 2px solid #28a745 !important;
    color: white !important;
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(40, 167, 69, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &--enter-l {
    min-width: 68px;
    height: 86px;
    z-index: 5;
    border-radius: 8px; // 他のキーと同じ角の丸み
    
    // L字型を作成（内側の角を考慮した多角形）
    clip-path: polygon(
      /* 外側の角（丸みを考慮） */
      3% 0%,         // 左上
      97% 0%,        // 右上
      100% 3%,       // 右上角
      100% 43%,      // 右側上部
      100% 97%,      // 右下角
      97% 100%,      // 右下
      44% 100%,      // 下部分の右側（右に移動して隙間を広げる）
      41% 97%,       // 下部分左下の角（丸み開始）
      38% 94%,       // 下部分左下の角（丸み）
      36% 90%,       // 下部分左下の角（丸み）
      35% 85%,       // 下部分左下の角（丸み終了）
      35% 46.5%,     // 下部分の左側（まっすぐな縦線）
      3% 46.5%,      // 上部分の左下（まっすぐな横線）
      0% 43%,        // 上部分左下の角（丸み - 他の角と同じ3%）
      0% 3%,         // 左上角
      3% 0%          // 戻る
    );
    
    // 他のキーと同じ背景とボーダースタイル
    background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
    border: 1px solid #444;
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -2px 0 rgba(0, 0, 0, 0.2);
    
    // L字の内角部分の丸み（削除してシンプルに）
    // 内角の処理は不要（clip-pathで十分）
    
    .enter-label {
      position: absolute;
      top: 15px; // 上部分の中央
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      font-weight: 500;
      color: #e0e0e0;
      z-index: 2;
    }
  }
}

.key-spacer {
  width: 32px;
}

.key-spacer-small {
  width: 16px;
}


.finger-guide {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.finger-guide-title {
  font-size: 11px;
  font-weight: 600;
  color: #ccc;
  margin-bottom: 12px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.finger-guide-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.finger-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.finger-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  &--pinky-left {
    background: linear-gradient(135deg, rgba(255, 99, 132, 0.8), rgba(255, 99, 132, 0.4));
    border-color: rgba(255, 99, 132, 0.9);
  }

  &--ring-left {
    background: linear-gradient(135deg, rgba(255, 159, 64, 0.8), rgba(255, 159, 64, 0.4));
    border-color: rgba(255, 159, 64, 0.9);
  }

  &--middle-left {
    background: linear-gradient(135deg, rgba(255, 205, 86, 0.8), rgba(255, 205, 86, 0.4));
    border-color: rgba(255, 205, 86, 0.9);
  }

  &--index-left {
    background: linear-gradient(135deg, rgba(75, 192, 192, 0.8), rgba(75, 192, 192, 0.4));
    border-color: rgba(75, 192, 192, 0.9);
  }

  &--thumb {
    background: linear-gradient(135deg, rgba(153, 102, 255, 0.8), rgba(153, 102, 255, 0.4));
    border-color: rgba(153, 102, 255, 0.9);
  }

  &--index-right {
    background: linear-gradient(135deg, rgba(54, 162, 235, 0.8), rgba(54, 162, 235, 0.4));
    border-color: rgba(54, 162, 235, 0.9);
  }

  &--middle-right {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.8), rgba(40, 167, 69, 0.4));
    border-color: rgba(40, 167, 69, 0.9);
  }

  &--ring-right {
    background: linear-gradient(135deg, rgba(255, 159, 243, 0.8), rgba(255, 159, 243, 0.4));
    border-color: rgba(255, 159, 243, 0.9);
  }

  &--pinky-right {
    background: linear-gradient(135deg, rgba(201, 203, 207, 0.8), rgba(201, 203, 207, 0.4));
    border-color: rgba(201, 203, 207, 0.9);
  }
}

.finger-label {
  font-size: 10px;
  color: #bbb;
  font-weight: 500;
}

// アニメーション
@keyframes keyPulse {
  0% {
    transform: translateY(-2px);
    box-shadow:
      0 6px 16px rgba(0, 123, 255, 0.4),
      0 0 20px rgba(0, 123, 255, 0.6);
  }
  100% {
    transform: translateY(-4px);
    box-shadow:
      0 8px 20px rgba(0, 123, 255, 0.8),
      0 0 32px rgba(0, 123, 255, 1);
  }
}

@keyframes shiftPulse {
  0% {
    transform: translateY(-2px);
    box-shadow:
      0 6px 16px rgba(255, 193, 7, 0.4),
      0 0 20px rgba(255, 193, 7, 0.6);
  }
  100% {
    transform: translateY(-4px);
    box-shadow:
      0 8px 20px rgba(255, 193, 7, 0.8),
      0 0 32px rgba(255, 193, 7, 1);
  }
}

// シフトキーアクティブ状態のスタイル
.key--shift-active {
  background: linear-gradient(145deg,
    rgba(255, 193, 7, 0.9),
    rgba(255, 193, 7, 0.7)
  ) !important;
  border-color: rgba(255, 193, 7, 1) !important;
  color: #000 !important;
  animation: shiftPulse 0.8s infinite alternate;
  z-index: 8;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg,
      rgba(255, 193, 7, 0.4),
      rgba(255, 193, 7, 0.1)
    );
    border-radius: inherit;
    z-index: -1;
    animation: shiftGlow 1.6s infinite alternate;
  }
}

@keyframes shiftGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

// レスポンシブCSSを削除（スマホでは非表示のため不要）

// 768px以下のレスポンシブCSSも削除

// 480px以下のレスポンシブCSSも削除（スマホでは非表示のため不要）
</style>
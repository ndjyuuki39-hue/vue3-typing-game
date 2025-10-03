// ブラウザのコンソールで実行してください
console.log('===== 進捗データデバッグ =====')

const progressData = JSON.parse(localStorage.getItem('english-typing-game-progress') || '{}')

console.log('📊 全体の進捗データ:')
console.log(progressData)

console.log('\n📚 英単語の進捗:')
console.log('words:', progressData.words)

if (progressData.words) {
  console.log('\n🔍 wordLevel1の詳細:')
  console.log('wordLevel1:', progressData.words.wordLevel1)

  if (progressData.words.wordLevel1) {
    console.log('  - completedStages:', progressData.words.wordLevel1.completedStages)
    console.log('  - currentStage:', progressData.words.wordLevel1.currentStage)
    console.log('  - stageBestWpm:', progressData.words.wordLevel1.stageBestWpm)
    console.log('  - stageBestAccuracy:', progressData.words.wordLevel1.stageBestAccuracy)
  } else {
    console.log('  ❌ wordLevel1が存在しません')
  }
}

console.log('\n🎮 実際にクリア済みのステージ:')
if (progressData.words?.wordLevel1?.completedStages) {
  const completed = progressData.words.wordLevel1.completedStages
  console.log('  クリア済みステージ番号:', completed)
  console.log('  クリア済みステージ数:', completed.length)

  if (completed.length > 0) {
    console.log('  ✅ ランダム出題が可能です')
  } else {
    console.log('  ❌ クリア済みステージがないため、ランダム出題できません')
  }
} else {
  console.log('  ❌ completedStagesが見つかりません')
}

console.log('\n===== デバッグ終了 =====')

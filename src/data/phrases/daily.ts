import type { PhraseContent } from '@/stores/content'

// Daily Conversation - 10 Stages × 10 Phrases = 100 Phrases
export const dailyPhrases: PhraseContent[] = [
  // Stage 1: 基本挨拶 (Basic Greetings)
  {
    id: 'daily-001',
    english: 'Good morning.',
    japanese: 'おはようございます。',
    category: 'daily',
    situation: '朝の挨拶',
    difficulty: 1
  },
  {
    id: 'daily-002',
    english: 'Good afternoon.',
    japanese: 'こんにちは。',
    category: 'daily',
    situation: '昼の挨拶',
    difficulty: 1
  },
  {
    id: 'daily-003',
    english: 'Good evening.',
    japanese: 'こんばんは。',
    category: 'daily',
    situation: '夜の挨拶',
    difficulty: 1
  },
  {
    id: 'daily-004',
    english: 'Good night.',
    japanese: 'おやすみなさい。',
    category: 'daily',
    situation: '寝る前の挨拶',
    difficulty: 1
  },
  {
    id: 'daily-005',
    english: 'Hello there.',
    japanese: 'こんにちは。',
    category: 'daily',
    situation: '気軽な挨拶',
    difficulty: 1
  },
  {
    id: 'daily-006',
    english: 'Hi everyone.',
    japanese: 'みなさん、こんにちは。',
    category: 'daily',
    situation: '複数への挨拶',
    difficulty: 1
  },
  {
    id: 'daily-007',
    english: 'Nice to meet you.',
    japanese: 'はじめまして。',
    category: 'daily',
    situation: '初対面',
    difficulty: 1
  },
  {
    id: 'daily-008',
    english: 'See you later.',
    japanese: 'また後で。',
    category: 'daily',
    situation: '別れの挨拶',
    difficulty: 1
  },
  {
    id: 'daily-009',
    english: 'Take care.',
    japanese: '気をつけて。',
    category: 'daily',
    situation: '別れ際の気遣い',
    difficulty: 1
  },
  {
    id: 'daily-010',
    english: 'Have a nice day.',
    japanese: '良い一日を。',
    category: 'daily',
    situation: '別れ際の挨拶',
    difficulty: 1
  },

  // Stage 2: 体調・気分 (Health & Feelings)
  {
    id: 'daily-011',
    english: 'How are you?',
    japanese: '元気ですか？',
    category: 'daily',
    situation: '体調確認',
    difficulty: 1
  },
  {
    id: 'daily-012',
    english: 'I am fine.',
    japanese: '元気です。',
    category: 'daily',
    situation: '体調回答',
    difficulty: 1
  },
  {
    id: 'daily-013',
    english: 'I feel great.',
    japanese: '気分がとてもいいです。',
    category: 'daily',
    situation: '気分表現',
    difficulty: 1
  },
  {
    id: 'daily-014',
    english: 'I am tired.',
    japanese: '疲れています。',
    category: 'daily',
    situation: '疲労表現',
    difficulty: 1
  },
  {
    id: 'daily-015',
    english: 'I am happy.',
    japanese: '幸せです。',
    category: 'daily',
    situation: '感情表現',
    difficulty: 1
  },
  {
    id: 'daily-016',
    english: 'I am sad.',
    japanese: '悲しいです。',
    category: 'daily',
    situation: '感情表現',
    difficulty: 1
  },
  {
    id: 'daily-017',
    english: 'I am excited.',
    japanese: 'わくわくしています。',
    category: 'daily',
    situation: '感情表現',
    difficulty: 1
  },
  {
    id: 'daily-018',
    english: 'I am worried.',
    japanese: '心配です。',
    category: 'daily',
    situation: '感情表現',
    difficulty: 1
  },
  {
    id: 'daily-019',
    english: 'I am sleepy.',
    japanese: '眠いです。',
    category: 'daily',
    situation: '状態表現',
    difficulty: 1
  },
  {
    id: 'daily-020',
    english: 'I am hungry.',
    japanese: 'お腹が空いています。',
    category: 'daily',
    situation: '状態表現',
    difficulty: 1
  },

  // Stage 3: 基本質問 (Basic Questions)
  {
    id: 'daily-021',
    english: 'What is your name?',
    japanese: 'お名前は何ですか？',
    category: 'daily',
    situation: '名前確認',
    difficulty: 1
  },
  {
    id: 'daily-022',
    english: 'Where are you from?',
    japanese: 'どちらのご出身ですか？',
    category: 'daily',
    situation: '出身地確認',
    difficulty: 1
  },
  {
    id: 'daily-023',
    english: 'How old are you?',
    japanese: '何歳ですか？',
    category: 'daily',
    situation: '年齢確認',
    difficulty: 1
  },
  {
    id: 'daily-024',
    english: 'What do you do?',
    japanese: 'お仕事は何ですか？',
    category: 'daily',
    situation: '職業確認',
    difficulty: 1
  },
  {
    id: 'daily-025',
    english: 'What time is it?',
    japanese: '今何時ですか？',
    category: 'daily',
    situation: '時間確認',
    difficulty: 1
  },
  {
    id: 'daily-026',
    english: 'Where do you live?',
    japanese: 'どこにお住まいですか？',
    category: 'daily',
    situation: '住所確認',
    difficulty: 1
  },
  {
    id: 'daily-027',
    english: 'Do you have time?',
    japanese: '時間はありますか？',
    category: 'daily',
    situation: '時間確認',
    difficulty: 1
  },
  {
    id: 'daily-028',
    english: 'Can you help me?',
    japanese: '手伝ってもらえますか？',
    category: 'daily',
    situation: '助力要請',
    difficulty: 1
  },
  {
    id: 'daily-029',
    english: 'Do you understand?',
    japanese: '分かりますか？',
    category: 'daily',
    situation: '理解確認',
    difficulty: 1
  },
  {
    id: 'daily-030',
    english: 'What do you think?',
    japanese: 'どう思いますか？',
    category: 'daily',
    situation: '意見確認',
    difficulty: 1
  },

  // Stage 4: 日常行動 (Daily Activities)
  {
    id: 'daily-031',
    english: 'I wake up early.',
    japanese: '早起きします。',
    category: 'daily',
    situation: '起床',
    difficulty: 1
  },
  {
    id: 'daily-032',
    english: 'I brush my teeth.',
    japanese: '歯を磨きます。',
    category: 'daily',
    situation: '歯磨き',
    difficulty: 1
  },
  {
    id: 'daily-033',
    english: 'I take a shower.',
    japanese: 'シャワーを浴びます。',
    category: 'daily',
    situation: 'シャワー',
    difficulty: 1
  },
  {
    id: 'daily-034',
    english: 'I eat breakfast.',
    japanese: '朝食を食べます。',
    category: 'daily',
    situation: '朝食',
    difficulty: 1
  },
  {
    id: 'daily-035',
    english: 'I study every day.',
    japanese: '毎日勉強します。',
    category: 'daily',
    situation: '勉強',
    difficulty: 1
  },
  {
    id: 'daily-036',
    english: 'I come home.',
    japanese: '家に帰ります。',
    category: 'daily',
    situation: '帰宅',
    difficulty: 1
  },
  {
    id: 'daily-037',
    english: 'I watch TV.',
    japanese: 'テレビを見ます。',
    category: 'daily',
    situation: 'テレビ視聴',
    difficulty: 1
  },
  {
    id: 'daily-038',
    english: 'I read books.',
    japanese: '本を読みます。',
    category: 'daily',
    situation: '読書',
    difficulty: 1
  },
  {
    id: 'daily-039',
    english: 'I listen to music.',
    japanese: '音楽を聞きます。',
    category: 'daily',
    situation: '音楽鑑賞',
    difficulty: 1
  },
  {
    id: 'daily-040',
    english: 'I go to bed.',
    japanese: '寝ます。',
    category: 'daily',
    situation: '就寝',
    difficulty: 1
  },

  // Stage 5: 天気・時間 (Weather & Time)
  {
    id: 'daily-041',
    english: 'It is sunny today.',
    japanese: '今日は晴れです。',
    category: 'daily',
    situation: '天気',
    difficulty: 1
  },
  {
    id: 'daily-042',
    english: 'It is raining now.',
    japanese: '今雨が降っています。',
    category: 'daily',
    situation: '天気',
    difficulty: 1
  },
  {
    id: 'daily-043',
    english: 'It is very cold.',
    japanese: 'とても寒いです。',
    category: 'daily',
    situation: '気温',
    difficulty: 1
  },
  {
    id: 'daily-044',
    english: 'It is quite hot.',
    japanese: 'かなり暑いです。',
    category: 'daily',
    situation: '気温',
    difficulty: 1
  },
  {
    id: 'daily-045',
    english: 'What a nice day!',
    japanese: 'いい天気ですね！',
    category: 'daily',
    situation: '天気感想',
    difficulty: 1
  },
  {
    id: 'daily-046',
    english: 'It is Monday today.',
    japanese: '今日は月曜日です。',
    category: 'daily',
    situation: '曜日',
    difficulty: 1
  },
  {
    id: 'daily-047',
    english: 'Tomorrow is Tuesday.',
    japanese: '明日は火曜日です。',
    category: 'daily',
    situation: '曜日',
    difficulty: 1
  },
  {
    id: 'daily-048',
    english: 'Yesterday was Sunday.',
    japanese: '昨日は日曜日でした。',
    category: 'daily',
    situation: '曜日',
    difficulty: 1
  },
  {
    id: 'daily-049',
    english: 'It is morning now.',
    japanese: '今朝です。',
    category: 'daily',
    situation: '時間帯',
    difficulty: 1
  },
  {
    id: 'daily-050',
    english: 'Good weather today.',
    japanese: '今日はいい天気ですね。',
    category: 'daily',
    situation: '天気',
    difficulty: 1
  },

  // Stage 6: 学習・知識 (Learning & Knowledge)
  {
    id: 'daily-051',
    english: 'I am learning English.',
    japanese: '英語を学んでいます。',
    category: 'daily',
    situation: '学習',
    difficulty: 1
  },
  {
    id: 'daily-052',
    english: 'Can you teach me?',
    japanese: '教えてもらえますか？',
    category: 'daily',
    situation: '教育依頼',
    difficulty: 1
  },
  {
    id: 'daily-053',
    english: 'I do not understand.',
    japanese: '分かりません。',
    category: 'daily',
    situation: '理解困難',
    difficulty: 1
  },
  {
    id: 'daily-054',
    english: 'Please speak slowly.',
    japanese: 'ゆっくり話してください。',
    category: 'daily',
    situation: '話速調整',
    difficulty: 1
  },
  {
    id: 'daily-055',
    english: 'How do you say this?',
    japanese: 'これはどう言いますか？',
    category: 'daily',
    situation: '表現確認',
    difficulty: 1
  },
  {
    id: 'daily-056',
    english: 'I want to learn more.',
    japanese: 'もっと学びたいです。',
    category: 'daily',
    situation: '学習意欲',
    difficulty: 1
  },
  {
    id: 'daily-057',
    english: 'That is interesting.',
    japanese: 'それは面白いです。',
    category: 'daily',
    situation: '興味表現',
    difficulty: 1
  },
  {
    id: 'daily-058',
    english: 'I know a little English.',
    japanese: '英語を少し知っています。',
    category: 'daily',
    situation: '能力表現',
    difficulty: 1
  },
  {
    id: 'daily-059',
    english: 'Can you explain this?',
    japanese: 'これを説明してもらえますか？',
    category: 'daily',
    situation: '説明依頼',
    difficulty: 1
  },
  {
    id: 'daily-060',
    english: 'I am a beginner.',
    japanese: '初心者です。',
    category: 'daily',
    situation: '初心者表現',
    difficulty: 1
  },

  // Stage 7: 家族・友人 (Family & Friends)
  {
    id: 'daily-061',
    english: 'This is my family.',
    japanese: 'これは私の家族です。',
    category: 'daily',
    situation: '家族紹介',
    difficulty: 1
  },
  {
    id: 'daily-062',
    english: 'I have two children.',
    japanese: '子供が2人います。',
    category: 'daily',
    situation: '家族構成',
    difficulty: 1
  },
  {
    id: 'daily-063',
    english: 'My mother is kind.',
    japanese: '母は優しいです。',
    category: 'daily',
    situation: '家族描写',
    difficulty: 1
  },
  {
    id: 'daily-064',
    english: 'He is my best friend.',
    japanese: '彼は私の親友です。',
    category: 'daily',
    situation: '友人紹介',
    difficulty: 1
  },
  {
    id: 'daily-065',
    english: 'We are good friends.',
    japanese: '私たちは良い友人です。',
    category: 'daily',
    situation: '友人関係',
    difficulty: 1
  },
  {
    id: 'daily-066',
    english: 'I miss my family.',
    japanese: '家族が恋しいです。',
    category: 'daily',
    situation: '家族への思い',
    difficulty: 1
  },
  {
    id: 'daily-067',
    english: 'Call me later.',
    japanese: '後で電話してください。',
    category: 'daily',
    situation: '連絡要求',
    difficulty: 1
  },
  {
    id: 'daily-068',
    english: 'Let us meet tomorrow.',
    japanese: '明日会いましょう。',
    category: 'daily',
    situation: '会う約束',
    difficulty: 1
  },
  {
    id: 'daily-069',
    english: 'I love you.',
    japanese: '愛しています。',
    category: 'daily',
    situation: '愛情表現',
    difficulty: 1
  },
  {
    id: 'daily-070',
    english: 'You are my friend.',
    japanese: 'あなたは私の友人です。',
    category: 'daily',
    situation: '友情表現',
    difficulty: 1
  },

  // Stage 8: 趣味・興味 (Hobbies & Interests)
  {
    id: 'daily-071',
    english: 'What is your hobby?',
    japanese: '趣味は何ですか？',
    category: 'daily',
    situation: '趣味確認',
    difficulty: 2
  },
  {
    id: 'daily-072',
    english: 'I like sports.',
    japanese: 'スポーツが好きです。',
    category: 'daily',
    situation: '趣味表現',
    difficulty: 2
  },
  {
    id: 'daily-073',
    english: 'Do you play games?',
    japanese: 'ゲームをしますか？',
    category: 'daily',
    situation: '趣味確認',
    difficulty: 2
  },
  {
    id: 'daily-074',
    english: 'I enjoy reading.',
    japanese: '読書を楽しんでいます。',
    category: 'daily',
    situation: '趣味表現',
    difficulty: 2
  },
  {
    id: 'daily-075',
    english: 'Music is my passion.',
    japanese: '音楽が私の情熱です。',
    category: 'daily',
    situation: '情熱表現',
    difficulty: 2
  },
  {
    id: 'daily-076',
    english: 'I like walking.',
    japanese: '散歩が好きです。',
    category: 'daily',
    situation: '趣味表現',
    difficulty: 1
  },
  {
    id: 'daily-077',
    english: 'Cooking is fun.',
    japanese: '料理は楽しいです。',
    category: 'daily',
    situation: '趣味表現',
    difficulty: 2
  },
  {
    id: 'daily-078',
    english: 'I collect stamps.',
    japanese: '切手を集めています。',
    category: 'daily',
    situation: '収集趣味',
    difficulty: 2
  },
  {
    id: 'daily-079',
    english: 'Art is beautiful.',
    japanese: '芸術は美しいです。',
    category: 'daily',
    situation: '芸術感想',
    difficulty: 2
  },
  {
    id: 'daily-080',
    english: 'I practice piano.',
    japanese: 'ピアノを練習します。',
    category: 'daily',
    situation: '楽器練習',
    difficulty: 2
  },

  // Stage 9: 計画・未来 (Plans & Future)
  {
    id: 'daily-081',
    english: 'What are your plans?',
    japanese: 'あなたの計画は何ですか？',
    category: 'daily',
    situation: '計画確認',
    difficulty: 2
  },
  {
    id: 'daily-082',
    english: 'I will visit my friend.',
    japanese: '友人を訪ねます。',
    category: 'daily',
    situation: '未来計画',
    difficulty: 1
  },
  {
    id: 'daily-083',
    english: 'We should meet soon.',
    japanese: 'すぐに会うべきです。',
    category: 'daily',
    situation: '提案',
    difficulty: 2
  },
  {
    id: 'daily-084',
    english: 'I hope to see you.',
    japanese: 'あなたに会えることを願います。',
    category: 'daily',
    situation: '希望表現',
    difficulty: 2
  },
  {
    id: 'daily-085',
    english: 'Next week is busy.',
    japanese: '来週は忙しいです。',
    category: 'daily',
    situation: '予定表現',
    difficulty: 2
  },
  {
    id: 'daily-086',
    english: 'I want to travel.',
    japanese: '旅行したいです。',
    category: 'daily',
    situation: '願望表現',
    difficulty: 2
  },
  {
    id: 'daily-087',
    english: 'Let us plan together.',
    japanese: '一緒に計画しましょう。',
    category: 'daily',
    situation: '共同計画',
    difficulty: 2
  },
  {
    id: 'daily-088',
    english: 'The future looks bright.',
    japanese: '未来は明るく見えます。',
    category: 'daily',
    situation: '未来展望',
    difficulty: 2
  },
  {
    id: 'daily-089',
    english: 'I will call you.',
    japanese: 'あなたに電話します。',
    category: 'daily',
    situation: '連絡約束',
    difficulty: 2
  },
  {
    id: 'daily-090',
    english: 'See you next time.',
    japanese: '次回お会いしましょう。',
    category: 'daily',
    situation: '別れの約束',
    difficulty: 2
  },

  // Stage 10: 感謝・謝罪 (Thanks & Apologies)
  {
    id: 'daily-091',
    english: 'Thank you very much.',
    japanese: 'どうもありがとうございます。',
    category: 'daily',
    situation: '丁寧な感謝',
    difficulty: 2
  },
  {
    id: 'daily-092',
    english: 'I am sorry.',
    japanese: 'すみません。',
    category: 'daily',
    situation: '謝罪',
    difficulty: 2
  },
  {
    id: 'daily-093',
    english: 'No problem at all.',
    japanese: '全く問題ありません。',
    category: 'daily',
    situation: '問題なし',
    difficulty: 2
  },
  {
    id: 'daily-094',
    english: 'You are welcome.',
    japanese: 'どういたしまして。',
    category: 'daily',
    situation: '感謝への返答',
    difficulty: 2
  },
  {
    id: 'daily-095',
    english: 'I apologize deeply.',
    japanese: '深くお詫びします。',
    category: 'daily',
    situation: '深い謝罪',
    difficulty: 2
  },
  {
    id: 'daily-096',
    english: 'Thank you for your help.',
    japanese: 'ご協力ありがとうございます。',
    category: 'daily',
    situation: '協力への感謝',
    difficulty: 2
  },
  {
    id: 'daily-097',
    english: 'I really appreciate it.',
    japanese: '本当に感謝します。',
    category: 'daily',
    situation: '深い感謝',
    difficulty: 2
  },
  {
    id: 'daily-098',
    english: 'Excuse me, please.',
    japanese: '失礼いたします。',
    category: 'daily',
    situation: '丁寧な謝罪',
    difficulty: 2
  },
  {
    id: 'daily-099',
    english: 'It was my mistake.',
    japanese: '私のミスでした。',
    category: 'daily',
    situation: 'ミス認知',
    difficulty: 2
  },
  {
    id: 'daily-100',
    english: 'Thanks for everything.',
    japanese: 'すべてありがとうございます。',
    category: 'daily',
    situation: '総合感謝',
    difficulty: 2
  }
]
import type { PhraseContent } from '@/stores/content'

// Restaurant & Food - 10 Stages × 10 Phrases = 100 Phrases
export const restaurantPhrases: PhraseContent[] = [
  // Stage 1: 基本的な飲食表現 (Basic Food & Drink - moved from daily)
  {
    id: 'restaurant-001',
    english: 'I am thirsty.',
    japanese: '喉が渇いています。',
    category: 'restaurant',
    situation: '渇き',
    difficulty: 1
  },
  {
    id: 'restaurant-002',
    english: 'I want some water.',
    japanese: '水が欲しいです。',
    category: 'restaurant',
    situation: '飲み物要求',
    difficulty: 1
  },
  {
    id: 'restaurant-003',
    english: 'I like coffee.',
    japanese: 'コーヒーが好きです。',
    category: 'restaurant',
    situation: '好み',
    difficulty: 1
  },
  {
    id: 'restaurant-004',
    english: 'What is for lunch?',
    japanese: '昼食は何ですか？',
    category: 'restaurant',
    situation: '食事確認',
    difficulty: 1
  },
  {
    id: 'restaurant-005',
    english: 'I had dinner.',
    japanese: '夕食を食べました。',
    category: 'restaurant',
    situation: '食事報告',
    difficulty: 1
  },
  {
    id: 'restaurant-006',
    english: 'The food is good.',
    japanese: '食べ物が美味しいです。',
    category: 'restaurant',
    situation: '食事感想',
    difficulty: 1
  },
  {
    id: 'restaurant-007',
    english: 'I need a drink.',
    japanese: '飲み物が必要です。',
    category: 'restaurant',
    situation: '飲み物要求',
    difficulty: 1
  },
  {
    id: 'restaurant-008',
    english: 'Let us eat together.',
    japanese: '一緒に食べましょう。',
    category: 'restaurant',
    situation: '食事誘い',
    difficulty: 1
  },
  {
    id: 'restaurant-009',
    english: 'I am full now.',
    japanese: 'お腹がいっぱいです。',
    category: 'restaurant',
    situation: '満腹',
    difficulty: 1
  },
  {
    id: 'restaurant-010',
    english: 'Can I see the menu, please?',
    japanese: 'メニューを見せてください。',
    category: 'restaurant',
    situation: 'メニュー依頼',
    difficulty: 1
  },

  // Stage 2: 注文・オーダー (Ordering)
  {
    id: 'restaurant-011',
    english: 'I would like to order this.',
    japanese: 'これを注文したいです。',
    category: 'restaurant',
    situation: '注文',
    difficulty: 1
  },
  {
    id: 'restaurant-012',
    english: 'What do you recommend?',
    japanese: '何がおすすめですか？',
    category: 'restaurant',
    situation: '推薦確認',
    difficulty: 1
  },
  {
    id: 'restaurant-013',
    english: 'I will have the steak.',
    japanese: 'ステーキをお願いします。',
    category: 'restaurant',
    situation: '料理注文',
    difficulty: 1
  },
  {
    id: 'restaurant-014',
    english: 'How do you want it cooked?',
    japanese: '焼き加減はいかがですか？',
    category: 'restaurant',
    situation: '調理確認',
    difficulty: 1
  },
  {
    id: 'restaurant-015',
    english: 'Medium rare, please.',
    japanese: 'ミディアムレアでお願いします。',
    category: 'restaurant',
    situation: '焼き加減指定',
    difficulty: 1
  },
  {
    id: 'restaurant-016',
    english: 'Could I have some bread?',
    japanese: 'パンをいただけますか？',
    category: 'restaurant',
    situation: 'パン要求',
    difficulty: 1
  },
  {
    id: 'restaurant-017',
    english: 'What sides come with it?',
    japanese: '付け合わせは何ですか？',
    category: 'restaurant',
    situation: '付け合わせ確認',
    difficulty: 1
  },
  {
    id: 'restaurant-018',
    english: 'I am allergic to nuts.',
    japanese: 'ナッツアレルギーです。',
    category: 'restaurant',
    situation: 'アレルギー情報',
    difficulty: 2
  },
  {
    id: 'restaurant-019',
    english: 'Is this dish spicy?',
    japanese: 'この料理は辛いですか？',
    category: 'restaurant',
    situation: '料理確認',
    difficulty: 1
  },
  {
    id: 'restaurant-020',
    english: 'Can you make it less spicy?',
    japanese: 'もう少し辛くなくできますか？',
    category: 'restaurant',
    situation: '調理調整',
    difficulty: 2
  },

  // Stage 3: 飲み物 (Beverages)
  {
    id: 'restaurant-021',
    english: 'What do you have to drink?',
    japanese: '飲み物は何がありますか？',
    category: 'restaurant',
    situation: '飲み物確認',
    difficulty: 1
  },
  {
    id: 'restaurant-022',
    english: 'I would like some wine.',
    japanese: 'ワインをお願いします。',
    category: 'restaurant',
    situation: 'ワイン注文',
    difficulty: 1
  },
  {
    id: 'restaurant-023',
    english: 'Do you have beer?',
    japanese: 'ビールはありますか？',
    category: 'restaurant',
    situation: 'ビール確認',
    difficulty: 1
  },
  {
    id: 'restaurant-024',
    english: 'A glass of water, please.',
    japanese: 'お水をください。',
    category: 'restaurant',
    situation: '水注文',
    difficulty: 1
  },
  {
    id: 'restaurant-025',
    english: 'Could I have some ice?',
    japanese: '氷をもらえますか？',
    category: 'restaurant',
    situation: '氷要求',
    difficulty: 1
  },
  {
    id: 'restaurant-026',
    english: 'This coffee is too hot.',
    japanese: 'このコーヒーは熱すぎます。',
    category: 'restaurant',
    situation: '温度苦情',
    difficulty: 1
  },
  {
    id: 'restaurant-027',
    english: 'Do you have fresh juice?',
    japanese: 'フレッシュジュースはありますか？',
    category: 'restaurant',
    situation: 'ジュース確認',
    difficulty: 1
  },
  {
    id: 'restaurant-028',
    english: 'What kind of tea do you have?',
    japanese: '紅茶は何がありますか？',
    category: 'restaurant',
    situation: '紅茶確認',
    difficulty: 1
  },
  {
    id: 'restaurant-029',
    english: 'I prefer green tea.',
    japanese: '緑茶がいいです。',
    category: 'restaurant',
    situation: 'お茶選択',
    difficulty: 1
  },
  {
    id: 'restaurant-030',
    english: 'No sugar, thanks.',
    japanese: '砂糖なしでお願いします。',
    category: 'restaurant',
    situation: '砂糖拒否',
    difficulty: 1
  },

  // Stage 4-10: 追加のレストラン関連フレーズ（70フレーズ）
  // Stage 4: サービス・要求 (Service & Requests)
  {
    id: 'restaurant-031',
    english: 'Excuse me, waiter.',
    japanese: 'すみません、ウェイター。',
    category: 'restaurant',
    situation: 'ウェイター呼び',
    difficulty: 1
  },
  {
    id: 'restaurant-032',
    english: 'Could we have a table?',
    japanese: 'テーブルをお願いできますか？',
    category: 'restaurant',
    situation: 'テーブル要求',
    difficulty: 1
  },
  {
    id: 'restaurant-033',
    english: 'We have a reservation.',
    japanese: '予約をしています。',
    category: 'restaurant',
    situation: '予約確認',
    difficulty: 1
  },
  {
    id: 'restaurant-034',
    english: 'Table for two, please.',
    japanese: '2人用のテーブルをお願いします。',
    category: 'restaurant',
    situation: 'テーブル指定',
    difficulty: 1
  },
  {
    id: 'restaurant-035',
    english: 'Could we sit by the window?',
    japanese: '窓際の席にできますか？',
    category: 'restaurant',
    situation: '席リクエスト',
    difficulty: 2
  },
  {
    id: 'restaurant-036',
    english: 'This table is fine.',
    japanese: 'このテーブルで結構です。',
    category: 'restaurant',
    situation: 'テーブル承諾',
    difficulty: 1
  },
  {
    id: 'restaurant-037',
    english: 'May I have some napkins?',
    japanese: 'ナプキンをもらえますか？',
    category: 'restaurant',
    situation: 'ナプキン要求',
    difficulty: 1
  },
  {
    id: 'restaurant-038',
    english: 'The service is excellent.',
    japanese: 'サービスが素晴らしいです。',
    category: 'restaurant',
    situation: 'サービス評価',
    difficulty: 1
  },
  {
    id: 'restaurant-039',
    english: 'Could you bring the check?',
    japanese: '会計をお願いできますか？',
    category: 'restaurant',
    situation: '会計要求',
    difficulty: 1
  },
  {
    id: 'restaurant-040',
    english: 'We are ready to order.',
    japanese: '注文の準備ができました。',
    category: 'restaurant',
    situation: '注文準備',
    difficulty: 1
  },

  // Stage 5: 料理の評価・感想 (Food Evaluation & Comments)
  {
    id: 'restaurant-041',
    english: 'This tastes amazing!',
    japanese: 'これは驚くほど美味しいです！',
    category: 'restaurant',
    situation: '料理賞賛',
    difficulty: 1
  },
  {
    id: 'restaurant-042',
    english: 'The food is a bit cold.',
    japanese: '料理が少し冷たいです。',
    category: 'restaurant',
    situation: '温度問題',
    difficulty: 1
  },
  {
    id: 'restaurant-043',
    english: 'This is too salty.',
    japanese: 'これは塩辛すぎます。',
    category: 'restaurant',
    situation: '塩分過多',
    difficulty: 1
  },
  {
    id: 'restaurant-044',
    english: 'Could I get this reheated?',
    japanese: 'これを温め直してもらえますか？',
    category: 'restaurant',
    situation: '温め直し要求',
    difficulty: 2
  },
  {
    id: 'restaurant-045',
    english: 'The presentation is beautiful.',
    japanese: '盛り付けが美しいです。',
    category: 'restaurant',
    situation: '盛り付け評価',
    difficulty: 2
  },
  {
    id: 'restaurant-046',
    english: 'This is perfectly cooked.',
    japanese: 'これは完璧な焼き加減です。',
    category: 'restaurant',
    situation: '調理評価',
    difficulty: 2
  },
  {
    id: 'restaurant-047',
    english: 'I have never tried this before.',
    japanese: 'これは初めて食べます。',
    category: 'restaurant',
    situation: '初体験',
    difficulty: 1
  },
  {
    id: 'restaurant-048',
    english: 'This is my favorite dish.',
    japanese: 'これは私の大好きな料理です。',
    category: 'restaurant',
    situation: 'お気に入り',
    difficulty: 1
  },
  {
    id: 'restaurant-049',
    english: 'The portion is very generous.',
    japanese: '分量がとても多いです。',
    category: 'restaurant',
    situation: '分量評価',
    difficulty: 2
  },
  {
    id: 'restaurant-050',
    english: 'Can I have the recipe?',
    japanese: 'レシピを教えてもらえますか？',
    category: 'restaurant',
    situation: 'レシピ要求',
    difficulty: 1
  },

  // Stage 6: 苦情・問題 (Complaints & Issues)
  {
    id: 'restaurant-051',
    english: 'This is not what I ordered.',
    japanese: 'これは注文したものではありません。',
    category: 'restaurant',
    situation: '注文間違い',
    difficulty: 1
  },
  {
    id: 'restaurant-052',
    english: 'My order is taking too long.',
    japanese: '注文に時間がかかりすぎています。',
    category: 'restaurant',
    situation: '遅延苦情',
    difficulty: 2
  },
  {
    id: 'restaurant-053',
    english: 'Could you check on my order?',
    japanese: '注文の状況を確認してもらえますか？',
    category: 'restaurant',
    situation: '注文確認',
    difficulty: 1
  },
  {
    id: 'restaurant-054',
    english: 'The table is dirty.',
    japanese: 'テーブルが汚れています。',
    category: 'restaurant',
    situation: 'テーブル問題',
    difficulty: 1
  },
  {
    id: 'restaurant-055',
    english: 'Could you clean this, please?',
    japanese: 'これを清掃してもらえますか？',
    category: 'restaurant',
    situation: '清掃要求',
    difficulty: 1
  },
  {
    id: 'restaurant-056',
    english: 'I found something in my food.',
    japanese: '料理に何か入っています。',
    category: 'restaurant',
    situation: '異物混入',
    difficulty: 1
  },
  {
    id: 'restaurant-057',
    english: 'I would like to speak to the manager.',
    japanese: 'マネージャーと話したいです。',
    category: 'restaurant',
    situation: 'マネージャー要求',
    difficulty: 2
  },
  {
    id: 'restaurant-058',
    english: 'This is unacceptable.',
    japanese: 'これは受け入れられません。',
    category: 'restaurant',
    situation: '強い不満',
    difficulty: 1
  },
  {
    id: 'restaurant-059',
    english: 'Can you replace this dish?',
    japanese: 'この料理を交換してもらえますか？',
    category: 'restaurant',
    situation: '料理交換',
    difficulty: 1
  },
  {
    id: 'restaurant-060',
    english: 'I am not satisfied with the service.',
    japanese: 'サービスに満足していません。',
    category: 'restaurant',
    situation: 'サービス不満',
    difficulty: 2
  },

  // Stage 7: アルコール・バー (Alcohol & Bar)
  {
    id: 'restaurant-061',
    english: 'Can I see the wine list?',
    japanese: 'ワインリストを見せてもらえますか？',
    category: 'restaurant',
    situation: 'ワインリスト要求',
    difficulty: 1
  },
  {
    id: 'restaurant-062',
    english: 'I would like a beer.',
    japanese: 'ビールをお願いします。',
    category: 'restaurant',
    situation: 'ビール注文',
    difficulty: 1
  },
  {
    id: 'restaurant-063',
    english: 'What cocktails do you have?',
    japanese: 'どのようなカクテルがありますか？',
    category: 'restaurant',
    situation: 'カクテル確認',
    difficulty: 1
  },
  {
    id: 'restaurant-064',
    english: 'Can you recommend a good wine?',
    japanese: '良いワインを推薦してもらえますか？',
    category: 'restaurant',
    situation: 'ワイン推薦',
    difficulty: 1
  },
  {
    id: 'restaurant-065',
    english: 'I do not drink alcohol.',
    japanese: 'アルコールは飲みません。',
    category: 'restaurant',
    situation: 'アルコール拒否',
    difficulty: 1
  },
  {
    id: 'restaurant-066',
    english: 'Do you have non-alcoholic drinks?',
    japanese: 'ノンアルコール飲料はありますか？',
    category: 'restaurant',
    situation: 'ノンアルコール確認',
    difficulty: 2
  },
  {
    id: 'restaurant-067',
    english: 'This wine pairs well with the food.',
    japanese: 'このワインは料理とよく合います。',
    category: 'restaurant',
    situation: 'ワインペアリング',
    difficulty: 2
  },
  {
    id: 'restaurant-068',
    english: 'Can I have another round?',
    japanese: 'もう一杯お願いできますか？',
    category: 'restaurant',
    situation: '追加注文',
    difficulty: 1
  },
  {
    id: 'restaurant-069',
    english: 'What is the alcohol content?',
    japanese: 'アルコール度数はどのくらいですか？',
    category: 'restaurant',
    situation: 'アルコール度数確認',
    difficulty: 2
  },
  {
    id: 'restaurant-070',
    english: 'I have had enough to drink.',
    japanese: 'もう十分飲みました。',
    category: 'restaurant',
    situation: '飲酒終了',
    difficulty: 1
  },

  // Stage 8: デザート・コーヒー (Dessert & Coffee)
  {
    id: 'restaurant-071',
    english: 'Do you have dessert?',
    japanese: 'デザートはありますか？',
    category: 'restaurant',
    situation: 'デザート確認',
    difficulty: 1
  },
  {
    id: 'restaurant-072',
    english: 'What flavors of ice cream do you have?',
    japanese: 'どのような味のアイスクリームがありますか？',
    category: 'restaurant',
    situation: 'アイスクリーム確認',
    difficulty: 1
  },
  {
    id: 'restaurant-073',
    english: 'I would like some cake.',
    japanese: 'ケーキをお願いします。',
    category: 'restaurant',
    situation: 'ケーキ注文',
    difficulty: 1
  },
  {
    id: 'restaurant-074',
    english: 'Can I have coffee after the meal?',
    japanese: '食後にコーヒーをお願いできますか？',
    category: 'restaurant',
    situation: '食後コーヒー',
    difficulty: 1
  },
  {
    id: 'restaurant-075',
    english: 'Do you have decaf coffee?',
    japanese: 'カフェインレスコーヒーはありますか？',
    category: 'restaurant',
    situation: 'デカフェ確認',
    difficulty: 2
  },
  {
    id: 'restaurant-076',
    english: 'This dessert is too sweet.',
    japanese: 'このデザートは甘すぎます。',
    category: 'restaurant',
    situation: 'デザート評価',
    difficulty: 1
  },
  {
    id: 'restaurant-077',
    english: 'Can I share this dessert?',
    japanese: 'このデザートをシェアできますか？',
    category: 'restaurant',
    situation: 'デザートシェア',
    difficulty: 1
  },
  {
    id: 'restaurant-078',
    english: 'Do you have fresh fruit?',
    japanese: '新鮮なフルーツはありますか？',
    category: 'restaurant',
    situation: 'フルーツ確認',
    difficulty: 1
  },
  {
    id: 'restaurant-079',
    english: 'The chocolate cake looks delicious.',
    japanese: 'チョコレートケーキが美味しそうです。',
    category: 'restaurant',
    situation: 'ケーキ評価',
    difficulty: 1
  },
  {
    id: 'restaurant-080',
    english: 'Can I have extra cream?',
    japanese: '追加でクリームをもらえますか？',
    category: 'restaurant',
    situation: 'クリーム追加',
    difficulty: 1
  },

  // Stage 9: 特別な機会 (Special Occasions)
  {
    id: 'restaurant-081',
    english: 'We are celebrating an anniversary.',
    japanese: '記念日をお祝いしています。',
    category: 'restaurant',
    situation: '記念日',
    difficulty: 2
  },
  {
    id: 'restaurant-082',
    english: 'It is my birthday today.',
    japanese: '今日は私の誕生日です。',
    category: 'restaurant',
    situation: '誕生日',
    difficulty: 1
  },
  {
    id: 'restaurant-083',
    english: 'Can you bring a birthday cake?',
    japanese: 'バースデーケーキを持ってきてもらえますか？',
    category: 'restaurant',
    situation: 'バースデーケーキ',
    difficulty: 1
  },
  {
    id: 'restaurant-084',
    english: 'This is a special occasion.',
    japanese: 'これは特別な機会です。',
    category: 'restaurant',
    situation: '特別な機会',
    difficulty: 1
  },
  {
    id: 'restaurant-085',
    english: 'Can we have some privacy?',
    japanese: 'プライベートな席をお願いできますか？',
    category: 'restaurant',
    situation: 'プライベート要求',
    difficulty: 2
  },
  {
    id: 'restaurant-086',
    english: 'We would like to make a toast.',
    japanese: '乾杯をしたいです。',
    category: 'restaurant',
    situation: '乾杯',
    difficulty: 1
  },
  {
    id: 'restaurant-087',
    english: 'Could you take our photo?',
    japanese: '写真を撮ってもらえますか？',
    category: 'restaurant',
    situation: '写真撮影',
    difficulty: 1
  },
  {
    id: 'restaurant-088',
    english: 'This meal was perfect.',
    japanese: 'この食事は完璧でした。',
    category: 'restaurant',
    situation: '食事満足',
    difficulty: 1
  },
  {
    id: 'restaurant-089',
    english: 'Thank you for making this special.',
    japanese: '特別にしてくださってありがとうございます。',
    category: 'restaurant',
    situation: '特別感謝',
    difficulty: 2
  },
  {
    id: 'restaurant-090',
    english: 'We will definitely come back.',
    japanese: '必ずまた来ます。',
    category: 'restaurant',
    situation: '再訪約束',
    difficulty: 1
  },

  // Stage 10: 別れ・感謝 (Farewell & Gratitude)
  {
    id: 'restaurant-091',
    english: 'Thank you for the wonderful meal.',
    japanese: '素晴らしい食事をありがとうございました。',
    category: 'restaurant',
    situation: '食事感謝',
    difficulty: 2
  },
  {
    id: 'restaurant-092',
    english: 'The service was exceptional.',
    japanese: 'サービスが格別でした。',
    category: 'restaurant',
    situation: 'サービス賞賛',
    difficulty: 2
  },
  {
    id: 'restaurant-093',
    english: 'I will recommend this place.',
    japanese: 'この店を推薦します。',
    category: 'restaurant',
    situation: '推薦約束',
    difficulty: 1
  },
  {
    id: 'restaurant-094',
    english: 'Everything was delicious.',
    japanese: 'すべて美味しかったです。',
    category: 'restaurant',
    situation: '全体満足',
    difficulty: 1
  },
  {
    id: 'restaurant-095',
    english: 'Have a good evening.',
    japanese: '良い夜をお過ごしください。',
    category: 'restaurant',
    situation: '夜の挨拶',
    difficulty: 1
  },
  {
    id: 'restaurant-096',
    english: 'We had a great time.',
    japanese: '素晴らしい時間を過ごしました。',
    category: 'restaurant',
    situation: '時間満足',
    difficulty: 1
  },
  {
    id: 'restaurant-097',
    english: 'Thank you for your hospitality.',
    japanese: 'おもてなしをありがとうございます。',
    category: 'restaurant',
    situation: 'もてなし感謝',
    difficulty: 2
  },
  {
    id: 'restaurant-098',
    english: 'Good night and thank you.',
    japanese: 'おやすみなさい、ありがとうございました。',
    category: 'restaurant',
    situation: '夜の感謝',
    difficulty: 1
  },
  {
    id: 'restaurant-099',
    english: 'See you next time.',
    japanese: 'また次回お会いしましょう。',
    category: 'restaurant',
    situation: '次回約束',
    difficulty: 1
  },
  {
    id: 'restaurant-100',
    english: 'This was an unforgettable experience.',
    japanese: 'これは忘れられない体験でした。',
    category: 'restaurant',
    situation: '忘れられない体験',
    difficulty: 2
  }
]
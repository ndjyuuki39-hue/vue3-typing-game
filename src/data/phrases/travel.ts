import type { PhraseContent } from '@/stores/content'

// Travel - 10 Stages × 10 Phrases = 100 Phrases
export const travelPhrases: PhraseContent[] = [
  // Stage 1: 基本的な旅行表現 (Basic Travel - moved from daily)
  {
    id: 'travel-001',
    english: 'I love traveling.',
    japanese: '旅行が大好きです。',
    category: 'travel',
    situation: '旅行趣味',
    difficulty: 1
  },
  {
    id: 'travel-002',
    english: 'Where is the nearest station?',
    japanese: '最寄りの駅はどこですか？',
    category: 'travel',
    situation: '道案内',
    difficulty: 1
  },
  {
    id: 'travel-003',
    english: 'How much is the ticket?',
    japanese: 'チケットはいくらですか？',
    category: 'travel',
    situation: '料金確認',
    difficulty: 1
  },
  {
    id: 'travel-004',
    english: 'Where can I buy tickets?',
    japanese: 'どこでチケットを買えますか？',
    category: 'travel',
    situation: 'チケット購入場所',
    difficulty: 1
  },
  {
    id: 'travel-005',
    english: 'What time does the train leave?',
    japanese: '電車は何時に出発しますか？',
    category: 'travel',
    situation: '出発時間確認',
    difficulty: 1
  },
  {
    id: 'travel-006',
    english: 'Is this the right platform?',
    japanese: 'これは正しいホームですか？',
    category: 'travel',
    situation: 'ホーム確認',
    difficulty: 1
  },
  {
    id: 'travel-007',
    english: 'How long is the journey?',
    japanese: '旅行時間はどのくらいですか？',
    category: 'travel',
    situation: '所要時間確認',
    difficulty: 1
  },
  {
    id: 'travel-008',
    english: 'I need directions to the hotel.',
    japanese: 'ホテルへの道順が必要です。',
    category: 'travel',
    situation: '道案内要求',
    difficulty: 1
  },
  {
    id: 'travel-009',
    english: 'Where is the tourist information?',
    japanese: '観光案内所はどこですか？',
    category: 'travel',
    situation: '観光案内所確認',
    difficulty: 1
  },
  {
    id: 'travel-010',
    english: 'Can you help me with directions?',
    japanese: '道案内を手伝ってもらえますか？',
    category: 'travel',
    situation: '道案内依頼',
    difficulty: 1
  },

  // Stage 2: 宿泊・ホテル (Accommodation & Hotels)
  {
    id: 'travel-011',
    english: 'I have a hotel reservation.',
    japanese: 'ホテルの予約をしています。',
    category: 'travel',
    situation: '予約確認',
    difficulty: 1
  },
  {
    id: 'travel-012',
    english: 'Do you have any rooms available?',
    japanese: '空いている部屋はありますか？',
    category: 'travel',
    situation: '空室確認',
    difficulty: 1
  },
  {
    id: 'travel-013',
    english: 'How much is a single room?',
    japanese: 'シングルルームはいくらですか？',
    category: 'travel',
    situation: '部屋料金確認',
    difficulty: 1
  },
  {
    id: 'travel-014',
    english: 'I would like to check in.',
    japanese: 'チェックインしたいです。',
    category: 'travel',
    situation: 'チェックイン',
    difficulty: 1
  },
  {
    id: 'travel-015',
    english: 'What time is checkout?',
    japanese: 'チェックアウトは何時ですか？',
    category: 'travel',
    situation: 'チェックアウト時間',
    difficulty: 1
  },
  {
    id: 'travel-016',
    english: 'Could I have a wake-up call?',
    japanese: 'モーニングコールをお願いできますか？',
    category: 'travel',
    situation: 'モーニングコール依頼',
    difficulty: 2
  },
  {
    id: 'travel-017',
    english: 'The room is very comfortable.',
    japanese: '部屋はとても快適です。',
    category: 'travel',
    situation: '部屋評価',
    difficulty: 1
  },
  {
    id: 'travel-018',
    english: 'Is breakfast included?',
    japanese: '朝食は含まれていますか？',
    category: 'travel',
    situation: '朝食確認',
    difficulty: 1
  },
  {
    id: 'travel-019',
    english: 'Where is the elevator?',
    japanese: 'エレベーターはどこですか？',
    category: 'travel',
    situation: 'エレベーター確認',
    difficulty: 1
  },
  {
    id: 'travel-020',
    english: 'Can you store my luggage?',
    japanese: '荷物を預かってもらえますか？',
    category: 'travel',
    situation: '荷物預け',
    difficulty: 1
  },

  // Stage 3: 交通機関 (Transportation)
  {
    id: 'travel-021',
    english: 'Where is the bus stop?',
    japanese: 'バス停はどこですか？',
    category: 'travel',
    situation: 'バス停確認',
    difficulty: 1
  },
  {
    id: 'travel-022',
    english: 'Which bus goes to downtown?',
    japanese: 'どのバスが繁華街に行きますか？',
    category: 'travel',
    situation: 'バス路線確認',
    difficulty: 1
  },
  {
    id: 'travel-023',
    english: 'How often do buses run?',
    japanese: 'バスはどのくらいの頻度で運行していますか？',
    category: 'travel',
    situation: 'バス頻度確認',
    difficulty: 2
  },
  {
    id: 'travel-024',
    english: 'I need a taxi.',
    japanese: 'タクシーが必要です。',
    category: 'travel',
    situation: 'タクシー要求',
    difficulty: 1
  },
  {
    id: 'travel-025',
    english: 'Can you call a taxi for me?',
    japanese: 'タクシーを呼んでもらえますか？',
    category: 'travel',
    situation: 'タクシー依頼',
    difficulty: 1
  },
  {
    id: 'travel-026',
    english: 'Take me to the airport.',
    japanese: '空港まで連れて行ってください。',
    category: 'travel',
    situation: '空港行き',
    difficulty: 1
  },
  {
    id: 'travel-027',
    english: 'How much will it cost?',
    japanese: 'いくらかかりますか？',
    category: 'travel',
    situation: '料金確認',
    difficulty: 1
  },
  {
    id: 'travel-028',
    english: 'Is there a subway nearby?',
    japanese: '近くに地下鉄はありますか？',
    category: 'travel',
    situation: '地下鉄確認',
    difficulty: 1
  },
  {
    id: 'travel-029',
    english: 'I missed my train.',
    japanese: '電車に乗り遅れました。',
    category: 'travel',
    situation: '電車遅れ',
    difficulty: 1
  },
  {
    id: 'travel-030',
    english: 'When is the next flight?',
    japanese: '次の便はいつですか？',
    category: 'travel',
    situation: '次便確認',
    difficulty: 1
  },

  // Stage 4: 空港・飛行機 (Airport & Flight)
  {
    id: 'travel-031',
    english: 'Where is the check-in counter?',
    japanese: 'チェックインカウンターはどこですか？',
    category: 'travel',
    situation: 'チェックイン確認',
    difficulty: 1
  },
  {
    id: 'travel-032',
    english: 'I need to check my luggage.',
    japanese: '荷物を預ける必要があります。',
    category: 'travel',
    situation: '荷物預け',
    difficulty: 1
  },
  {
    id: 'travel-033',
    english: 'What is my gate number?',
    japanese: '私のゲート番号は何番ですか？',
    category: 'travel',
    situation: 'ゲート確認',
    difficulty: 1
  },
  {
    id: 'travel-034',
    english: 'My flight has been delayed.',
    japanese: 'フライトが遅延しました。',
    category: 'travel',
    situation: 'フライト遅延',
    difficulty: 1
  },
  {
    id: 'travel-035',
    english: 'Where is the boarding gate?',
    japanese: '搭乗ゲートはどこですか？',
    category: 'travel',
    situation: '搭乗ゲート確認',
    difficulty: 1
  },
  {
    id: 'travel-036',
    english: 'Can I upgrade to business class?',
    japanese: 'ビジネスクラスにアップグレードできますか？',
    category: 'travel',
    situation: 'アップグレード要求',
    difficulty: 2
  },
  {
    id: 'travel-037',
    english: 'I have a connecting flight.',
    japanese: '乗り継ぎ便があります。',
    category: 'travel',
    situation: '乗り継ぎ',
    difficulty: 1
  },
  {
    id: 'travel-038',
    english: 'Where is the baggage claim?',
    japanese: '手荷物受取所はどこですか？',
    category: 'travel',
    situation: '荷物受取所確認',
    difficulty: 1
  },
  {
    id: 'travel-039',
    english: 'My luggage is damaged.',
    japanese: '荷物が破損しています。',
    category: 'travel',
    situation: '荷物破損',
    difficulty: 1
  },
  {
    id: 'travel-040',
    english: 'Can I get an aisle seat?',
    japanese: '通路側の席をもらえますか？',
    category: 'travel',
    situation: '座席要求',
    difficulty: 1
  },

  // Stage 5: 観光・名所 (Sightseeing & Attractions)
  {
    id: 'travel-041',
    english: 'What are the famous attractions?',
    japanese: '有名な観光地は何ですか？',
    category: 'travel',
    situation: '観光地確認',
    difficulty: 1
  },
  {
    id: 'travel-042',
    english: 'How much is the entrance fee?',
    japanese: '入場料はいくらですか？',
    category: 'travel',
    situation: '入場料確認',
    difficulty: 1
  },
  {
    id: 'travel-043',
    english: 'Can you take our picture?',
    japanese: '写真を撮ってもらえますか？',
    category: 'travel',
    situation: '写真撮影依頼',
    difficulty: 1
  },
  {
    id: 'travel-044',
    english: 'When does the museum open?',
    japanese: '博物館は何時に開きますか？',
    category: 'travel',
    situation: '開館時間確認',
    difficulty: 1
  },
  {
    id: 'travel-045',
    english: 'Is there a guided tour?',
    japanese: 'ガイドツアーはありますか？',
    category: 'travel',
    situation: 'ガイドツアー確認',
    difficulty: 1
  },
  {
    id: 'travel-046',
    english: 'Where can I buy souvenirs?',
    japanese: 'どこでお土産を買えますか？',
    category: 'travel',
    situation: 'お土産購入',
    difficulty: 1
  },
  {
    id: 'travel-047',
    english: 'The view is breathtaking.',
    japanese: '景色が息をのむほど美しいです。',
    category: 'travel',
    situation: '景色賞賛',
    difficulty: 2
  },
  {
    id: 'travel-048',
    english: 'Can I get a map?',
    japanese: '地図をもらえますか？',
    category: 'travel',
    situation: '地図要求',
    difficulty: 1
  },
  {
    id: 'travel-049',
    english: 'What time does it close?',
    japanese: '何時に閉まりますか？',
    category: 'travel',
    situation: '閉館時間確認',
    difficulty: 1
  },
  {
    id: 'travel-050',
    english: 'This place is amazing.',
    japanese: 'この場所は素晴らしいです。',
    category: 'travel',
    situation: '場所評価',
    difficulty: 1
  },

  // Stage 6: レンタカー・運転 (Car Rental & Driving)
  {
    id: 'travel-051',
    english: 'I want to rent a car.',
    japanese: '車をレンタルしたいです。',
    category: 'travel',
    situation: 'レンタカー要求',
    difficulty: 1
  },
  {
    id: 'travel-052',
    english: 'Do I need an international license?',
    japanese: '国際免許証が必要ですか？',
    category: 'travel',
    situation: '国際免許確認',
    difficulty: 2
  },
  {
    id: 'travel-053',
    english: 'Where can I park?',
    japanese: 'どこに駐車できますか？',
    category: 'travel',
    situation: '駐車場確認',
    difficulty: 1
  },
  {
    id: 'travel-054',
    english: 'How much is the parking fee?',
    japanese: '駐車料金はいくらですか？',
    category: 'travel',
    situation: '駐車料金確認',
    difficulty: 1
  },
  {
    id: 'travel-055',
    english: 'Fill it up with gas, please.',
    japanese: 'ガソリンを満タンにしてください。',
    category: 'travel',
    situation: 'ガソリン給油',
    difficulty: 1
  },
  {
    id: 'travel-056',
    english: 'Which way to the highway?',
    japanese: '高速道路はどちら方向ですか？',
    category: 'travel',
    situation: '高速道路確認',
    difficulty: 1
  },
  {
    id: 'travel-057',
    english: 'I think we are lost.',
    japanese: '道に迷ったと思います。',
    category: 'travel',
    situation: '道迷い',
    difficulty: 1
  },
  {
    id: 'travel-058',
    english: 'Can you show me on the GPS?',
    japanese: 'GPSで教えてもらえますか？',
    category: 'travel',
    situation: 'GPS確認',
    difficulty: 1
  },
  {
    id: 'travel-059',
    english: 'The car has a flat tire.',
    japanese: '車がパンクしました。',
    category: 'travel',
    situation: 'パンク',
    difficulty: 1
  },
  {
    id: 'travel-060',
    english: 'Where is the nearest gas station?',
    japanese: '一番近いガソリンスタンドはどこですか？',
    category: 'travel',
    situation: 'ガソリンスタンド確認',
    difficulty: 1
  },

  // Stage 7: 通貨・両替 (Currency & Exchange)
  {
    id: 'travel-061',
    english: 'Where can I exchange money?',
    japanese: 'どこでお金を両替できますか？',
    category: 'travel',
    situation: '両替所確認',
    difficulty: 1
  },
  {
    id: 'travel-062',
    english: 'What is the exchange rate?',
    japanese: '為替レートはいくらですか？',
    category: 'travel',
    situation: '為替レート確認',
    difficulty: 1
  },
  {
    id: 'travel-063',
    english: 'Do you accept credit cards?',
    japanese: 'クレジットカードは使えますか？',
    category: 'travel',
    situation: 'カード使用確認',
    difficulty: 1
  },
  {
    id: 'travel-064',
    english: 'Can I pay with cash?',
    japanese: '現金で払えますか？',
    category: 'travel',
    situation: '現金支払い確認',
    difficulty: 1
  },
  {
    id: 'travel-065',
    english: 'Is there a service fee?',
    japanese: 'サービス料はありますか？',
    category: 'travel',
    situation: 'サービス料確認',
    difficulty: 1
  },
  {
    id: 'travel-066',
    english: 'I need smaller bills.',
    japanese: 'もっと小さい紙幣が必要です。',
    category: 'travel',
    situation: '小額紙幣要求',
    difficulty: 1
  },
  {
    id: 'travel-067',
    english: 'Where is the nearest ATM?',
    japanese: '一番近いATMはどこですか？',
    category: 'travel',
    situation: 'ATM確認',
    difficulty: 1
  },
  {
    id: 'travel-068',
    english: 'My card is not working.',
    japanese: 'カードが使えません。',
    category: 'travel',
    situation: 'カード故障',
    difficulty: 1
  },
  {
    id: 'travel-069',
    english: 'Can I get a receipt?',
    japanese: 'レシートをもらえますか？',
    category: 'travel',
    situation: 'レシート要求',
    difficulty: 1
  },
  {
    id: 'travel-070',
    english: 'How much is the commission?',
    japanese: '手数料はいくらですか？',
    category: 'travel',
    situation: '手数料確認',
    difficulty: 1
  },

  // Stage 8: 言語・コミュニケーション (Language & Communication)
  {
    id: 'travel-071',
    english: 'Do you speak English?',
    japanese: '英語を話せますか？',
    category: 'travel',
    situation: '英語確認',
    difficulty: 1
  },
  {
    id: 'travel-072',
    english: 'I do not understand.',
    japanese: '理解できません。',
    category: 'travel',
    situation: '理解困難',
    difficulty: 1
  },
  {
    id: 'travel-073',
    english: 'Could you speak more slowly?',
    japanese: 'もっとゆっくり話してもらえますか？',
    category: 'travel',
    situation: 'ゆっくり話す依頼',
    difficulty: 1
  },
  {
    id: 'travel-074',
    english: 'Can you translate this?',
    japanese: 'これを翻訳してもらえますか？',
    category: 'travel',
    situation: '翻訳依頼',
    difficulty: 1
  },
  {
    id: 'travel-075',
    english: 'How do you say this?',
    japanese: 'これは何と言いますか？',
    category: 'travel',
    situation: '表現確認',
    difficulty: 1
  },
  {
    id: 'travel-076',
    english: 'I am learning your language.',
    japanese: 'あなたの言語を学んでいます。',
    category: 'travel',
    situation: '言語学習',
    difficulty: 1
  },
  {
    id: 'travel-077',
    english: 'Thank you for your patience.',
    japanese: '辛抱強く対応してくださってありがとう。',
    category: 'travel',
    situation: '忍耐感謝',
    difficulty: 2
  },
  {
    id: 'travel-078',
    english: 'Can you point to it?',
    japanese: 'それを指差してもらえますか？',
    category: 'travel',
    situation: '指差し依頼',
    difficulty: 1
  },
  {
    id: 'travel-079',
    english: 'I need help with directions.',
    japanese: '道案内で助けが必要です。',
    category: 'travel',
    situation: '道案内支援',
    difficulty: 1
  },
  {
    id: 'travel-080',
    english: 'You are very kind.',
    japanese: 'あなたはとても親切です。',
    category: 'travel',
    situation: '親切感謝',
    difficulty: 1
  },

  // Stage 9: 天気・季節 (Weather & Seasons)
  {
    id: 'travel-081',
    english: 'What is the weather like?',
    japanese: '天気はどうですか？',
    category: 'travel',
    situation: '天気確認',
    difficulty: 1
  },
  {
    id: 'travel-082',
    english: 'It is very hot today.',
    japanese: '今日はとても暑いです。',
    category: 'travel',
    situation: '暑さ表現',
    difficulty: 1
  },
  {
    id: 'travel-083',
    english: 'I need an umbrella.',
    japanese: '傘が必要です。',
    category: 'travel',
    situation: '傘要求',
    difficulty: 1
  },
  {
    id: 'travel-084',
    english: 'When is the rainy season?',
    japanese: '雨季はいつですか？',
    category: 'travel',
    situation: '雨季確認',
    difficulty: 1
  },
  {
    id: 'travel-085',
    english: 'The temperature is perfect.',
    japanese: '気温が完璧です。',
    category: 'travel',
    situation: '気温評価',
    difficulty: 1
  },
  {
    id: 'travel-086',
    english: 'I did not expect it to be so cold.',
    japanese: 'こんなに寒いとは予想していませんでした。',
    category: 'travel',
    situation: '寒さ驚き',
    difficulty: 2
  },
  {
    id: 'travel-087',
    english: 'What should I wear?',
    japanese: '何を着るべきですか？',
    category: 'travel',
    situation: '服装確認',
    difficulty: 1
  },
  {
    id: 'travel-088',
    english: 'The sunset is beautiful.',
    japanese: '夕日が美しいです。',
    category: 'travel',
    situation: '夕日賞賛',
    difficulty: 1
  },
  {
    id: 'travel-089',
    english: 'Is this the best time to visit?',
    japanese: 'これが訪問するのに最適な時期ですか？',
    category: 'travel',
    situation: '訪問時期確認',
    difficulty: 2
  },
  {
    id: 'travel-090',
    english: 'The weather forecast says rain.',
    japanese: '天気予報では雨と言っています。',
    category: 'travel',
    situation: '天気予報',
    difficulty: 2
  },

  // Stage 10: 感想・別れ (Impressions & Farewell)
  {
    id: 'travel-091',
    english: 'I had a wonderful time.',
    japanese: '素晴らしい時間を過ごしました。',
    category: 'travel',
    situation: '感想表現',
    difficulty: 1
  },
  {
    id: 'travel-092',
    english: 'This trip was unforgettable.',
    japanese: 'この旅は忘れられません。',
    category: 'travel',
    situation: '旅行評価',
    difficulty: 2
  },
  {
    id: 'travel-093',
    english: 'I want to come back again.',
    japanese: 'また戻って来たいです。',
    category: 'travel',
    situation: '再訪希望',
    difficulty: 1
  },
  {
    id: 'travel-094',
    english: 'Thank you for your hospitality.',
    japanese: 'おもてなしをありがとうございます。',
    category: 'travel',
    situation: 'もてなし感謝',
    difficulty: 2
  },
  {
    id: 'travel-095',
    english: 'I will recommend this place.',
    japanese: 'この場所を推薦します。',
    category: 'travel',
    situation: '推薦宣言',
    difficulty: 1
  },
  {
    id: 'travel-096',
    english: 'It was nice meeting you.',
    japanese: 'お会いできて良かったです。',
    category: 'travel',
    situation: '出会い感謝',
    difficulty: 1
  },
  {
    id: 'travel-097',
    english: 'Safe travels!',
    japanese: '良い旅を！',
    category: 'travel',
    situation: '旅の挨拶',
    difficulty: 1
  },
  {
    id: 'travel-098',
    english: 'I hope to see you again.',
    japanese: 'また会えることを願っています。',
    category: 'travel',
    situation: '再会希望',
    difficulty: 1
  },
  {
    id: 'travel-099',
    english: 'Take care of yourself.',
    japanese: 'お体に気をつけてください。',
    category: 'travel',
    situation: '健康気遣い',
    difficulty: 1
  },
  {
    id: 'travel-100',
    english: 'Goodbye and thank you.',
    japanese: 'さようなら、そしてありがとう。',
    category: 'travel',
    situation: '別れの挨拶',
    difficulty: 1
  }
]
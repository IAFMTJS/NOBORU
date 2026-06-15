-- Improve application exercise pedagogy: longer prompts, no spoiler hints.

update public.application_exercises
set
  prompt = 'Write the hiragana for the vowel sound “a”.',
  display_hint = null
where title = 'Hiragana a';

update public.application_exercises
set
  prompt = 'Read the kana below aloud, then type its romaji spelling.',
  display_hint = null
where title = 'Hiragana sa romaji';

update public.application_exercises
set
  prompt = 'Two familiar kana appear together. What English meaning do they form?',
  display_hint = 'Think of affection between friends or family.'
where title = 'Love in hiragana';

update public.application_exercises
set
  prompt = 'You are describing the early part of the day. Write it in hiragana.',
  display_hint = 'The word has three kana from rows you already know.'
where title = 'Morning in hiragana';

update public.application_exercises
set
  prompt = 'This everyday object keeps rain off your head. What is the English meaning?',
  display_hint = null
where title = 'Umbrella meaning';

update public.application_exercises
set
  prompt = 'A common fish name in Japanese cuisine — write it in hiragana.',
  display_hint = 'Two kana; often served grilled at mountain lodges.'
where title = 'Salmon in hiragana';

update public.application_exercises
set
  prompt = 'Write the polite Japanese word for “you” in hiragana.',
  display_hint = 'Three kana; used carefully in real conversation.'
where title = 'You in hiragana';

update public.application_exercises
set
  prompt = 'What does this Japanese word mean in English?',
  display_hint = null
where title = 'You meaning';

update public.application_exercises
set
  prompt = 'Translate the sentence into hiragana: “You are well.”',
  display_hint = 'Use は between the topic and the adjective, and end with です.'
where title = 'You are well';

update public.application_exercises
set
  prompt = 'Write the Japanese word for “friend” in hiragana.',
  display_hint = 'Four kana; a core word for talking about companions on the trail.'
where title = 'Friend in hiragana';

update public.application_exercises
set
  prompt = 'Read the sentence and translate it into natural English.',
  display_hint = null
where title = 'You are happy';

update public.application_exercises
set
  prompt = 'What does this word mean in English?',
  display_hint = null
where title = 'Fish in hiragana';

update public.application_exercises
set
  prompt = 'Write the Japanese word for “river” in hiragana.',
  display_hint = 'Two kana; flowing water beside many real trails.'
where title = 'Voiced fish';

update public.application_exercises
set
  prompt = 'Write the Japanese word for “today” in hiragana, including the long vowel.',
  display_hint = 'Uses a small ょ combination — review your きょう pattern.'
where title = 'Combination kyō';

update public.application_exercises
set
  prompt = 'Write the katakana for the vowel sound “a”.',
  display_hint = null
where title = 'Katakana a';

update public.application_exercises
set
  prompt = 'Read the katakana below, then type its romaji spelling.',
  display_hint = null
where title = 'Katakana sa romaji';

update public.application_exercises
set
  prompt = 'This loan-word treat is popular in summer. What does it mean in English?',
  display_hint = null
where title = 'Ice in katakana';

update public.application_exercises
set
  prompt = 'Write the Japanese loan word for “coffee” in katakana.',
  display_hint = 'Listen for a long vowel in the middle syllable.'
where title = 'Coffee in katakana';

update public.application_exercises
set
  prompt = 'Write the katakana for “you” as used in some bold signage.',
  display_hint = 'Same reading you learned in hiragana — different script.'
where title = 'You in katakana';

update public.application_exercises
set
  prompt = 'Read the katakana sentence and translate it into natural English.',
  display_hint = null
where title = 'Happy in katakana phrase';

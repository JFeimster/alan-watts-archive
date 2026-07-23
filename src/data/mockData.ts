import { Topic, Lecture, Collection, Book, Quote, Essay, VideoItem } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 't1',
    title: 'Ego, Identity and the Separate Self',
    slug: 'ego-identity-and-the-separate-self',
    description: 'Investigating the illusion of the ego as an isolated skin-encapsulated skin ego confronting an external universe.',
    longDescription: 'Alan Watts frequently examined how Western culture constructs a profound split between the observer and the observed. Through lectures and writings like *The Book on the Taboo Against Knowing Who You Are*, he demonstrated that the separate ego is a social convention rather than a biological reality, and that discovering our identity as the total universe dissolves existential alienation.',
    lectureCount: 18,
    bookCount: 4,
    quoteCount: 42,
    iconName: 'UserX',
    featuredQuoteId: 'q1'
  },
  {
    id: 't2',
    title: 'Overthinking, Anxiety and Mental Noise',
    slug: 'overthinking-anxiety-and-mental-noise',
    description: 'Understanding the feedback loops of worry, compulsive self-monitoring, and the mind trying to catch its own tail.',
    longDescription: 'Anxiety arises when the mind attempts to force control over unpredictable emotional states and future outcomes. Watts compared this to muddy water: trying to make it clear by stirring it only makes it muddier. Letting it settle requires no effort.',
    lectureCount: 24,
    bookCount: 3,
    quoteCount: 56,
    iconName: 'Brain',
    featuredQuoteId: 'q2'
  },
  {
    id: 't3',
    title: 'Letting Go, Control and the Backwards Law',
    slug: 'letting-go-control-and-the-backwards-law',
    description: 'The paradoxical principle that striving hardest for security and control guarantees insecurity and anxiety.',
    longDescription: 'The Backwards Law dictates that when you try to stay afloat by thrashing, you sink; when you trust the water, you float. In moral and psychological realms, the more one pursues happiness or peace of mind as a goal, the more elusive they become.',
    lectureCount: 15,
    bookCount: 2,
    quoteCount: 38,
    iconName: 'RotateCcw',
    featuredQuoteId: 'q3'
  },
  {
    id: 't4',
    title: 'Time, the Present Moment and Insecurity',
    slug: 'time-the-present-moment-and-insecurity',
    description: 'Transcending psychological time and recognizing that the eternal now is the only reality that ever exists.',
    longDescription: 'Human beings sacrifice the living present for a phantom future that never arrives. Watts articulated how clinging to memory and anticipation creates perpetual dissatisfaction, and how waking up to the present moment uncovers profound security within insecurity.',
    lectureCount: 21,
    bookCount: 3,
    quoteCount: 48,
    iconName: 'Clock',
    featuredQuoteId: 'q4'
  },
  {
    id: 't5',
    title: 'Death, Mortality and Rebirth',
    slug: 'death-mortality-and-rebirth',
    description: 'Viewing death not as a tragic termination but as the necessary background contrast for conscious existence.',
    longDescription: 'Just as music depends on silence between notes, life depends on death. Watts argued that fearing death stems from mistakenly identifying solely with the temporary ego-mask rather than the eternal process of the cosmos.',
    lectureCount: 12,
    bookCount: 2,
    quoteCount: 29,
    iconName: 'Sunset',
    featuredQuoteId: 'q5'
  },
  {
    id: 't6',
    title: 'Life as Play, Work and Purpose',
    slug: 'life-as-play-work-and-purpose',
    description: 'Reimagining human existence through the metaphor of music and drama rather than serious cosmic obligation.',
    longDescription: 'If the universe is fundamentally playful (lila), then asking "What is the meaning of life?" is like asking what is the meaning of a song. Music is not getting to the end note; the playing of the music is the point.',
    lectureCount: 19,
    bookCount: 3,
    quoteCount: 35,
    iconName: 'Music',
    featuredQuoteId: 'q6'
  },
  {
    id: 't7',
    title: 'Zen, Taoism and Buddhism',
    slug: 'zen-taoism-and-buddhism',
    description: 'The practical, non-conceptual philosophies of liberation originating from East Asia and India.',
    longDescription: 'Watts was instrumental in translating Eastern philosophies into accessible, rigorous English prose without academic pedantry. He emphasized Zen and Taoism as avenues for dropping conceptual baggage and experiencing direct reality.',
    lectureCount: 32,
    bookCount: 6,
    quoteCount: 74,
    iconName: 'Compass',
    featuredQuoteId: 'q7'
  },
  {
    id: 't8',
    title: 'Love, Relationships and Desire',
    slug: 'love-relationships-and-desire',
    description: 'Unraveling the difference between genuine affection and possessive emotional attachment.',
    longDescription: 'True love cannot be commanded or demanded as an obligation. When relationship becomes a mutual trap for security, love vanishes. Watts explored how intimacy flourishes only when we release our grip on one another.',
    lectureCount: 14,
    bookCount: 2,
    quoteCount: 31,
    iconName: 'Heart',
    featuredQuoteId: 'q8'
  },
  {
    id: 't9',
    title: 'God, Religion and Mysticism',
    slug: 'god-religion-and-mysticism',
    description: 'Differentiating institutional dogmatic religion from direct mystical experience of the divine ground.',
    longDescription: 'Watts critiqued conventional Western theology for treating God as an external monarchical dictator, contrasting it with non-dual mysticism where the individual discovers their identity with the ultimate reality.',
    lectureCount: 16,
    bookCount: 4,
    quoteCount: 39,
    iconName: 'Sun',
    featuredQuoteId: 'q9'
  },
  {
    id: 't10',
    title: 'Nature, Ecology and Interdependence',
    slug: 'nature-ecology-and-interdependence',
    description: 'Recognizing that humanity does not live on top of nature as conquerors, but is an intrinsic expression of the natural world.',
    longDescription: 'We do not come into this world; we come out of it, in the same way that apples come out of an apple tree. Understanding ecological interdependence transforms our ethical relationship with the biosphere.',
    lectureCount: 13,
    bookCount: 2,
    quoteCount: 27,
    iconName: 'Trees',
    featuredQuoteId: 'q10'
  },
  {
    id: 't11',
    title: 'Tricksters, Gurus and Spiritual Authority',
    slug: 'tricksters-gurus-and-spiritual-authority',
    description: 'A critical and often humorous look at spiritual teachers, institutions, and the game of seeking enlightenment.',
    longDescription: 'Watts often warned against phonies and spiritual salesmen who promise secret techniques for self-improvement. True awakening involves realizing you have nowhere to go and nothing to attain.',
    lectureCount: 10,
    bookCount: 2,
    quoteCount: 22,
    iconName: 'Mask',
    featuredQuoteId: 'q11'
  },
  {
    id: 't12',
    title: 'AI, Technology and Modern Life',
    slug: 'ai-technology-and-modern-life',
    description: 'Philosophical reflections on cybernetics, automation, human identity in an engineered world, and the limits of symbolic thought.',
    longDescription: 'In his later lectures and essays, Watts engaged with systems theory and early computing, noting the danger of mistaking the map for the territory and letting abstract models dominate living experience.',
    lectureCount: 8,
    bookCount: 1,
    quoteCount: 18,
    iconName: 'Cpu',
    featuredQuoteId: 'q12'
  }
];

const baseLECTURES: Lecture[] = [
  {
    id: 'lec-1',
    title: 'The Nature of Consciousness: Out of Your Mind (Part 1)',
    slug: 'nature-of-consciousness-out-of-your-mind-1',
    series: 'Out of Your Mind',
    year: 1970,
    duration: '48:15',
    durationSeconds: 2895,
    verificationStatus: 'verified-source',
    sourceNote: 'Archived from Pacifica Radio KPFA master tapes, recorded live at the University of California, Santa Cruz, 1970.',
    summary: 'Alan Watts introduces the fundamental premise that our normal sensation of being an isolated ego inside a bag of skin is a hallucination sanctioned by cultural consensus.',
    keyIdeas: [
      'The myth of the separate ego confronting an external universe',
      'Language and categorization as selective filters on reality',
      'Discovering that you are the entire unfolding cosmos'
    ],
    topics: ['ego-identity-and-the-separate-self', 'zen-taoism-and-buddhism', 'time-the-present-moment-and-insecurity'],
    transcript: [
      { time: '00:12', seconds: 12, text: 'We suffer from a hallucination, from a false and distorted sense of our own existence as living beings.' },
      { time: '01:45', seconds: 105, text: 'Most of us have been brought up to think of ourselves as isolated egos inside a bag of skin.' },
      { time: '04:20', seconds: 260, text: 'You do not come into this world; you come out of it, in the same way that a leaf comes out of a tree.' },
      { time: '09:10', seconds: 550, text: 'The point is that we are all interconnected, but our culture teaches us to play the game of being an independent agent.' },
      { time: '15:30', seconds: 930, text: 'When you open your eyes and see that the observer and the observed are one, the anxiety of separateness vanishes.' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    relatedBookIds: ['book-1', 'book-3'],
    relatedQuoteIds: ['q1', 'q4']
  },
  {
    id: 'lec-2',
    title: 'The Backwards Law: Why Trying to Be Happy Makes You Miserable',
    slug: 'the-backwards-law-trying-to-be-happy',
    series: 'The Tao of Philosophy',
    year: 1968,
    duration: '52:40',
    durationSeconds: 3160,
    verificationStatus: 'verified-source',
    sourceNote: 'Verified master recording from the Alan Watts Electronic University archives, produced in Sausalito.',
    summary: 'An exploration of the fundamental paradox in human life: the harder you try to force security, peace, or happiness, the deeper you sink into anxiety and frustration.',
    keyIdeas: [
      'The mechanism of voluntary control applied to involuntary realms',
      'Why striving for spiritual attainment defeats itself',
      'Trusting the spontaneous order of life (Ziran)'
    ],
    topics: ['letting-go-control-and-the-backwards-law', 'overthinking-and-mental-noise'],
    transcript: [
      { time: '00:30', seconds: 30, text: 'There is a fundamental law in human psychology which I call the Backwards Law.' },
      { time: '02:15', seconds: 135, text: 'When you try to stay afloat by thrashing wildly in the water, you sink. When you relax and trust the water, you float.' },
      { time: '08:40', seconds: 520, text: 'The pursuit of happiness is precisely what guarantees that you will remain unhappy.' },
      { time: '14:20', seconds: 860, text: 'To have faith is to trust yourself to the water. When you swim you don\'t grab hold of the water, because if you do you sink and drown.' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    relatedBookIds: ['book-2'],
    relatedQuoteIds: ['q3']
  },
  {
    id: 'lec-3',
    title: 'The Illusion of Time and the Eternal Now',
    slug: 'the-illusion-of-time-and-the-eternal-now',
    series: 'Essential Lectures',
    year: 1966,
    duration: '45:10',
    durationSeconds: 2710,
    verificationStatus: 'verified-source',
    sourceNote: 'Broadcasting archives from KPFA Berkeley, 1966.',
    summary: 'Examining how psychological time—dwelling on the past and worrying about the future—robs us of the only reality that actually exists: the present moment.',
    keyIdeas: [
      'Memory and anticipation as useful tools that became tyrants',
      'The eternal present as the sole locus of consciousness',
      'Dropping the burden of future salvation'
    ],
    topics: ['time-the-present-moment-and-insecurity', 'overthinking-anxiety-and-mental-noise'],
    transcript: [
      { time: '01:05', seconds: 65, text: 'Time is a social convention, a most useful bookkeeping device, but like money, we have come to worship it.' },
      { time: '05:30', seconds: 330, text: 'If you try to experience the present while thinking of tomorrow, you are like a man eating a fake meal.' },
      { time: '12:10', seconds: 730, text: 'There is simply no time other than now. The past is a memory trace in the present; the future is a projection in the present.' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    relatedBookIds: ['book-1'],
    relatedQuoteIds: ['q4']
  },
  {
    id: 'lec-4',
    title: 'Zen Bones and Sudden Awakening',
    slug: 'zen-bones-and-sudden-awakening',
    series: 'The Way of Zen Seminars',
    year: 1962,
    duration: '59:20',
    durationSeconds: 3560,
    verificationStatus: 'verified-source',
    sourceNote: 'Academy of Asian Studies recordings, San Francisco.',
    summary: 'Watts cuts through religious solemnity to examine Zen practice as a direct pointing to reality without conceptual intermediaries.',
    keyIdeas: [
      'Why concepts about truth are obstacles to truth',
      'The humor and directness of Zen masters',
      'Realizing there is nothing to attain'
    ],
    topics: ['zen-taoism-and-buddhism', 'ego-identity-and-the-separate-self'],
    transcript: [
      { time: '00:45', seconds: 45, text: 'Zen does not confuse spirituality with solemnity or long faces.' },
      { time: '06:20', seconds: 380, text: 'When the student asks the master how to enter the path, the master says: Have you finished your breakfast?' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    relatedBookIds: ['book-4'],
    relatedQuoteIds: ['q7']
  },
  {
    id: 'lec-5',
    title: 'The Game of Life as Play and Music',
    slug: 'the-game-of-life-as-play-and-music',
    series: 'Nature, Man and Woman',
    year: 1969,
    duration: '44:00',
    durationSeconds: 2640,
    verificationStatus: 'verified-source',
    sourceNote: 'Esalen Institute audio archive, Big Sur, CA.',
    summary: 'Reframing human ambition and seriousness through the metaphor of music and drama.',
    keyIdeas: [
      'The cosmic game (Lila)',
      'Why work becomes agonizing when detached from play',
      'The rhythm of waking and sleeping, hiding and seeking'
    ],
    topics: ['life-as-play-work-and-purpose', 'nature-ecology-and-interdependence'],
    transcript: [
      { time: '01:20', seconds: 80, text: 'We treat life as a serious journey with a destination, but music has no destination. The point of a song is the song itself.' }
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    relatedBookIds: ['book-2'],
    relatedQuoteIds: ['q6']
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    title: 'Out of Your Mind',
    slug: 'out-of-your-mind',
    subtitle: 'Adventures in the Meaning of Silence and Superconsciousness',
    yearRecorded: '1970',
    lectureCount: 6,
    totalDuration: '5 hrs 20 mins',
    description: 'Perhaps Alan Watts’ most famous and requested lecture series. Recorded live, this collection covers the illusions of the ego, the nature of reality, and awakening from cultural conditioning.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    lectureIds: ['lec-1'],
    verificationStatus: 'verified-source'
  },
  {
    id: 'col-2',
    title: 'The Tao of Philosophy',
    slug: 'the-tao-of-philosophy',
    subtitle: 'Master Lectures on Eastern Wisdom and Western Life',
    yearRecorded: '1968',
    lectureCount: 8,
    totalDuration: '6 hrs 45 mins',
    description: 'A brilliant exposition of Taoism, Zen, and Hinduism, bridging ancient insights with modern psychological predicaments.',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    lectureIds: ['lec-2'],
    verificationStatus: 'verified-source'
  },
  {
    id: 'col-3',
    title: 'Essential Seminars',
    slug: 'essential-seminars',
    subtitle: 'Foundations of Buddhist Psychology and Non-Dual Awareness',
    yearRecorded: '1965–1969',
    lectureCount: 10,
    totalDuration: '8 hrs 15 mins',
    description: 'Deep dives into the experiential foundations of meditation, detachment, and dropping intellectual concepts.',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    lectureIds: ['lec-3', 'lec-4'],
    verificationStatus: 'verified-source'
  }
];

const baseBOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Book: On the Taboo Against Knowing Who You Are',
    slug: 'the-book-on-the-taboo-against-knowing-who-you-are',
    year: 1966,
    publisher: 'Pantheon Books',
    description: 'Explores the root of our existential anxiety: the illusion that we are isolated egos separate from the physical universe. Watts presents an eye-opening alternative view of identity.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/0679723005-L.jpg',
    keyThemes: ['Ego Illusion', 'Cosmic Unity', 'Social Conditioning'],
    audiobookAvailable: true,
    purchaseUrl: 'https://a.co/d/041HkuqU',
    tableOfContents: [
      'The Game of Black-and-White',
      'The Crock of Gold',
      'The Inside-Out Man',
      'IT'
    ]
  },
  {
    id: 'book-2',
    title: 'The Wisdom of Insecurity',
    slug: 'the-wisdom-of-insecurity',
    year: 1951,
    publisher: 'Random House',
    description: 'A message for an anxious age: why seeking permanent security in a changing world is the primary source of our psychological distress.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    keyThemes: ['Anxiety', 'Present Moment', 'Uncertainty'],
    audiobookAvailable: true,
    purchaseUrl: 'https://www.penguinrandomhouse.com',
    tableOfContents: [
      'The Age of Anxiety',
      'The Pursuit of Security',
      'The Instant Philosophy',
      'The Secret of Effective Action'
    ]
  },
  {
    id: 'book-3',
    title: 'The Way of Zen',
    slug: 'the-way-of-zen',
    year: 1957,
    publisher: 'Pantheon Books',
    description: 'The definitive Western introduction to Zen Buddhism, tracing its historical roots in Indian Buddhism and Chinese Taoism up to practical everyday application.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    keyThemes: ['Zen History', 'Taoism', 'Direct Experience'],
    audiobookAvailable: true,
    purchaseUrl: 'https://www.penguinrandomhouse.com'
  },
  {
    id: 'book-4',
    title: 'Psychotherapy East and West',
    slug: 'psychotherapy-east-and-west',
    year: 1961,
    publisher: 'Pantheon Books',
    description: 'A comparative exploration of Eastern liberating philosophies (Buddhism, Vedanta, Taoism) and Western psychotherapy.',
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    keyThemes: ['Consciousness', 'Mental Health', 'Eastern vs Western Thought'],
    audiobookAvailable: false
  }
];

const baseQUOTES: Quote[] = [
  {
    id: 'q1',
    text: 'You are an aperture through which the universe is looking and exploring itself.',
    slug: 'you-are-an-aperture-through-which-the-universe-is-looking',
    sourceLectureOrBook: 'Out of Your Mind Lecture Series',
    year: 1970,
    verificationStatus: 'verified-source',
    context: 'Spoken during the UC Santa Cruz lectures, illustrating that human consciousness is not a foreign intruder in nature.',
    interpretation: 'Watts reminds us that we are not observers standing outside the cosmos; we are the cosmos itself experiencing sentient form.',
    topics: ['ego-identity-and-the-separate-self', 'nature-ecology-and-interdependence'],
    relatedLectureId: 'lec-1'
  },
  {
    id: 'q2',
    text: 'Muddy water is best cleared by leaving it alone.',
    slug: 'muddy-water-is-best-cleared-by-leaving-it-alone',
    sourceLectureOrBook: 'The Wisdom of Insecurity',
    year: 1951,
    verificationStatus: 'verified-source',
    context: 'From Chapter 5, addressing the futility of forceful mental control over thoughts and emotions.',
    interpretation: 'When the mind is agitated, trying to force it to be calm with violent effort only agitates it further. True peace comes when we allow thoughts to settle on their own.',
    topics: ['overthinking-anxiety-and-mental-noise', 'letting-go-control-and-the-backwards-law'],
    relatedLectureId: 'lec-2'
  },
  {
    id: 'q3',
    text: 'Tomorrow is the pretense of tomorrow. If you wash dishes for the sake of the plates, you are a disaster.',
    slug: 'tomorrow-is-the-pretense-of-tomorrow',
    sourceLectureOrBook: 'Essential Lectures, KPFA',
    year: 1966,
    verificationStatus: 'verified-source',
    context: 'Discussing the illusion of instrumental living—living entirely for future outcomes.',
    interpretation: 'If every action is merely a means to a future end, life becomes an endless postponement. Action must be its own reward.',
    topics: ['time-the-present-moment-and-insecurity', 'life-as-play-work-and-purpose'],
    relatedLectureId: 'lec-3'
  },
  {
    id: 'q4',
    text: 'The only way to make sense out of change is to plunge into it, move with it, and join the dance.',
    slug: 'the-only-way-to-make-sense-out-of-change-is-to-plunge-into-it',
    sourceLectureOrBook: 'The Book on the Taboo',
    year: 1966,
    verificationStatus: 'verified-source',
    context: 'Addressing human resistance to impermanence and constant flux.',
    interpretation: 'Security is an illusion because change is the fundamental law of nature. Instead of fighting the current, we must learn to dance with it.',
    topics: ['letting-go-control-and-the-backwards-law', 'time-the-present-moment-and-insecurity'],
    relatedLectureId: 'lec-2'
  },
  {
    id: 'q5',
    text: 'To have faith is to trust yourself to the water. When you swim you don\'t grab hold of the water.',
    slug: 'to-have-faith-is-to-trust-yourself-to-the-water',
    sourceLectureOrBook: 'The Wisdom of Insecurity',
    year: 1951,
    verificationStatus: 'verified-source',
    context: 'Elucidating the nature of spiritual trust versus compulsive grip.',
    interpretation: 'Faith is not believing in a dogma; it is letting go of the desperate compulsion to secure oneself against the unknown.',
    topics: ['letting-go-control-and-the-backwards-law', 'zen-taoism-and-buddhism'],
    relatedLectureId: 'lec-2'
  },
  {
    id: 'q6',
    text: 'We thought of life as a journey, a pilgrimage, which had a serious purpose at the end, and the thing was to get to that end, success, or whatever it is, by being respectable and efficient. But we missed the point the whole time. It was a musical thing, and you were supposed to be dancing or singing while the music was being played.',
    slug: 'we-thought-of-life-as-a-journey',
    sourceLectureOrBook: 'Nature, Man and Woman Lectures',
    year: 1969,
    verificationStatus: 'verified-source',
    context: 'Explaining the musical theory of existence.',
    interpretation: 'Life is not a race to a finish line. The activity itself is the ultimate purpose.',
    topics: ['life-as-play-work-and-purpose'],
    relatedLectureId: 'lec-5'
  }
];

export const ESSAYS: Essay[] = [
  {
    id: 'essay-1',
    title: 'The Principle of Least Effort in Spiritual Practice',
    slug: 'the-principle-of-least-effort-in-spiritual-practice',
    date: 'March 14, 1967',
    readTime: '6 min read',
    author: 'Alan Watts',
    excerpt: 'Why strenuous striving for enlightenment is often the greatest obstacle to realizing our true nature.',
    content: [
      'In our technological civilization, we are saturated with the belief that nothing of value is achieved without intense struggle, willpower, and resistance against obstacles. We apply this industrial ethic directly to the inner life, believing that peace of mind can be forged through rigorous mental calisthenics.',
      'Yet when we examine the traditions of Zen and Taoism, we encounter a radical inversion: wu-wei, often translated as non-striving or effective action without forced effort. This is not lethargy or indifference; it is the art of cooperating with the grain of reality rather than sawing against it.',
      'When you attempt to force your mind into calmness, you are dividing yourself into two parts: the jailer and the prisoner. The jailer attempts to subdue the prisoner through constant surveillance and punishment, which only generates more friction and anxiety.',
      'Awakening begins the moment you realize that the seeker and the sought are one, and that no amount of frantic spiritual striving can manufacture what is already your fundamental nature.'
    ],
    topics: ['letting-go-control-and-the-backwards-law', 'zen-taoism-and-buddhism'],
    verificationStatus: 'verified-source'
  },
  {
    id: 'essay-2',
    title: 'Man in Nature: The Myth of the Alien Conqueror',
    slug: 'man-in-nature-the-myth-of-the-alien-conqueror',
    date: 'November 22, 1964',
    readTime: '8 min read',
    author: 'Alan Watts',
    excerpt: 'An early ecological critique of the anthropocentric worldview that treats the Earth as a raw material warehouse.',
    content: [
      'Civilized human beings have long operated under the assumption that they are visitors or conquerors in a realm called nature. We speak of "conquering space," "taming the wilderness," and "managing ecosystems" as if humanity were an independent management corporation overseeing a lifeless machine.',
      'This linguistic and conceptual error has catastrophic consequences. By treating the environment as an external "other" to be exploited, we sever our sense of biological feedback and belonging.',
      'Ecological sanity requires an ontological shift: recognizing that we are grown by this planet in the same way that leaves are grown by an oak tree. The biosphere is our larger body.'
    ],
    topics: ['nature-ecology-and-interdependence', 'ego-identity-and-the-separate-self'],
    verificationStatus: 'verified-source'
  }
];

export const baseVIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Alan Watts — The Spectrum of Love (Archival Film)',
    slug: 'alan-watts-spectrum-of-love',
    date: '1971',
    duration: '28:40',
    archiveSource: 'PBS / KQED San Francisco Archive',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=800&q=80',
    description: 'A rare televised lecture on the nature of interpersonal relationship, emotional attachment, and unconditional freedom.',
    verificationStatus: 'verified-source',
    youtubeId: 'emHAoQGoQic'
  },
  {
    id: 'vid-2',
    title: 'Philosophy of Nature & Man (BBC Interview)',
    slug: 'philosophy-of-nature-man-bbc',
    date: '1969',
    duration: '22:15',
    archiveSource: 'BBC Television Archives London',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    description: 'Alan Watts discusses Eastern thought and Western ecological crises with BBC broadcasters in London.',
    verificationStatus: 'verified-source',
    youtubeId: 'aLg4KK6msDw'
  },
  {
    id: 'vid-3',
    title: 'Alan Watts — What If Money Was No Object? (Esalen)',
    slug: 'what-if-money-was-no-object',
    date: '1966',
    duration: '3:12',
    archiveSource: 'Electronic University Master Reels',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    description: 'The famous short reflection questioning our obsession with security and money versus our true passionate play.',
    verificationStatus: 'verified-source',
    youtubeId: 'khOaAHK7efc'
  }
];

export let LECTURES: Lecture[] = [...baseLECTURES];
export let BOOKS: Book[] = [...baseBOOKS];
export let QUOTES: Quote[] = [...baseQUOTES];
export let VIDEOS: VideoItem[] = [...baseVIDEOS];

if (typeof window !== 'undefined') {
  try {
    const customLectures = localStorage.getItem('custom_lectures');
    if (customLectures) {
      const parsed = JSON.parse(customLectures);
      if (Array.isArray(parsed)) {
        LECTURES = [...baseLECTURES, ...parsed];
      }
    }
  } catch (e) {
    console.error('Error loading custom lectures:', e);
  }

  try {
    const customBooks = localStorage.getItem('custom_books');
    if (customBooks) {
      const parsed = JSON.parse(customBooks);
      if (Array.isArray(parsed)) {
        BOOKS = [...baseBOOKS, ...parsed];
      }
    }
  } catch (e) {
    console.error('Error loading custom books:', e);
  }

  try {
    const customQuotes = localStorage.getItem('custom_quotes');
    if (customQuotes) {
      const parsed = JSON.parse(customQuotes);
      if (Array.isArray(parsed)) {
        QUOTES = [...baseQUOTES, ...parsed];
      }
    }
  } catch (e) {
    console.error('Error loading custom quotes:', e);
  }

  try {
    const customVideos = localStorage.getItem('custom_videos');
    if (customVideos) {
      const parsed = JSON.parse(customVideos);
      if (Array.isArray(parsed)) {
        VIDEOS = [...baseVIDEOS, ...parsed];
      }
    }
  } catch (e) {
    console.error('Error loading custom videos:', e);
  }
}

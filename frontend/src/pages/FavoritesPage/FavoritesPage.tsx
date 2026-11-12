import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  ListMusic,
  Sparkles,
  RotateCcw,
  RotateCw,
  Volume2,
  CheckCircle2,
  Bookmark,
  Play,
  Pause,
  Download,
  RefreshCw,
  Repeat,
  Music2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { DuaItem, TranslationLang, Playlist } from "../../types";
import { DuaCard } from "../../components/DuaCard";
import { MORNING_ZIKR_DUA } from "../../data/fallbackDuas";

export interface FavoritesPageProps {
  favoriteDuas: DuaItem[];
  allDuasCount: number;
  playlists: Playlist[];
  selectedLang: TranslationLang;
  fontSizeLarge: boolean;
  bookmarks: Set<string>;
  playingAudioId: string | null;
  speakingDuaId: string | null;
  audioDuration: number;
  audioCurrentTime: number;
  copiedId: string | null;
  onPlayDua: (dua: DuaItem) => void;
  onToggleBookmark: (id: string) => void;
  onCopyDua: (dua: DuaItem) => void;
  onShareDua: (dua: DuaItem) => void;
  onAddToPlaylist: (dua: DuaItem) => void;
  onBackToHome: () => void;
  onNavigateToDuas: () => void;
  onNavigateToPlaylists: () => void;
  onOpenAudioSelection?: () => void;
  onSeekAudio?: (seconds: number) => void;
  onSkipAudio?: (seconds: number) => void;
  onToggleDownload?: (dua: DuaItem) => void;
  isMorningDuaDownloaded?: boolean;
  isMorningDuaDownloading?: boolean;
  morningDuaDownloadProgress?: number;
  onSetPlaybackRate?: (rate: number) => void;
  onToggleLoop?: (loop: boolean) => void;
}

interface ZikrItem {
  id: string;
  name: { en: string; ta: string; ur: string };
  arabic: string;
  transliteration: { en: string; ta: string; ur: string };
  translation: { en: string; ta: string; ur: string };
  targetCount: number;
  virtue?: { en: string; ta: string; ur: string };
  reference?: string;
}

const DAILY_ZIKR: ZikrItem[] = [
  {
    id: "subhanallah",
    name: {
      en: "Tasbeeh (SubhanAllah)",
      ta: "தஸ்பீஹ் (சுப்ஹானல்லாஹ்)",
      ur: "تسبیح (سُبْحَانَ اللَّهِ)"
    },
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: {
      en: "SubḥānAllāh",
      ta: "சுப்ஹானல்லாஹ்",
      ur: "سُبْحَانَ اللَّهِ"
    },
    translation: {
      en: "Glory be to Allah (Free from any imperfection)",
      ta: "அல்லாஹ் தூயவன்",
      ur: "اللہ ہر عیب اور نقص سے پاک ہے"
    },
    targetCount: 33,
    virtue: {
      en: "33 times after each prayer. Plants a tree for you in Jannah.",
      ta: "ஒவ்வொரு தொழுகைக்குப் பின்னும் 33 முறை கூறினால் சொர்க்கத்தில் மரம் நடப்படும்.",
      ur: "ہر نماز کے بعد 33 بار پڑھنے پر جنت میں درخت لگایا جاتا ہے۔"
    },
    reference: "Sahih Muslim 597"
  },
  {
    id: "alhamdulillah",
    name: {
      en: "Tahmeed (Alhamdulillah)",
      ta: "தஹ்மீத் (அல்ஹம்துலில்லாஹ்)",
      ur: "تحمید (اَلْحَمْدُ لِلَّهِ)"
    },
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: {
      en: "Al-ḥamdu lillāh",
      ta: "அல்ஹம்துலில்லாஹ்",
      ur: "اَلْحَمْدُ لِلَّهِ"
    },
    translation: {
      en: "All praise and gratitude belong to Allah alone",
      ta: "எல்லாப் புகழும் அல்லாஹ்வுக்கே",
      ur: "تمام تعریفیں اور شکر اللہ ہی کے لیے ہیں"
    },
    targetCount: 33,
    virtue: {
      en: "Fills the scale of good deeds completely on the Day of Resurrection.",
      ta: "மறுமை நாளில் நன்மையின் தராசை முழுமையாக நிரப்பும் வார்த்தை.",
      ur: "قیامت کے دن نیکیوں کے ترازو کو بھر دیتا ہے۔"
    },
    reference: "Sahih Muslim 223"
  },
  {
    id: "allahuakbar",
    name: {
      en: "Takbeer (Allahu Akbar)",
      ta: "தக்பீர் (அல்லாஹு அக்பர்)",
      ur: "تکبیر (اَللَّهُ أَكْبَرُ)"
    },
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: {
      en: "Allāhu Akbar",
      ta: "அல்லாஹு அக்பர்",
      ur: "اَللَّهُ أَكْبَرُ"
    },
    translation: {
      en: "Allah is the Greatest (Greater than all existence)",
      ta: "அல்லாஹ் மிகப் பெரியவன்",
      ur: "اللہ سب سے بڑا ہے"
    },
    targetCount: 34,
    virtue: {
      en: "Affirmation of Allah's absolute supremacy, beloved to the Prophet (ﷺ).",
      ta: "அல்லாஹ்வின் மகத்துவத்தைப் பறைசாற்றும் உன்னத திக்ர்.",
      ur: "اللہ کی کبریائی اور عظمت کا اعتراف، نبی کریم ﷺ کا محبوب ذکر۔"
    },
    reference: "Sahih al-Bukhari 3113"
  },
  {
    id: "tahlil_tamam",
    name: {
      en: "Tahlil (Full Declaration of Tawheed)",
      ta: "தஹ்லீல் (முழுமையான தவ்ஹீத்)",
      ur: "تہلیل (کلمہ توحید کامل)"
    },
    arabic: "لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: {
      en: "Lā ilāha illallāhu waḥdahu lā sharīka lahu, lahul-mulku wa lahul-ḥamdu, wa huwa ‘alā kulli shay’in qadīr",
      ta: "லா இலாஹ இல்லல்லாஹு வஹ்தஹு லா ஷரீக்க லஹு, லஹுல் முல்க்கு வலஹுல் ஹம்து, வஹுவ அலா குல்லி ஷையின் கதீர்",
      ur: "لا الہ الا اللہ وحدہ لا شریک لہ، لہ الملک ولہ الحمد، وہو علیٰ کل شیء قدیر"
    },
    translation: {
      en: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things.",
      ta: "வணக்கத்திற்குரியவன் அல்லாஹ்வைத் தவிர வேறு யாருமில்லை; அவன் தனித்தவன், அவனுக்கு இணை யாருமில்லை; அவனுக்கே ஆட்சியும் புகழும் உரியது; அவன் அனைத்தின் மீதும் பேராற்றல் உடையவன்.",
      ur: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت اور اسی کی تعریف ہے، اور وہ ہر چیز پر قادر ہے۔"
    },
    targetCount: 10,
    virtue: {
      en: "Equal to freeing 10 slaves, 100 good deeds written, and protection from Shaytan.",
      ta: "பத்து அடிமைகளை விடுதலை செய்த நன்மை கிடைக்கும்; ஷைத்தானிடமிருந்து பாதுகாப்பு.",
      ur: "دس غلام آزاد کرنے کے برابر ثواب، سو نیکیاں اور شیطان سے تحفظ۔"
    },
    reference: "Sahih al-Bukhari 3293"
  },
  {
    id: "kalimatani",
    name: {
      en: "Two Beloved Words to Ar-Rahman",
      ta: "இறைவனுக்கு மிக விருப்பமான இரு வார்த்தைகள்",
      ur: "کلماتِ حبیبہ (رحمن کے پیارے کلمات)"
    },
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: {
      en: "SubḥānAllāhi wa biḥamdihī, SubḥānAllāhil-‘Aẓīm",
      ta: "சுப்ஹானல்லாஹி வபிஹம்திஹி, சுப்ஹானல்லாஹில் அளீம்",
      ur: "سبحان اللہ وبحمدہ، سبحان اللہ العظیم"
    },
    translation: {
      en: "Glory be to Allah and His is the praise, Glory be to Allah the Most Supreme",
      ta: "அல்லாஹ்வின் தூய்மையைப் போற்றிப் புகழ்கிறேன், மகத்தான அல்லாஹ் தூயவன்.",
      ur: "اللہ اپنی حمد کے ساتھ پاک ہے، اور عظمت والا اللہ پاک ہے۔"
    },
    targetCount: 100,
    virtue: {
      en: "Two phrases beloved to the Most Merciful, light on the tongue, heavy on the Scale.",
      ta: "நாவுக்கு எளிதானவை, தராசில் கனமானவை, கருணையாளனுக்கு மிக விருப்பமானவை.",
      ur: "زبان پر ہلکے، میزان میں بھاری اور رحمن کو نہایت محبوب ہیں۔"
    },
    reference: "Sahih al-Bukhari 6406"
  },
  {
    id: "astaghfirullah",
    name: {
      en: "Istighfar (Seeking Forgiveness)",
      ta: "இஸ்திஃபார் (பாவமன்னிப்புக் கோருதல்)",
      ur: "استغفار (طلبِ مغفرت و توبہ)"
    },
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: {
      en: "Astaghfirullāha wa atūbu ilayh",
      ta: "அஸ்தஃபிருல்லாஹ வஅதூபு இலைஹி",
      ur: "استغفر اللہ واتوب الیہ"
    },
    translation: {
      en: "I seek forgiveness from Allah and turn to Him in sincere repentance",
      ta: "நான் அல்லாஹ்விடம் மன்னிப்புக் கோருகிறேன், அவனிடமே பாவமன்னிப்பு கேட்டு மீளுகிறேன்.",
      ur: "میں اللہ سے بخشش مانگتا ہوں اور اسی کے حضور توبہ کرتا ہوں۔"
    },
    targetCount: 100,
    virtue: {
      en: "The Prophet (ﷺ) sought forgiveness more than 70 to 100 times daily.",
      ta: "நபிகள் நாயகம் (ஸல்) அவர்கள் தினமும் 100 முறைக்கும் மேல் பாவமன்னிப்பு கோருவார்கள்.",
      ur: "رسول اللہ ﷺ روزانہ ستر سے سو بار سے زیادہ استغفار فرماتے تھے۔"
    },
    reference: "Sahih al-Bukhari 6307"
  },
  {
    id: "hawqala",
    name: {
      en: "Hawqala (Treasure of Jannah)",
      ta: "ஹவ்கலா (சொர்க்கத்தின் பொக்கிஷம்)",
      ur: "حوقلہ (جنت کا خزانہ)"
    },
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: {
      en: "Lā ḥawla wa lā quwwata illā billāhil-‘Aliyyil-‘Aẓīm",
      ta: "லா ஹவ்ல வலா குவ்வத்த இல்லா பில்லாஹில் அலிய்யில் அளீம்",
      ur: "لا حول ولا قوة الا باللہ العلی العظیم"
    },
    translation: {
      en: "There is no might and no power except with Allah, the Most High, the Supreme",
      ta: "அல்லாஹ்வின் உதவியின்றி பாவங்களிலிருந்து விலகவோ, நன்மைகள் செய்யவோ எவருக்கும் சக்தியில்லை.",
      ur: "اللہ کے سوا کسی کے پاس نہ گناہوں سے بچنے کی طاقت ہے اور نہ نیکی کرنے کی قوت۔"
    },
    targetCount: 33,
    virtue: {
      en: "A treasure from the treasures of Paradise beneath the Divine Throne.",
      ta: "சொர்க்கத்தின் பொக்கிஷங்களில் உள்ள ஒரு விலைமதிப்பற்ற பொக்கிஷம்.",
      ur: "عرشِ الٰہی کے نیچے سے جنت کے خزانوں میں سے ایک خزانہ۔"
    },
    reference: "Sahih al-Bukhari 4205"
  },
  {
    id: "salawat",
    name: {
      en: "Salawat (Blessings on the Prophet ﷺ)",
      ta: "ஸலவாத் (நபிகள் மீது அருள் வேண்டி)",
      ur: "درود و سلام بر نبی کریم ﷺ"
    },
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
    transliteration: {
      en: "Allāhumma ṣalli ‘alā Muḥammadin wa ‘alā āli Muḥammad",
      ta: "அல்லாஹும்ம ஸல்லி அலா முஹம்மதின் வஅலா ஆலி முஹம்மத்",
      ur: "اللہم صل علیٰ محمد وعلیٰ آل محمد"
    },
    translation: {
      en: "O Allah, send blessings upon Muhammad and upon the family of Muhammad",
      ta: "யா அல்லாஹ்! முஹம்மது நபியின் மீதும், அவர்களின் குடும்பத்தார் மீதும் கருணையும் சாந்தியும் பொழிவாயாக.",
      ur: "اے اللہ! محمد ﷺ پر اور ان کی آل پر رحمتیں اور برکتیں نازل فرما۔"
    },
    targetCount: 10,
    virtue: {
      en: "Whoever sends one blessing upon the Prophet (ﷺ), Allah sends ten upon them.",
      ta: "ஒரு முறை ஸலவாத் கூறுபவருக்கு அல்லாஹ் பத்து அருள்களைப் பொழிகிறான்.",
      ur: "ایک بار درود بھیجنے والے پر اللہ تعالیٰ دس رحمتیں نازل فرماتا ہے۔"
    },
    reference: "Sahih Muslim 408"
  },
  {
    id: "hasbunallah",
    name: {
      en: "HasbunAllah (Sufficient is Allah)",
      ta: "ஹஸ்புனல்லாஹ் (அல்லாஹ்வே போதுமானவன்)",
      ur: "حسبنا اللہ (توکل علی اللہ)"
    },
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: {
      en: "ḤasbunAllāhu wa ni‘mal-wakīl",
      ta: "ஹஸ்புனல்லாஹு வநிஃமல் வகீல்",
      ur: "حسبنا اللہ ونعم الوکیل"
    },
    translation: {
      en: "Allah alone is sufficient for us, and He is the best Disposer of affairs",
      ta: "அல்லாஹ்வே நமக்கு போதுமானவன்; அவனே பொறுப்பேற்பவர்களில் மிகச் சிறந்தவன்.",
      ur: "ہمیں اللہ ہی کافی ہے اور وہ بہترین کارساز ہے۔"
    },
    targetCount: 7,
    virtue: {
      en: "The supplication of Prophet Ibrahim (AS) when cast into the fire.",
      ta: "நெருப்புக் குண்டத்தில் எறியப்பட்ட போது இப்ராஹீம் (அலை) கூறிய இறைவார்த்தை.",
      ur: "حضرت ابراہیم علیہ السلام نے آگ میں ڈالے جاتے وقت یہ کلمات ادا فرمائے تھے۔"
    },
    reference: "Quran 3:173 / Sahih al-Bukhari"
  },
  {
    id: "sayyidul_istighfar",
    name: {
      en: "Sayyidul Istighfar (Master of Forgiveness)",
      ta: "ஸையிதுல் இஸ்திஃபார் (தலைசிறந்த பாவமன்னிப்பு)",
      ur: "سید الاستغفار (استغفار کا سردار)"
    },
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: {
      en: "Allāhumma Anta Rabbī lā ilāha illā Anta, khalaqtanī wa anā ‘abduka, wa anā ‘alā ‘ahdika wa wa‘dika mastata‘tu, a‘ūdhu bika min sharri mā ṣana‘tu, abū’u laka bi-ni‘matika ‘alayya, wa abū’u bi-dhanbī faghfir lī fa-innahū lā yaghfirudh-dhunūba illā Anta",
      ta: "அல்லாஹும்ம அந்த ரப்பீ லா இலாஹ இல்லா அந்த, கலக்தனீ வஅனா அப்துக்க, வஅனா அலா அஹ்திக்க வவஃதிக்க மஸ்ததஃது...",
      ur: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں..."
    },
    translation: {
      en: "O Allah, You are my Lord; there is no deity worthy of worship except You. You created me and I am Your servant, and I uphold Your covenant and promise as much as I am able...",
      ta: "யா அல்லாஹ்! நீயே என் இறைவன்; உன்னைத் தவிர வணக்கத்திற்குரியவன் வேறு யாருமில்லை. நீயே என்னைப் படைத்தாய், நான் உனது அடியான்...",
      ur: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں..."
    },
    targetCount: 1,
    virtue: {
      en: "Whoever recites this with conviction in morning/evening and dies will be among the people of Jannah.",
      ta: "காலையிலும் மாலையிலும் உறுதியுடன் ஓதுபவர் சுவர்க்கவாசியாவார்.",
      ur: "صبح یا شام یقین کے ساتھ پڑھ کر وفات پانے والا جنتیوں میں شامل ہو گا۔"
    },
    reference: "Sahih al-Bukhari 6306"
  }
];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoriteDuas,
  allDuasCount,
  playlists,
  selectedLang,
  fontSizeLarge,
  bookmarks,
  playingAudioId,
  speakingDuaId,
  audioDuration,
  audioCurrentTime,
  copiedId,
  onPlayDua,
  onToggleBookmark,
  onCopyDua,
  onShareDua,
  onAddToPlaylist,
  onBackToHome,
  onNavigateToDuas,
  onNavigateToPlaylists,
  onOpenAudioSelection,
  onSeekAudio,
  onSkipAudio,
  onToggleDownload,
  isMorningDuaDownloaded = false,
  isMorningDuaDownloading = false,
  morningDuaDownloadProgress = 0,
  onSetPlaybackRate,
  onToggleLoop
}) => {
  const [activeSubtab, setActiveSubtab] = useState<"zikr" | "saved">("zikr");
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [showDuaText, setShowDuaText] = useState<boolean>(false);

  const isMorningDuaPlaying = playingAudioId === MORNING_ZIKR_DUA._id;

  const [counts, setCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("tasbeeh_counts_v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tasbeeh_counts_v1", JSON.stringify(counts));
    } catch {}
  }, [counts]);

  const handleIncrement = (id: string, target: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      const next = current + 1;
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          if (next === target) {
            navigator.vibrate([40, 60, 40]);
          } else {
            navigator.vibrate(15);
          }
        } catch {}
      }
      return { ...prev, [id]: next };
    });
  };

  const handleReset = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleResetAll = () => {
    setCounts({});
  };

  const cyclePlaybackRate = () => {
    const nextRates = [1.0, 1.25, 1.5, 0.8];
    const currentIndex = nextRates.indexOf(playbackRate);
    const nextRate = nextRates[(currentIndex + 1) % nextRates.length];
    setPlaybackRate(nextRate);
    onSetPlaybackRate?.(nextRate);
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    onToggleLoop?.(next);
  };

  const speakArabic = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ar-SA";
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Top Breadcrumb & Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-6">
        <div
          className="flex items-center justify-between gap-2 p-2.5 sm:p-4 rounded-2xl glass-panel border"
          style={{ borderColor: "var(--border-gold-md)" }}
        >
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm flex-shrink-0"
            style={{
              background: "var(--event-card-bg)",
              border: "1px solid var(--event-border)",
              color: "var(--gold-bright)"
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span
              className="text-base sm:text-xl font-extrabold truncate tracking-tight"
              style={{ color: "var(--text-heading)", fontWeight: 800 }}
            >
              {selectedLang === "ur" ? "اذکار و تسبیح" : selectedLang === "ta" ? "திக்ர் & தஸ்பீஹ்" : "Zikr & Audio"}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 border"
              style={{
                background: "var(--event-circle-bg)",
                borderColor: "var(--event-border)",
                color: "var(--gold-bright)"
              }}
            >
              Morning Adhkar • Audio
            </span>
          </div>

          <button
            onClick={handleResetAll}
            title="Reset All Tasbeeh Counters"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border"
            style={{
              background: "var(--bg-input)",
              borderColor: "var(--border-gold)",
              color: "var(--text-muted)"
            }}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset All</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs (All Duas / Zikr / Playlists) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-3 sm:mt-6">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-gold)] pb-2 sm:pb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap py-0.5">
            <button
              onClick={onNavigateToDuas}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>All Duas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {allDuasCount}
              </span>
            </button>

            <button
              className="tab-active-gold flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap shadow-md transition flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{selectedLang === "ur" ? "ذکر" : selectedLang === "ta" ? "திக்ர்" : "Zikr"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">
                Audio & Tasbeeh
              </span>
            </button>

            <button
              onClick={onNavigateToPlaylists}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Playlists</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {playlists.length}
              </span>
            </button>
          </div>

          {/* Sub-toggle: Daily Zikr vs Saved Duas */}
          {favoriteDuas.length > 0 && (
            <div className="flex items-center gap-1 p-0.5 rounded-xl border border-[var(--border-gold)] bg-black/10 flex-shrink-0">
              <button
                onClick={() => setActiveSubtab("zikr")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  activeSubtab === "zikr"
                    ? "bg-[var(--gold-bright)] text-slate-950 font-extrabold shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--gold-bright)]"
                }`}
              >
                Daily Zikr & Audio
              </button>
              <button
                onClick={() => setActiveSubtab("saved")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeSubtab === "saved"
                    ? "bg-[var(--gold-bright)] text-slate-950 font-extrabold shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--gold-bright)]"
                }`}
              >
                <span>Saved Duas</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-bold">
                  {favoriteDuas.length}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6 pb-12">
        {activeSubtab === "zikr" ? (
          <div>
            {/* 1. Featured Music Player Card: Morning Dua (adhkar) Omar Hisham */}
            <div
              className="p-5 sm:p-7 rounded-3xl border mb-6 shadow-xl relative overflow-hidden transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(20,196,187,0.12) 0%, rgba(212,175,55,0.14) 100%), var(--event-card-bg)",
                borderColor: isMorningDuaPlaying ? "var(--gold-bright)" : "var(--event-border)"
              }}
            >
              {/* Glowing Aura when playing */}
              {isMorningDuaPlaying && (
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
              )}

              {/* Top Row: Badge, Reciter Info & Offline Download */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border"
                    style={{
                      background: "var(--event-circle-bg)",
                      borderColor: "var(--event-border)",
                      color: "var(--gold-bright)"
                    }}
                  >
                    <Music2 className={`w-4 h-4 ${isMorningDuaPlaying ? "animate-bounce text-amber-400" : ""}`} />
                  </div>
                  <span
                    className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wide flex items-center gap-1.5"
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      borderColor: "var(--border-gold)",
                      color: "var(--gold-bright)"
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Morning Adhkar Audio • Zikr</span>
                  </span>
                </div>

                {/* Offline Download Action */}
                <div>
                  {isMorningDuaDownloaded ? (
                    <button
                      onClick={() => onToggleDownload?.(MORNING_ZIKR_DUA)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition active:scale-95 shadow-sm"
                      style={{
                        background: "rgba(16,185,129,0.18)",
                        borderColor: "rgba(16,185,129,0.4)",
                        color: "#10b981"
                      }}
                      title="Downloaded to offline storage. Click to remove."
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Offline Ready ✓</span>
                    </button>
                  ) : isMorningDuaDownloading ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                      style={{
                        background: "rgba(245,158,11,0.15)",
                        borderColor: "rgba(245,158,11,0.4)",
                        color: "#f59e0b"
                      }}
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Downloading {morningDuaDownloadProgress}%</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onToggleDownload?.(MORNING_ZIKR_DUA)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition active:scale-95 shadow-sm hover:brightness-110"
                      style={{
                        background: "var(--event-circle-bg)",
                        borderColor: "var(--event-border)",
                        color: "var(--gold-bright)"
                      }}
                      title="Download sacred audio to device storage for 100% offline listening"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Offline 💾</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Reciter */}
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="text-lg sm:text-2xl font-black tracking-tight"
                    style={{ color: "var(--event-text)", fontWeight: 900 }}
                  >
                    Morning Dua (adhkar) Omar Hisham
                  </h3>
                  {isMorningDuaPlaying && (
                    <span className="flex items-center gap-1 h-4 ml-1">
                      <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
                      <span className="w-1 h-4.5 bg-emerald-400 rounded-full animate-pulse delay-100" />
                      <span className="w-1 h-2.5 bg-amber-300 rounded-full animate-pulse delay-200" />
                    </span>
                  )}
                </div>

                <p
                  className="text-xs sm:text-sm font-bold mt-1"
                  style={{ color: "var(--gold-light)", fontWeight: 700 }}
                >
                  🎙️ Reciter: Omar Hisham Al Arabi (عمر هشام العربي) • Authentic Sunnah Morning Adhkar
                </p>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--event-text-sub)" }}
                >
                  {selectedLang === "ur"
                    ? "صبح کے اذکار کا مکمل صوتی تلاوتی گلدستہ، انٹرنیٹ کے بغیر بھی سننے کے لیے دستیاب"
                    : selectedLang === "ta"
                    ? "உமர் ஹிஷாம் அவர்களின் இனிமையான குரலில் காலை நேர துஆக்கள் மற்றும் அத்கார்கள்"
                    : "Sacred vocal recitation of morning supplications. Play with music controls and zero internet offline."}
                </p>
              </div>

              {/* Music Scrubber Bar */}
              <div className="mt-3 mb-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1" style={{ color: "var(--text-muted)" }}>
                  <span>{formatTime(isMorningDuaPlaying ? audioCurrentTime : 0)}</span>
                  <span>{formatTime(isMorningDuaPlaying && audioDuration > 0 ? audioDuration : 0)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={isMorningDuaPlaying && audioDuration > 0 ? audioDuration : 100}
                  step="0.5"
                  value={isMorningDuaPlaying ? audioCurrentTime : 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (onSeekAudio) onSeekAudio(val);
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-400 bg-black/25"
                  title="Drag to seek audio position"
                />
              </div>

              {/* Music Controls Toolbar */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[var(--border-gold)]">
                {/* Loop Button */}
                <button
                  onClick={toggleLoop}
                  className={`p-2 rounded-xl border transition active:scale-95 ${
                    isLooping ? "bg-amber-400/20 text-amber-300 border-amber-400/50 font-bold" : "text-[var(--text-muted)] border-[var(--border-gold)]"
                  }`}
                  style={{ background: isLooping ? undefined : "var(--bg-input)" }}
                  title={isLooping ? "Repeat Loop Enabled" : "Enable Repeat Track Loop"}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Rewind 10s */}
                <button
                  onClick={() => onSkipAudio?.(-10)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold transition active:scale-95"
                  style={{
                    background: "var(--bg-input)",
                    borderColor: "var(--border-gold)",
                    color: "var(--text-primary)"
                  }}
                  title="Rewind 10 seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">-10s</span>
                </button>

                {/* Big Center Play / Pause Button */}
                <button
                  onClick={() => onPlayDua(MORNING_ZIKR_DUA)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold transition active:scale-95 shadow-xl ${
                    isMorningDuaPlaying ? "btn-gold animate-[pulse_2s_infinite]" : "btn-teal hover:scale-105"
                  }`}
                  title={isMorningDuaPlaying ? "Pause Audio" : "Play Morning Dua (adhkar) Omar Hisham"}
                >
                  {isMorningDuaPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                  )}
                </button>

                {/* Forward 10s */}
                <button
                  onClick={() => onSkipAudio?.(10)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold transition active:scale-95"
                  style={{
                    background: "var(--bg-input)",
                    borderColor: "var(--border-gold)",
                    color: "var(--text-primary)"
                  }}
                  title="Forward 10 seconds"
                >
                  <span className="hidden sm:inline">+10s</span>
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Playback Speed Selector */}
                <button
                  onClick={cyclePlaybackRate}
                  className="px-2.5 py-2 rounded-xl border text-xs font-bold font-mono transition active:scale-95"
                  style={{
                    background: "var(--bg-input)",
                    borderColor: "var(--border-gold)",
                    color: "var(--gold-bright)"
                  }}
                  title="Change playback speed"
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Expandable Dua Text / Translation preview */}
              <div className="mt-4 pt-3 border-t border-[var(--border-gold)]">
                <button
                  onClick={() => setShowDuaText(!showDuaText)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[var(--gold-light)] hover:text-[var(--gold-bright)] transition"
                >
                  <span>
                    {showDuaText
                      ? "Hide Sacred Arabic Supplication Text"
                      : "View Sacred Arabic Supplication & Translation"}
                  </span>
                  {showDuaText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showDuaText && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-black/20 border border-[var(--border-gold)] animate-fade-in">
                    <p
                      dir="rtl"
                      className="font-arabic font-bold text-right text-xl sm:text-2xl leading-loose"
                      style={{
                        fontFamily: "'Amiri', 'Scheherazade New', serif",
                        color: "var(--text-primary)"
                      }}
                    >
                      {MORNING_ZIKR_DUA.arabicText}
                    </p>
                    <p className="mt-3 text-xs sm:text-sm font-bold italic text-[var(--teal-bright)]">
                      "{MORNING_ZIKR_DUA.transliterations?.[selectedLang] || MORNING_ZIKR_DUA.transliteration}"
                    </p>
                    <p className="mt-2 text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: "var(--text-primary)" }}>
                      {MORNING_ZIKR_DUA.translations?.[selectedLang] || MORNING_ZIKR_DUA.translations?.en}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Introductory Guidance Banner */}
            <div
              className="p-3.5 sm:p-5 rounded-2xl border mb-5 shadow-sm"
              style={{
                background: "var(--event-card-bg)",
                borderColor: "var(--event-border)"
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className="text-sm sm:text-base font-extrabold"
                    style={{ color: "var(--event-text)", fontWeight: 800 }}
                  >
                    {selectedLang === "ur"
                      ? "فضیلتِ ذکر و تسبیح کاؤنٹر"
                      : selectedLang === "ta"
                      ? "தினசரி திக்ர் மற்றும் டிஜிட்டல் தஸ்பீஹ்"
                      : "Authentic Daily Adhkar & Digital Tasbeeh"}
                  </h3>
                  <p
                    className="text-xs sm:text-sm mt-1 leading-relaxed"
                    style={{ color: "var(--event-text-sub)" }}
                  >
                    {selectedLang === "ur"
                      ? "ہر ذکر پر ٹیپ کر کے کاؤنٹر مکمل کریں، ٹارگٹ پورا ہونے پر رنگین نشان ظاہر ہوگا۔"
                      : selectedLang === "ta"
                      ? "ஒவ்வொரு திக்ரையும் வாசித்து எண்ணுவதற்கு 'Tap to Count' பட்டனை அழுத்தவும்."
                      : "Tap each Dhikr counter card to increment your recitation count. Keep your heart attached to the remembrance of Allah during Hajj, Umrah & daily life."}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "var(--event-circle-bg)",
                    border: "1px solid var(--event-border)",
                    color: "var(--gold-bright)"
                  }}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>

            {/* 3. List of Zikr Cards with Interactive Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              {DAILY_ZIKR.map((zikr) => {
                const count = counts[zikr.id] || 0;
                const isCompleted = count >= zikr.targetCount;
                const progressPct = Math.min(100, Math.round((count / zikr.targetCount) * 100));

                const titleText = zikr.name[selectedLang] || zikr.name.en;
                const translitText = zikr.transliteration[selectedLang] || zikr.transliteration.en;
                const transText = zikr.translation[selectedLang] || zikr.translation.en;
                const virtueText = zikr.virtue?.[selectedLang] || zikr.virtue?.en;

                return (
                  <div
                    key={zikr.id}
                    className="glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border shadow-md relative select-none"
                    style={{
                      background: isCompleted ? "rgba(20,196,187,0.06)" : "var(--event-card-bg)",
                      borderColor: isCompleted ? "var(--border-gold-md)" : "var(--event-border)"
                    }}
                  >
                    <div>
                      {/* Top Bar: Reference & Target Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                          style={{
                            background: "var(--event-circle-bg)",
                            borderColor: "var(--event-border)",
                            color: "var(--gold-bright)"
                          }}
                        >
                          Target: {zikr.targetCount}x
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isCompleted && (
                            <span className="text-[11px] font-extrabold text-[#10b981] flex items-center gap-1 bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          )}

                          <button
                            onClick={() => speakArabic(zikr.arabic)}
                            title="Listen Arabic Recitation"
                            className="p-1.5 rounded-xl border transition hover:scale-105 active:scale-95"
                            style={{
                              background: "var(--bg-input)",
                              borderColor: "var(--border-gold)",
                              color: "var(--gold-bright)"
                            }}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {count > 0 && (
                            <button
                              onClick={() => handleReset(zikr.id)}
                              title="Reset counter"
                              className="p-1.5 rounded-xl border transition hover:scale-105 active:scale-95 text-[var(--text-muted)] hover:text-red-400"
                              style={{
                                background: "var(--bg-input)",
                                borderColor: "var(--border-gold)"
                              }}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dhikr Title */}
                      <h4
                        className="text-base sm:text-lg font-extrabold mt-3 tracking-wide"
                        style={{ color: "var(--text-heading)", fontWeight: 800 }}
                      >
                        {titleText}
                      </h4>

                      {/* Arabic Text */}
                      <div className="arabic-block mt-3 text-right">
                        <p
                          dir="rtl"
                          className={`font-arabic font-bold transition-all ${
                            fontSizeLarge ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                          }`}
                          style={{
                            fontFamily: "'Amiri', 'Scheherazade New', serif",
                            color: "var(--text-primary)",
                            lineHeight: 2.1,
                            wordSpacing: "0.15em"
                          }}
                        >
                          {zikr.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      {translitText && (
                        <p
                          className="mt-3 text-sm sm:text-base font-bold italic tracking-wide"
                          style={{
                            color: "var(--teal-bright)",
                            fontWeight: 700
                          }}
                        >
                          "{translitText}"
                        </p>
                      )}

                      {/* Translation */}
                      <p
                        className="mt-2 text-xs sm:text-sm font-semibold leading-relaxed"
                        style={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        {transText}
                      </p>

                      {/* Virtue & Reference */}
                      {(virtueText || zikr.reference) && (
                        <div
                          className="mt-3 p-2.5 rounded-xl text-[11px] sm:text-xs font-medium border leading-relaxed"
                          style={{
                            background: "rgba(0,0,0,0.12)",
                            borderColor: "var(--border-gold)",
                            color: "var(--text-muted)"
                          }}
                        >
                          {virtueText && <p className="font-semibold text-amber-200/90">{virtueText}</p>}
                          {zikr.reference && (
                            <p className="mt-1 text-[10px] font-bold text-[var(--gold-bright)]">
                              Source: {zikr.reference}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Interactive Tasbeeh Tap Counter Toolbar */}
                    <div className="mt-5 pt-4 border-t border-[var(--border-gold)]">
                      {/* Progress Bar */}
                      <div className="w-full bg-black/25 rounded-full h-1.5 mb-3 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${progressPct}%`,
                            background: isCompleted ? "#10b981" : "var(--gold-bright)"
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Big Tap to Count Button */}
                        <button
                          onClick={() => handleIncrement(zikr.id, zikr.targetCount)}
                          className={`flex-1 py-3 px-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-between transition-all duration-200 active:scale-95 shadow-md ${
                            isCompleted ? "btn-teal" : "btn-gold"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>{isCompleted ? "Keep Counting" : "Tap to Count"}</span>
                          </span>
                          <span className="font-mono text-base sm:text-lg font-black px-2.5 py-0.5 rounded-lg bg-black/20">
                            {count} / {zikr.targetCount}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Saved Duas Tab (fallback/previous favorites) */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--text-heading)" }}>
                Saved Duas ({favoriteDuas.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
              {favoriteDuas.map((dua) => {
                const isPlaying = playingAudioId === dua._id || speakingDuaId === dua._id;
                const isPlayingAudio = playingAudioId === dua._id;
                const isBookmarked = bookmarks.has(dua._id);

                return (
                  <DuaCard
                    key={dua._id}
                    dua={dua}
                    selectedLang={selectedLang}
                    fontSizeLarge={fontSizeLarge}
                    isBookmarked={isBookmarked}
                    isPlaying={isPlaying}
                    isPlayingAudio={isPlayingAudio}
                    audioDuration={audioDuration}
                    audioCurrentTime={audioCurrentTime}
                    copiedId={copiedId}
                    onPlay={onPlayDua}
                    onToggleBookmark={onToggleBookmark}
                    onCopy={onCopyDua}
                    onShare={onShareDua}
                    onAddToPlaylist={onAddToPlaylist}
                    onOpenAudioSelection={onOpenAudioSelection}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

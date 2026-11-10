import mongoose from "mongoose";
import { Dua, AudioTrack } from "../models/index.js";
import { env } from "../config/env.js";

const norm = (s: string) => s.normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g, "");

const rows = [
  {
    slug: "hajj-leaving-home-part-1",
    order: 1,
    title: "1. First Part (Dua for Leaving Home)",
    titles: {
      en: "1. First Part (Dua for Leaving Home)",
      ur: "1. پہلا حصہ (گھر سے نکلتے وقت کی دعا)",
      ta: "1. முதல் பகுதி (வீட்டிலிருந்து புறப்படும்போது ஓதும் துஆ)"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillāhi, tawakkaltu ‘alallāhi, wa lā ḥawla wa lā quwwata illā billāh.",
    transliterations: {
      en: "Bismillāhi, tawakkaltu ‘alallāhi, wa lā ḥawla wa lā quwwata illā billāh.",
      ta: "பிஸ்மில்லாஹி தவக்கல்து 'அலல்லாஹி வலா ஹவ்ல வலா குவ்வத்த இல்லா பில்லாஹ்"
    },
    translations: {
      en: "In the name of Allah, I place my trust in Allah; there is no power and no strength except with Allah.",
      ur: "اللہ کے نام کے ساتھ، میں نے اللہ پر بھروسہ کیا، اور اللہ کے بغیر نہ گناہوں سے بچنے کی طاقت ہے نہ نیکی کرنے کی قوت۔",
      ta: "அல்லாஹ்வின் பெயரால்! அல்லாஹ்வின் மீதே நான் முழு நம்பிக்கை வைக்கிறேன். அவனது உதவியின்றி (பாவங்களிலிருந்து) விலகுவதற்கோ (நன்மைகளைச் செய்வதற்கு) ஆற்றலோ சக்தியோ இல்லை."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794299759/hajj-duas/Leaving_Home-1.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300292/hajj-duas/Leaving_Home-1-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300292/hajj-duas/Leaving_Home-1-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300293/hajj-duas/Leaving_Home-1-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300292/hajj-duas/Leaving_Home-1-title-en.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300293/hajj-duas/Leaving_Home-1-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300293/hajj-duas/Leaving_Home-1-title-ur.mp3",
    source: "Sunan Abi Dawud & Jami at-Tirmidhi",
    reference: "Abu Dawud 5095, Tirmidhi 3426",
    verified: true
  },
  {
    slug: "hajj-leaving-home-part-2",
    order: 2,
    title: "2. Second Part (Dua Seeking Protection)",
    titles: {
      en: "2. Second Part (Dua Seeking Protection)",
      ur: "2. دوسرا حصہ (حفاظت طلب کرنے کی دعا)",
      ta: "2. இரண்டாம் பகுதி (பாதுகாப்பு கோரும் துஆ)"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ أَوْ أَزِلَّ أَوْ أُزَلَّ أَوْ أَظْلِمَ أَوْ أُظْلَمَ أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",
    transliteration: "Allāhumma innī a‘ūdhu bika an aḍilla aw uḍalla, aw azilla aw uzalla, aw aẓlima aw uẓlama, aw ajhala aw yujhala ‘alayya.",
    transliterations: {
      en: "Allāhumma innī a‘ūdhu bika an aḍilla aw uḍalla, aw azilla aw uzalla, aw aẓlima aw uẓlama, aw ajhala aw yujhala ‘alayya.",
      ta: "அல்லாஹும்ம இன்னீ அஊது பிக அன் அதில்ல அவ் உழல்ல, அவ் அஜில்ல அவ் உஜல்ல, அவ் அழ்லிம அவ் உழ்லம, அவ் அஜ்ஹல அவ் யுஜ்ஹல அலய்ய"
    },
    translations: {
      en: "O Allah, I seek refuge in You lest I misguide or be misguided, lest I lapse or be caused to lapse, lest I oppress or be oppressed, or lest I act ignorantly or be treated ignorantly.",
      ur: "اے اللہ! میں تیری پناہ مانگتا ہوں اس بات سے کہ میں گمراہ ہو جاؤں یا گمراہ کر دیا جاؤں، یا میں پھسل جاؤں یا پھسلا دیا جاؤں، یا میں ظلم کروں یا مجھ پر ظلم کیا جائے، یا میں جہالت کروں یا میرے ساتھ جہالت کا معاملہ کیا جائے۔",
      ta: "யா அல்லாஹ்! நான் வழி தவறிவிடுவதிலிருந்தோ அல்லது பிறரால் வழி தவற வைக்கப்படுவதிலிருந்தோ, சறுக்கி விடுவதிலிருந்தோ அல்லது சறுக்க வைக்கப்படுவதிலிருந்தோ, அநீதி இழைப்பதிலிருந்தோ அல்லது அநீதி இழைக்கப்படுவதிலிருந்தோ, அறியாமையில் விழுவதிலிருந்தோ அல்லது பிறர் என்னிடம் அறியாமையாக நடப்பதிலிருந்தோ உன்னிடம் பாதுகாப்புத் தேடுகிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300295/hajj-duas/Leaving_Home-2.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300294/hajj-duas/Leaving_Home-2-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300294/hajj-duas/Leaving_Home-2-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300295/hajj-duas/Leaving_Home-2-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300294/hajj-duas/Leaving_Home-2-title-en.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300295/hajj-duas/Leaving_Home-2-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300295/hajj-duas/Leaving_Home-2-title-ur.mp3",
    source: "Sunan Abi Dawud & Jami at-Tirmidhi",
    reference: "Abu Dawud 5094, Tirmidhi 3427",
    verified: true
  },
  {
    slug: "hajj-send-off-others",
    order: 3,
    title: "3. SEND OFF OTHERS...",
    titles: {
      en: "3. SEND OFF OTHERS...",
      ur: "3.دوسروں کو رخصت کرتے وقت",
      ta: "3.பிறரை வழியனுப்பும் போது..."
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "أَسْتَوْدِعُ اللّٰهَ دِيْنَكَ وَأَمَانَتَكَ وَآخِرَ عَمَلِكَ ، زَوَّدَكَ اللّٰهُ التَّقْوٰى وَيَسَّرَ لَكَ الْخَيْرَ حَيْثُ كُنْتَ",
    transliteration: "Astawdi‘ullāha dīnaka wa amānataka wa ākhira ‘amalik, zawwadakallāhut-taqwā wa yassara lakal-khayra haythu kunt.",
    transliterations: {
      en: "Astawdi‘ullāha dīnaka wa amānataka wa ākhira ‘amalik, zawwadakallāhut-taqwā wa yassara lakal-khayra haythu kunt.",
      ta: "அஸ்தவ்திஉல்லாஹ தீனக வஅமானத்தக வஆகிர 'அமலக, தவ்வதகல்லாஹுத்-தக்வா வ யஸ்ஸர லக்கல்-கைர ஹைஸுமா குந்த்"
    },
    translations: {
      en: "I entrust to Allah your religion, your trust, and the final result of your deeds; may Allah supply you with piety (Taqwa) and facilitate goodness for you wherever you are.",
      ur: "میں تمہارے دین، تمہاری امانت اور تمہارے آخری عمل کو اللہ کے سپرد کرتا ہوں؛ اللہ تمہیں تقویٰ کا زادِ راہ عطا فرمائے اور تم جہاں بھی ہو تمہارے لیے بھلائی کو آسان کرے۔",
      ta: "உங்களின் மார்க்கத்தையும், உங்களின் அமானிதத்தையும், உங்களின் செயல்களின் முடிவையும் அல்லாஹ்விடம் ஒப்படைக்கிறேன். அல்லாஹ் உங்களுக்கு தக்வாவை (இறையச்சத்தை) நற்பேறாக வழங்குவானாக! நீங்கள் எங்கிருந்தாலும் உங்களுக்கு நன்மைகளை எளிதாக்கி வைப்பானாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300298/hajj-duas/Send_of_others.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300296/hajj-duas/Send_of_others-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300297/hajj-duas/Send_of_others-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300298/hajj-duas/Send_of_others-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300297/hajj-duas/Send_of_others-title-en.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300297/hajj-duas/Send_of_others-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300298/hajj-duas/Send_of_others-title-ur.mp3",
    source: "Sunan Abi Dawud & Jami at-Tirmidhi",
    reference: "Abu Dawud 2600, Tirmidhi 3442 & 3444",
    verified: true
  },
  {
    slug: "hajj-boarding-ship",
    order: 4,
    title: "4. WHEN BOARDING IN THE SHIP... / سفر جہاز کی دعاء",
    titles: {
      en: "4. WHEN BOARDING IN THE SHIP...",
      ur: "4. سفر جہاز کی دعاء",
      ta: "4. கப்பல் / வாகனத்தில் ஏறும் போது..."
    },
    category: "Hajj & Umrah",
    kind: "quran",
    arabicText: "بِسْمِ اللّٰهِ مَجْرٰؔىهَا وَمُرْسٰىهَا ؕ اِنَّ رَبِّيْ لَغَفُوْرٌ رَّحِيْمٌ وَمَا قَدَرُوا اللّٰهَ حَقَّ قَدْرِهٖ ۖ وَالْاَرْضُ جَمِيْعًا قَبْضَتُهٗ يَوْمَ الْقِيٰمَةِ وَالسَّمٰوٰتُ مَطْوِیّٰتٌۢ بَيَمِيْنِهٖ ؕ سُبْحٰنَهٗ وَتَعٰلٰى عَمَّا يُشْرِكُوْنَ",
    transliteration: "Bismillāhi majrāhā wa mursāhā, inna Rabbī la-Ghafūrur-Raḥīm. Wa mā qadarullāha ḥaqqa qadrihī, wal-arḍu jamī‘an qabḍatuhū yawmal-qiyāmati was-samāwātu maṭwiyyātum bi-yamīnih, subḥānahū wa ta‘ālā ‘ammā yushrikūn.",
    transliterations: {
      en: "Bismillāhi majrāhā wa mursāhā, inna Rabbī la-Ghafūrur-Raḥīm. Wa mā qadarullāha ḥaqqa qadrihī, wal-arḍu jamī‘an qabḍatuhū yawmal-qiyāmati was-samāwātu maṭwiyyātum bi-yamīnih, subḥānahū wa ta‘ālā ‘ammā yushrikūn.",
      ta: "பிஸ்மில்லாஹி மஜ்ரேஹா வ முர்ஸாஹா, இன்ன ரப்பீ லஃகஃபூருர்-ரஹீம்.\nவமா கதருல்லாஹ அக்க கத்ரிஹீ வல்-அர்ளு ஜமீஅன் கப்ளதுஹூ யவ்மல்-கியாமதி வஸ்-ஸமாவாது மத்விய்யாதும் பி-யமீனிஹ். ஸுப்ஹானஹூ வ தஆலா அம்மா யுஷ்ரிகூன்."
    },
    translations: {
      en: '"In the name of Allah is its course and its anchorage. Indeed, my Lord is Forgiving and Merciful." (Surah Hud: 41)\n\n"They have not appraised Allah with true appraisal, while the earth entirely will be in His grip on the Day of Resurrection, and the heavens will be folded up in His right hand. Exalted is He and high above what they associate with Him." (Surah Az-Zumar: 67)',
      ur: '”اللہ ہی کے نام سے اس کا چلنا اور اس کا ٹھہرنا ہے، بے شک میرا رب بڑا بخشنے والا، نہایت رحم کرنے والا ہے۔“ (سورہ ہود: ۴۱)\n\n”اور انہوں نے اللہ کی جیسی قدر کرنی چاہیے تھی ویسی قدر نہ کی، حالانکہ قیامت کے دن تمام زمین اس کی مٹھی میں ہوگی اور تمام آسمان اس کے داہنے ہاتھ میں لپٹے ہوئے ہوں گے۔ وہ پاک اور برتر ہے اس شرک سے جو وہ کرتے ہیں۔“ (سورہ الزمر: ۶۷)',
      ta: '"அல்லாஹ்வின் பெயராலேயே இது ஓடுவதும், இது நங்கூரமிட்டு நிற்பதும் நிகழ்கிறது. நிச்சயமாக என் இறைவன் மிக மன்னிப்பவனும், மிக்க கருணையாளனுமாவான்." (ஸூரஹ் ஹூத்: 41)\n\n"அவர்கள் அல்லாஹ்வை அவனது கண்ணியத்திற்குத் தகுந்தவாறு மதிக்கவில்லை; மேலும் மறுமை நாளில் பூமி முழுவதும் அவனது பிடியில் இருக்கும்; வானங்கள் அவனது வலக்கையில் சுருட்டப்பட்டிருக்கும். அவர்கள் இணைவைப்பதை விட்டும் அவன் மிகத் தூய்மையானவனும், மிகவும் உயர்ந்தவனுமாவான்." (ஸூரஹ் அஸ்-ஜுமர்: 67)'
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300260/hajj-duas/BOARDING_IN_THE_SHIP.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300259/hajj-duas/BOARDING_IN_THE_SHIP-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300259/hajj-duas/BOARDING_IN_THE_SHIP-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300260/hajj-duas/BOARDING_IN_THE_SHIP-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300259/hajj-duas/BOARDING_IN_THE_SHIP-title-en.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300259/hajj-duas/BOARDING_IN_THE_SHIP-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300260/hajj-duas/BOARDING_IN_THE_SHIP-title-ur.mp3",
    source: "Quran",
    reference: "Surah Hud 11:41 & Surah Az-Zumar 39:67",
    verified: true
  },
  {
    slug: "hajj-travel-aeroplane",
    order: 5,
    title: "5. Dua for Traveling / Boarding an Aeroplane (سفر / ہوائی جہاز کی دعا)",
    titles: {
      en: "5. Dua for Traveling / Boarding an Aeroplane",
      ur: "5. سفر / ہوائی جہاز کی دعا",
      ta: "5. பயணம் / விமானத்தில் ஏறும் போது ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ﴿١﴾ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ ﴿٢﴾ اَللّٰهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هٰذَا الْبِرَّ وَالتَّقْوَىٰ وَمِنَ الْعَمَلِ مَا تَرْضَىٰ ﴿٣﴾ اَللّٰهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هٰذَا وَاطْوِ عَنَّا بُعْدَهُ ﴿٤﴾ اَللّٰهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ ﴿٥﴾ اَللّٰهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ وَالْوَلَدِ ﴿٦﴾",
    transliteration: "Subḥān-alladhī sakh-khara lanā hādhā wa-mā kunnā lahū muqrinīn. Wa-innā ilā rabbinā lamunqalibūn. Allāhumma innā nas’aluka fī safarinā hādhal-birra wat-taqwā wa-minal-‘amali mā tarḍā. Allāhumma hawwin ‘alaynā safaranā hādhā waṭwi ‘annā bu‘dah. Allāhumma antas-ṣāḥibu fis-safari wal-khalīfatu fil-ahl. Allāhumma innā na‘ūdhu bika min wa‘thā’is-safari wa-ka’ābatil-manẓari wa-sū’il-munqalabi fil-māli wal-ahli wal-walad.",
    transliterations: {
      en: "Subḥān-alladhī sakh-khara lanā hādhā wa-mā kunnā lahū muqrinīn. Wa-innā ilā rabbinā lamunqalibūn. Allāhumma innā nas’aluka fī safarinā hādhal-birra wat-taqwā wa-minal-‘amali mā tarḍā. Allāhumma hawwin ‘alaynā safaranā hādhā waṭwi ‘annā bu‘dah. Allāhumma antas-ṣāḥibu fis-safari wal-khalīfatu fil-ahl. Allāhumma innā na‘ūdhu bika min wa‘thā’is-safari wa-ka’ābatil-manẓari wa-sū’il-munqalabi fil-māli wal-ahli wal-walad.",
      ta: "ஸுப்ஹானல்லதீ ஸக்கற லனா ஹாதா வமா குன்னா லஹூ முக்ரினீன். வ இன்னா இலா ரப்பினா லமுன்கலிபூன்.\nஅல்லாஹும்ம இன்னா நஸ்அலுக ஃபீ ஸஃபரினா ஹாதல்-பிர்ற வத்-தக்வா வமினல்-'அமலி மா தர்ழா. அல்லாஹும்ம ஹவ்வின் 'அலைனா ஸஃபரனா ஹாதா வத்வி 'அன்னா புஃதஹ். அல்லாஹும்ம அந்தஸ்-ஸாஹிபு ஃபீஸ்-ஸஃபரி வல்-கலீஃபது ஃபீல்-அஹ்ல். அல்லாஹும்ம இன்னா நஊது பிக மின் வஃஸாஇஸ்-ஸஃபரி வ காபதில்-மன்ஸரி வ ஸூஇல்-முன்கலபி ஃபீல்-மாலி வல்-அஹ்லி வல்-வலத்."
    },
    translations: {
      en: "\"Glory be to Him Who has subjected this to us, for we could never have accomplished it by ourselves. And surely, to our Lord we shall return.\n\nO Allah, we ask You on this journey of ours for righteousness, piety, and deeds that please You.\n\nO Allah, make this journey easy for us and shorten its distance for us.\n\nO Allah, You are the Companion on the journey and the Caretaker of the family.\n\nO Allah, we seek refuge in You from the hardships of travel, from distressing sights, and from an unfortunate return in wealth, family, and children.\"",
      ur: "\"پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے تابع کر دیا، ورنہ ہم اسے اپنے قابو میں لانے کی طاقت نہ رکھتے تھے، اور بیشک ہم اپنے رب ہی کی طرف لوٹ کر جانے والے ہیں۔\n\nاے اللہ! ہم آپ سے اپنے اس سفر میں نیکی، تقویٰ اور ایسے عمل کی توفیق مانگتے ہیں جس سے تو راضی ہو جائے۔\n\nاے اللہ! ہمارے لیے اس سفر کو آسان فرما دے اور اس کی دوری کو ہمارے لیے سمیٹ دے (کم کر دے)۔\n\nاے اللہ! تو ہی سفر میں ہمارا ساتھی ہے اور گھر بار میں ہمارا نگہبان ہے۔\n\nاے اللہ! ہم سفر کی مشقت سے، دکھی کرنے والے مناظر سے، اور مال، اہل و عیال میں برے انجام سے تیری پناہ مانگتے ہیں۔\"",
      ta: "\"எங்களுக்கு இதனை வசப்படுத்தித் தந்தவன் மகா தூய்மையானவன்; நாங்களோ இதற்கு சக்தி பெற்றவர்களாக இருக்கவில்லை. மேலும் நிச்சயமாக நாம் நமது இறைவனிடமே திரும்பிச் செல்பவர்கள் ஆவோம்.\n\nயா அல்லாஹ்! எங்கள் இந்தப் பயணத்தில் நன்மையையும், இறையச்சத்தையும், நீ பொருந்திக்கொள்ளும் நற்செயல்களையும் உன்னிடம் வேண்டுகிறோம்.\n\nயா அல்லாஹ்! எங்கள் இந்தப் பயணத்தை எங்களுக்கு எளிதாக்கி வைப்பாயாக; அதன் தொலைவை எங்களுக்குச் சுருக்கித் தருவாயாக!\n\nயா அல்லாஹ்! பயணத்தில் தோழனாகவும், குடும்பத்தைப் பாதுகாக்கும் பொறுப்பாளனாகவும் நீயே இருக்கிறாய்.\n\nயா அல்லாஹ்! பயணத்தின் சிரமங்களிலிருந்தும், துயரமளிக்கும் காட்சிகளிலிருந்தும், செல்வம், குடும்பம் மற்றும் பிள்ளைகளில் ஏற்படும் தீய மாற்றங்களிலிருந்தும் உன்னிடம் பாதுகாப்புத் தேடுகிறோம்.\""
    },
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300300/hajj-duas/Travel_aeroplane-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300300/hajj-duas/Travel_aeroplane-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300302/hajj-duas/Travel_aeroplane-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300301/hajj-duas/Travel_aeroplane-title-en.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300301/hajj-duas/Travel_aeroplane-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300302/hajj-duas/Travel_aeroplane-title-ur.mp3",
    source: "Sahih Muslim & Sunan Abi Dawud",
    reference: "Sahih Muslim 1342 • Surah Az-Zukhruf 43:13-14",
    verified: true
  },
  {
    slug: "hajj-intention-ihram-ifrad",
    order: 6,
    title: "6. Intention of Ihram / Intention of Ifrad (احرام کی نیت / افراد کی نیت)",
    titles: {
      en: "6. Intention of Ihram / Intention of Ifrad",
      ur: "6. احرام کی نیت / افراد کی نیت",
      ta: "6. இஹ்ராமின் நிய்யத் / இஃப்ராத் நிய்யத் (ஹஜ்)"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ إِنِّيْ أُرِيْدُ الْحَجَّ فَيَسِّرْهُ لِيْ وَتَقَبَّلْهُ مِنِّيْ",
    transliteration: "Allāhumma innī urīdul-ḥajja fayassirhu lī wa taqabbalhu minnī.",
    transliterations: {
      en: "Allāhumma innī urīdul-ḥajja fayassirhu lī wa taqabbalhu minnī.",
      ta: "அல்லாஹும்ம இன்னீ உரீதுல்-ஹஜ்ஜ ஃபயஸ்ஸிர்ஹு லீ வ தகப்பல்ஹு மின்னீ"
    },
    translations: {
      en: "O Allah, I intend to perform Hajj, so make it easy for me and accept it from me.",
      ur: "اے اللہ! میں حج کا ارادہ کرتا ہوں، پس اسے میرے لیے آسان کر دے اور اسے مجھ سے قبول فرما!",
      ta: "யா அல்லாஹ்! நான் ஹஜ் செய்ய நாடுகிறேன், எனவே அதை எனக்கு எளிதாக்கி வைப்பாயாக; மேலும் அதனை என்னிடமிருந்து ஏற்றுக்கொள்வாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300290/hajj-duas/intention-of-ihram.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300289/hajj-duas/intention-of-ihram-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300289/hajj-duas/intention-of-ihram-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300289/hajj-duas/intention-of-ihram-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300290/hajj-duas/intention-of-ihram_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300289/hajj-duas/intention-of-ihram-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300290/hajj-duas/intention-of-ihram_urudu_title.ogg",
    source: "Fiqh & Sunnah (Manasik al-Hajj)",
    reference: "Niyyah for Ihram (Hajj Ifrad)",
    verified: true
  },
  {
    slug: "hajj-intention-qiran",
    order: 7,
    title: "7. Intention of Qiran (قران کی نیت - حج اور عمرہ)",
    titles: {
      en: "7. Intention of Qiran",
      ur: "7. قران کی نیت (حج اور عمرہ)",
      ta: "7. கிரான் நிய்யத் (ஹஜ் மற்றும் உம்ரா)"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ إِنِّيْ أُرِيْدُ الْحَجَّ وَالْعُمْرَةَ فَيَسِّرْهُمَا لِيْ وَتَقَبَّلْهُمَا مِنِّيْ",
    transliteration: "Allāhumma innī urīdul-ḥajja wal-‘umrata fayassirhumā lī wa taqabbalhumā minnī.",
    transliterations: {
      en: "Allāhumma innī urīdul-ḥajja wal-‘umrata fayassirhumā lī wa taqabbalhumā minnī.",
      ta: "அல்லாஹும்ம இன்னீ உரீதுல்-ஹஜ்ஜ வல்-உம்ரத்த ஃபயஸ்ஸிர்ஹுமா லீ வ தகப்பல்ஹுமா மின்னீ"
    },
    translations: {
      en: "O Allah! I intend to perform Hajj and Umrah, so make them easy for me and accept them from me.",
      ur: "اے اللہ! میں حج اور عمرے کا ارادہ کرتا ہوں، پس تو ان دونوں کو میرے لیے آسان فرما دے اور ان کو میری طرف سے قبول فرما۔",
      ta: "யா அல்லாஹ்! நான் ஹஜ் மற்றும் உம்ரா செய்ய நாடுகிறேன், எனவே அவ்விரண்டையும் எனக்கு எளிதாக்கி வைப்பாயாக; மேலும் அவ்விரண்டையும் என்னிடமிருந்து ஏற்றுக்கொள்வாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300290/hajj-duas/intention-of-qiran.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300280/hajj-duas/hajj-intention-qiran-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300281/hajj-duas/hajj-intention-qiran-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300281/hajj-duas/hajj-intention-qiran-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300291/hajj-duas/intention-of-qiran_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300281/hajj-duas/hajj-intention-qiran-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300291/hajj-duas/intention-of-qiran_urudu_title.ogg",
    source: "Fiqh & Sunnah (Manasik al-Hajj)",
    reference: "Niyyah for Ihram (Hajj Qiran)",
    verified: true
  },
  {
    slug: "hajj-intention-tamattu",
    order: 8,
    title: "8. Intention of Tamattu (حج تمتع اور عمرہ کی نیت)",
    titles: {
      en: "8. Intention of Tamattu",
      ur: "8. حج تمتع اور عمرہ کی نیت",
      ta: "8. \"தமத்துஃ\" இஹ்ராமின் நிய்யத்து"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ إِنِّيْ أُرِيْدُ الْعُمْرَةَ فَيَسِّرْهَا لِيْ وَتَقَبَّلْهَا مِنِّيْ",
    transliteration: "Allāhumma innī urīdul-‘umrata fayassirhā lī wa taqabbalhā minnī.",
    transliterations: {
      en: "Allāhumma innī urīdul-‘umrata fayassirhā lī wa taqabbalhā minnī.",
      ta: "அல்லாஹும்ம இன்னீ உரீதுல்-உம்ரத்த ஃபயஸ்ஸிர்ஹா லீ வ தகப்பல்ஹா மின்னீ"
    },
    translations: {
      en: "O Allah, I intend to perform Umrah, so make it easy for me and accept it from me.",
      ur: "اے اللہ! میں عمرہ کا ارادہ کرتا ہوں، پس اسے میرے لیے آسان فرما دے اور اسے مجھ سے قبول فرما۔",
      ta: "யா அல்லாஹ்! நான் உம்ரா செய்ய நாடுகிறேன், எனவே அதை எனக்கு எளிதாக்கி வைப்பாயாக; மேலும் அதனை என்னிடமிருந்து ஏற்றுக்கொள்வாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300291/hajj-duas/intention-of-thamathu.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300281/hajj-duas/hajj-intention-tamattu-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300282/hajj-duas/hajj-intention-tamattu-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300282/hajj-duas/hajj-intention-tamattu-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300291/hajj-duas/intention-of-thamathu_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300282/hajj-duas/hajj-intention-tamattu-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300292/hajj-duas/intention-of-thamathu_urudu_title.ogg",
    source: "Fiqh & Sunnah (Manasik al-Hajj)",
    reference: "Niyyah for Ihram (Hajj Tamattu' - Umrah)",
    verified: true
  },
  {
    slug: "hajj-dua-after-talbiyah",
    order: 9,
    title: "9. Dhu'aa after Thalbiya... (تلبیہ کے بعد کی دعا)",
    titles: {
      en: "9. Dhu'aa after Thalbiya...",
      ur: "9. تلبیہ کے بعد کی دعا",
      ta: "9. தல்பியாவுக்குப் பின் ஓதும் துஆ..."
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ وَأَعُوْذُ بِكَ مِنْ غَضَبِكَ وَالنَّارِ",
    transliteration: "Allāhumma innī as’aluka riḍāka wal-jannata, wa a‘ūdhu bika min ghaḍabika wan-nār.",
    transliterations: {
      en: "Allāhumma innī as’aluka riḍāka wal-jannata, wa a‘ūdhu bika min ghaḍabika wan-nār.",
      ta: "அல்லாஹும்ம இன்னீ அஸ்அலுக ரிழாக வல்-ஜன்னத்த, வ அஊது பிக மின் கதபிக வந்-நார்"
    },
    translations: {
      en: "O Allah, I ask of You Your pleasure and Paradise, and I seek refuge in You from Your anger and the Fire.",
      ur: "اے اللہ! میں تجھ سے تیری رضا اور جنت کا سوال کرتا ہوں اور تیرے غضب اور آگ (جہنم) سے تیری پناہ مانگتا ہوں۔",
      ta: "யா அல்லாஹ்! நிச்சயமாக நான் உன்னிடம் உனது திருப்தியையும், சொர்க்கத்தையும் கேட்கிறேன்; மேலும் உனது கோபத்திலிருந்தும், நரக நெருப்பிலிருந்தும் உன்னிடம் பாதுகாப்புத் தேடுகிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300261/hajj-duas/dhu-aa-after-thalbiya.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/hajj-dua-after-talbiyah-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300269/hajj-duas/hajj-dua-after-talbiyah-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300269/hajj-duas/hajj-dua-after-talbiyah-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300262/hajj-duas/dhu-aa-after-thalbiya_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300269/hajj-duas/hajj-dua-after-talbiyah-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300262/hajj-duas/dhu-aa-after-thalbiya_Urudu_title.ogg",
    source: "Sunan al-Daraqutni & al-Bayhaqi",
    reference: "Al-Daraqutni 2686 • Al-Bayhaqi 5/45",
    verified: true
  },
  {
    slug: "hajj-dua-entering-haram",
    order: 10,
    title: "10. Dhu'aa When Entering the Haram (حرم میں داخل ہوتے وقت کی دعا)",
    titles: {
      en: "10. Dhu'aa When Entering the Haram",
      ur: "10. حرم میں داخل ہوتے وقت کی دعا",
      ta: "10. ஹரமுக்குள் நுழையும் போது ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ إِنَّ هٰذَا حَرَمُكَ وَحَرَمُ رَسُوْلِكَ فَحَرِّمْ لَحْمِيْ وَدَمِيْ وَعَظْمِيْ وَبَشَرِيْ عَلَى النَّارِ، اَللَّهُمَّ آمِنِّيْ مِنْ عَذَابِكَ يَوْمَ تَبْعَثُ عِبَادَكَ، وَاجْعَلْنِيْ مِنْ أَوْلِيَائِكَ وَأَهْلِ طَاعَتِكَ، وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيْمُ",
    transliteration: "Allāhumma inna hādhā ḥaramuka wa ḥaramu rasūlika fa-ḥarrim laḥmī wa damī wa ‘aẓmī wa basharī ‘alan-nār. Allāhumma āminnī min ‘adhābika yawma tab‘athu ‘ibādak, waj‘alnī min awliyā’ika wa ahli ṭā‘atik, wa tub ‘alayya innaka antat-Tawwābur-Raḥīm.",
    transliterations: {
      en: "Allāhumma inna hādhā ḥaramuka wa ḥaramu rasūlika fa-ḥarrim laḥmī wa damī wa ‘aẓmī wa basharī ‘alan-nār. Allāhumma āminnī min ‘adhābika yawma tab‘athu ‘ibādak, waj‘alnī min awliyā’ika wa ahli ṭā‘atik, wa tub ‘alayya innaka antat-Tawwābur-Raḥīm.",
      ta: "அல்லாஹும்ம இன்ன ஹாதா ஹரமுக வ ஹரமு ரஸூலிக ஃபஹர்ரிம் லஹ்மீ வ தமீ வ அழ்மீ வ பஷரீ அலந்-நார். அல்லாஹும்ம ஆமின்நீ மின் அதாபிக யவ்ம தப்அது இபாதக, வஜ்அல்நீ மின் அவ்லியாஇக வ அஹ்லி தாஅதிக, வ துப் அலய்ய இன்னக அந்தத்-தவ்வாபுர்-ரஹீம்."
    },
    translations: {
      en: "O Allah! This is Your Sanctuary and the Sanctuary of Your Messenger, so forbid my flesh, my blood, my bones, and my skin from the Fire. O Allah! Protect me from Your punishment on the Day You resurrect Your servants, and make me of Your friends and the people of Your obedience, and accept my repentance; indeed, You are the Ever-Returning, the Merciful.",
      ur: "اے اللہ! یہ تیری حرم (محفوظ جگہ) ہے اور تیرے رسول کی حرم ہے، پس تو میرے گوشت، میرے خون، میری ہڈی اور میری جلد کو آگ پر حرام کر دے۔ اے اللہ! مجھے اپنے عذاب سے اس دن امن میں رکھ جس دن تو اپنے بندوں کو اٹھائے گا، اور مجھے اپنے دوستوں اور اپنی فرماں برداری کرنے والوں میں سے بنا، اور میری توبہ قبول فرما، بے شک تو ہی بہت توبہ قبول کرنے والا، رحم کرنے والا ہے۔",
      ta: "யா அல்லாஹ்! நிச்சயமாக இது உனது புனிதத்தலமாகும் மற்றும் உனது தூதரின் புனிதத்தலமாகும்; எனவே எனது சதை, இரத்தம், எலும்பு மற்றும் தோலை நரக நெருப்புக்குத் தடை செய்வாயாக. யா அல்லாஹ்! உன் அடியார்களை நீ உயிர்ப்பித்து எழுப்பும் நாளில் உன் தண்டனையிலிருந்து எனக்குப் பாதுகாப்பு அளிப்பாயாக; மேலும் உனது நேசர்களிலும் உனக்குக் கீழ்ப்படிபவர்களிலும் என்னை ஆக்குவாயாக; எனது தவ்பாவை ஏற்றுக்கொள்வாயாக; நிச்சயமாக நீயே தவ்பாவை அதிகம் ஏற்றுக்கொள்பவனும், நிகரற்ற அன்புடையவனுமாவாய்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300261/hajj-duas/Dhu_aa_When_Entering_the_Haram.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300274/hajj-duas/hajj-dua-entering-haram-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300274/hajj-duas/hajj-dua-entering-haram-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300274/hajj-duas/hajj-dua-entering-haram-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300261/hajj-duas/Dhu_aa_When_Entering_the_Haram_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300274/hajj-duas/hajj-dua-entering-haram-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300261/hajj-duas/Dhu_aa_When_Entering_the_Haram_Urudu_title.ogg",
    source: "Fiqh & Athar (Manasik al-Hajj)",
    reference: "Dua upon Entering the Haram Boundaries",
    verified: true
  },
  {
    slug: "hajj-dua-entering-makkah",
    order: 11,
    title: "11. When Entering Holy Makkah (مکہ مکرمہ میں داخل ہوتے وقت)",
    titles: {
      en: "11. When Entering Holy Makkah",
      ur: "11. مکہ مکرمہ میں داخل ہوتے وقت",
      ta: "11. மக்கா நகருக்குள் நுழையும் போது ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ اجْعَلْ لِيْ بِهَا قَرَارًا وَارْزُقْنِيْ فِيْهَا حَلَالاً، اَللَّهُمَّ بَارِكْ لَنَا فِيْهَا، اَللَّهُمَّ ارْزُقْنَا جَنَاهَا وَحَبِّبْنَا إِلَى أَهْلِهَا وَحَبِّبْ صَالِحِيْ أَهْلِهَا إِلَيْنَا.",
    transliteration: "Allāhummaj‘al lī bihā qarāran warzuqnī fīhā ḥalālā, Allāhumma bārik lanā fīhā, Allāhummarzuqnā janāhā wa ḥabbibnā ilā ahlihā wa ḥabbib ṣāliḥī ahlihā ilaynā.",
    transliterations: {
      en: "Allāhummaj‘al lī bihā qarāran warzuqnī fīhā ḥalālā, Allāhumma bārik lanā fīhā, Allāhummarzuqnā janāhā wa ḥabbibnā ilā ahlihā wa ḥabbib ṣāliḥī ahlihā ilaynā.",
      ta: "அல்லாஹும்மஜ்'அல் லீ பிஹா கராரன் வர்ஸுக்னீ ஃபீஹா ஹலாலா, அல்லாஹும்ம பாரிக் லனா ஃபீஹா, அல்லாஹும்மர்ஸுக்னா ஜனாஹா வ ஹப்பிப்னா இலா அஹ்லிஹா வ ஹப்பிப் ஸாலிஹீ அஹ்லிஹா இலைனா."
    },
    translations: {
      en: "O Allah, make for me in it a place of stay and provide me therein with lawful sustenance. O Allah, bless us in it. O Allah, provide us with its fruits, make us beloved to its people, and make the righteous among its people beloved to us.",
      ur: "اے اللہ! اس (شہر) میں میرے لیے ٹھکانہ بنا اور مجھے اس میں حلال رزق عطا فرما۔ اے اللہ! ہمارے لیے اس میں برکت عطا فرما۔ اے اللہ! ہمیں اس کے پھل عطا فرما، ہمیں اس کے رہنے والوں کا محبوب بنا اور اس کے نیک لوگوں کو ہمارا محبوب بنا۔",
      ta: "யா அல்லாஹ்! இதில் (இப்புனித மக்கா நகரில்) எனக்கு ஒரு நிலையான தங்குமிடத்தை ஏற்படுத்தித் தருவாயாக; மேலும் இதில் எனக்கு ஹலாலான உணவை வழங்குவாயாக. யா அல்லாஹ்! இதில் எங்களுக்கு பரக்கத் செய்வாயாக. யா அல்லாஹ்! இதன் கனிவர்க்கங்களை எங்களுக்கு உணவாக வழங்குவாயாக; இதன் மக்களிடத்தில் எங்களை நேசத்திற்குரியவர்களாக ஆக்குவாயாக; மேலும் இதன் நல்லடியார்களை நாங்கள் நேசிக்கும்படி செய்வாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300303/hajj-duas/when-entering-the-holy-makka.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300275/hajj-duas/hajj-dua-entering-makkah-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300275/hajj-duas/hajj-dua-entering-makkah-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300275/hajj-duas/hajj-dua-entering-makkah-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300303/hajj-duas/when-entering-the-holy-makka_English_Title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300275/hajj-duas/hajj-dua-entering-makkah-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300303/hajj-duas/when-entering-the-holy-makka_Urudu_Title.ogg",
    source: "Sunan al-Tabarani & al-Bayhaqi",
    reference: "Al-Mu'jam al-Awsat 5104 • Al-Adhkar",
    verified: true
  },
  {
    slug: "hajj-entering-masjidul-haram",
    order: 12,
    title: "12. When Entering the Masjidul Haram (مسجد حرام میں داخل ہوتے وقت)",
    titles: {
      en: "12. When Entering the Masjidul Haram",
      ur: "12. مسجد حرام میں داخل ہوتے وقت",
      ta: "12. மஸ்ஜிதுல் ஹராமில் நுழையும்போது..."
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Bismillāhi, was-ṣalātu was-salāmu ‘alā rasūlillāhi ṣallallāhu ‘alayhi wa sallam. Allāhummaghfir lī dhunūbī waftaḥ lī abwāba raḥmatik.",
    transliterations: {
      en: "Bismillāhi, was-ṣalātu was-salāmu ‘alā rasūlillāhi ṣallallāhu ‘alayhi wa sallam. Allāhummaghfir lī dhunūbī waftaḥ lī abwāba raḥmatik.",
      ta: "பிஸ்மில்லாஹி வஸ்-ஸலாது வஸ்-ஸலாமு அலா ரஸூலில்லாஹி ஸல்லல்லாஹு அலைஹி வசல்லம். அல்லாஹும்மஃக்பிர் லீ துனூபீ வஃப்தஹ் லீ அப்வாப ரஹ்மதிக."
    },
    translations: {
      en: "In the name of Allah, and blessings and peace be upon the Messenger of Allah (may Allah grant him peace and blessings). O Allah, forgive me my sins and open for me the gates of Your mercy.",
      ur: "اللہ کے نام کے ساتھ، اور اللہ کے رسول صلی اللہ علیہ وسلم پر درود و سلام ہو۔ اے اللہ! میرے گناہوں کو بخش دے اور میرے لیے اپنی رحمت کے دروازے کھول دے۔",
      ta: "அல்லாஹ்வின் பெயரால்! அல்லாஹ்வின் தூதர் (ஸல்) அவர்கள் மீது ஸலவாத்தும் ஸலாமும் உண்டாகட்டுமாக. யா அல்லாஹ்! எனது பாவங்களை மன்னித்தருள்வாயாக; மேலும் உனது ரஹ்மத்தின் (கருணையின்) வாசல்களை எனக்குத் திறந்து விடுவாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300302/hajj-duas/When_Entering_the_Masjidul_Haram.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300278/hajj-duas/hajj-entering-masjidul-haram-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300278/hajj-duas/hajj-entering-masjidul-haram-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300279/hajj-duas/hajj-entering-masjidul-haram-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300302/hajj-duas/When_Entering_the_Masjidul_Haram_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300278/hajj-duas/hajj-entering-masjidul-haram-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300303/hajj-duas/When_Entering_the_Masjidul_Haram_urudu_Title.ogg",
    source: "Sunan Ibn Majah & Jami at-Tirmidhi",
    reference: "Ibn Majah 771 • Tirmidhi 314",
    verified: true
  },
  {
    slug: "hajj-sighting-the-kaba",
    order: 13,
    title: "13. Du'a When Sighting the Ka'ba (بیت اللہ پر پہلی نظر پڑتے وقت کی دعا)",
    titles: {
      en: "13. Du'a When Sighting the Ka'ba",
      ur: "13. بیت اللہ پر پہلی نظر پڑتے وقت کی دعا",
      ta: "13. கஃபாவைப் பார்த்ததும் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً وَزِدْ مِنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا. اَللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ وَإِلَيْكَ يَرْجِعُ السَّلَامُ فَحَيِّنَا رَبَّنَا بِالسَّلَامِ وَأَدْخِلْنَا الْجَنَّةَ دَارَ السَّلَامِ تَبَارَكْتَ وَتَعَالَيْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ. اَللَّهُمَّ إِنَّكَ دَعَوْتَ عِبَادَكَ إِلَى بَيْتِكَ الْحَرَامِ وَقَدْ جِئْتُ طَالِبًا مَرْضَاتَكَ وَأَنْتَ مَنَنْتَ عَلَيَّ بِذَلِكَ فَاعْفُ لِي وَارْحَمْنِي وَعَافِنِي وَاعْفُ عَنِّي إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اَللَّهُمَّ إِنِّي عَبْدُكَ وَزَائِرُكَ وَلِكُلِّ زَائِرٍ حَقٌّ عَلَى مَزُورِهِ وَأَنْتَ خَيْرُ مَزُورٍ فَأسْأَلُكَ أَنْ تَغْفِرَ لِي وَتَرْحَمَنِي وَتُفِكَ رَقَبَتِي مِنَ النَّارِ. اَللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ وَالْفَوْزَ بِالْجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ.",
    transliteration: "Allāhumma zid hādhal-bayta tashrīfan wa ta‘ẓīman wa takrīman wa mahābah, wa zid man sharrafahū wa karramahū mimman ḥajjahū awi‘tamarahū tashrīfan wa takrīman wa ta‘ẓīman wa birrā.\nAllāhumma antas-Salāmu wa minkas-salām, wa ilayka yarji‘us-salām, fa-ḥayyinā Rabbanā bis-salām, wa adkhilnal-jannata dāras-salām, tabārakta wa ta‘ālayta yā Dhal-Jalāli wal-Ikrām.\nAllāhumma innaka da‘awta ‘ibādaka ilā baytikal-ḥarām, wa qad ji’tu ṭāliban marḍātak, wa anta mananta ‘alayya bi-dhālik, fa‘fu lī warḥamnī wa ‘āfinī wa‘fu ‘annī, innaka ‘alā kulli shay’in qadīr.\nAllāhumma innī ‘abduka wa zā’iruk, wa li-kulli zā’irin ḥaqqun ‘alā mazūrih, wa anta khayru mazūr, fa-as’aluka an taghfira lī wa tarḥamanī wa tufikka raqabatī minan-nār.\nAllāhumma innī as’alukal-‘afwa wal-‘āfiyata fid-dunyā wal-ākhirah, wal-fawza bil-jannati wan-najāta minan-nār.",
    transliterations: {
      en: "Allāhumma zid hādhal-bayta tashrīfan wa ta‘ẓīman wa takrīman wa mahābah, wa zid man sharrafahū wa karramahū mimman ḥajjahū awi‘tamarahū tashrīfan wa takrīman wa ta‘ẓīman wa birrā.\nAllāhumma antas-Salāmu wa minkas-salām, wa ilayka yarji‘us-salām, fa-ḥayyinā Rabbanā bis-salām, wa adkhilnal-jannata dāras-salām, tabārakta wa ta‘ālayta yā Dhal-Jalāli wal-Ikrām.\nAllāhumma innaka da‘awta ‘ibādaka ilā baytikal-ḥarām, wa qad ji’tu ṭāliban marḍātak, wa anta mananta ‘alayya bi-dhālik, fa‘fu lī warḥamnī wa ‘āfinī wa‘fu ‘annī, innaka ‘alā kulli shay’in qadīr.\nAllāhumma innī ‘abduka wa zā’iruk, wa li-kulli zā’irin ḥaqqun ‘alā mazūrih, wa anta khayru mazūr, fa-as’aluka an taghfira lī wa tarḥamanī wa tufikka raqabatī minan-nār.\nAllāhumma innī as’alukal-‘afwa wal-‘āfiyata fid-dunyā wal-ākhirah, wal-fawza bil-jannati wan-najāta minan-nār.",
      ta: "அல்லாஹும்ம ஜித் ஹாதல்-பைத்த தஷ்ரீஃபன் வ தஃளீமன் வ தக்ரீமன் வ மஹாயா, வ ஜித் மன் ஷர்ரஃபஹூ வ கர்ரமஹூ மிம்மன் ஹஜ்ஜஹூ அவிஃதமரஹூ தஷ்ரீஃபன் வ தக்ரீமன் வ தஃளீமன் வ பிர்ரா.\nஅல்லாஹும்ம அந்தஸ்-ஸலாமு வ மின்கஸ்-ஸலாம், வ இலைக யர்ஜிஉஸ்-ஸலாம், ஃபஹய்யினா ரப்பனா பிஸ்-ஸலாம், வ அத்கில்னல்-ஜன்னத்த தாரஸ்-ஸலாம், தபாரக்த வ தஆலைத யா தல்-ஜலாலி வல்-இக்ராம்.\nஅல்லாஹும்ம இன்னக தஅவத இபாதக இலா பைதிகல்-ஹராம், வ கத் ஜிஃது தாலிபன் மர்ழாதக, வ அந்த மனன்த அலய்ய பிதாலிக், ஃபஃபு லீ வர்ஹம்னீ வ ஆஃபினீ வஃபு அன்னீ, இன்னக அலா குல்லி ஷையின் கதீர்.\nஅல்லாஹும்ம இன்னீ அப்துக வ ஜாஇருக, வ லிகுல்லி ஜாஇரின் ஹக்குன் அலா மஜூரிஹ், வ அந்த கைரு மஜூர், ஃபஅஸ்அலுக அன் தஃக்பிர லீ வ தர்ஹமனீ வ துஃபிக்க ரகபதீ மினந்-நார்.\nஅல்லாஹும்ம இன்னீ அஸ்அலுகல்-அஃப்வ வல்-ஆஃபியத ஃபித்-துன்யா வல்-ஆகிரா, வல்-ஃபவ்ஸ பில்-ஜன்னதி வந்-நஜாத மினந்-நார்."
    },
    translations: {
      en: "O Allah, increase this House in honor, reverence, esteem, and awe, and increase the one who honors and respects it—of those who perform Hajj or 'Umrah—in honor, respect, reverence, and piety.\n\nO Allah, You are Peace, and from You is peace, and to You returns peace. So greet us, our Lord, with peace, and admit us into Paradise, the Abode of Peace. Blessed and Exalted are You, O Lord of Majesty and Bounty.\n\nO Allah, You have called Your servants to Your Sacred House, and I have come seeking Your pleasure, and You have favored me with this. So forgive me, have mercy on me, grant me well-being, and pardon me, for You have power over all things.\n\nO Allah, I am Your servant and Your visitor, and every visitor has a right over the one they visit, and You are the Best of those visited. I ask You to forgive me, have mercy on me, and free my neck from the Fire.\n\nO Allah, I ask You for pardon and well-being in this world and the Hereafter, success in attaining Paradise, and salvation from the Fire.",
      ur: "اے اللہ! اس گھر (کعبہ) کے شرف، عظمت، بزرگی اور ہیبت میں اور اضافہ فرما، اور جس نے بھی حج یا عمرہ کے ذریعے اس کی تعظیم و تکریم کی ہے، اس کے بھی شرف، عظمت، بزرگی اور نیکی میں اضافہ فرما۔\n\nاے اللہ! تو ہی سلامتی والا ہے، تجھ ہی سے سلامتی ہے، اور تیری ہی طرف سلامتی پلٹتی ہے۔ پس اے ہمارے رب! ہمیں سلامتی کے ساتھ زندہ رکھ اور ہمیں دارالسلام (جنت) میں داخل فرما۔ تو بابرکت اور بلند و بالا ہے، اے جلال اور بزرگی والے!\n\nاے اللہ! تو نے اپنے بندوں کو اپنے محترم گھر کی طرف بلایا، اور میں تیری رضا کا طلبگار ہو کر حاضر ہوا ہوں، اور تو نے ہی مجھ پر یہ احسان فرمایا ہے۔ پس تو مجھے بخش دے، مجھ پر رحم فرما، مجھے عافیت عطا فرما اور مجھے معاف فرما، بے شک تو ہر چیز پر قادر ہے۔\n\nاے اللہ! میں تیرا بندہ اور تیری زیارت کرنے والا ہوں، اور ہر زائر کا اس کے مزیور (جس کی زیارت کی جائے) پر حق ہوتا ہے، اور تو سب سے بہتر مزیور ہے۔ پس میں تجھ سے سوال کرتا ہوں کہ تو مجھے بخش دے، مجھ پر رحم فرما، اور میری گردن کو آگ سے آزاد کر دے۔\n\nاے اللہ! میں تجھ سے دنیا اور آخرت میں عافیت اور سلامتی کا سوال کرتا ہوں، جنت کی کامیابی اور آگ سے نجات کا طلبگار ہوں۔",
      ta: "யா அல்லாஹ்! இந்த ஆலயத்தின் (கஅபாவின்) கண்ணியத்தையும், மகத்துவத்தையும், சிறப்பையும், மரியாதையையும் இன்னும் அதிகப்படுத்துவாயாக; மேலும் ஹஜ் அல்லது உம்ரா செய்து இதனை கண்ணியப்படுத்துவோரின் மதிப்பையும், கண்ணியத்தையும், மகத்துவத்தையும், நற்பண்பையும் அதிகப்படுத்துவாயாக.\n\nயா அல்லாஹ்! நீயே சாந்தியளிப்பவன், உன்னிடமிருந்தே சாந்தி உண்டாகிறது; சாந்தி உன்னிடமே மீளுகிறது. எனவே எங்கள் இறைவனே! எங்களை சாந்தியுடன் வாழச் செய்வாயாக; மேலும் எங்களை சாந்தியின் இல்லமான சொர்க்கத்தில் பிரவேசிக்கச் செய்வாயாக. மகத்துவமும் கண்ணியமும் உடையவனே! நீ பாக்கியம் நிறைந்தவனும் மிக உயர்ந்தவனுமாவாய்.\n\nயா அல்லாஹ்! உனது அடியார்களை உனது புனித ஆலயத்திற்கு நீ அழைத்தாய்; நான் உனது பொருத்தத்தை நாடி வந்துள்ளேன்; நீ என் மீது இந்த அருளைப் புரிந்துள்ளாய். எனவே என்னை மன்னித்தருள்வாயாக, எனக்கு கருணை காட்டுவாயாக, எனக்கு ஆரோக்கியம் வழங்குவாயாக, என்னை மன்னித்தருள்வாயாக; நிச்சயமாக நீ அனைத்துப் பொருட்களின் மீதும் பேராற்றலுடையவன்.\n\nயா அல்லாஹ்! நான் உனது அடியான் மற்றும் உன்னைத் தரிசிக்க வந்தவன்; மேலும் தரிசிக்க வருபவருக்கு அவரை சந்திப்பவர் மீது ஓர் உரிமை உண்டு, நீயோ சந்திக்கப்படுவோரில் மிகச் சிறந்தவன். எனவே என்னை மன்னித்தருளவும், எனக்கு கருணை புரியவும், எனது கழுத்தை நரக நெருப்பிலிருந்து விடுவிக்கவும் உன்னிடம் வேண்டுகிறேன்.\n\nயா அல்லாஹ்! நிச்சயமாக நான் உன்னிடம் இம்மையிலும் மறுமையிலும் மன்னிப்பையும், நல்வாழ்வையும், சொர்க்கத்தின் வெற்றியையும், நரகத்திலிருந்து விடுதலையையும் வேண்டுகிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300262/hajj-duas/Du_a_When_Sighting_the_Ka_ba.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300282/hajj-duas/hajj-sighting-the-kaba-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300284/hajj-duas/hajj-sighting-the-kaba-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300284/hajj-duas/hajj-sighting-the-kaba-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300262/hajj-duas/Du_a_When_Sighting_the_Ka_ba_ENGLISH_Title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300283/hajj-duas/hajj-sighting-the-kaba-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300263/hajj-duas/Du_a_When_Sighting_the_Ka_ba_Urudu_Title.ogg",
    source: "Sunan al-Bayhaqi & al-Shafi'i",
    reference: "Al-Sunan al-Kubra 5/73 • Al-Umm (Dua upon sighting Ka'bah)",
    verified: true
  },
  {
    slug: "hajj-dua-refuge-facing-kabah",
    order: 14,
    title: "14. May Recite Also This Dua... (بیت اللہ کے سامنے مانگی جانے والی دعا)",
    titles: {
      en: "14. May Recite Also This Dua...",
      ur: "14. بیت اللہ کے سامنے یہ دعا بھی مانگی جا سکتی ہے",
      ta: "14. கஃபாவின் முன் ஓதக்கூடிய மற்றுமொரு துஆ..."
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "أَعُوذُ بِرَبِّ الْبَيْتِ مِنَ الدَّيْنِ وَالْفَقْرِ وَمِنْ ضَيْقِ الصَّدْرِ وَعَذَابِ الْقَبْرِ",
    transliteration: "A‘ūdhu bi-Rabbil-bayti minad-dayni wal-faqr, wa min ḍīqiṣ-ṣadri wa ‘adhābil-qabr.",
    transliterations: {
      en: "A‘ūdhu bi-Rabbil-bayti minad-dayni wal-faqr, wa min ḍīqiṣ-ṣadri wa ‘adhābil-qabr.",
      ta: "அஊது பி-ரப்பில்-பைத்தி மினத்-தைனி வல்-ஃபக்ர், வ மின் தீகிஸ்-ஸத்ரி வ அதாபில்-கப்ர்."
    },
    translations: {
      en: "I seek refuge in the Lord of the House (the Ka'bah) from debt and poverty, from a constricted breast (anxiety/sorrow), and from the punishment of the grave.",
      ur: "قرض سے، محتاجی سے، سینے کی تنگی سے، اور قبر کے عذاب سے میں بیت (اللہ) کے رب کی پناہ مانگتا ہوں۔",
      ta: "கடன், வறுமை, மனநெருக்கடி (கவலை/துன்பம்), மற்றும் கப்ரின் (மண்ணறையின்) வேதனையிலிருந்து இந்த ஆலயத்தின் (கஅபாவின்) இரட்சகனிடம் நான் பாதுகாப்புத் தேடுகிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300296/hajj-duas/may-recite-also-this-dhu-aa.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300277/hajj-duas/hajj-dua-refuge-facing-kabah-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300277/hajj-duas/hajj-dua-refuge-facing-kabah-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300277/hajj-duas/hajj-dua-refuge-facing-kabah-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300296/hajj-duas/may-recite-also-this-dhu-aa_English_titile.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300277/hajj-duas/hajj-dua-refuge-facing-kabah-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300296/hajj-duas/may-recite-also-this-dhu-aa_Urudu_title.ogg",
    source: "Athar & Manasik al-Hajj",
    reference: "Dua before the Ka'bah • Al-Adhkar",
    verified: true
  },
  {
    slug: "hajj-dua-near-hajarul-aswad",
    order: 15,
    title: "15. Dua Near the Hajar-ul-Aswad (حجر اسود کے پاس کی دعا)",
    titles: {
      en: "15. Dua Near the Hajar-ul-Aswad",
      ur: "15. حجر اسود کے پاس کی دعا",
      ta: "15. ஹஜருல் அஸ்வத் அருகே ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، وَإِلَيْكَ يَرْجِعُ السَّلَامُ، فَحَيِّنَا رَبَّنَا بِالسَّلَامِ وَ أَدْخِلْنَا بِرَحْمَتِكَ دَارَ السَّلَامِ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ. اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفاً وَتَعْظِيماً وَتَكْرِيماً وَمَهَابَةً وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ وَاعْتَمَرَهُ تَعْظِيماً وَتَشْرِيفاً.",
    transliteration: "Allāhumma Antas-Salām, wa minkas-Salām, wa ilayka yarji‘us-Salām, fa-ḥayyinā Rabbanā bis-Salām, wa adkhilnā bi-raḥmatika Dāras-Salām. Tabārakta yā Dhal-Jalāli wal-Ikrām.\nAllāhumma zid hādhal-bayta tashrīfan wa ta‘ẓīman wa takrīman wa mahābah, wa zid man sharrafahū wa karramahū mimman ḥajjahū wa‘tamarahū ta‘ẓīman wa tashrīfā.",
    transliterations: {
      en: "Allāhumma Antas-Salām, wa minkas-Salām, wa ilayka yarji‘us-Salām, fa-ḥayyinā Rabbanā bis-Salām, wa adkhilnā bi-raḥmatika Dāras-Salām. Tabārakta yā Dhal-Jalāli wal-Ikrām.\nAllāhumma zid hādhal-bayta tashrīfan wa ta‘ẓīman wa takrīman wa mahābah, wa zid man sharrafahū wa karramahū mimman ḥajjahū wa‘tamarahū ta‘ẓīman wa tashrīfā.",
      ta: "அல்லாஹும்ம அந்தஸ்-ஸலாம், வ மின்கஸ்-ஸலாம், வ இலைக யர்ஜிஉஸ்-ஸலாம், ஃபஹய்யினா ரப்பனா பிஸ்-ஸலாம், வ அத்கில்னா பி-ரஹ்மதிக தாரஸ்-ஸலாம். தபாரக்த யா தல்-ஜலாலி வல்-இக்ராம்.\nஅல்லாஹும்ம ஜித் ஹாதல்-பைத்த தஷ்ரீஃபன் வ தஃளீமன் வ தக்ரீமன் வ மஹாயா, வ ஜித் மன் ஷர்ரஃபஹூ வ கர்ரமஹூ மிம்மன் ஹஜ்ஜஹூ வஃதமரஹூ தஃளீமன் வ தஷ்ரீஃபா."
    },
    translations: {
      en: "O Allah! You are the Giver of Peace, and from You is peace, and to You peace returns. So, O our Lord! Cause us to live with peace, and admit us, by Your mercy, into the Abode of Peace (Paradise). Blessed are You, O Possessor of Majesty and Honor.\n\nO Allah! Increase this House in honor, greatness, respect, and awe. And increase in honor and greatness anyone who honors and respects it among those who perform Hajj and Umrah.",
      ur: "اے اللہ! تو سلامتی والا ہے اور سلامتی تیری ہی طرف سے ہے، اور سلامتی تیری ہی طرف لوٹتی ہے۔ پس اے ہمارے رب! ہمیں سلامتی کے ساتھ زندہ رکھ اور ہمیں اپنی رحمت سے سلامتی کے گھر (جنت) میں داخل فرما۔ تو برکت والا ہے، اے شان و شوکت اور بزرگی والے۔\n\nاے اللہ! اس گھر (کعبہ) کی عظمت، توقیر، عزت اور رعب کو مزید بڑھا دے۔ اور جو بھی حج یا عمرہ کرے اور اس گھر کی تعظیم و تکریم کرے، اس کی تعظیم اور توقیر کو مزید بڑھا دے۔",
      ta: "யா அல்லாஹ்! நீயே சாந்தியளிப்பவன், உன்னிடமிருந்தே சாந்தி உண்டாகிறது; மேலும் சாந்தி உன்னிடமே மீளுகிறது. எனவே எங்கள் இறைவனே! எங்களை சாந்தியுடன் வாழச் செய்வாயாக; உனது கருணையினால் எங்களை சாந்தியின் இல்லமான சொர்க்கத்தில் பிரவேசிக்கச் செய்வாயாக. மகத்துவமும் கண்ணியமும் உடையவனே! நீ பாக்கியம் நிறைந்தவன்.\n\nயா அல்லாஹ்! இந்த ஆலயத்தின் கண்ணியத்தையும், மகத்துவத்தையும், மதிப்பையும், மரியாதையையும் இன்னும் அதிகப்படுத்துவாயாக; மேலும் ஹஜ் அல்லது உம்ரா செய்து இதனை கண்ணியப்படுத்துவோரின் மகத்துவத்தையும் சிறப்பையும் அதிகப்படுத்துவாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/dua-near-the-hajar-ul-aswad.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/dua-near-the-hajar-ul-aswad_English_Title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/dua-near-the-hajar-ul-aswad_Urudu_Title.ogg",
    source: "Sunan al-Bayhaqi & al-Shafi'i",
    reference: "Al-Sunan al-Kubra • Manasik al-Hajj",
    verified: true
  },
  {
    slug: "hajj-intention-of-tawaf",
    order: 16,
    title: "16. Intention of Tawaf (طواف کی نیت)",
    titles: {
      en: "16. Intention of Tawaf",
      ur: "16. طواف کی نیت",
      ta: "16. தவாஃபின் நிய்யத்"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ إِنِّي أُرِيدُ طَوَافَ بَيْتِكَ الْحَرَامِ سَبْعَةَ أَشْوَاطٍ لِوَجْهِكَ الْكَرِيمِ فَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي",
    transliteration: "Allāhumma innī urīdu ṭawāfa baytikal-ḥarāmi sab‘ata ashwāṭin li-wajhikal-karīmi fayassirhu lī wa taqabbalhu minnī.",
    transliterations: {
      en: "Allāhumma innī urīdu ṭawāfa baytikal-ḥarāmi sab‘ata ashwāṭin li-wajhikal-karīmi fayassirhu lī wa taqabbalhu minnī.",
      ta: "அல்லாஹும்ம இன்னீ உரீது தவாஃப பைதிகல்-ஹராமி ஸப்அத்த அஷ்வாதின் லி-வஜ்ஹிகல்-கரீமி ஃபயஸ்ஸிர்ஹு லீ வ தகப்பல்ஹு மின்னீ."
    },
    translations: {
      en: "O Allah, I intend to perform seven circuits of Your Sacred House for Your Noble Face, so make it easy for me and accept it from me.",
      ur: "اے اللہ! میں تیری حرمت والے گھر (خانہ کعبہ) کے سات پھیروں (طواف) کی نیت کرتا ہوں تیری رضا کے لیے، پس اس کو میرے لیے آسان فرما دے اور اسے مجھ سے قبول فرما۔",
      ta: "யா அல்லாஹ்! உனது சங்கை மிகுந்த திருப்பொருத்தத்தை நாடி, உனது புனித ஆலயத்தை ஏழு சுற்றுகள் தவாஃப் செய்ய நாடுகிறேன்; எனவே அதனை எனக்கு எளிதாக்கி வைப்பாயாக; மேலும் அதனை என்னிடமிருந்து ஏற்றுக்கொள்வாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300288/hajj-duas/Intention_of_Tawaf.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300279/hajj-duas/hajj-intention-of-tawaf-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300280/hajj-duas/hajj-intention-of-tawaf-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300280/hajj-duas/hajj-intention-of-tawaf-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300288/hajj-duas/Intention_of_Tawaf_english_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300280/hajj-duas/hajj-intention-of-tawaf-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300288/hajj-duas/Intention_of_Tawaf_urudu_title.ogg",
    source: "Fiqh & Manasik al-Hajj",
    reference: "Niyyah for Tawaf al-Ka'bah",
    verified: true
  },
  {
    slug: "hajj-tawaf-opening-invocation",
    order: 17,
    title: "17. Opening Invocation - 1st Circuit of Tawaf (طواف کے پہلے چکر کا آغاز)",
    titles: {
      en: "17. Opening Invocation - 1st Circuit of Tawaf",
      ur: "17. طواف کے پہلے چکر کا آغاز (استلام کی دعا)",
      ta: "17. தவாஃபின் முதல் சுற்றின் தொடக்கம் (இஸ்திலாம்)"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
    transliteration: "Bismillāhi Allāhu Akbar, wa lillāhil-ḥamd.",
    transliterations: {
      en: "Bismillāhi Allāhu Akbar, wa lillāhil-ḥamd.",
      ta: "பிஸ்மில்லாஹி அல்லாஹு அக்பர், வ லில்லாஹில் ஹம்து."
    },
    translations: {
      en: "In the name of Allah, Allah is the Greatest, and all praise is due to Allah.",
      ur: "اللہ کے نام سے (شروع کرتا ہوں)، اللہ سب سے بڑا ہے اور تمام تعریفیں اللہ ہی کے لیے ہیں۔",
      ta: "அல்லாஹ்வின் பெயரால் (தொடங்குகிறேன்), அல்லாஹ் மிகப் பெரியவன்; புகழனைத்தும் அல்லாஹ்வுக்கே உரியது."
    },
        audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300285/hajj-duas/hajj-tawaf-opening-invocation-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300285/hajj-duas/hajj-tawaf-opening-invocation-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300286/hajj-duas/hajj-tawaf-opening-invocation-ur.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300285/hajj-duas/hajj-tawaf-opening-invocation-title-ta.mp3",
    source: "Sahih al-Bukhari & Sunan al-Bayhaqi",
    reference: "Bukhari 1612 • Facing Hajar al-Aswad",
    verified: true
  },
  {
    slug: "hajj-tawaf-first-circuit",
    order: 18,
    title: "18. Supplication for the First Circuit (طواف کے پہلے چکر کی دعا)",
    titles: {
      en: "18. Supplication for the First Circuit",
      ur: "18. طواف کے پہلے چکر کی دعا",
      ta: "18. தவாஃபின் முதல் சுற்றுக்கான துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ وَحَبِيبِكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ وَالْمُعَافَاةَ الدَّائِمَةَ فِي الدِّينِ وَالدُّنْيَا وَالْآخِرَةِ، وَالْفَوْزَ بِالْجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ",
    transliteration: "Subḥānallāhi wal-ḥamdu lillāhi wa lā ilāha illallāhu wallāhu akbar, wa lā ḥawla wa lā quwwata illā billāhil-‘aliyyil-‘aẓīm, was-salātu was-salāmu ‘alā Rasūlillāhi ṣallallāhu ‘alayhi wa sallam. Allāhumma īmānan bika wa taṣdīqan bi-kitābika wa wafā'an bi-‘ahdika wa-ttibā‘an li-sunnati nabiyyika wa ḥabībika Muḥammadin ṣallallāhu ‘alayhi wa sallam. Allāhumma innī as-alukal-‘afwa wal-‘āfiyata wal-mu‘āfātad-dā’imata fid-dīni wad-dunyā wal-ākhirah, wal-fawza bil-jannati wan-najāta minan-nār.",
    transliterations: {
      en: "Subḥānallāhi wal-ḥamdu lillāhi wa lā ilāha illallāhu wallāhu akbar, wa lā ḥawla wa lā quwwata illā billāhil-‘aliyyil-‘aẓīm, was-salātu was-salāmu ‘alā Rasūlillāhi ṣallallāhu ‘alayhi wa sallam. Allāhumma īmānan bika wa taṣdīqan bi-kitābika wa wafā'an bi-‘ahdika wa-ttibā‘an li-sunnati nabiyyika wa ḥabībika Muḥammadin ṣallallāhu ‘alayhi wa sallam. Allāhumma innī as-alukal-‘afwa wal-‘āfiyata wal-mu‘āfātad-dā’imata fid-dīni wad-dunyā wal-ākhirah, wal-fawza bil-jannati wan-najāta minan-nār.",
      ta: "ஸுப்ஹானல்லாஹி வல்-ஹம்து லில்லாஹி வலா இலாஹ இல்லல்லாஹு வல்லாஹு அக்பர், வலா ஹவ்ல வலா குவ்வத்த இல்லா பில்லாஹில்-அலிய்யில்-அளீம், வஸ்-ஸலாது வஸ்-ஸலாமு அலா ரஸூலில்லாஹி ஸல்லல்லாஹு அலைஹி வசல்லம். அல்லாஹும்ம ஈமானன் பிக வ தஸ்தீகான் பி-கிதாபிக வ வஃபாஅன் பி-அஹ்திக வத்திபாஅன் லி-ஸுன்னதி நபிய்யிக வ ஹபீபிக முஹம்மதின் ஸல்லல்லாஹு அலைஹி வசல்லம். அல்லாஹும்ம இன்னீ அஸ்அலுகல்-அஃப்வ வல்-ஆஃபியத வல்-முஆஃபாதத்-தாஇமத ஃபித்-தீனி வத்-துன்யா வல்-ஆகிரா, வல்-ஃபவ்ஸ பில்-ஜன்னதி வந்-நஜாத மினந்-நார்."
    },
    translations: {
      en: "Glory be to Allah, all praise is due to Allah, there is no god but Allah, and Allah is the Greatest. There is no power and no strength except with Allah, the Most High, the Supreme. Peace and blessings be upon the Messenger of Allah. O Allah, out of faith in You, belief in Your Book, fulfillment of Your covenant, and following the Sunnah of Your Prophet and beloved Muhammad (peace and blessings be upon him). O Allah, I ask You for forgiveness, well-being, and permanent protection in religion, worldly life, and the Hereafter, and success in entering Paradise and salvation from the Hellfire.",
      ur: "اللہ پاک ہے، تمام تعریفیں اللہ ہی کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں اور اللہ سب سے بڑا ہے، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی توفیق نہیں مگر اللہ کی طرف سے جو سب سے بلند عظمت والا ہے۔ اور درود و سلام ہو اللہ کے رسول (صلی اللہ علیہ وسلم) پر۔ اے اللہ! تجھ پر ایمان لاتے ہوئے، تیری کتاب کی تصدیق کرتے ہوئے، تیرے عہد کو پورا کرتے ہوئے اور تیرے نبی و محبوب محمد (صلی اللہ علیہ وسلم) کی سنت کی پیروی کرتے ہوئے (یہ طواف شروع کرتا ہوں)۔ اے اللہ! میں تجھ سے دین، دنیا اور آخرت میں معافی، عافیت اور ہمیشہ کی سلامتی کا طلبگار ہوں، اور جنت کی کامیابی اور دوزخ کی آگ سے نجات مانگتا ہوں۔",
      ta: "அல்லாஹ் மகா தூய்மையானவன்; புகழனைத்தும் அல்லாஹ்வுக்கே உரியது; அல்லாஹ்வைத் தவிர வேறு வணக்கத்திற்குரிய இறைவன் இல்லை; மேலும் அல்லாஹ் மிகப் பெரியவன். மிக உயர்ந்தவனும் மகத்துவமிக்கவனுமான அல்லாஹ்வின் உதவியின்றி (பாவங்களிலிருந்து விலக) எந்த ஆற்றலும் (நன்மைகள் செய்ய) எந்த சக்தியும் இல்லை. மேலும் அல்லாஹ்வின் தூதர் (ஸல்) அவர்கள் மீது ஸலவாத்தும் ஸலாமும் உண்டாகட்டுமாக. யா அல்லாஹ்! உன் மீது கொண்ட ஈமானினாலும், உனது வேதத்தை மெய்ப்பித்தலாலும், உனது உடன்படிக்கையை நிறைவேற்றுவதாலும், உனது நபியும் அன்பிற்குரியவருமான முஹம்மத் (ஸல்) அவர்களின் வழிமுறையைப் பின்பற்றுவதாலும் (இத்தவாஃபைச் செய்கிறேன்). யா அல்லாஹ்! மார்க்கத்திலும், இம்மையிலும், மறுமையிலும் மன்னிப்பையும், நல்வாழ்வையும், நிரந்தரப் பாதுகாப்பையும், சொர்க்கத்தின் வெற்றியையும், நரக நெருப்பிலிருந்து பாதுகாப்பையும் உன்னிடம் வேண்டுகிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300299/hajj-duas/Supplication_for_the_First_Circuit.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300283/hajj-duas/hajj-tawaf-first-circuit-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300284/hajj-duas/hajj-tawaf-first-circuit-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300285/hajj-duas/hajj-tawaf-first-circuit-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300299/hajj-duas/Supplication_for_the_First_Circuit_english_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300284/hajj-duas/hajj-tawaf-first-circuit-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300299/hajj-duas/Supplication_for_the_First_Circuit_urudu_title.ogg",
    source: "Sunan al-Bayhaqi & al-Shafi'i",
    reference: "Al-Sunan al-Kubra • Dhu'as of Tawaf",
    verified: true
  },
  {
    slug: "hajj-dua-at-multazam",
    order: 19,
    title: "19. Dua at the Multazam (ملتزم پر مانگی جانے والی دعا)",
    titles: {
      en: "19. Dua at the Multazam",
      ur: "19. ملتزم پر مانگی جانے والی دعا",
      ta: "19. முல்தஜமில் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ يَا رَبَّ الْبَيْتِ الْعَتِيقِ أَعْتِقْ رِقَابَنَا وَرِقَابَ آبَائِنَا وَأُمَّهَاتِنَا وَإِخْوَانِنَا وَأَوْلَادِنَا مِنَ النَّارِ، يَا ذَا الْجُودِ وَالْكَرَمِ وَالْفَضْلِ وَالْمَنِّ وَالْعَطَاءِ وَالْإِحْسَانِ، اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الْآخِرَةِ، اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدِكَ وَاقِفٌ تَحْتَ بَابِكَ مُلْتَزِمٌ بِأَعْتَابِكَ مُتَذَلِّلٌ بَيْنَ يَدَيْكَ أَرْجُو رَحْمَتَكَ وَأَخْشَى عَذَابَكَ، يَا قَدِيمَ الْإِحْسَانِ، اللَّهُمَّ إِنِّى أَسْأَلُكَ أَنْ تَرْفَعَ ذِكْرِي وَتَضَعَ وِزْرِي وَتُصْلِحَ أَمْرِي وَتُطَهِّرَ قَلْبِي وَتُنَوِّرَ لِي فِي قَبْرِي وَتَغْفِرَ لِي ذَنْبِي وَأَسْأَلُكَ الدَّرَجَاتِ الْعُلَى مِنَ الْجَنَّةِ.",
    transliteration: "Allāhumma yā Rabbal-baytil-‘atīqi a‘tiq riqābanā wa riqāba ābā’inā wa ummahātinā wa ikhwāninā wa awlādinā minan-nār, yā Dhal-jūdi wal-karami wal-faḍli wal-manni wal-‘aṭā’i wal-iḥsān, Allāhumma aḥsin ‘āqibatanā fil-umūri kullihā wa ajirnā min khizyid-dunyā wa ‘adhābil-ākhirah, Allāhumma innī ‘abduka wabnu ‘abdika wāqifun taḥta bābika multazimun bi-a‘tābika mutadhallilun bayna yadayka arjū raḥmataka wa akhshā ‘adhābaka, yā Qadīmal-iḥsān, Allāhumma innī as’aluka an tarfa‘a dhikrī wa taḍa‘a wizrī wa tuṣliḥa amrī wa tuṭahhira qalbī wa tunawwira lī fī qabrī wa taghfira lī dhanbī wa as’alukad-darajātil-‘ulyā minal-jannah.",
    transliterations: {
      en: "Allāhumma yā Rabbal-baytil-‘atīqi a‘tiq riqābanā wa riqāba ābā’inā wa ummahātinā wa ikhwāninā wa awlādinā minan-nār, yā Dhal-jūdi wal-karami wal-faḍli wal-manni wal-‘aṭā’i wal-iḥsān, Allāhumma aḥsin ‘āqibatanā fil-umūri kullihā wa ajirnā min khizyid-dunyā wa ‘adhābil-ākhirah, Allāhumma innī ‘abduka wabnu ‘abdika wāqifun taḥta bābika multazimun bi-a‘tābika mutadhallilun bayna yadayka arjū raḥmataka wa akhshā ‘adhābaka, yā Qadīmal-iḥsān, Allāhumma innī as’aluka an tarfa‘a dhikrī wa taḍa‘a wizrī wa tuṣliḥa amrī wa tuṭahhira qalbī wa tunawwira lī fī qabrī wa taghfira lī dhanbī wa as’alukad-darajātil-‘ulyā minal-jannah.",
      ta: "அல்லாஹும்ம யா ரப்பல்-பைத்தில்-அதீக், அஃதிக் ரிகாபனா வ ரிகாப ஆபாஇனா வ உம் மஹாதினா வ இக்வானினா வ அவ்லாதினா மினந்-நார், யா தல்-ஜூதி வல்-கரமி வல்-ஃபழ்லி வல்-மன்னி வல்-அதாஇ வல்-இஹ்ஸான். அல்லாஹும்ம அஹ்ஸின் ஆகிபதனா ஃபில்-உமூரி குல்லிஹா வ அஜிர்னா மின் கிஸ்யித்-துன்யா வ அதாபில்-ஆகிரா. அல்லாஹும்ம இன்னீ அப்துக வப்னு அப்திக, வாகிஃபுன் தஹ்த பாபிக, முல்தஸிமுன் பி-அஃதாபிக, முததல்-லிலுன் பைன யதய்க, அர்ஜூ ரஹ்மதக வ அக்ஷா அதாபக, யா கதீமல்-இஹ்ஸான். அல்லாஹும்ம இன்னீ அஸ்அலுக அன் தர்ஃபஅ திக்ரீ, வ தழஅ விஸ்ரீ, வ துஸ்லிஹ அம்ரீ, வ துதஹ்ஹிர கல்பீ, வ துநவ்விர லீ ஃபீ கப்ரீ, வ தஃக்பிர லீ தன்பீ, வ அஸ்அலுகத்-தரஜாதில்-உல்யா மினல்-ஜன்னாஹ்."
    },
    translations: {
      en: "O Allah, Lord of the Ancient House, free our necks, the necks of our fathers, our mothers, our brothers, and our children from the Fire, O Possessor of generosity, nobility, grace, favor, giving, and excellence, and make our end excellent in all matters while protecting us from the disgrace of this world and the punishment of the Hereafter; O Allah, I am Your slave, the son of Your slave, standing beneath Your door, clinging to Your threshold, and humbling myself before You as I hope for Your mercy and fear Your punishment, O You Whose beneficence is eternal, and I ask You to raise my mention, lift my burden, rectify my affairs, purify my heart, illuminate my grave, forgive my sin, and grant me the highest ranks of Paradise.",
      ur: "اے اللہ! بیت العتیق (خانہ کعبہ) کے رب! ہماری گردنوں کو، ہمارے باپ دادا، ہماری ماؤں، ہمارے بھائیوں اور ہماری اولاد کی گردنوں کو آگ (جہنم) سے آزاد فرما، اے جود و کرم، فضل، احسان، عطا اور بخشش والے! اے اللہ! تمام معاملات میں ہمارا انجام بہتر فرما اور ہمیں دنیا کی رسوائی اور آخرت کے عذاب سے پناہ دے؛ اے اللہ! میں تیرا بندہ اور تیرے ہی بندے کا بیٹا ہوں، تیرے دروازے کے نیچے کھڑا ہوں، تیرے آستانے سے لپٹا ہوا ہوں، تیرے سامنے عاجزی کرنے والا ہوں، تیری رحمت کا امیدوار ہوں اور تیرے عذاب سے ڈرتا ہوں، اے ہمیشہ سے احسان کرنے والے! اے اللہ! میں تجھ سے سوال کرتا ہوں کہ تو میرا ذکر بلند کر، میرا بوجھ اتار دے، میرے معاملات کی اصلاح فرما، میرے دل کو پاک کر دے، میری قبر کو میرے لیے روشن کر دے، میرے گناہ معاف فرما اور میں تجھ سے جنت کے بلند ترین درجے مانگتا ہوں۔",
      ta: "பழமையான ஆலயத்தின் (கஅபாவின்) இரட்சகனான யா அல்லாஹ்! எங்களின் கழுத்துகளையும், எங்களின் தந்தையர், அன்னையர், சகோதரர்கள் மற்றும் பிள்ளைகளின் கழுத்துகளையும் நரக நெருப்பிலிருந்து விடுதலை செய்வாயாக; கொடையும், கண்ணியமும், அருளும், பேரன்பும், ஈகையும், உபகாரமும் நிறைந்தவனே! யா அல்லாஹ்! எங்கள் காரியங்கள் அனைத்திலும் எங்களின் முடிவை அழகியதாக ஆக்குவாயாக; மேலும் இம்மையின் இழிவிலிருந்தும் மறுமையின் வேதனையிலிருந்தும் எங்களைப் பாதுகாப்பாயாக. யா அல்லாஹ்! நான் உனது அடியான், உனது அடியானின் மகன்; உனது வாசலின் கீழ் நின்று கொண்டிருக்கிறேன், உனது வாசற்படியைக் கட்டியணைத்துக் கொண்டுள்ளேன், உனக்கு முன்னால் பணிந்து நிற்கிறேன்; உனது கருணையை ஆதரவு வைக்கிறேன், உனது வேதனைக்கு அஞ்சுகிறேன், என்றுமே நிலைத்த உபகாரமுடையவனே! யா அல்லாஹ்! எனது புகழை உயர்த்தவும், எனது பாவச் சுமையை இறக்கி வைக்கவும், எனது காரியங்களை சீராக்கவும், எனது உள்ளத்தைப் பரிசுத்தப்படுத்தவும், எனது கப்ரில் எனக்கு ஒளியூட்டவும், எனது பாவங்களை மன்னிக்கவும் உன்னிடம் வேண்டுகிறேன்; மேலும் சொர்க்கத்தின் மிக உயர்ந்த பதவிகளை உன்னிடம் கேட்கிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300267/hajj-duas/dua-at-multazim.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-multazam-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300272/hajj-duas/hajj-dua-at-multazam-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300273/hajj-duas/hajj-dua-at-multazam-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300267/hajj-duas/dua-at-multazim_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300272/hajj-duas/hajj-dua-at-multazam-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300267/hajj-duas/dua-at-multazim_Urudu_title.ogg",
    source: "Athar & Manasik al-Hajj",
    reference: "Du'a at the Multazam • Al-Adhkar",
    verified: true
  },
  {
    slug: "hajj-dua-at-maqam-ibrahim",
    order: 20,
    title: "20. Dua at Maqam Ibrahim (مقامِ ابراہیم پر مانگی جانے والی دعا)",
    titles: {
      en: "20. Dua at Maqam Ibrahim",
      ur: "20. مقامِ ابراہیم پر مانگی جانے والی دعا",
      ta: "20. மகாமு இப்ராஹீமில் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ إِنَّكَ تَعْلَمُ سِرِّي وَعَلَانِيَتِي فَاقْبَلْ مَعْذِرَتِي، وَتَعْلَمُ حَاجَتِي فَأَعْطِنِي سُؤْلِي، وَتَعْلَمُ مَا فِي نَفْسِي فَاغْفِرْ لِي ذُنُوبِي، اللَّهُمَّ إِنِّي أَسْأَلُكَ إِيمَانًا يُبَاشِرُ قَلْبِي وَيَقِينًا صَادِقًا حَتَّى أَعْلَمَ أَنَّهُ لَا يُصِيبُنِي إِلَّا مَا كَتَبْتَ لِي، وَرِضًا بِمَا قَسَمْتَ لِي، أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ، تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ، اللَّهُمَّ لَا تَدَعْ لَنَا فِي مَقَامِنَا هَذَا ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً إِلَّا قَضَيْتَهَا وَيَسَّرْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ، اللَّهُمَّ يَسِّرْ أُمُورَنَا وَاشْرَحْ صُدُورَنَا وَنَوِّرْ قُلُوبَنَا وَاخْتِمْ بِالصَّالِحَاتِ أَعْمَالَنَا، اللَّهُمَّ تَوَفَّنَا مُسْلِمِينَ وَأَلْحِقْنَا بِالصَّالِحِينَ، وَصَلَّى اللَّهُ تَعَالَى وَسَلَّمَ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ أَجْمَعِينَ، وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.",
    transliteration: "Allāhumma innaka ta‘lamu sirrī wa ‘alāniyyatī faqbal ma‘dhiratī, wa ta‘lamu ḥājatī fa-a‘ṭinī su’lī, wa ta‘lamu mā fī nafsī faghfir lī dhunūbī.\nAllāhumma innī as’aluka īmānan yubāshiru qalbī wa yaqīnan ṣādiqan ḥattā a‘lama annahū lā yuṣībunī illā mā katabta lī, wa riḍan bimā qasamta lī, Anta waliyyī fid-dunyā wal-ākhirah, tawaffanī musliman wa alḥiqnī biṣ-ṣāliḥīn.\nAllāhumma lā tada‘ lanā fī maqāminā hādhā dhanban illā ghafartah, wa lā hamman illā farrajtah, wa lā ḥājatan illā qaḍaytahā wa yassartahā yā Arḥamar-rāḥimīn.\nAllāhumma yassir umūranā washraḥ ṣudūranā wa nawwir qulūbanā wakhtim biṣ-ṣāliḥāti a‘mālanā, Allāhumma tawaffanā muslimīna wa alḥiqnā biṣ-ṣāliḥīn.\nWa ṣallallāhu ta‘ālā wa sallama ‘alā sayyidinā Muḥammadin wa ālihī wa ṣaḥbihī ajma‘īn, wal-ḥamdu lillāhi Rabbil-‘ālamīn.",
    transliterations: {
      en: "Allāhumma innaka ta‘lamu sirrī wa ‘alāniyyatī faqbal ma‘dhiratī, wa ta‘lamu ḥājatī fa-a‘ṭinī su’lī, wa ta‘lamu mā fī nafsī faghfir lī dhunūbī.\nAllāhumma innī as’aluka īmānan yubāshiru qalbī wa yaqīnan ṣādiqan ḥattā a‘lama annahū lā yuṣībunī illā mā katabta lī, wa riḍan bimā qasamta lī, Anta waliyyī fid-dunyā wal-ākhirah, tawaffanī musliman wa alḥiqnī biṣ-ṣāliḥīn.\nAllāhumma lā tada‘ lanā fī maqāminā hādhā dhanban illā ghafartah, wa lā hamman illā farrajtah, wa lā ḥājatan illā qaḍaytahā wa yassartahā yā Arḥamar-rāḥimīn.\nAllāhumma yassir umūranā washraḥ ṣudūranā wa nawwir qulūbanā wakhtim biṣ-ṣāliḥāti a‘mālanā, Allāhumma tawaffanā muslimīna wa alḥiqnā biṣ-ṣāliḥīn.\nWa ṣallallāhu ta‘ālā wa sallama ‘alā sayyidinā Muḥammadin wa ālihī wa ṣaḥbihī ajma‘īn, wal-ḥamdu lillāhi Rabbil-‘ālamīn.",
      ta: "அல்லாஹும்ம இன்னக தஃலமு சிர்ரீ வ அலானியத்தீ ஃபக்பல் மஃதிரதீ, வ தஃலமு ஹாஜத்தீ ஃபஅஃதினீ ஸுஃலீ, வ தஃலமு மா ஃபீ நஃப்ஸீ ஃபஃக்பிர் லீ துனூபீ.\nஅல்லாஹும்ம இன்னீ அஸ்அலுக ஈமானன் யுபாஷிரு கல்பீ வ யகீனன் ஸாதிகான் ஹத்தா அஃலம அன்னஹூ லா யுஸீபுனீ இல்லா மா கதப்த லீ, வ ரிழன் பிமா கஸம்த லீ, அந்த வலிய்யீ ஃபித்-துன்யா வல்-ஆகிரா, தவஃப்பனீ முஸ்லிமன் வ அல்ஹிக்னீ பிஸ்-ஸாலிஹீன்.\nஅல்லாஹும்ம லா ததஃ லனா ஃபீ மகாமினா ஹாதா தன்பன் இல்லா கஃபர்தஹ், வலா ஹம்மன் இல்லா ஃபர்ரஜ்தஹ், வலா ஹாஜதன் இல்லா கதய்தஹா வ யஸ்ஸர்தஹா யா அர்ஹமர்-ராஹிமீன்.\nஅல்லாஹும்ம யஸ்ஸிர் உமூரனா வஷ்ரஹ் ஸுதூரனா வ நவ்விர குலூபனா வக்திம் பிஸ்-ஸாலிஹாதீ அஃமாலனா, அல்லாஹும்ம தவஃப்பனா முஸ்லிமீன வ அல்ஹிக்னா பிஸ்-ஸாலிஹீன்.\nவ ஸல்லல்லாஹு தஆலா வ ஸல்லம அலா ஸய்யிதினா முஹம்மதின் வ ஆலிஹீ வ ஸஹ்பிஹீ அஜ்மஈன், வல்-ஹம்து லில்லாஹி ரப்பில்-ஆலமீன்."
    },
    translations: {
      en: "O Allah, You know my secret and my open, so accept my apology. You know my need, so grant me my request. You know what is in my soul, so forgive my sins.\n\nO Allah, I ask You for faith that touches my heart and true certainty until I know that nothing will befall me except what You have written for me, and contentment with what You have divided for me. You are my Protector in this world and the Hereafter; cause me to die as a Muslim and join me with the righteous.\n\nO Allah, do not leave for us in this place of ours any sin except that You forgive it, nor any worry except that You relieve it, nor any need except that You fulfill it and make it easy, O Most Merciful of the merciful.\n\nO Allah, make our affairs easy for us, expand our chests, illuminate our hearts, and seal our deeds with righteousness. O Allah, cause us to die as Muslims and join us with the righteous.\n\nAnd may Allah the Exalted send blessings and peace upon our master Muhammad, his family, and all his companions. And all praise is due to Allah, Lord of the worlds.",
      ur: "اے اللہ! بے شک تو میرے پوشیدہ اور ظاہر کو بخوبی جانتا ہے، پس میرا عذر قبول فرما۔ اور تو میری حاجت کو جانتا ہے، پس مجھے میری مانگی ہوئی چیز عطا فرما۔ اور تو میرے دل کے اندر کی بات کو جانتا ہے، پس میرے گناہ معاف فرما۔\n\nاے اللہ! میں تجھ سے ایسا ایمان مانگتا ہوں جو میرے دل میں پیوست ہو جائے اور ایسا سچا یقین کہ مجھے معلوم ہو جائے کہ مجھے وہی پہنچتا ہے جو تو نے میرے مقسوم میں لکھ دیا ہے، اور جو تو نے میرے لیے تقسیم فرما دیا ہے اس پر راضی رہنا (نصیب فرما)۔ تو ہی دنیا اور آخرت میں میرا کارساز ہے، مجھے اسلام پر موت دے اور مجھے نیک لوگوں کے ساتھ ملا دے۔\n\nاے اللہ! اس ہمارے مقام (مقامِ ابراہیم) پر ہمارا کوئی گناہ نہ چھوڑ مگر اسے بخش دے، اور کوئی غم نہ چھوڑ مگر اسے دور کر دے، اور کوئی ضرورت نہ پوری ہونے والی نہ چھوڑ مگر اسے پورا کر دے اور آسان کر دے، اے سب سے زیادہ رحم کرنے والے!\n\nاے اللہ! ہمارے کاموں کو آسان فرما، ہمارے سینے کھول دے، ہمارے دلوں کو منور فرما، اور ہمارے اعمال کا خاتمہ نیک اعمال پر فرما۔ اے اللہ! ہمیں اسلام کی حالت میں وفات دے اور ہمیں صالحین (نیک لوگوں) کے ساتھ ملا دے۔\n\nاور اللہ تعالی درود و سلام نازل فرمائے ہمارے آقا حضرت محمد ﷺ پر اور آپ کی آل پر اور تمام صحابہ کرام پر، اور تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔",
      ta: "யா அல்லாஹ்! நிச்சயமாக நீ எனது இரகசியத்தையும் எனது வெளிப்படையையும் நன்கறிவாய்; எனவே எனது மன்னிப்புக் கோரலை ஏற்றுக்கொள்வாயாக. நீ எனது தேவையை அறிவாய்; எனவே நான் கேட்பதை எனக்கு வழங்குவாயாக. நீ என் உள்ளத்தில் இருப்பதை அறிவாய்; எனவே என் பாவங்களை மன்னித்தருள்வாயாக.\n\nயா அல்லாஹ்! என் உள்ளத்தைத் தொடும் உறுதியான ஈமானையும், எனக்கு நீ விதித்ததைத் தவிர வேறு எதுவும் எனக்கு ஏற்படாது என்பதை நான் உறுதியாக அறியும் உண்மையான உறுதியையும் (யகீனையும்), எனக்காக நீ பங்கிட்டதில் மனத்திருப்தியையும் உன்னிடம் வேண்டுகிறேன். நீயே இம்மையிலும் மறுமையிலும் எனது பாதுகாவலன்; என்னை முஸ்லிமாக மரணிக்கச் செய்து, நல்லடியார்களுடன் என்னைச் சேர்த்தருள்வாயாக!\n\nயா அல்லாஹ்! எங்களின் இந்த இடத்தில் (மகாமு இப்ராஹீமில்) எந்த ஒரு பாவத்தையும் நீ மன்னிக்காமல் விட்டுவிடாதே; எந்த ஒரு கவலையையும் நீ நீக்காமல் விடாதே; எந்த ஒரு தேவையையும் நீ நிறைவேற்றி எளிதாக்காமல் விடாதே, கருணையாளர்களிலெல்லாம் மகா கருணையாளனே!\n\nயா அல்லாஹ்! எங்கள் காரியங்களை எங்களுக்கு எளிதாக்கித் தருவாயாக; எங்களின் நெஞ்சங்களை விசாலமாக்குவாயாக; எங்கள் உள்ளங்களை ஒளிரச் செய்வாயாக; எங்கள் செயல்களை நற்செயல்களோடு நிறைவு செய்வாயாக. யா அல்லாஹ்! எங்களை முஸ்லிம்களாக மரணிக்கச் செய்து, நல்லோர்களுடன் சேர்த்தருள்வாயாக!\n\nமேலும் அல்லாஹ் எங்களின் தலைவர் முஹம்மத் (ஸல்) அவர்கள் மீதும், அவர்களது குடும்பத்தார், தோழர்கள் அனைவர் மீதும் ஸலவாத்தும் ஸலாமும் பொழிவானாக. புகழனைத்தும் அகிலங்களின் இரட்சகனான அல்லாஹ்வுக்கே உரியது."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/dua-at-maqha-me-ibrahim.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300269/hajj-duas/hajj-dua-at-maqam-ibrahim-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-maqam-ibrahim-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-maqam-ibrahim-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/dua-at-maqha-me-ibrahim_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-maqam-ibrahim-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/dua-at-maqha-me-ibrahim_urudu_title.ogg",
    source: "Sunan al-Bayhaqi & al-Azraqi",
    reference: "Akhbar Makkah • Al-Sunan al-Kubra (Dua at Maqam Ibrahim)",
    verified: true
  },
  {
    slug: "hajj-dua-at-meezab-rahmat",
    order: 21,
    title: "21. Dua at Meezab-e-Rahmat (میزابِ رحمت کی دعا)",
    titles: {
      en: "21. Dua at Meezab-e-Rahmat",
      ur: "21. میزابِ رحمت کے نیچے مانگی جانے والی دعا",
      ta: "21. மீஸாபே ரஹ்மத்தின் கீழ் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ أَظِلَّنِيْ تَحْتَ ظِلِّ عَرْشِكَ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّكَ وَلَا بَاقِيَ إِلَّا وَجْهُكَ، وَاسْقِنِيْ مِنْ حَوْضِ نَبِيِّكَ سَيِّدِنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ شُرْبَةً هَنِيْئَةً مَرِيْئَةً لَا أَظْمَأُ بَعْدَهَا أَبَدًا",
    transliteration: "Allāhumma aẓillanī taḥta ẓilli ‘arshika yawma lā ẓilla illā ẓilluka wa lā bāqiya illā wajhuk, wasqinī min ḥawḍi nabiyyika sayyidinā Muḥammadin ṣallallāhu ‘alayhi wa sallama shurbatan hanī’atan marī’atan lā aẓma’u ba‘dahā abadā.",
    transliterations: {
      en: "Allāhumma aẓillanī taḥta ẓilli ‘arshika yawma lā ẓilla illā ẓilluka wa lā bāqiya illā wajhuk, wasqinī min ḥawḍi nabiyyika sayyidinā Muḥammadin ṣallallāhu ‘alayhi wa sallama shurbatan hanī’atan marī’atan lā aẓma’u ba‘dahā abadā.",
      ta: "அல்லாஹும்ம அளில்லனீ தஹ்த ளில்லி அர்ஷிக யவ்ம லா ளில்ல இல்லா ளில்லுக வலா பாகிய இல்லா வஜ்ஹுக், வஸ்கினீ மின் ஹவ்ளி நபிய்யிக ஸய்யிதினா முஹம்மதின் ஸல்லல்லாஹு அலைஹி வசல்லம ஷுர்பதன் ஹனீஅதன் மரீஅதன் லா அள்மவு பஃதஹா அபதா."
    },
    translations: {
      en: "O Allah, shelter me under the shade of Your Throne on the Day when there is no shade except Your shade, and nothing remains except Your Face. And quench my thirst from the Hawd (basin) of Your Prophet, our master Muhammad (may Allah bless him and grant him peace), with a refreshing and satisfying drink after which I will never thirst again.",
      ur: "اے اللہ! مجھے اپنے عرش کے سائے کے نیچے جگہ عطا فرما، جس دن تیرے سائے کے سوا کوئی سایہ نہ ہوگا اور نہ تیری ذات کے سوا کوئی بقا ہوگی، اور مجھے اپنے نبی ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم کے حوض (کوثر) سے ایسا خوشگوار اور مزے دار پانی کا گھونٹ پلائیے کہ اس کے بعد کبھی پیاس نہ لگے۔",
      ta: "யா அல்லாஹ்! உனது நிழலைத் தவிர வேறு எந்த நிழலும் இல்லாத, உனது திருமுகத்தைத் தவிர வேறு எதுவும் நிலைத்திராத (மறுமை) நாளில், உனது அர்ஷின் நிழலின் கீழ் எனக்கு நிழல் தருவாயாக! மேலும் உனது நபியும் எங்கள் தலைவருமான முஹம்மத் (ஸல்) அவர்களின் ஹவ்ல் (கவ்ஸர்) தடாகத்திலிருந்து, அதன்பின் ஒருபோதும் எனக்குத் தாகமே ஏற்படாத வகையில், மனமகிழ்வூட்டும் சுவையான ஒரு மிடறு பானத்தை எனக்குப் புகட்டுவாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300266/hajj-duas/dua-at-meezab-rahmat.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-meezab-rahmat-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-meezab-rahmat-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-meezab-rahmat-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300266/hajj-duas/dua-at-meezab-rahmat_english_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-meezab-rahmat-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300266/hajj-duas/dua-at-meezab-rahmat_urudu_title.ogg",
    source: "Manasik al-Hajj & Al-Adhkar",
    reference: "Dua Beneath Meezab al-Rahmah",
    verified: true
  },
  {
    slug: "hajj-dua-between-rukne-yamani-and-hajarul-aswad",
    order: 22,
    title: "22. Dua Between Rukn al-Yamani and Hajar al-Aswad (رکنِ یمانی اور حجرِ اسود کے درمیان کی دعا)",
    titles: {
      en: "22. Dua Between Rukn al-Yamani and Hajar al-Aswad",
      ur: "22. رکنِ یمانی اور حجرِ اسود کے درمیان کی دعا",
      ta: "22. ருக்னுல் யமானிக்கும் ஹஜருல் அஸ்வத்துக்கும் இடையில் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "quran",
    arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘adhāban-nār.",
    transliterations: {
      en: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘adhāban-nār.",
      ta: "ரப்பனா ஆதினா ஃபித்-துன்யா ஹஸனதன் வ ஃபில்-ஆகிரதி ஹஸனதன் வ கினா அதாபன்-நார்."
    },
    translations: {
      en: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
      ur: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں عذابِ دوزخ سے بچا۔",
      ta: "எங்கள் இறைவனே! எங்களுக்கு இவ்வுலகிலும் நன்மையை வழங்குவாயாக; மறுமையிலும் நன்மையை வழங்குவாயாக; மேலும் எங்களை நரக நெருப்பின் வேதனையிலிருந்து காத்தருள்வாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300263/hajj-duas/du-aa-between-rukne-yamani-and-hajarul-aswad.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300272/hajj-duas/hajj-dua-between-rukne-yamani-and-hajarul-aswad-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300273/hajj-duas/hajj-dua-between-rukne-yamani-and-hajarul-aswad-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300273/hajj-duas/hajj-dua-between-rukne-yamani-and-hajarul-aswad-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300263/hajj-duas/du-aa-between-rukne-yamani-and-hajarul-aswad_english_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300273/hajj-duas/hajj-dua-between-rukne-yamani-and-hajarul-aswad-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/du-aa-between-rukne-yamani-and-hajarul-aswad_Urudu_title.ogg",
    source: "Quran & Sunan Abi Dawud",
    reference: "Surah Al-Baqarah 2:201 • Sunan Abi Dawud 1892",
    verified: true
  },
  {
    slug: "hajj-tawaf-second-circuit-opening",
    order: 23,
    title: "23. Opening Invocation - 2nd Circuit of Tawaf (طواف کے دوسرے چکر کا آغاز)",
    titles: {
      en: "23. Opening Invocation - 2nd Circuit of Tawaf",
      ur: "23. طواف کے دوسرے چکر کا آغاز (استلام کی تکبیر)",
      ta: "23. தவாஃபின் 2-வது சுற்றின் தொடக்கம் (இஸ்திலாம்)"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
    transliteration: "Bismillāhi Allāhu Akbar, wa lillāhil-ḥamd.",
    transliterations: {
      en: "Bismillāhi Allāhu Akbar, wa lillāhil-ḥamd.",
      ta: "பிஸ்மில்லாஹி அல்லாஹு அக்பர், வ லில்லாஹில் ஹம்து."
    },
    translations: {
      en: "In the name of Allah, Allah is the Greatest, and all praise is due to Allah.",
      ur: "اللہ کے نام سے (شروع کرتا ہوں)، اللہ سب سے بڑا ہے اور تمام تعریفیں اللہ ہی کے لیے ہیں۔",
      ta: "அல்லாஹ்வின் பெயரால் (தொடங்குகிறேன்), அல்லாஹ் மிகப் பெரியவன்; புகழனைத்தும் அல்லாஹ்வுக்கே உரியது."
    },
        audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300286/hajj-duas/hajj-tawaf-second-circuit-opening-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300286/hajj-duas/hajj-tawaf-second-circuit-opening-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300287/hajj-duas/hajj-tawaf-second-circuit-opening-ur.mp3",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300287/hajj-duas/hajj-tawaf-second-circuit-opening-title-ta.mp3",
    source: "Sahih al-Bukhari & Sunan al-Bayhaqi",
    reference: "Bukhari 1612 • Facing Hajar al-Aswad (2nd Circuit)",
    verified: true
  },
  {
    slug: "hajj-tawaf-second-circuit",
    order: 24,
    title: "24. Supplication for the Second Circuit (طواف کے دوسرے چکر کی دعا)",
    titles: {
      en: "24. Supplication for the Second Circuit",
      ur: "24. طواف کے دوسرے چکر کی دعا",
      ta: "24. தவாஃபின் 2-வது சுற்றுக்கான துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ إِنَّ هَذَا الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَالْأَمْنَ أَمْنُكَ، وَالْعَبْدَ عَبْدُكَ، وَأَنَا عَبْدُكَ وَابْنُ عَبْدِكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ، فَحَرِّمْ لُحُومَنَا وَبَشَرَنَا عَلَى النَّارِ، اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ، وَاجْعَلْنَا مِنَ الرَّاشِدِينَ، اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ، اللَّهُمَّ ارْزُقْنِي الْجَنَّةَ بِغَيْرِ حِسَابٍ",
    transliteration: "Allāhumma inna hādhal-bayta baytuka, wal-ḥarama ḥaramuka, wal-amna amnuka, wal-‘abda ‘abduka, wa anā ‘abduka wabnu ‘abdika, wa hādhā maqāmul-‘ā’idhi bika minan-nāri fa-ḥarrim luḥūmanā wa basharanā ‘alan-nār. Allāhumma ḥabbib ilaynal-īmāna wa zayyinhu fī qulūbinā wa karrih ilaynal-kufra wal-fusūqa wal-‘iṣyāna waj‘alnā minar-rāshidīn. Allāhumma qinī ‘adhābaka yawma tab‘athu ‘ibādak. Allāhummar-zuqnīl-jannata bi-ghayri ḥisāb.",
    transliterations: {
      en: "Allāhumma inna hādhal-bayta baytuka, wal-ḥarama ḥaramuka, wal-amna amnuka, wal-‘abda ‘abduka, wa anā ‘abduka wabnu ‘abdika, wa hādhā maqāmul-‘ā’idhi bika minan-nāri fa-ḥarrim luḥūmanā wa basharanā ‘alan-nār. Allāhumma ḥabbib ilaynal-īmāna wa zayyinhu fī qulūbinā wa karrih ilaynal-kufra wal-fusūqa wal-‘iṣyāna waj‘alnā minar-rāshidīn. Allāhumma qinī ‘adhābaka yawma tab‘athu ‘ibādak. Allāhummar-zuqnīl-jannata bi-ghayri ḥisāb.",
      ta: "அல்லாஹும்ம இன்ன ஹாதல்-பைத்த பைத்துக, வல்-ஹரம ஹரமுக, வல்-அம்ன அம்னுக, வல்-அப்த அப்துக, வ அன அப்துக வப்னு அப்திக, வ ஹாதா மகாமூல்-ஆயிதி பிக மினந்-நாரி ஃபஹர்ரிம் லுஹூமனா வ பஷரனா அலந்-நார். அல்லாஹும்ம ஹப்பிப் இலைனல்-ஈமான வ ஸய்யின்ஹு ஃபீ குலூபினா, வ கர்ரிஹ் இலைனல்-குஃப்ற வல்-ஃபுஸூக்க வல்-இஸ்யான், வஜ்அல்னா மினர்-ராஷிதீன். அல்லாஹும்ம கினீ அதாபக யவ்ம தப்அது இபாதக. அல்லாஹும்மர்-ஸுக்னில்-ஜன்னத பி-கைரி ஹிஸாப்."
    },
    translations: {
      en: "O Allah! Indeed, this House is Your House, the Sanctuary is Your Sanctuary, the place of safety is Your safety, the slave is Your slave, and I am Your slave, the son of Your slave. This is the place of one who seeks refuge in You from the Fire, so forbid our flesh and our skin from the Fire. O Allah, make faith dear to us and adorn it in our hearts, and make disbelief, wickedness, and disobedience hateful to us, and make us among the rightly guided. O Allah, protect me from Your punishment on the Day You resurrect Your slaves. O Allah, grant me Paradise without reckoning.",
      ur: "اے اللہ! بے شک یہ گھر تیرا گھر ہے، اور حرم تیرا حرم ہے، اور امن تیرا امن ہے، اور بندہ تیرا بندہ ہے، اور میں تیرا بندہ اور تیرے بندے کا بیٹا ہوں، اور یہ اس شخص کا مقام ہے جو آگ (جہنم) سے تیری پناہ مانگتا ہے، پس ہمارے جسم کے گوشت اور چمڑے کو آگ پر حرام کر دے۔ اے اللہ! ہمارے لیے ایمان کو محبوب بنا دے اور اسے ہمارے دلوں میں مزین کر دے، اور کفر، نافرمانی اور گناہ کو ہمارے نزدیک ناپسندیدہ بنا دے، اور ہمیں راہ راست پر چلنے والوں میں شامل فرما۔ اے اللہ! مجھے اس دن اپنے عذاب سے بچانا جس دن تو اپنے بندوں کو اٹھائے گا۔ اے اللہ! مجھے بغیر حساب کے جنت عطا فرما۔",
      ta: "யா அல்லாஹ்! நிச்சயமாக இந்த ஆலயம் உனது ஆலயம்; இந்த புனித தலம் உனது புனித தலம்; இந்த பாதுகாப்பு உனது பாதுகாப்பு; இந்த அடியான் உனது அடியான்; நான் உனது அடியான், உனது அடியானின் மகன். இது நரக நெருப்பிலிருந்து உன்னிடம் பாதுகாப்புத் தேடுபவனின் இடமாகும்; எனவே எங்களது உடலின் சதையையும், தோலையும் நரக நெருப்பிற்கு தடை செய்யப்பட்டதாக (ஹராமாக) ஆக்குவாயாக! யா அல்லாஹ்! ஈமானை எங்களுக்குப் பிரியமானதாக ஆக்கி, எங்கள் உள்ளங்களில் அதனை அலங்கரிப்பாயாக; மேலும் இறைமறுப்பு, பாவம் மற்றும் மாறுசெய்தலை எங்களுக்கு வெறுக்கத்தக்கதாக ஆக்குவாயாக; மேலும் எங்களை நேர்வழி பெற்றவர்களில் சேர்த்தருள்வாயாக! யா அல்லாஹ்! உனது அடியார்களை நீ உயிர்ப்பித்து எழுப்பும் (மறுமை) நாளில் உனது வேதனையிலிருந்து என்னைக் காத்தருள்வாயாக! யா அல்லாஹ்! கணக்கின்றி எனக்கு சொர்க்கத்தை வழங்குவாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300299/hajj-duas/Supplication_for_the_Second_Circuit.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300286/hajj-duas/hajj-tawaf-second-circuit-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300287/hajj-duas/hajj-tawaf-second-circuit-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300288/hajj-duas/hajj-tawaf-second-circuit-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300300/hajj-duas/Supplication_for_the_Second_Circuit_English_Title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300287/hajj-duas/hajj-tawaf-second-circuit-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300300/hajj-duas/Supplication_for_the_Second_Circuit_Urudu_Title.ogg",
    source: "Sunan al-Bayhaqi & al-Shafi'i",
    reference: "Al-Sunan al-Kubra • Dhu'as of Tawaf",
    verified: true
  },
  {
    slug: "hajj-dua-near-hajarul-aswad-25",
    order: 25,
    title: "25. Dua Near the Hajar-ul-Aswad (حجر اسود کے پاس کی دعا)",
    titles: {
      en: "25. Dua Near the Hajar-ul-Aswad",
      ur: "25. حجر اسود کے پاس کی دعا",
      ta: "25. ஹஜருல் அஸ்வத் அருகே ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، وَإِلَيْكَ يَرْجِعُ السَّلَامُ، فَحَيِّنَا رَبَّنَا بِالسَّلَامِ وَ أَدْخِلْنَا بِرَحْمَتِكَ دَارَ السَّلَامِ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ. اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفاً وَتَعْظِيماً وَتَكْرِيماً وَمَهَابَةً وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ وَاعْتَمَرَهُ تَعْظِيماً وَتَشْرِيفاً.",
    transliteration: "Allāhumma Antas-Salām, wa minkas-Salām, wa ilayka yarji‘us-Salām, fa-ḥayyinā Rabbanā bis-Salām, wa adkhilnā bi-raḥmatika Dāras-Salām. Tabārakta yā Dhal-Jalāli wal-Ikrām.\nAllāhumma zid hādhal-bayta tashrīfan wa ta‘ẓīman wa takrīman wa mahābah, wa zid man sharrafahū wa karramahū mimman ḥajjahū wa‘tamarahū ta‘ẓīman wa tashrīfā.",
    transliterations: {
      en: "Allāhumma Antas-Salām, wa minkas-Salām, wa ilayka yarji‘us-Salām, fa-ḥayyinā Rabbanā bis-Salām, wa adkhilnā bi-raḥmatika Dāras-Salām. Tabārakta yā Dhal-Jalāli wal-Ikrām.\nAllāhumma zid hādhal-bayta tashrīfan wa ta‘ẓīman wa takrīman wa mahābah, wa zid man sharrafahū wa karramahū mimman ḥajjahū wa‘tamarahū ta‘ẓīman wa tashrīfā.",
      ta: "அல்லாஹும்ம அந்தஸ்-ஸலாம், வ மின்கஸ்-ஸலாம், வ இலைக யர்ஜிஉஸ்-ஸலாம், ஃபஹய்யினா ரப்பனா பிஸ்-ஸலாம், வ அத்கில்னா பி-ரஹ்மதிக தாரஸ்-ஸலாம். தபாரக்த யா தல்-ஜலாலி வல்-இக்ராம்.\nஅல்லாஹும்ம ஜித் ஹாதல்-பைத்த தஷ்ரீஃபன் வ தஃளீமன் வ தக்ரீமன் வ மஹாயா, வ ஜித் மன் ஷர்ரஃபஹூ வ கர்ரமஹூ மிம்மன் ஹஜ்ஜஹூ வஃதமரஹூ தஃளீமன் வ தஷ்ரீஃபா."
    },
    translations: {
      en: "O Allah! You are the Giver of Peace, and from You is peace, and to You peace returns. So, O our Lord! Cause us to live with peace, and admit us, by Your mercy, into the Abode of Peace (Paradise). Blessed are You, O Possessor of Majesty and Honor.\n\nO Allah! Increase this House in honor, greatness, respect, and awe. And increase in honor and greatness anyone who honors and respects it among those who perform Hajj and Umrah.",
      ur: "اے اللہ! تو سلامتی والا ہے اور سلامتی تیری ہی طرف سے ہے، اور سلامتی تیری ہی طرف لوٹتی ہے۔ پس اے ہمارے رب! ہمیں سلامتی کے ساتھ زندہ رکھ اور ہمیں اپنی رحمت سے سلامتی کے گھر (جنت) میں داخل فرما۔ تو برکت والا ہے، اے شان و شوکت اور بزرگی والے۔\n\nاے اللہ! اس گھر (کعبہ) کی عظمت، توقیر، عزت اور رعب کو مزید بڑھا دے۔ اور جو بھی حج یا عمرہ کرے اور اس گھر کی تعظیم و تکریم کرے، اس کی تعظیم اور توقیر کو مزید بڑھا دے۔",
      ta: "யா அல்லாஹ்! நீயே சாந்தியளிப்பவன், உன்னிடமிருந்தே சாந்தி உண்டாகிறது; மேலும் சாந்தி உன்னிடமே மீளுகிறது. எனவே எங்கள் இறைவனே! எங்களை சாந்தியுடன் வாழச் செய்வாயாக; உனது கருணையினால் எங்களை சாந்தியின் இல்லமான சொர்க்கத்தில் பிரவேசிக்கச் செய்வாயாக. மகத்துவமும் கண்ணியமும் உடையவனே! நீ பாக்கியம் நிறைந்தவன்.\n\nயா அல்லாஹ்! இந்த ஆலயத்தின் கண்ணியத்தையும், மகத்துவத்தையும், மதிப்பையும், மரியாதையையும் இன்னும் அதிகப்படுத்துவாயாக; மேலும் ஹஜ் அல்லது உம்ரா செய்து இதனை கண்ணியப்படுத்துவோரின் மகத்துவத்தையும் சிறப்பையும் அதிகப்படுத்துவாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/dua-near-the-hajar-ul-aswad.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/dua-near-the-hajar-ul-aswad_English_Title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300276/hajj-duas/hajj-dua-near-hajarul-aswad-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300268/hajj-duas/dua-near-the-hajar-ul-aswad_Urudu_Title.ogg",
    source: "Sunan al-Bayhaqi & al-Shafi'i",
    reference: "Al-Sunan al-Kubra • Manasik al-Hajj",
    verified: true
  },
  {
    slug: "hajj-dua-at-multazam-26",
    order: 26,
    title: "26. Dua at the Multazam (ملتزم پر مانگی جانے والی دعا)",
    titles: {
      en: "26. Dua at the Multazam",
      ur: "26. ملتزم پر مانگی جانے والی دعا",
      ta: "26. முல்தஜமில் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ يَا رَبَّ الْبَيْتِ الْعَتِيقِ أَعْتِقْ رِقَابَنَا وَرِقَابَ آبَائِنَا وَأُمَّهَاتِنَا وَإِخْوَانِنَا وَأَوْلَادِنَا مِنَ النَّارِ، يَا ذَا الْجُودِ وَالْكَرَمِ وَالْفَضْلِ وَالْمَنِّ وَالْعَطَاءِ وَالْإِحْسَانِ، اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الْآخِرَةِ، اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدِكَ وَاقِفٌ تَحْتَ بَابِكَ مُلْتَزِمٌ بِأَعْتَابِكَ مُتَذَلِّلٌ بَيْنَ يَدَيْكَ أَرْجُو رَحْمَتَكَ وَأَخْشَى عَذَابَكَ، يَا قَدِيمَ الْإِحْسَانِ، اللَّهُمَّ إِنِّى أَسْأَلُكَ أَنْ تَرْفَعَ ذِكْرِي وَتَضَعَ وِزْرِي وَتُصْلِحَ أَمْرِي وَتُطَهِّرَ قَلْبِي وَتُنَوِّرَ لِي فِي قَبْرِي وَتَغْفِرَ لِي ذَنْبِي وَأَسْأَلُكَ الدَّرَجَاتِ الْعُلَى مِنَ الْجَنَّةِ.",
    transliteration: "Allāhumma yā Rabbal-baytil-‘atīqi a‘tiq riqābanā wa riqāba ābā’inā wa ummahātinā wa ikhwāninā wa awlādinā minan-nār, yā Dhal-jūdi wal-karami wal-faḍli wal-manni wal-‘aṭā’i wal-iḥsān, Allāhumma aḥsin ‘āqibatanā fil-umūri kullihā wa ajirnā min khizyid-dunyā wa ‘adhābil-ākhirah, Allāhumma innī ‘abduka wabnu ‘abdika wāqifun taḥta bābika multazimun bi-a‘tābika mutadhallilun bayna yadayka arjū raḥmataka wa akhshā ‘adhābaka, yā Qadīmal-iḥsān, Allāhumma innī as’aluka an tarfa‘a dhikrī wa taḍa‘a wizrī wa tuṣliḥa amrī wa tuṭahhira qalbī wa tunawwira lī fī qabrī wa taghfira lī dhanbī wa as’alukad-darajātil-‘ulyā minal-jannah.",
    transliterations: {
      en: "Allāhumma yā Rabbal-baytil-‘atīqi a‘tiq riqābanā wa riqāba ābā’inā wa ummahātinā wa ikhwāninā wa awlādinā minan-nār, yā Dhal-jūdi wal-karami wal-faḍli wal-manni wal-‘aṭā’i wal-iḥsān, Allāhumma aḥsin ‘āqibatanā fil-umūri kullihā wa ajirnā min khizyid-dunyā wa ‘adhābil-ākhirah, Allāhumma innī ‘abduka wabnu ‘abdika wāqifun taḥta bābika multazimun bi-a‘tābika mutadhallilun bayna yadayka arjū raḥmataka wa akhshā ‘adhābaka, yā Qadīmal-iḥsān, Allāhumma innī as’aluka an tarfa‘a dhikrī wa taḍa‘a wizrī wa tuṣliḥa amrī wa tuṭahhira qalbī wa tunawwira lī fī qabrī wa taghfira lī dhanbī wa as’alukad-darajātil-‘ulyā minal-jannah.",
      ta: "அல்லாஹும்ம யா ரப்பல்-பைத்தில்-அதீக், அஃதிக் ரிகாபனா வ ரிகாப ஆபாஇனா வ உம் மஹாதினா வ இக்வானினா வ அவ்லாதினா மினந்-நார், யா தல்-ஜூதி வல்-கரமி வல்-ஃபழ்லி வல்-மன்னி வல்-அதாஇ வல்-இஹ்ஸான். அல்லாஹும்ம அஹ்ஸின் ஆகிபதனா ஃபில்-உமூரி குல்லிஹா வ அஜிர்னா மின் கிஸ்யித்-துன்யா வ அதாபில்-ஆகிரா. அல்லாஹும்ம இன்னீ அப்துக வப்னு அப்திக, வாகிஃபுன் தஹ்த பாபிக, முல்தஸிமுன் பி-அஃதாபிக, முததல்-லிலுன் பைன யதய்க, அர்ஜூ ரஹ்மதக வ அக்ஷா அதாபக, யா கதீமல்-இஹ்ஸான். அல்லாஹும்ம இன்னீ அஸ்அலுக அன் தர்ஃபஅ திக்ரீ, வ தழஅ விஸ்ரீ, வ துஸ்லிஹ அம்ரீ, வ துதஹ்ஹிர கல்பீ, வ துநவ்விர லீ ஃபீ கப்ரீ, வ தஃக்பிர லீ தன்பீ, வ அஸ்அலுகத்-தரஜாதில்-உல்யா மினல்-ஜன்னாஹ்."
    },
    translations: {
      en: "O Allah, Lord of the Ancient House, free our necks, the necks of our fathers, our mothers, our brothers, and our children from the Fire, O Possessor of generosity, nobility, grace, favor, giving, and excellence, and make our end excellent in all matters while protecting us from the disgrace of this world and the punishment of the Hereafter; O Allah, I am Your slave, the son of Your slave, standing beneath Your door, clinging to Your threshold, and humbling myself before You as I hope for Your mercy and fear Your punishment, O You Whose beneficence is eternal, and I ask You to raise my mention, lift my burden, rectify my affairs, purify my heart, illuminate my grave, forgive my sin, and grant me the highest ranks of Paradise.",
      ur: "اے اللہ! بیت العتیق (خانہ کعبہ) کے رب! ہماری گردنوں کو، ہمارے باپ دادا، ہماری ماؤں، ہمارے بھائیوں اور ہماری اولاد کی گردنوں کو آگ (جہنم) سے آزاد فرما، اے جود و کرم، فضل، احسان، عطا اور بخشش والے! اے اللہ! تمام معاملات میں ہمارا انجام بہتر فرما اور ہمیں دنیا کی رسوائی اور آخرت کے عذاب سے پناہ دے؛ اے اللہ! میں تیرا بندہ اور تیرے ہی بندے کا بیٹا ہوں، تیرے دروازے کے نیچے کھڑا ہوں، تیرے آستانے سے لپٹا ہوا ہوں، تیرے سامنے عاجزی کرنے والا ہوں، تیری رحمت کا امیدوار ہوں اور تیرے عذاب سے ڈرتا ہوں، اے ہمیشہ سے احسان کرنے والے! اے اللہ! میں تجھ سے سوال کرتا ہوں کہ تو میرا ذکر بلند کر، میرا بوجھ اتار دے، میرے معاملات کی اصلاح فرما، میرے دل کو پاک کر دے، میری قبر کو میرے لیے روشن کر دے، میرے گناہ معاف فرما اور میں تجھ سے جنت کے بلند ترین درجے مانگتا ہوں۔",
      ta: "பழமையான ஆலயத்தின் (கஅபாவின்) இரட்சகனான யா அல்லாஹ்! எங்களின் கழுத்துகளையும், எங்களின் தந்தையர், அன்னையர், சகோதரர்கள் மற்றும் பிள்ளைகளின் கழுத்துகளையும் நரக நெருப்பிலிருந்து விடுதலை செய்வாயாக; கொடையும், கண்ணியமும், அருளும், பேரன்பும், ஈகையும், உபகாரமும் நிறைந்தவனே! யா அல்லாஹ்! எங்கள் காரியங்கள் அனைத்திலும் எங்களின் முடிவை அழகியதாக ஆக்குவாயாக; மேலும் இம்மையின் இழிவிலிருந்தும் மறுமையின் வேதனையிலிருந்தும் எங்களைப் பாதுகாப்பாயாக. யா அல்லாஹ்! நான் உனது அடியான், உனது அடியானின் மகன்; உனது வாசலின் கீழ் நின்று கொண்டிருக்கிறேன், உனது வாசற்படியைக் கட்டியணைத்துக் கொண்டுள்ளேன், உனக்கு முன்னால் பணிந்து நிற்கிறேன்; உனது கருணையை ஆதரவு வைக்கிறேன், உனது வேதனைக்கு அஞ்சுகிறேன், என்றுமே நிலைத்த உபகாரமுடையவனே! யா அல்லாஹ்! எனது புகழை உயர்த்தவும், எனது பாவச் சுமையை இறக்கி வைக்கவும், எனது காரியங்களை சீராக்கவும், எனது உள்ளத்தைப் பரிசுத்தப்படுத்தவும், எனது கப்ரில் எனக்கு ஒளியூட்டவும், எனது பாவங்களை மன்னிக்கவும் உன்னிடம் வேண்டுகிறேன்; மேலும் சொர்க்கத்தின் மிக உயர்ந்த பதவிகளை உன்னிடம் கேட்கிறேன்."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300267/hajj-duas/dua-at-multazim.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-multazam-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300272/hajj-duas/hajj-dua-at-multazam-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300273/hajj-duas/hajj-dua-at-multazam-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300267/hajj-duas/dua-at-multazim_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300272/hajj-duas/hajj-dua-at-multazam-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300267/hajj-duas/dua-at-multazim_Urudu_title.ogg",
    source: "Athar & Manasik al-Hajj",
    reference: "Du'a at the Multazam • Al-Adhkar",
    verified: true
  },
  {
    slug: "hajj-dua-at-maqam-ibrahim-27",
    order: 27,
    title: "27. Dua at Maqam Ibrahim (مقامِ ابراہیم پر مانگی جانے والی دعا)",
    titles: {
      en: "27. Dua at Maqam Ibrahim",
      ur: "27. مقامِ ابراہیم پر مانگی جانے والی دعا",
      ta: "27. மகாமு இப்ராஹீமில் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اللَّهُمَّ إِنَّكَ تَعْلَمُ سِرِّي وَعَلَانِيَتِي فَاقْبَلْ مَعْذِرَتِي، وَتَعْلَمُ حَاجَتِي فَأَعْطِنِي سُؤْلِي، وَتَعْلَمُ مَا فِي نَفْسِي فَاغْفِرْ لِي ذُنُوبِي، اللَّهُمَّ إِنِّي أَسْأَلُكَ إِيمَانًا يُبَاشِرُ قَلْبِي وَيَقِينًا صَادِقًا حَتَّى أَعْلَمَ أَنَّهُ لَا يُصِيبُنِي إِلَّا مَا كَتَبْتَ لِي، وَرِضًا بِمَا قَسَمْتَ لِي، أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ، تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ، اللَّهُمَّ لَا تَدَعْ لَنَا فِي مَقَامِنَا هَذَا ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً إِلَّا قَضَيْتَهَا وَيَسَّرْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ، اللَّهُمَّ يَسِّرْ أُمُورَنَا وَاشْرَحْ صُدُورَنَا وَنَوِّرْ قُلُوبَنَا وَاخْتِمْ بِالصَّالِحَاتِ أَعْمَالَنَا، اللَّهُمَّ تَوَفَّنَا مُسْلِمِينَ وَأَلْحِقْنَا بِالصَّالِحِينَ، وَصَلَّى اللَّهُ تَعَالَى وَسَلَّمَ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ أَجْمَعِينَ، وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.",
    transliteration: "Allāhumma innaka ta‘lamu sirrī wa ‘alāniyyatī faqbal ma‘dhiratī, wa ta‘lamu ḥājatī fa-a‘ṭinī su’lī, wa ta‘lamu mā fī nafsī faghfir lī dhunūbī.\nAllāhumma innī as’aluka īmānan yubāshiru qalbī wa yaqīnan ṣādiqan ḥattā a‘lama annahū lā yuṣībunī illā mā katabta lī, wa riḍan bimā قasamta lī, Anta waliyyī fid-dunyā wal-ākhirah, tawaffanī musliman wa alḥiqnī biṣ-ṣāliḥīn.\nAllāhumma lā tada‘ lanā fī maqāminā hādhā dhanban illā ghafartah, wa lā hamman illā farrajtah, wa lā ḥājatan illā qaḍaytahā wa yassartahā yā Arḥamar-rāḥimīn.\nAllāhumma yassir umūranā washraḥ ṣudūranā wa nawwir qulūbanā wakhtim biṣ-ṣāliḥāti a‘mālanā, Allāhumma tawaffanā muslimīna wa alḥiqnā biṣ-ṣāliḥīn.\nWa ṣallallāhu ta‘ālā wa sallama ‘alā sayyidinā Muḥammadin wa ālihī wa ṣaḥbihī ajma‘īn, wal-ḥamdu lillāhi Rabbil-‘ālamīn.",
    transliterations: {
      en: "Allāhumma innaka ta‘lamu sirrī wa ‘alāniyyatī faqbal ma‘dhiratī, wa ta‘lamu ḥājatī fa-a‘ṭinī su’lī, wa ta‘lamu mā fī nafsī faghfir lī dhunūbī.\nAllāhumma innī as’aluka īmānan yubāshiru qalbī wa yaqīnan ṣādiqan ḥattā a‘lama annahū lā yuṣībunī illā mā katabta lī, wa riḍan bimā qasamta lī, Anta waliyyī fid-dunyā wal-ākhirah, tawaffanī musliman wa alḥiqnī biṣ-ṣāliḥīn.\nAllāhumma lā tada‘ lanā fī maqāminā hādhā dhanban illā ghafartah, wa lā hamman illā farrajtah, wa lā ḥājatan illā qaḍaytahā wa yassartahā yā Arḥamar-rāḥimīn.\nAllāhumma yassir umūranā washraḥ ṣudūranā wa nawwir qulūbanā wakhtim biṣ-ṣāliḥāti a‘mālanā, Allāhumma tawaffanā muslimīna wa alḥiqnā biṣ-ṣāliḥīn.\nWa ṣallallāhu ta‘ālā wa sallama ‘alā sayyidinā Muḥammadin wa ālihī wa ṣaḥbihī ajma‘īn, wal-ḥamdu lillāhi Rabbil-‘ālamīn.",
      ta: "அல்லாஹும்ம இன்னக தஃலமு சிர்ரீ வ அலானியத்தீ ஃபக்பல் மஃதிரதீ, வ தஃலமு ஹாஜத்தீ ஃபஅஃதினீ ஸுஃலீ, வ தஃலமு மா ஃபீ நஃப்ஸீ ஃபஃக்பிர் லீ துனூபீ.\nஅல்லாஹும்ம இன்னீ அஸ்அலுக ஈமானன் யுபாஷிரு கல்பீ வ யகீனன் ஸாதிகான் ஹத்தா அஃலம அன்னஹூ லா யுஸீபுனீ இல்லா மா கதப்த லீ, வ ரிழன் பிமா கஸம்த லீ, அந்த வலிய்யீ ஃபித்-துன்யா வல்-ஆகிரா, தவஃப்பனீ முஸ்லிமன் வ அல்ஹிக்னீ பிஸ்-ஸாலிஹீன்.\nஅல்லாஹும்ம லா ததஃ லனா ஃபீ மகாமினா ஹாதா தன்பன் இல்லா கஃபர்தஹ், வலா ஹம்மன் இல்லா ஃபர்ரஜ்தஹ், வலா ஹாஜதன் இல்லா கதய்தஹா வ யஸ்ஸர்தஹா யா அர்ஹமர்-ராஹிமீன்.\nஅல்லாஹும்ம யஸ்ஸிர் உமூரனா வஷ்ரஹ் ஸுதூரனா வ நவ்விர குலூபனா வக்திம் பிஸ்-ஸாலிஹாதீ அஃமாலனா, அல்லாஹும்ம தவஃப்பனா முஸ்லிமீன வ அல்ஹிக்னா பிஸ்-ஸாலிஹீன்.\nவ ஸல்லல்லாஹு தஆலா வ ஸல்லம அலா ஸய்யிதினா முஹம்மதின் வ ஆலிஹீ வ ஸஹ்பிஹீ அஜ்மஈன், வல்-ஹம்து லில்லாஹி ரப்பில்-ஆலமீன்."
    },
    translations: {
      en: "O Allah, You know my secret and my open, so accept my apology. You know my need, so grant me my request. You know what is in my soul, so forgive my sins.\n\nO Allah, I ask You for faith that touches my heart and true certainty until I know that nothing will befall me except what You have written for me, and contentment with what You have divided for me. You are my Protector in this world and the Hereafter; cause me to die as a Muslim and join me with the righteous.\n\nO Allah, do not leave for us in this place of ours any sin except that You forgive it, nor any worry except that You relieve it, nor any need except that You fulfill it and make it easy, O Most Merciful of the merciful.\n\nO Allah, make our affairs easy for us, expand our chests, illuminate our hearts, and seal our deeds with righteousness. O Allah, cause us to die as Muslims and join us with the righteous.\n\nAnd may Allah the Exalted send blessings and peace upon our master Muhammad, his family, and all his companions. And all praise is due to Allah, Lord of the worlds.",
      ur: "اے اللہ! بے شک تو میرے پوشیدہ اور ظاہر کو بخوبی جانتا ہے، پس میرا عذر قبول فرما۔ اور تو میری حاجت کو جانتا ہے، پس مجھے میری مانگی ہوئی چیز عطا فرما۔ اور تو میرے دل کے اندر کی بات کو جانتا ہے، پس میرے گناہ معاف فرما۔\n\nاے اللہ! میں تجھ سے ایسا ایمان مانگتا ہوں جو میرے دل میں پیوست ہو جائے اور ایسا سچا یقین کہ مجھے معلوم ہو جائے کہ مجھے وہی پہنچتا ہے جو تو نے میرے مقسوم میں لکھ دیا ہے، اور جو تو نے میرے لیے تقسیم فرما دیا ہے اس پر راضی رہنا (نصیب فرما)۔ تو ہی دنیا اور آخرت میں میرا کارساز ہے، مجھے اسلام پر موت دے اور مجھے نیک لوگوں کے ساتھ ملا دے۔\n\nاے اللہ! اس ہمارے مقام (مقامِ ابراہیم) پر ہمارا کوئی گناہ نہ چھوڑ مگر اسے بخش دے، اور کوئی غم نہ چھوڑ مگر اسے دور کر دے، اور کوئی ضرورت نہ پوری ہونے والی نہ چھوڑ مگر اسے پورا کر دے اور آسان کر دے، اے سب سے زیادہ رحم کرنے والے!\n\nاے اللہ! ہمارے کاموں کو آسان فرما، ہمارے سینے کھول دے، ہمارے دلوں کو منور فرما، اور ہمارے اعمال کا خاتمہ نیک اعمال پر فرما۔ اے اللہ! ہمیں اسلام کی حالت میں وفات دے اور ہمیں صالحین (نیک لوگوں) کے ساتھ ملا دے۔\n\nاور اللہ تعالی درود و سلام نازل فرمائے ہمارے آقا حضرت محمد ﷺ پر اور آپ کی آل پر اور تمام صحابہ کرام پر، اور تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔",
      ta: "யா அல்லாஹ்! நிச்சயமாக நீ எனது இரகசியத்தையும் எனது வெளிப்படையையும் நன்கறிவாய்; எனவே எனது மன்னிப்புக் கோரலை ஏற்றுக்கொள்வாயாக. நீ எனது தேவையை அறிவாய்; எனவே நான் கேட்பதை எனக்கு வழங்குவாயாக. நீ என் உள்ளத்தில் இருப்பதை அறிவாய்; எனவே என் பாவங்களை மன்னித்தருள்வாயாக.\n\nயா அல்லாஹ்! என் உள்ளத்தைத் தொடும் உறுதியான ஈமானையும், எனக்கு நீ விதித்ததைத் தவிர வேறு எதுவும் எனக்கு ஏற்படாது என்பதை நான் உறுதியாக அறியும் உண்மையான உறுதியையும் (யகீனையும்), எனக்காக நீ பங்கிட்டதில் மனத்திருப்தியையும் உன்னிடம் வேண்டுகிறேன். நீயே இம்மையிலும் மறுமையிலும் எனது பாதுகாவலன்; என்னை முஸ்லிமாக மரணிக்கச் செய்து, நல்லடியார்களுடன் என்னைச் சேர்த்தருள்வாயாக!\n\nயா அல்லாஹ்! எங்களின் இந்த இடத்தில் (மகாமு இப்ராஹீமில்) எந்த ஒரு பாவத்தையும் நீ மன்னிக்காமல் விட்டுவிடாதே; எந்த ஒரு கவலையையும் நீ நீக்காமல் விடாதே; எந்த ஒரு தேவையையும் நீ நிறைவேற்றி எளிதாக்காமல் விடாதே, கருணையாளர்களிலெல்லாம் மகா கருணையாளனே!\n\nயா அல்லாஹ்! எங்கள் காரியங்களை எங்களுக்கு எளிதாக்கித் தருவாயாக; எங்களின் நெஞ்சங்களை விசாலமாக்குவாயாக; எங்கள் உள்ளங்களை ஒளிரச் செய்வாயாக; எங்கள் செயல்களை நற்செயல்களோடு நிறைவு செய்வாயாக. யா அல்லாஹ்! எங்களை முஸ்லிம்களாக மரணிக்கச் செய்து, நல்லோர்களுடன் சேர்த்தருள்வாயாக!\n\nமேலும் அல்லாஹ் எங்களின் தலைவர் முஹம்மத் (ஸல்) அவர்கள் மீதும், அவர்களது குடும்பத்தார், தோழர்கள் அனைவர் மீதும் ஸலவாத்தும் ஸலாமும் பொழிவானாக. புகழனைத்தும் அகிலங்களின் இரட்சகனான அல்லாஹ்வுக்கே உரியது."
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/dua-at-maqha-me-ibrahim.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300269/hajj-duas/hajj-dua-at-maqam-ibrahim-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-maqam-ibrahim-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-maqam-ibrahim-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/dua-at-maqha-me-ibrahim_English_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-maqam-ibrahim-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300264/hajj-duas/dua-at-maqha-me-ibrahim_urudu_title.ogg",
    source: "Sunan al-Bayhaqi & al-Azraqi",
    reference: "Akhbar Makkah • Al-Sunan al-Kubra (Dua at Maqam Ibrahim)",
    verified: true
  },
  {
    slug: "hajj-dua-at-meezab-rahmat-28",
    order: 28,
    title: "28. Dua at Meezab-e-Rahmat (میزابِ رحمت کی دعا)",
    titles: {
      en: "28. Dua at Meezab-e-Rahmat",
      ur: "28. میزابِ رحمت کے نیچے مانگی جانے والی دعا",
      ta: "28. மீஸாபே ரஹ்மத்தின் கீழ் ஓதும் துஆ"
    },
    category: "Hajj & Umrah",
    kind: "hadith",
    arabicText: "اَللَّهُمَّ أَظِلْنِيْ تَحْتَ ظِلِّ عَرْشِكَ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّكَ وَلَا بَاقِيَ إِلَّا وَجْهُكَ، وَاسْقِنِيْ مِنْ حَوْضِ نَبِيِّكَ سَيِّدِنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ شُرْبَةً هَنِيْئَةً مَرِيْئَةً لَا أَظْمَأُ بَعْدَهَا أَبَدًا",
    transliteration: "Allāhumma aẓillanī taḥta ẓilli ‘arshika yawma lā ẓilla illā ẓilluka wa lā bāqiya illā wajhuk, wasqinī min ḥawḍi nabiyyika sayyidinā Muḥammadin ṣallallāhu ‘alayhi wa sallama shurbatan hanī’atan marī’atan lā aẓma’u ba‘dahā abadā.",
    transliterations: {
      en: "Allāhumma aẓillanī taḥta ẓilli ‘arshika yawma lā ẓilla illā ẓilluka wa lā bāqiya illā wajhuk, wasqinī min ḥawḍi nabiyyika sayyidinā Muḥammadin ṣallallāhu ‘alayhi wa sallama shurbatan hanī’atan marī’atan lā aẓma’u ba‘dahā abadā.",
      ta: "அல்லாஹும்ம அளில்லனீ தஹ்த ளில்லி அர்ஷிக யவ்ம லா ளில்ல இல்லா ளில்லுக வலா பாகிய இல்லா வஜ்ஹுக், வஸ்கினீ மின் ஹவ்ளி நபிய்யிக ஸய்யிதினா முஹம்மதின் ஸல்லல்லாஹு அலைஹி வசல்லம ஷுர்பதன் ஹனீஅதன் மரீஅதன் லா அள்மவு பஃதஹா அபதா."
    },
    translations: {
      en: "O Allah, shelter me under the shade of Your Throne on the Day when there is no shade except Your shade, and nothing remains except Your Face. And quench my thirst from the Hawd (basin) of Your Prophet, our master Muhammad (may Allah bless him and grant him peace), with a refreshing and satisfying drink after which I will never thirst again.",
      ur: "اے اللہ! مجھے اپنے عرش کے سائے کے نیچے جگہ عطا فرما، جس دن تیرے سائے کے سوا کوئی سایہ نہ ہوگا اور نہ تیری ذات کے سوا کوئی بقا ہوگی، اور مجھے اپنے نبی ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم کے حوض (کوثر) سے ایسا خوشگوار اور مزے دار پانی کا گھونٹ پلائیے کہ اس کے بعد کبھی پیاس نہ لگے۔",
      ta: "யா அல்லாஹ்! உனது நிழலைத் தவிர வேறு எந்த நிழலும் இல்லாத, உனது திருமுகத்தைத் தவிர வேறு எதுவும் நிலைத்திராத (மறுமை) நாளில், உனது அர்ஷின் நிழலின் கீழ் எனக்கு நிழல் தருவாயாக! மேலும் உனது நபியும் எங்கள் தலைவருமான முஹம்மத் (ஸல்) அவர்களின் ஹவ்ல் (கவ்ஸர்) தடாகத்திலிருந்து, அதன்பின் ஒருபோதும் எனக்குத் தாகமே ஏற்படாத வகையில், மனமகிழ்வூட்டும் சுவையான ஒரு மிடறு பானத்தை எனக்குப் புகட்டுவாயாக!"
    },
    audioUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300266/hajj-duas/dua-at-meezab-rahmat.ogg",
    audioEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300270/hajj-duas/hajj-dua-at-meezab-rahmat-en.mp3",
    audioTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-meezab-rahmat-ta.mp3",
    audioUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-meezab-rahmat-ur.mp3",
    audioTitleEnglishUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300266/hajj-duas/dua-at-meezab-rahmat_english_title.ogg",
    audioTitleTamilUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300271/hajj-duas/hajj-dua-at-meezab-rahmat-title-ta.mp3",
    audioTitleUrduUrl: "https://res.cloudinary.com/of1qk9bu/video/upload/v1794300266/hajj-duas/dua-at-meezab-rahmat_urudu_title.ogg",
    source: "Manasik al-Hajj & Al-Adhkar",
    reference: "Dua Beneath Meezab al-Rahmah",
    verified: true
  }
];

const tracks: Array<{ slug: string; language: "ar" | "en" | "ta" | "ur"; speaker: string; storageKey: string; mimeType: string; durationSec: number; sizeBytes: number }> = [
  // Dua 1
  { slug: "hajj-leaving-home-part-1", language: "ar", speaker: "Arabic Reciter", storageKey: "Leaving Home-1.ogg", mimeType: "audio/ogg", durationSec: 11, sizeBytes: 74332 },
  { slug: "hajj-leaving-home-part-1", language: "en", speaker: "ElevenLabs George", storageKey: "Leaving Home-1-en.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 102861 },
  { slug: "hajj-leaving-home-part-1", language: "ta", speaker: "Azure Pallavi", storageKey: "Leaving Home-1-ta.mp3", mimeType: "audio/mpeg", durationSec: 10, sizeBytes: 70416 },
  { slug: "hajj-leaving-home-part-1", language: "ur", speaker: "Azure Uzma", storageKey: "Leaving Home-1-ur.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 46944 },

  // Dua 2
  { slug: "hajj-leaving-home-part-2", language: "ar", speaker: "Arabic Reciter", storageKey: "Leaving Home-2.ogg", mimeType: "audio/ogg", durationSec: 12, sizeBytes: 86296 },
  { slug: "hajj-leaving-home-part-2", language: "en", speaker: "ElevenLabs George", storageKey: "Leaving Home-2-en.mp3", mimeType: "audio/mpeg", durationSec: 13, sizeBytes: 204007 },
  { slug: "hajj-leaving-home-part-2", language: "ta", speaker: "Azure Pallavi", storageKey: "Leaving Home-2-ta.mp3", mimeType: "audio/mpeg", durationSec: 18, sizeBytes: 134208 },
  { slug: "hajj-leaving-home-part-2", language: "ur", speaker: "Azure Uzma", storageKey: "Leaving Home-2-ur.mp3", mimeType: "audio/mpeg", durationSec: 12, sizeBytes: 86112 },

  // Dua 3
  { slug: "hajj-send-off-others", language: "ar", speaker: "Arabic Reciter", storageKey: "Send of others.ogg", mimeType: "audio/ogg", durationSec: 16, sizeBytes: 114467 },
  { slug: "hajj-send-off-others", language: "en", speaker: "ElevenLabs George", storageKey: "Send of others-en.mp3", mimeType: "audio/mpeg", durationSec: 11, sizeBytes: 168898 },
  { slug: "hajj-send-off-others", language: "ta", speaker: "Azure Pallavi", storageKey: "Send of others-ta.mp3", mimeType: "audio/mpeg", durationSec: 13, sizeBytes: 97056 },
  { slug: "hajj-send-off-others", language: "ur", speaker: "Azure Uzma", storageKey: "Send of others-ur.mp3", mimeType: "audio/mpeg", durationSec: 9, sizeBytes: 66384 },

  // Dua 4
  { slug: "hajj-boarding-ship", language: "ar", speaker: "Arabic Reciter", storageKey: "BOARDING IN THE SHIP.ogg", mimeType: "audio/ogg", durationSec: 26, sizeBytes: 176427 },
  { slug: "hajj-boarding-ship", language: "en", speaker: "ElevenLabs George", storageKey: "BOARDING IN THE SHIP-en.mp3", mimeType: "audio/mpeg", durationSec: 21, sizeBytes: 329394 },
  { slug: "hajj-boarding-ship", language: "ta", speaker: "Azure Pallavi", storageKey: "BOARDING IN THE SHIP-ta.mp3", mimeType: "audio/mpeg", durationSec: 25, sizeBytes: 179136 },
  { slug: "hajj-boarding-ship", language: "ur", speaker: "Azure Uzma", storageKey: "BOARDING IN THE SHIP-ur.mp3", mimeType: "audio/mpeg", durationSec: 17, sizeBytes: 124848 },

  // Dua 5
  { slug: "hajj-travel-aeroplane", language: "en", speaker: "ElevenLabs George", storageKey: "Travel aeroplane-en.mp3", mimeType: "audio/mpeg", durationSec: 32, sizeBytes: 509953 },
  { slug: "hajj-travel-aeroplane", language: "ta", speaker: "Azure Pallavi", storageKey: "Travel aeroplane-ta.mp3", mimeType: "audio/mpeg", durationSec: 43, sizeBytes: 314928 },
  { slug: "hajj-travel-aeroplane", language: "ur", speaker: "Azure Uzma", storageKey: "Travel aeroplane-ur.mp3", mimeType: "audio/mpeg", durationSec: 32, sizeBytes: 233568 },

  // Dua 6
  { slug: "hajj-intention-ihram-ifrad", language: "ar", speaker: "Arabic Reciter", storageKey: "intention-of-ihram.ogg", mimeType: "audio/ogg", durationSec: 7, sizeBytes: 46428 },
  { slug: "hajj-intention-ihram-ifrad", language: "en", speaker: "ElevenLabs George (Male)", storageKey: "intention-of-ihram-en.mp3", mimeType: "audio/mpeg", durationSec: 6, sizeBytes: 34704 },
  { slug: "hajj-intention-ihram-ifrad", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "intention-of-ihram-ta.mp3", mimeType: "audio/mpeg", durationSec: 10, sizeBytes: 59760 },
  { slug: "hajj-intention-ihram-ifrad", language: "ur", speaker: "Azure Salman (Male)", storageKey: "intention-of-ihram-ur.mp3", mimeType: "audio/mpeg", durationSec: 9, sizeBytes: 51552 },

  // Dua 7
  { slug: "hajj-intention-qiran", language: "ar", speaker: "Arabic Reciter", storageKey: "intention-of-qiran.ogg", mimeType: "audio/ogg", durationSec: 8, sizeBytes: 57424 },
  { slug: "hajj-intention-qiran", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-intention-qiran-en.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 41904 },
  { slug: "hajj-intention-qiran", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-intention-qiran-ta.mp3", mimeType: "audio/mpeg", durationSec: 12, sizeBytes: 69408 },
  { slug: "hajj-intention-qiran", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-intention-qiran-ur.mp3", mimeType: "audio/mpeg", durationSec: 10, sizeBytes: 61776 },

  // Dua 8
  { slug: "hajj-intention-tamattu", language: "ar", speaker: "Arabic Reciter", storageKey: "intention-of-thamathu.ogg", mimeType: "audio/ogg", durationSec: 6, sizeBytes: 44465 },
  { slug: "hajj-intention-tamattu", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-intention-tamattu-en.mp3", mimeType: "audio/mpeg", durationSec: 6, sizeBytes: 34560 },
  { slug: "hajj-intention-tamattu", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-intention-tamattu-ta.mp3", mimeType: "audio/mpeg", durationSec: 10, sizeBytes: 60912 },
  { slug: "hajj-intention-tamattu", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-intention-tamattu-ur.mp3", mimeType: "audio/mpeg", durationSec: 9, sizeBytes: 53424 },

  // Dua 9
  { slug: "hajj-dua-after-talbiyah", language: "ar", speaker: "Arabic Reciter", storageKey: "dhu-aa-after-thalbiya.ogg", mimeType: "audio/ogg", durationSec: 8, sizeBytes: 59387 },
  { slug: "hajj-dua-after-talbiyah", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-after-talbiyah-en.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 41040 },
  { slug: "hajj-dua-after-talbiyah", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-after-talbiyah-ta.mp3", mimeType: "audio/mpeg", durationSec: 12, sizeBytes: 72288 },
  { slug: "hajj-dua-after-talbiyah", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-after-talbiyah-ur.mp3", mimeType: "audio/mpeg", durationSec: 10, sizeBytes: 60192 },

  // Dua 10
  { slug: "hajj-dua-entering-haram", language: "ar", speaker: "Arabic Reciter", storageKey: "Dhu'aa When Entering the Haram.ogg", mimeType: "audio/ogg", durationSec: 25, sizeBytes: 184512 },
  { slug: "hajj-dua-entering-haram", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-entering-haram-en.mp3", mimeType: "audio/mpeg", durationSec: 24, sizeBytes: 141264 },
  { slug: "hajj-dua-entering-haram", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-entering-haram-ta.mp3", mimeType: "audio/mpeg", durationSec: 36, sizeBytes: 213984 },
  { slug: "hajj-dua-entering-haram", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-entering-haram-ur.mp3", mimeType: "audio/mpeg", durationSec: 31, sizeBytes: 183312 },

  // Dua 11
  { slug: "hajj-dua-entering-makkah", language: "ar", speaker: "Arabic Reciter", storageKey: "when-entering-the-holy-makka.ogg", mimeType: "audio/ogg", durationSec: 18, sizeBytes: 133185 },
  { slug: "hajj-dua-entering-makkah", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-entering-makkah-en.mp3", mimeType: "audio/mpeg", durationSec: 16, sizeBytes: 97056 },
  { slug: "hajj-dua-entering-makkah", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-entering-makkah-ta.mp3", mimeType: "audio/mpeg", durationSec: 31, sizeBytes: 187488 },
  { slug: "hajj-dua-entering-makkah", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-entering-makkah-ur.mp3", mimeType: "audio/mpeg", durationSec: 22, sizeBytes: 131904 },

  // Dua 12
  { slug: "hajj-entering-masjidul-haram", language: "ar", speaker: "Arabic Reciter", storageKey: "When Entering the Masjidul Haram.ogg", mimeType: "audio/ogg", durationSec: 11, sizeBytes: 85401 },
  { slug: "hajj-entering-masjidul-haram", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-entering-masjidul-haram-en.mp3", mimeType: "audio/mpeg", durationSec: 12, sizeBytes: 70704 },
  { slug: "hajj-entering-masjidul-haram", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-entering-masjidul-haram-ta.mp3", mimeType: "audio/mpeg", durationSec: 18, sizeBytes: 106848 },
  { slug: "hajj-entering-masjidul-haram", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-entering-masjidul-haram-ur.mp3", mimeType: "audio/mpeg", durationSec: 14, sizeBytes: 81792 },

  // Dua 13
  { slug: "hajj-sighting-the-kaba", language: "ar", speaker: "Arabic Reciter", storageKey: "Du'a When Sighting the Ka'ba.ogg", mimeType: "audio/ogg", durationSec: 79, sizeBytes: 554059 },
  { slug: "hajj-sighting-the-kaba", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-sighting-the-kaba-en.mp3", mimeType: "audio/mpeg", durationSec: 66, sizeBytes: 395424 },
  { slug: "hajj-sighting-the-kaba", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-sighting-the-kaba-ta.mp3", mimeType: "audio/mpeg", durationSec: 106, sizeBytes: 636192 },
  { slug: "hajj-sighting-the-kaba", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-sighting-the-kaba-ur.mp3", mimeType: "audio/mpeg", durationSec: 90, sizeBytes: 540864 },

  // Dua 14
  { slug: "hajj-dua-refuge-facing-kabah", language: "ar", speaker: "Arabic Reciter", storageKey: "may-recite-also-this-dhu-aa.ogg", mimeType: "audio/ogg", durationSec: 8, sizeBytes: 56016 },
  { slug: "hajj-dua-refuge-facing-kabah", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-refuge-facing-kabah-en.mp3", mimeType: "audio/mpeg", durationSec: 10, sizeBytes: 60336 },
  { slug: "hajj-dua-refuge-facing-kabah", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-refuge-facing-kabah-ta.mp3", mimeType: "audio/mpeg", durationSec: 12, sizeBytes: 74160 },
  { slug: "hajj-dua-refuge-facing-kabah", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-refuge-facing-kabah-ur.mp3", mimeType: "audio/mpeg", durationSec: 9, sizeBytes: 54432 },

  // Dua 15
  { slug: "hajj-dua-near-hajarul-aswad", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-near-the-hajar-ul-aswad.ogg", mimeType: "audio/ogg", durationSec: 30, sizeBytes: 213220 },
  { slug: "hajj-dua-near-hajarul-aswad", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-near-hajarul-aswad-en.mp3", mimeType: "audio/mpeg", durationSec: 33, sizeBytes: 195264 },
  { slug: "hajj-dua-near-hajarul-aswad", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-near-hajarul-aswad-ta.mp3", mimeType: "audio/mpeg", durationSec: 42, sizeBytes: 251568 },
  { slug: "hajj-dua-near-hajarul-aswad", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-near-hajarul-aswad-ur.mp3", mimeType: "audio/mpeg", durationSec: 38, sizeBytes: 229392 },

  // Dua 16
  { slug: "hajj-intention-of-tawaf", language: "ar", speaker: "Arabic Reciter", storageKey: "Intention of Tawaf.ogg", mimeType: "audio/ogg", durationSec: 12, sizeBytes: 87845 },
  { slug: "hajj-intention-of-tawaf", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-intention-of-tawaf-en.mp3", mimeType: "audio/mpeg", durationSec: 8, sizeBytes: 49680 },
  { slug: "hajj-intention-of-tawaf", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-intention-of-tawaf-ta.mp3", mimeType: "audio/mpeg", durationSec: 15, sizeBytes: 91296 },
  { slug: "hajj-intention-of-tawaf", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-intention-of-tawaf-ur.mp3", mimeType: "audio/mpeg", durationSec: 13, sizeBytes: 79776 },

  // Dua 17
  { slug: "hajj-tawaf-opening-invocation", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-tawaf-opening-invocation-en.mp3", mimeType: "audio/mpeg", durationSec: 5, sizeBytes: 31392 },
  { slug: "hajj-tawaf-opening-invocation", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-tawaf-opening-invocation-ta.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 39600 },
  { slug: "hajj-tawaf-opening-invocation", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-tawaf-opening-invocation-ur.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 44064 },

  // Dua 18
  { slug: "hajj-tawaf-first-circuit", language: "ar", speaker: "Arabic Reciter", storageKey: "Supplication for the First Circuit.ogg", mimeType: "audio/ogg", durationSec: 38, sizeBytes: 281718 },
  { slug: "hajj-tawaf-first-circuit", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-tawaf-first-circuit-en.mp3", mimeType: "audio/mpeg", durationSec: 38, sizeBytes: 229104 },
  { slug: "hajj-tawaf-first-circuit", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-tawaf-first-circuit-ta.mp3", mimeType: "audio/mpeg", durationSec: 60, sizeBytes: 362448 },
  { slug: "hajj-tawaf-first-circuit", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-tawaf-first-circuit-ur.mp3", mimeType: "audio/mpeg", durationSec: 50, sizeBytes: 300096 },

  // Dua 19
  { slug: "hajj-dua-at-multazam", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-at-multazim.ogg", mimeType: "audio/ogg", durationSec: 62, sizeBytes: 436311 },
  { slug: "hajj-dua-at-multazam", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-at-multazam-en.mp3", mimeType: "audio/mpeg", durationSec: 47, sizeBytes: 281088 },
  { slug: "hajj-dua-at-multazam", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-at-multazam-ta.mp3", mimeType: "audio/mpeg", durationSec: 75, sizeBytes: 447696 },
  { slug: "hajj-dua-at-multazam", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-at-multazam-ur.mp3", mimeType: "audio/mpeg", durationSec: 65, sizeBytes: 391392 },

  // Dua 20
  { slug: "hajj-dua-at-maqam-ibrahim", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-at-maqha-me-ibrahim.ogg", mimeType: "audio/ogg", durationSec: 79, sizeBytes: 553716 },
  { slug: "hajj-dua-at-maqam-ibrahim", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-at-maqam-ibrahim-en.mp3", mimeType: "audio/mpeg", durationSec: 67, sizeBytes: 401904 },
  { slug: "hajj-dua-at-maqam-ibrahim", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-at-maqam-ibrahim-ta.mp3", mimeType: "audio/mpeg", durationSec: 106, sizeBytes: 636624 },
  { slug: "hajj-dua-at-maqam-ibrahim", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-at-maqam-ibrahim-ur.mp3", mimeType: "audio/mpeg", durationSec: 95, sizeBytes: 569376 },

  // Dua 21
  { slug: "hajj-dua-at-meezab-rahmat", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-at-meezab-rahmat.ogg", mimeType: "audio/ogg", durationSec: 20, sizeBytes: 150843 },
  { slug: "hajj-dua-at-meezab-rahmat", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-at-meezab-rahmat-en.mp3", mimeType: "audio/mpeg", durationSec: 20, sizeBytes: 120816 },
  { slug: "hajj-dua-at-meezab-rahmat", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-at-meezab-rahmat-ta.mp3", mimeType: "audio/mpeg", durationSec: 31, sizeBytes: 185904 },
  { slug: "hajj-dua-at-meezab-rahmat", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-at-meezab-rahmat-ur.mp3", mimeType: "audio/mpeg", durationSec: 23, sizeBytes: 137376 },

  // Dua 22
  { slug: "hajj-dua-between-rukne-yamani-and-hajarul-aswad", language: "ar", speaker: "Arabic Reciter", storageKey: "du-aa-between-rukne-yamani-and-hajarul-aswad.ogg", mimeType: "audio/ogg", durationSec: 14, sizeBytes: 98567 },
  { slug: "hajj-dua-between-rukne-yamani-and-hajarul-aswad", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-between-rukne-yamani-and-hajarul-aswad-en.mp3", mimeType: "audio/mpeg", durationSec: 8, sizeBytes: 50688 },
  { slug: "hajj-dua-between-rukne-yamani-and-hajarul-aswad", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-between-rukne-yamani-and-hajarul-aswad-ta.mp3", mimeType: "audio/mpeg", durationSec: 12, sizeBytes: 73872 },
  { slug: "hajj-dua-between-rukne-yamani-and-hajarul-aswad", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-between-rukne-yamani-and-hajarul-aswad-ur.mp3", mimeType: "audio/mpeg", durationSec: 9, sizeBytes: 55584 },

  // Dua 23
  { slug: "hajj-tawaf-second-circuit-opening", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-tawaf-second-circuit-opening-en.mp3", mimeType: "audio/mpeg", durationSec: 5, sizeBytes: 31392 },
  { slug: "hajj-tawaf-second-circuit-opening", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-tawaf-second-circuit-opening-ta.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 39600 },
  { slug: "hajj-tawaf-second-circuit-opening", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-tawaf-second-circuit-opening-ur.mp3", mimeType: "audio/mpeg", durationSec: 7, sizeBytes: 44064 },

  // Dua 24
  { slug: "hajj-tawaf-second-circuit", language: "ar", speaker: "Arabic Reciter", storageKey: "Supplication for the Second Circuit.ogg", mimeType: "audio/ogg", durationSec: 40, sizeBytes: 276057 },
  { slug: "hajj-tawaf-second-circuit", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-tawaf-second-circuit-en.mp3", mimeType: "audio/mpeg", durationSec: 39, sizeBytes: 231840 },
  { slug: "hajj-tawaf-second-circuit", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-tawaf-second-circuit-ta.mp3", mimeType: "audio/mpeg", durationSec: 63, sizeBytes: 376992 },
  { slug: "hajj-tawaf-second-circuit", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-tawaf-second-circuit-ur.mp3", mimeType: "audio/mpeg", durationSec: 49, sizeBytes: 292176 },

  // Dua 25
  { slug: "hajj-dua-near-hajarul-aswad-25", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-near-the-hajar-ul-aswad.ogg", mimeType: "audio/ogg", durationSec: 30, sizeBytes: 213220 },
  { slug: "hajj-dua-near-hajarul-aswad-25", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-near-hajarul-aswad-en.mp3", mimeType: "audio/mpeg", durationSec: 33, sizeBytes: 195264 },
  { slug: "hajj-dua-near-hajarul-aswad-25", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-near-hajarul-aswad-ta.mp3", mimeType: "audio/mpeg", durationSec: 42, sizeBytes: 251568 },
  { slug: "hajj-dua-near-hajarul-aswad-25", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-near-hajarul-aswad-ur.mp3", mimeType: "audio/mpeg", durationSec: 38, sizeBytes: 229392 },

  // Dua 26
  { slug: "hajj-dua-at-multazam-26", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-at-multazim.ogg", mimeType: "audio/ogg", durationSec: 62, sizeBytes: 436311 },
  { slug: "hajj-dua-at-multazam-26", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-at-multazam-en.mp3", mimeType: "audio/mpeg", durationSec: 47, sizeBytes: 281088 },
  { slug: "hajj-dua-at-multazam-26", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-at-multazam-ta.mp3", mimeType: "audio/mpeg", durationSec: 75, sizeBytes: 447696 },
  { slug: "hajj-dua-at-multazam-26", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-at-multazam-ur.mp3", mimeType: "audio/mpeg", durationSec: 65, sizeBytes: 391392 },

  // Dua 27
  { slug: "hajj-dua-at-maqam-ibrahim-27", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-at-maqha-me-ibrahim.ogg", mimeType: "audio/ogg", durationSec: 79, sizeBytes: 553716 },
  { slug: "hajj-dua-at-maqam-ibrahim-27", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-at-maqam-ibrahim-en.mp3", mimeType: "audio/mpeg", durationSec: 67, sizeBytes: 401904 },
  { slug: "hajj-dua-at-maqam-ibrahim-27", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-at-maqam-ibrahim-ta.mp3", mimeType: "audio/mpeg", durationSec: 106, sizeBytes: 636624 },
  { slug: "hajj-dua-at-maqam-ibrahim-27", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-at-maqam-ibrahim-ur.mp3", mimeType: "audio/mpeg", durationSec: 95, sizeBytes: 569376 },

  // Dua 28
  { slug: "hajj-dua-at-meezab-rahmat-28", language: "ar", speaker: "Arabic Reciter", storageKey: "dua-at-meezab-rahmat.ogg", mimeType: "audio/ogg", durationSec: 20, sizeBytes: 150843 },
  { slug: "hajj-dua-at-meezab-rahmat-28", language: "en", speaker: "ElevenLabs George (Ryan Model)", storageKey: "hajj-dua-at-meezab-rahmat-en.mp3", mimeType: "audio/mpeg", durationSec: 20, sizeBytes: 120816 },
  { slug: "hajj-dua-at-meezab-rahmat-28", language: "ta", speaker: "Azure Valluvar (Male)", storageKey: "hajj-dua-at-meezab-rahmat-ta.mp3", mimeType: "audio/mpeg", durationSec: 31, sizeBytes: 185904 },
  { slug: "hajj-dua-at-meezab-rahmat-28", language: "ur", speaker: "Azure Salman (Male)", storageKey: "hajj-dua-at-meezab-rahmat-ur.mp3", mimeType: "audio/mpeg", durationSec: 23, sizeBytes: 137376 },
];

export async function seedDatabase(force = false) {
  console.log(force ? "Re-seeding database..." : "Syncing initial duas and transliterations...");
  if (force) {
    await Dua.deleteMany({});
    await AudioTrack.deleteMany({});
  }
  for (const r of rows) {
    await Dua.findOneAndUpdate(
      { slug: r.slug },
      { ...r, arabicNorm: norm(r.arabicText) },
      { upsert: true, new: true }
    );
  }
  for (const t of tracks) {
    const duaDoc = await Dua.findOne({ slug: t.slug });
    if (duaDoc) {
      await AudioTrack.findOneAndUpdate(
        { dua: duaDoc._id, language: t.language },
        {
          dua: duaDoc._id,
          language: t.language,
          speaker: t.speaker,
          durationSec: t.durationSec,
          storageKey: t.storageKey,
          mimeType: t.mimeType,
          sizeBytes: t.sizeBytes,
          licence: "Generated"
        },
        { upsert: true, new: true }
      );
    }
  }
  console.log(`Seeded successfully: ${rows.length} ordered Hajj & Umrah duas with all language audio tracks`);
  return rows.length;
}

// If run directly:
if (process.argv[1] && (process.argv[1].replace(/\\/g, "/").includes("seed.ts") || process.argv[1].replace(/\\/g, "/").includes("seed.js"))) {
  await mongoose.connect(env.MONGO_URI);
  await seedDatabase(true);
  await mongoose.disconnect();
}

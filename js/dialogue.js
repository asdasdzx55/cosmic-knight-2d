/**
 * COSMIC KNIGHT 2D - STORY DIALOGUE SYSTEM (نظام حوارات القصة الملحمية بالعربية)
 * Interactive heroic story cutscenes between the Hero (Knight) and the Boss / Enemies
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

const GAME_DIALOGUES = {
    // ==========================================
    // STAGE 1: THE MYSTIC FOREST (الغابة الساحرة)
    // ==========================================
    intro_1: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد والعدالة',
            titleEn: 'Protector of the Dimensions',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'أشعر باضطراب في هذه الغابة العريقة.. لقد استيقظت وحوش الظلام وبدأت بنشر الفوضى والأذى!',
            textEn: 'I sense a disturbance in this ancient forest.. Dark beasts have awakened to spread chaos!'
        },
        {
            speaker: 'enemy',
            nameAr: 'حارس الغابة المظلمة',
            nameEn: 'Forest Sentinel',
            titleAr: 'تابع التنين الشرير',
            titleEn: 'Minion of the Dragon',
            avatar: '🦇',
            color: '#ff2e63',
            textAr: 'قف مكانك أيها الفارس! لن تعبر إلى الممرات الأخرى.. سنهزمك هنا في أعماق الغابة!',
            textEn: 'Halt, Knight! You shall not pass into other paths.. We will defeat you here in the forest!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سيفي مستعد لنصرة الحق والدفاع عن الأبرياء، ولن توقفني أي قوى شريرة!',
            textEn: 'My blade is ready to defend justice and innocence, and no evil forces will stop me!'
        }
    ],
    outro_1: [
        {
            speaker: 'enemy',
            nameAr: 'حارس الغابة المظلمة',
            nameEn: 'Forest Sentinel',
            titleAr: 'حارس الغابة المهزوم',
            titleEn: 'Defeated Forest Sentinel',
            avatar: '🦇',
            color: '#ff2e63',
            textAr: 'يا لك من مقاتل صلب ومحترف.. لكن اعلم أن الطرق القادمة مليئة بالأخطار الشديدة!',
            textEn: 'What a formidable warrior you are.. but beware, the upcoming trials are far more dangerous!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'أنا مستعد لكل تحدٍ.. سأواصل رحلتي لإنهاء شر التنين وإعادة الأمان!',
            textEn: 'I am ready for any challenge.. I will push forward to defeat the evil dragon!'
        }
    ],

    // ==========================================
    // STAGE 2: CRYSTAL CAVERNS (كهوف الكريستال)
    // ==========================================
    intro_2: [
        {
            speaker: 'enemy',
            nameAr: 'عفريت الكريستال',
            nameEn: 'Crystal Imp',
            titleAr: 'حارس المناجم العميقة',
            titleEn: 'Deep Mines Warden',
            avatar: '💎',
            color: '#00f5d4',
            textAr: 'هذه الكريستالات ملك لجيش التنين.. لن تلمس حجراً واحداً أيها الفارس المتسلل!',
            textEn: 'These crystals belong to the Dragon army.. You will not touch a single gem!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سأسترجع طاقة النجوم الصافية وأطرد جيوش الشر من هذه الكهوف!',
            textEn: 'I will reclaim the starlight energy and drive the dark forces from these caves!'
        }
    ],
    outro_2: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'تم تطهير كهوف الكريستال بنجاح.. الطريق الآن يقودنا نحو صهارة البركان الثائر!',
            textEn: 'The crystal caverns are cleansed.. The path now leads towards the Volcanic Core!'
        }
    ],

    // ==========================================
    // STAGE 3: VOLCANIC CORE (البركان الثائر)
    // ==========================================
    intro_3: [
        {
            speaker: 'enemy',
            nameAr: 'وحش الحمم البركاني',
            nameEn: 'Magma Beast',
            titleAr: 'زعيم الصهارة الملتهبة',
            titleEn: 'Molten Core Leader',
            avatar: '🔥',
            color: '#ff5400',
            textAr: 'من يتجرأ على وطء أرض الصهارة والبراكين؟ ستحترق أمام لهيبي أيها الفارس!',
            textEn: 'Who dares step onto the molten volcano? You will burn before my flames!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'لهيب النيران لن يثني عزيمتي.. سأخمد هذا الخطر وأعيد الأمان!',
            textEn: 'Infernal fire cannot bend my will.. I will extinguish the danger and restore peace!'
        }
    ],
    outro_3: [
        {
            speaker: 'enemy',
            nameAr: 'وحش الحمم البركاني',
            nameEn: 'Magma Beast',
            titleAr: 'زعيم الصهارة المهزوم',
            titleEn: 'Defeated Molten Beast',
            avatar: '🔥',
            color: '#ff5400',
            textAr: 'لقد استطعت التغلب على حرارة البركان.. لكن أطلال السماء العالية ستسقطك في الهاوية!',
            textEn: 'You survived the volcano.. but the high sky ruins will drop you into the abyss!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'كل خطوة تقربني من قلعة التنين الشرير وإنقاذ الجميع!',
            textEn: 'Every step brings me closer to the dragon fortress and saving everyone!'
        }
    ],

    // ==========================================
    // STAGE 4: ANCIENT SKY RUINS (أطلال السماء)
    // ==========================================
    intro_4: [
        {
            speaker: 'enemy',
            nameAr: 'فارس الحراسة المجنح',
            nameEn: 'Sky Guardian',
            titleAr: 'حامي القلاع المعلقة',
            titleEn: 'Sky Citadel Guardian',
            avatar: '🦅',
            color: '#4cc9f0',
            textAr: 'رياح السماء العاتية وفخاخ الأطلال القديمة ستلقي بك إلى الهاوية السحيقة!',
            textEn: 'The fierce sky winds and ancient traps will cast you into the abyss!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سلاحي وعزيمتي درع حصين، وسأتجاوز كل الفخاخ بشجاعة!',
            textEn: 'My blade and courage are my shield, and I shall brave every trap!'
        }
    ],
    outro_4: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'عبرنا أطلال السماء بنجاح.. الآن ندخل إلى المعقل التكنولوجي المظلم!',
            textEn: 'Sky ruins cleared.. Now we breach the dark cyber laboratory!'
        }
    ],

    // ==========================================
    // STAGE 5: NEON CYBER LAB (المختبر السايبراني)
    // ==========================================
    intro_5: [
        {
            speaker: 'enemy',
            nameAr: 'المدفع الآلي الذكي',
            nameEn: 'Cyber Defense Core',
            titleAr: 'نظام الحراسة الآلي',
            titleEn: 'Automated Defense Core',
            avatar: '🤖',
            color: '#ff007f',
            textAr: 'تم رصد متسلل! تفعيل بروتوكول الليزر الفتاك والردع الفوري!',
            textEn: 'Intruder detected! Activating high-power laser protocol for deterrence!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'دفاعاتكم الآلية لن تصمد أمام سرعة البرق وقوة السيف السماوي!',
            textEn: 'Your automated defenses cannot withstand lightning speed and cosmic power!'
        }
    ],
    outro_5: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'تم تعطيل المنظومة الآلية.. نحن الآن نقترب من بُعد الظلال!',
            textEn: 'Cyber system dismantled.. Approaching the mysterious Shadow Realm!'
        }
    ],

    // ==========================================
    // STAGE 6: SHADOW REALM (بُعد الظلال)
    // ==========================================
    intro_6: [
        {
            speaker: 'enemy',
            nameAr: 'شبح الظلال الغامض',
            nameEn: 'Shadow Phantom',
            titleAr: 'حارس العتمة والضباب',
            titleEn: 'Guardian of Shadows',
            avatar: '🌌',
            color: '#9d4edd',
            textAr: 'هنا ينطفئ نورك أيها الفارس.. عتمة الظلال ستبدد كل شجاعتك وتثقل خطواتك!',
            textEn: 'Here your light fades, Knight.. The shadows will test every ounce of your will!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'نور الشجاعة ينبض في قلبي، والظلام سينجلي دائماً أمام إرادة الحق!',
            textEn: 'The light of bravery beats in my heart, and shadows will shatter before truth!'
        }
    ],
    outro_6: [
        {
            speaker: 'enemy',
            nameAr: 'شبح الظلال الغامض',
            nameEn: 'Shadow Phantom',
            titleAr: 'حارس العتمة المهزوم',
            titleEn: 'Defeated Shadow Phantom',
            avatar: '🌌',
            color: '#9d4edd',
            textAr: 'تفوقت على الظلام.. لقد اقتربت جداً من عرين التنين الأسطوري الأكبر!',
            textEn: 'You conquered the shadows.. You are now very close to the Grand Dragon lair!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'حان وقت الحسم.. النهاية تقترب يا قوى الأذى والشر!',
            textEn: 'The final hour is near.. Your reign of harm ends now!'
        }
    ],

    // ==========================================
    // STAGE 7: NEON CYBER METROPOLIS (المدينة السيبرانية)
    // ==========================================
    intro_7: [
        {
            speaker: 'enemy',
            nameAr: 'فارس الدرع الفولاذي',
            nameEn: 'Cyber Mech Knight',
            titleAr: 'قائد حرس المدينة العائمة',
            titleEn: 'Commander of the Cyber Citadel',
            avatar: '🛡️',
            color: '#00b4d8',
            textAr: 'أهلاً بك في المدينة الحصينة! دروعنا المصفحة القوية لن تخترقها أسلحة الفرسان!',
            textEn: 'Welcome to our fortress city! Our heavy armor will deflect all knight weapons!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سيفي يحمل طاقة النجوم الصافية، وسيخترق أصلب دروعكم بضربة واحدة!',
            textEn: 'My blade carries pure starlight and will cleave your strongest shields in one strike!'
        }
    ],
    outro_7: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سقطت المدينة السيبرانية.. الباب الأخير المؤدي لمعقل الفراغ ينفتح الآن!',
            textEn: 'Cyber city liberated.. The final gate to the Void Citadel opens now!'
        }
    ],

    // ==========================================
    // STAGE 8: CITADEL OF THE COSMIC VOID (معقل الفراغ الكوني)
    // ==========================================
    intro_8: [
        {
            speaker: 'enemy',
            nameAr: 'قائد حرس الفراغ المظلم',
            nameEn: 'Void Guard Commander',
            titleAr: 'حارس أبواب قلعة التنين',
            titleEn: 'Warden of the Dragon Citadel',
            avatar: '🔮',
            color: '#c77dff',
            textAr: 'هذا هو المعقل الأخير لعرين التنين الأسطوري! لن تدعك الوحوش تعبر حياً!',
            textEn: 'This is the final stronghold of the dragon lair! You shall not pass!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سأطهر هذا المعقل وأفتح طريق النصر والعدالة!',
            textEn: 'I shall cleanse this stronghold and pave the way to victory!'
        }
    ],
    outro_8: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'انتهت كل الحواجز.. القلعة أمامي الآن، حانت المعركة الكبرى ضد التنين الكوني الأسطوري!',
            textEn: 'All barriers shattered.. The castle lies ahead, the final battle against the Dragon begins!'
        }
    ],

    // ==========================================
    // STAGE 9: THE COSMIC DRAGON FINALE (الزعيم الأسطوري النهائي)
    // ==========================================
    intro_9: [
        {
            speaker: 'enemy',
            nameAr: 'التنين الكوني الأسطوري',
            nameEn: 'The Cosmic Dragon Sovereign',
            titleAr: 'وحش الظلال العتيد والأقوى',
            titleEn: 'Fierce Dragon of the Void',
            avatar: '🐉',
            color: '#ff0054',
            textAr: 'هاهاها! أيها الفارس الشجاع.. كيف تجرأت على الوصول إلى قلعتي؟ أنا أعتى الوحوش وأشدها بطشاً!',
            textEn: 'MWAHAHA! Brave mortal knight.. How dare you intrude upon my lair? I am the fiercest dragon alive!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'بطل المجرة والمدافع عن الأبرياء',
            titleEn: 'Champion of the Galaxy',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'لقد نشرت الدمار والخراب في كل مكان يا تنين الظلام! جئت اليوم لأضع حداً لبطشك بسيف العدالة!',
            textEn: 'You brought destruction to every realm, dark dragon! Today, your tyranny ends by the blade of justice!'
        },
        {
            speaker: 'enemy',
            nameAr: 'التنين الكوني الأسطوري',
            nameEn: 'The Cosmic Dragon Sovereign',
            titleAr: 'وحش الظلال العتيد',
            titleEn: 'Fierce Dragon',
            avatar: '🐉',
            color: '#ff0054',
            textAr: 'شجاعة لا نفع منها! تذوق لهيب الصهارة الحارقة وأمطار النيازك.. لن تخرج سالماً!',
            textEn: 'Futile bravery! Taste my inferno and meteor rain.. You will not leave unscathed!'
        }
    ],
    outro_9: [
        {
            speaker: 'enemy',
            nameAr: 'التنين الكوني الأسطوري',
            nameEn: 'The Cosmic Dragon Sovereign',
            titleAr: 'وحش الظلال المهزوم',
            titleEn: 'Defeated Dragon',
            avatar: '🐉',
            color: '#ff0054',
            textAr: 'ك.. كيف استطاع سيفك وعزيمتك اختراق درعي الصلب المنيع؟! لقد هُزمت في النهاية...',
            textEn: 'H.. How did your will and starlight blade pierce my heavy armor?! I am defeated at last...'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'البطل المنتصر وحامي الأبرياء',
            titleEn: 'Victorious Hero',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'القوة الحقيقية تكمن في نصرة الحق وحماية الضعفاء! ارقد بسلام في أعماق الفضاء البعيد.',
            textEn: 'True power lies in protecting the weak and standing for what is right! Rest in peace in deep space.'
        },
        {
            speaker: 'narrator',
            nameAr: 'الراوي',
            nameEn: 'Story Narrator',
            titleAr: 'سجل الشجعان والأبطال',
            titleEn: 'Annals of Brave Heroes',
            avatar: '👑',
            color: '#ffb703',
            textAr: 'وهكذا انتصر الفارس الشجاع، وعم السلام والأمان أرجاء العوالم والمجرات.. تهانينا لك أيها البطل على هذا الإنجاز العظيم!',
            textEn: 'And so the brave knight triumphed, bringing peace and safety across the galaxy.. Congratulations, Hero, on this grand achievement!'
        }
    ],

    // ==========================================
    // STAGE 10: THE MOLTEN SKYWAY (مسار الحمم المتحرك - تحدي الذهب)
    // ==========================================
    intro_10: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'المدافع عن الأبرياء',
            titleEn: 'Protector of the Innocent',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'هذا المسار البركاني مليء بالمنصات المتحركة والصهارة الملتهبة.. يجب أن أتحلى بأعلى درجات التركيز والقفز الدقيق للوصول لكنز الذهب العظيم!',
            textEn: 'This volcanic skyway is full of moving platforms and raging magma.. I must maintain utmost precision to claim the cosmic gold treasury!'
        },
        {
            speaker: 'enemy',
            nameAr: 'حارس الصهارة النارية',
            nameEn: 'Magma Sentinel',
            titleAr: 'حارس مسار الحمم',
            titleEn: 'Guardian of the Skyway',
            avatar: '🔥',
            color: '#ff5400',
            textAr: 'الحمم الساخنة تبتلع كل من يتردد! هل لديك الشجاعة والمهارة لعبور المنصات المتحركة دون السقوط في البركان؟',
            textEn: 'The scalding magma swallows any who hesitate! Do you have the skill to traverse the moving platforms without falling?'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'المدافع عن الأبرياء',
            titleEn: 'Protector of the Innocent',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'عزيمتي لا تلين! سأعبر هذه الحمم وأجمع الذهب لأقوي به عتادي وأحمي كل الأبرياء!',
            textEn: 'My resolve is unyielding! I shall cross the magma, gather the gold, and protect everyone!'
        }
    ],
    outro_10: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'المدافع عن الأبرياء',
            titleEn: 'Protector of the Innocent',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'رائع! لقد اجتزت مسار الحمم المتحرك كاملاً وجمعت كنز الذهب الضخم! أصبحت قوتنا مضاعفة الآن!',
            textEn: 'Magnificent! I have conquered the entire molten moving skyway and gathered the massive gold treasure!'
        },
        {
            speaker: 'narrator',
            nameAr: 'الراوي',
            nameEn: 'Story Narrator',
            titleAr: 'سجل الشجعان والأبطال',
            titleEn: 'Annals of Brave Heroes',
            avatar: '👑',
            color: '#ffb703',
            textAr: 'إنجاز بطولي استثنائي! لقد أثبت الفارس مهارة فائقة في التوازن والشجاعة فوق الحمم البركانية.. مبارك لك هذا الفوز والذهب الوفير!',
            textEn: 'An exceptional heroic feat! The knight has proven supreme skill and bravery over the volcanic molten pit.. Congratulations on this triumph and abundant gold!'
        }
    ]
};

class DialogueManager {
    constructor() {
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.onCompleteCallback = null;
        this.typingTimer = null;
        this.isTyping = false;
        this.fullText = '';

        this.overlay = null;
        this.speakerName = null;
        this.speakerTitle = null;
        this.speakerAvatar = null;
        this.speakerFrame = null;
        this.dialogueText = null;
        this.btnNext = null;
        this.btnSkip = null;
    }

    init() {
        this.overlay = document.getElementById('dialogue-overlay');
        this.speakerName = document.getElementById('dialogue-speaker-name');
        this.speakerTitle = document.getElementById('dialogue-speaker-title');
        this.speakerAvatar = document.getElementById('dialogue-avatar-icon');
        this.speakerFrame = document.getElementById('dialogue-avatar-frame');
        this.dialogueText = document.getElementById('dialogue-text');
        this.btnNext = document.getElementById('btn-dialogue-next');
        this.btnSkip = document.getElementById('btn-dialogue-skip');

        if (this.btnNext) {
            this.btnNext.onclick = (e) => {
                e.stopPropagation();
                this.next();
            };
        }

        if (this.btnSkip) {
            this.btnSkip.onclick = (e) => {
                e.stopPropagation();
                this.skip();
            };
        }

        if (this.overlay) {
            this.overlay.onclick = () => {
                this.next();
            };
        }

        window.addEventListener('keydown', (e) => {
            if (this.isActive() && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                this.next();
            }
        });
    }

    isActive() {
        return this.overlay && !this.overlay.classList.contains('hidden');
    }

    startDialogue(dialogueKey, onComplete) {
        if (!this.overlay) this.init();

        const dialogueList = GAME_DIALOGUES[dialogueKey];
        if (!dialogueList || dialogueList.length === 0 || !this.overlay) {
            if (onComplete) onComplete();
            return;
        }

        this.currentDialogue = dialogueList;
        this.currentIndex = 0;
        this.onCompleteCallback = onComplete;

        this.overlay.classList.remove('hidden');

        // Hide touch controls during dialogue
        const touchLayer = document.getElementById('touch-controls');
        if (touchLayer) touchLayer.style.display = 'none';

        if (window.gameManager) window.gameManager.state = 'DIALOGUE';

        this.renderStep();
    }

    renderStep() {
        if (!this.currentDialogue || this.currentIndex >= this.currentDialogue.length) {
            this.finish();
            return;
        }

        const step = this.currentDialogue[this.currentIndex];
        const isAr = true; // Always pure respectful Arabic as requested

        if (this.speakerName) this.speakerName.innerText = isAr ? step.nameAr : step.nameEn;
        if (this.speakerTitle) this.speakerTitle.innerText = isAr ? step.titleAr : step.titleEn;
        if (this.speakerAvatar) this.speakerAvatar.innerText = step.avatar;

        if (this.speakerFrame) {
            this.speakerFrame.style.borderColor = step.color || '#00e5ff';
            this.speakerFrame.style.boxShadow = `0 0 20px ${step.color || '#00e5ff'}`;
        }

        this.fullText = isAr ? step.textAr : step.textEn;
        this.typewriterEffect(this.fullText);

        if (window.soundEngine) window.soundEngine.playCoin();
    }

    typewriterEffect(text) {
        if (this.typingTimer) clearInterval(this.typingTimer);
        this.isTyping = true;
        let charIdx = 0;
        if (this.dialogueText) this.dialogueText.innerText = '';

        this.typingTimer = setInterval(() => {
            charIdx += 2;
            if (charIdx > text.length) {
                charIdx = text.length;
                clearInterval(this.typingTimer);
                this.isTyping = false;
            }
            if (this.dialogueText) this.dialogueText.innerText = text.slice(0, charIdx);
        }, 18);
    }

    next() {
        if (this.isTyping) {
            // Instantly complete text
            if (this.typingTimer) clearInterval(this.typingTimer);
            this.isTyping = false;
            if (this.dialogueText) this.dialogueText.innerText = this.fullText;
            return;
        }

        this.currentIndex++;
        this.renderStep();
    }

    skip() {
        if (this.typingTimer) clearInterval(this.typingTimer);
        this.isTyping = false;
        this.finish();
    }

    finish() {
        if (this.overlay) this.overlay.classList.add('hidden');
        this.currentDialogue = null;
        this.currentIndex = 0;

        const touchLayer = document.getElementById('touch-controls');
        if (touchLayer && window.gameManager && window.gameManager.state !== 'MENU') {
            touchLayer.style.display = 'flex';
        }

        if (this.onCompleteCallback) {
            const cb = this.onCompleteCallback;
            this.onCompleteCallback = null;
            cb();
        }
    }
}

window.dialogueManager = new DialogueManager();

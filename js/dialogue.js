/**
 * COSMIC KNIGHT 2D - STORY DIALOGUE SYSTEM (نظام حوارات القصة الملحمية بالعربية)
 * Interactive story cutscenes between the Hero (Knight) and the Boss / Enemies
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
            titleAr: 'حامي الأبعاد الكونية',
            titleEn: 'Protector of the Dimensions',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'أشعر باضطراب كوني في هذه الغابة العريقة.. لقد استيقظت وحوش الظلام وبدأت بنشر الفوضى!',
            textEn: 'I sense a cosmic disturbance in this ancient forest.. Dark beasts have awakened to spread chaos!'
        },
        {
            speaker: 'enemy',
            nameAr: 'حارس الغابة المظلمة',
            nameEn: 'Forest Sentinel',
            titleAr: 'خادم التنين الكوني',
            titleEn: 'Servant of the Cosmic Dragon',
            avatar: '🦇',
            color: '#ff2e63',
            textAr: 'قف مكانك أيها الفارس! لن تعبر إلى بوابات العوالم الأخرى.. ستموت هنا في أعماق الغابة!',
            textEn: 'Halt, Knight! You shall not pass into other realms.. You will perish here in the forest depths!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سيفي الكوني مستعد لنصرة الحق، ولن توقفني أي قوى شريرة!',
            textEn: 'My cosmic blade is ready, and no dark forces will stop my quest!'
        }
    ],
    outro_1: [
        {
            speaker: 'enemy',
            nameAr: 'حارس الغابة المظلمة',
            nameEn: 'Forest Sentinel',
            titleAr: 'خادم التنين المهزوم',
            titleEn: 'Dragon Servant',
            avatar: '🦇',
            color: '#ff2e63',
            textAr: 'ك.. كيف تغلبت علي بهذه السهولة؟! لكن اعلم أن العوالم القادمة أكثر قسوة وظلاماً!',
            textEn: 'H.. How did you defeat me so easily?! But beware, the next realms are far more ruthless!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'أنا مستعد لكل تحدٍ.. سأواصل رحلتي حتى أصل إلى عرش التنين الكوني!',
            textEn: 'I am ready for any challenge.. I will push forward to the Cosmic Dragon throne!'
        }
    ],

    // ==========================================
    // STAGE 2: CRYSTAL CAVERNS (كهوف الكريستال)
    // ==========================================
    intro_2: [
        {
            speaker: 'enemy',
            nameAr: 'عفريت الكريستال الناري',
            nameEn: 'Crystal Imp',
            titleAr: 'حارس المناجم العميقة',
            titleEn: 'Deep Mines Warden',
            avatar: '💎',
            color: '#00f5d4',
            textAr: 'هذه الكريستالات ملك لطاقة التنين الكوني.. لن تلمس حجراً واحداً أيها المتسلل!',
            textEn: 'These crystals belong to the Cosmic Dragon.. You will not touch a single gem!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'سأسترجع طاقة النجوم وأحرر هذه الكهوف من طغيانكم!',
            textEn: 'I will reclaim the starlight energy and free these caves from tyranny!'
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
            textAr: 'تم تطهير كهوف الكريستال.. الطريق الآن يقودنا نحو أعماق البركان الثائر!',
            textEn: 'The crystal caverns are cleansed.. The path now leads towards the Volcanic Core!'
        }
    ],

    // ==========================================
    // STAGE 3: VOLCANIC CORE (البركان الثائر)
    // ==========================================
    intro_3: [
        {
            speaker: 'enemy',
            nameAr: 'شيطان الحمم البركاني',
            nameEn: 'Magma Fiend',
            titleAr: 'حاكم صهارة البركان',
            titleEn: 'Lord of Molten Depths',
            avatar: '🔥',
            color: '#ff5400',
            textAr: 'من يتجرأ على وطء صهارة البركان الملتهب؟ ستحترق وتتحول إلى رماد أيها الفارس!',
            textEn: 'Who dares step onto the molten core? You will burn to ashes, mortal knight!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'نيران الشر لن تثني عزيمتي.. سأخمد هذا البركان وأعيد التوازن للأبعاد!',
            textEn: 'Infernal fire cannot bend my will.. I will extinguish evil and restore balance!'
        }
    ],
    outro_3: [
        {
            speaker: 'enemy',
            nameAr: 'شيطان الحمم البركاني',
            nameEn: 'Magma Fiend',
            titleAr: 'حاكم الصهارة المهزوم',
            titleEn: 'Molten Lord',
            avatar: '🔥',
            color: '#ff5400',
            textAr: 'لقد استطعت النجاة من لهيب البركان.. لكن سماء الفراغ والظلال ستسحقك بلا رحمة!',
            textEn: 'You survived the volcanic fires.. but the void sky will crush you without mercy!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'كل خطوة تقربني من تحرير الأبعاد ونصرة المظلومين!',
            textEn: 'Every step brings me closer to liberating the universe and bringing justice!'
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
            titleAr: 'حامي المعابد السماوية',
            titleEn: 'Sky Temple Guardian',
            avatar: '🦅',
            color: '#4cc9f0',
            textAr: 'رياح السماء العاتية وفخاخ المعابد القديمة ستلقي بك إلى الهاوية السحيقة!',
            textEn: 'The fierce sky winds and ancient temple traps will cast you into the abyss!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'أنا فارس الأبعاد، والسماء فنائي وسيفي درعي!',
            textEn: 'I am the Cosmic Knight, the sky is my arena and my blade is my shield!'
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
            titleAr: 'نظام الدفاع السيبراني للتنين',
            titleEn: 'Dragon Cyber Defense',
            avatar: '🤖',
            color: '#ff007f',
            textAr: 'تم رصد متسلل بشري! تفعيل بروتوكول الليزر الفتاك والقضاء الفوري!',
            textEn: 'Human intruder detected! Activating deadly laser protocol for instant termination!'
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
            textAr: 'تم تعطيل المنظومة السيبرانية.. اقتربنا من بُعد الظلال الخطير!',
            textEn: 'Cyber system dismantled.. Approaching the perilous Shadow Realm!'
        }
    ],

    // ==========================================
    // STAGE 6: SHADOW REALM (بُعد الظلال)
    // ==========================================
    intro_6: [
        {
            speaker: 'enemy',
            nameAr: 'شبح الظلال الكوني',
            nameEn: 'Shadow Wraith',
            titleAr: 'حارس الفراغ المظلم',
            titleEn: 'Guardian of the Void',
            avatar: '🌌',
            color: '#9d4edd',
            textAr: 'هنا ينتهي نورك أيها الفارس.. بُعد الظلال سيمتص كل ذرة شجاعة في روحك!',
            textEn: 'Here your light fades, Knight.. The shadow realm will consume every ounce of your soul!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'نور النجوم يسري في عروقي، والظلام سينجلي أمام سيف الفارس!',
            textEn: 'The starlight flows within me, and shadows will shatter before my blade!'
        }
    ],
    outro_6: [
        {
            speaker: 'enemy',
            nameAr: 'شبح الظلال الكوني',
            nameEn: 'Shadow Wraith',
            titleAr: 'حارس الفراغ المهزوم',
            titleEn: 'Void Guardian',
            avatar: '🌌',
            color: '#9d4edd',
            textAr: 'تفوقت على الظلام.. لقد اقتربت جداً من عرين التنين الأسطوري الأعظم!',
            textEn: 'You conquered the shadows.. You are now dangerously close to the Grand Dragon lair!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'حان وقت الحسم.. النهاية تقترب يا قوى الظلام!',
            textEn: 'The final hour is near.. Your reign of terror ends now, forces of darkness!'
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
            textAr: 'أهلاً بك في مقبرتك التكنولوجية! دروعنا المصفحة لا تخترقها سيوف العصور القديمة!',
            textEn: 'Welcome to your tech graveyard! Our armored shields cannot be pierced by ancient blades!'
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
            textAr: 'سقطت المدينة السيبرانية.. الباب الأخير أمام محراب الفراغ ينفتح الآن!',
            textEn: 'Cyber city liberated.. The final gate to the Void Sanctum opens now!'
        }
    ],

    // ==========================================
    // STAGE 8: SANCTUM OF THE COSMIC VOID (محراب الفراغ الكوني)
    // ==========================================
    intro_8: [
        {
            speaker: 'enemy',
            nameAr: 'كبير كهنة الفراغ المظلم',
            nameEn: 'Void High Priest',
            titleAr: 'حارس عرش التنين',
            titleEn: 'Warden of the Dragon Throne',
            avatar: '🔮',
            color: '#c77dff',
            textAr: 'هذا هو المحراب المقدس لسيدنا التنين الكوني! كل من يدخل هنا يُمحى وجوده من التاريخ!',
            textEn: 'This is the sacred sanctum of our Lord Cosmic Dragon! All who enter shall be erased from history!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'حامي الأبعاد',
            titleEn: 'Protector of Realms',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'اليوم يُكتب تاريخ جديد بتحرير الكون من قيود الفراغ والظلام!',
            textEn: 'Today, history is rewritten with the liberation of the universe from void and darkness!'
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
            textAr: 'انتهت كل الحواجز.. العرش أمامي الآن، حانت المعركة الكبرى ضد التنين الكوني الأسطوري!',
            textEn: 'All barriers shattered.. The throne lies ahead, the final grand battle against the Cosmic Dragon begins!'
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
            titleAr: 'سيد الأبعاد والظلام الأعظم',
            titleEn: 'Supreme Sovereign of the Void',
            avatar: '🐉',
            color: '#ff0054',
            textAr: 'هاهاها! أيها البشري الضئيل.. كيف تجرأت على الوصول إلى عرشي؟ أنا سيد هذا الكون وأقوى كائن في الوجود!',
            textEn: 'MWAHAHA! Puny mortal knight.. How dare you intrude upon my throne? I am the sovereign of all cosmos!'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'بطل المجرة وحامي الأبعاد',
            titleEn: 'Champion of the Cosmos',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'لقد نشرت الدمار في جميع الكواكب يا تنين الفراغ! جئت اليوم لأضع حداً لطغيانك بسيف العدالة الكونية!',
            textEn: 'You brought destruction to every planet, Dragon of the Void! Today, your tyranny ends by the cosmic blade of justice!'
        },
        {
            speaker: 'enemy',
            nameAr: 'التنين الكوني الأسطوري',
            nameEn: 'The Cosmic Dragon Sovereign',
            titleAr: 'سيد الأبعاد',
            titleEn: 'Void Sovereign',
            avatar: '🐉',
            color: '#ff0054',
            textAr: 'كلمات شجاعة من ميت محتوم! تذوق نيران الصهارة الكونية وأمطار النيازك المدمرة.. لن تخرج حياً!',
            textEn: 'Brave words from a doomed soul! Taste my cosmic inferno and meteor wrath.. You will not leave alive!'
        }
    ],
    outro_9: [
        {
            speaker: 'enemy',
            nameAr: 'التنين الكوني الأسطوري',
            nameEn: 'The Cosmic Dragon Sovereign',
            titleAr: 'سيد الأبعاد المهزوم',
            titleEn: 'Defeated Void Sovereign',
            avatar: '🐉',
            color: '#ff0054',
            textAr: 'ك.. كيف يعقل هذا؟! كيف استطاعت إرادتك وسيفك النجمي اختراق درعي الخالد المنيع؟! مستحيل...',
            textEn: 'H.. How is this possible?! How did your will and starlight blade pierce my immortal dragon scales?! Impossible...'
        },
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي',
            nameEn: 'Cosmic Knight',
            titleAr: 'محرر الأبعاد الكونية المنتصر',
            titleEn: 'Liberator of the Dimensions',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'القوة الحقيقية ليست في البطش والتدمير، بل في حماية الأبرياء ونصرة الحق! ارقد في سلام يا سيد الفراغ.',
            textEn: 'True power lies not in tyranny, but in protecting the innocent and standing for justice! Rest in peace, Dragon of the Void.'
        },
        {
            speaker: 'narrator',
            nameAr: 'الراوي الكوني',
            nameEn: 'Cosmic Chronicler',
            titleAr: 'سجل الأبطال الخالدين',
            titleEn: 'Annals of Eternity',
            avatar: '👑',
            color: '#ffb703',
            textAr: 'وهكذا انتصر الفارس السماوي، وعم السلام والنور أرجاء الأبعاد والمجرات.. تهانينا لك أيها البطل الأسطوري!',
            textEn: 'And so the Cosmic Knight triumphed, bringing eternal peace and starlight across the galaxy.. Congratulations, Legendary Hero!'
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
        const isAr = true; // Always pure Arabic as requested

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

/**
 * COSMIC KNIGHT 2D - STORY DIALOGUE SYSTEM
 * Interactive story cutscenes between the Hero (Knight) and the Boss / Enemies
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 */

const GAME_DIALOGUES = {
    // ==========================================
    // STAGE 1: THE MYSTIC FOREST
    // ==========================================
    intro_1: [
        {
            speaker: 'hero',
            nameAr: 'الفارس السماوي (Hero)',
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
            titleAr: 'خادم التنين',
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
    // STAGE 3: VOLCANIC CORE
    // ==========================================
    intro_3: [
        {
            speaker: 'enemy',
            nameAr: 'شيطان الحمم (Magma Fiend)',
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
            textAr: 'نيران الشر لن تثني عزيمتي.. سأخمد هذا البركان وأعيد التوازن!',
            textEn: 'Infernal fire cannot bend my will.. I will extinguish evil and restore balance!'
        }
    ],
    outro_3: [
        {
            speaker: 'enemy',
            nameAr: 'شيطان الحمم',
            nameEn: 'Magma Fiend',
            titleAr: 'حاكم الصهارة',
            titleEn: 'Molten Lord',
            avatar: '🔥',
            color: '#ff5400',
            textAr: 'لقد استطعت النجاة من لهيب البركان.. لكن سماء الفراغ ستسحقك بلا رحمة!',
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
    // STAGE 6: SHADOW REALM
    // ==========================================
    intro_6: [
        {
            speaker: 'enemy',
            nameAr: 'شبح الظلال الكوني (Shadow Wraith)',
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
            titleAr: 'حارس الفراغ',
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
    // STAGE 9: THE COSMIC DRAGON FINALE (الزعيم الأسطوري النهائي)
    // ==========================================
    intro_9: [
        {
            speaker: 'enemy',
            nameAr: 'التنين الكوني الأسطوري (Cosmic Dragon)',
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
            nameAr: 'الفارس السماوي (Hero)',
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
            nameAr: 'الفارس السماوي (البطل المنتصر)',
            nameEn: 'Cosmic Knight (Victor)',
            titleAr: 'محرر الأبعاد الكونية',
            titleEn: 'Liberator of the Dimensions',
            avatar: '⚔️',
            color: '#00e5ff',
            textAr: 'القوة الحقيقية ليست في البطش والتدمير، بل في حماية الأبرياء ونصرة الحق! ارقد في سلام يا سيد الفراغ.',
            textEn: 'True power lies not in tyranny, but in protecting the innocent and standing for justice! Rest in peace, Dragon of the Void.'
        },
        {
            speaker: 'narrator',
            nameAr: 'الراوي الكوني (The Universe)',
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
        const isAr = !window.gameManager || window.gameManager.saveData.lang === 'ar';

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

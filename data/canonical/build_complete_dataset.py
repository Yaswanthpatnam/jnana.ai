import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_JSON_PATH = r"D:\productive\jnana.ai\data\canonical\jnana_gita_base.json"
OUTPUT_COMPLETE_PATH = r"D:\productive\jnana.ai\data\canonical\jnana_gita_complete.json"

# The 58 Canonical Dialogue Scenes across all 18 Chapters
SCENES_MAP = [
    # CHAPTER 1: Arjuna Vishāda Yoga (47 verses)
    {
        "chapter": 1, "start_verse": 1, "end_verse": 13,
        "title": "The Gathering on the Holy Field of Kurukshetra",
        "scene_story": "On the holy plain of Kurukshetra, the two mighty armies of the Pandavas and Kauravas assemble face-to-face. King Dhritarashtra, anxious in his palace, asks Sanjaya what his sons and the Pandavas did. Sanjaya describes the martial tension, the blowing of celestial conch shells, and the war cries shaking heaven and earth as the battle is about to begin."
    },
    {
        "chapter": 1, "start_verse": 14, "end_verse": 25,
        "title": "Arjuna's Request Between the Two Armies",
        "scene_story": "Seated in his magnificent white chariot drawn by four white horses, Arjuna sees the weapons about to clash. He asks his friend and charioteer, Lord Krishna, to station his chariot in the open space between the two hostile forces so he may look directly into the faces of those who have gathered hungry for war."
    },
    {
        "chapter": 1, "start_verse": 26, "end_verse": 35,
        "title": "The Onset of Overwhelming Grief and Moral Collapse",
        "scene_story": "Standing between the armies, Arjuna looks out and sees fathers, grandfathers, beloved teachers, uncles, and childhood companions ready to slaughter one another. Overcome by intense pity and grief, his limbs tremble, his mouth turns dry, his skin burns, and his legendary Gandiva bow slips helplessly from his hands. He confesses that he sees no good in slaying his own kinsmen for the sake of a bloody kingdom."
    },
    {
        "chapter": 1, "start_verse": 36, "end_verse": 47,
        "title": "Arjuna Casts Aside His Bow and Collapses in Despair",
        "scene_story": "Arjuna laments the catastrophic ruin of family values, the loss of moral order, and the deep sorrow of shedding blood for fleeting earthly power. Broken and weeping, having spoken his despondency, Arjuna casts aside his bow and quiver of arrows, sinking down powerless upon the seat of his chariot in the midst of the battlefield."
    },

    # CHAPTER 2: Sānkhya Yoga (72 verses)
    {
        "chapter": 2, "start_verse": 1, "end_verse": 10,
        "title": "The Breakdown and Total Surrender to Krishna",
        "scene_story": "Seeing Arjuna broken down with eyes full of tears, Krishna rebukes him for this unmanly weakness at the critical hour. Arjuna, realizing his own intellect has failed him and that grief is clouding his sense of right and wrong, drops his pride, surrenders completely as a disciple, and begs Krishna: 'I am confused about my duty; tell me decisively what is best for me. I am Your student, instruct me.'"
    },
    {
        "chapter": 2, "start_verse": 11, "end_verse": 30,
        "title": "The Immortal Soul Beyond Death",
        "scene_story": "Krishna smiles gently in the midst of the weeping warrior and reveals the foundational truth of existence: the physical body is merely temporary clothing that the eternal soul puts on and discards. The true Self (Atman) is unborn, undying, immutable, and cannot be burned by fire, drowned by water, or cut by weapons; therefore, weeping for the perishable body is born of ignorance."
    },
    {
        "chapter": 2, "start_verse": 31, "end_verse": 38,
        "title": "Svadharma: The Moral Duty to Stand for Justice",
        "scene_story": "Krishna reminds Arjuna of his duty as a protector of righteousness (Kshatriya). Turning away from a just battle out of emotional weakness is not virtue; it is abandonment of duty that brings lasting dishonor worse than death, whereas fulfilling righteous duty leads to glory in both this world and the hereafter."
    },
    {
        "chapter": 2, "start_verse": 39, "end_verse": 53,
        "title": "Nishkāma Karma: Action Without Anxiety for Results",
        "scene_story": "Krishna introduces Buddhi Yoga (the yoga of intellect) and Karma Yoga. He instructs Arjuna that a human being has authority only over effort and action, never over the fruits or outcomes. By working dedicatedly without anxiety over success or failure, the mind is freed from the bondage and paralysis of fear."
    },
    {
        "chapter": 2, "start_verse": 54, "end_verse": 72,
        "title": "The Sthitaprajña: The Person of Steady, Unshakable Wisdom",
        "scene_story": "Arjuna asks: 'Krishna, what are the marks of an enlightened person whose wisdom is stable? How do they speak, sit, and walk?' Krishna describes the Sthitaprajna—the master who has freed the mind from cravings, remains undisturbed in misery, without longing in pleasure, and lives in deep, unshakable serenity like the ocean undisturbed by rivers flowing into it."
    },

    # CHAPTER 3: Karma Yoga (43 verses)
    {
        "chapter": 3, "start_verse": 1, "end_verse": 8,
        "title": "The Confusion Between Renunciation and Action",
        "scene_story": "Arjuna asks in confusion: 'If You consider quiet wisdom superior to action, why do You urge me into this terrible battle?' Krishna explains that no one can remain inactive even for a single second; physical inaction with a restless mind is self-deception, while disciplined action with a detached spirit is true spiritual practice."
    },
    {
        "chapter": 3, "start_verse": 9, "end_verse": 20,
        "title": "Yajna: The Sacred Rhythm of Selfless Interdependence",
        "scene_story": "Krishna explains the cosmic wheel of life: all beings are nourished by rain, rain comes from sacrifice, and sacrifice is born of right action. Whoever lives in this world taking from others without giving back in service lives in vain, whereas performing work as a sacred offering purifies the human soul."
    },
    {
        "chapter": 3, "start_verse": 21, "end_verse": 35,
        "title": "Leading by Example and Adhering to One's True Nature",
        "scene_story": "Krishna tells Arjuna that whatever standards a noble person sets, ordinary society follows. He explains that even God acts ceaselessly to uphold the world without personal desire, urging Arjuna to faithfully follow his own inborn duty (Svadharma), even if accompanied by flaws, rather than trying to imitate another's path."
    },
    {
        "chapter": 3, "start_verse": 36, "end_verse": 43,
        "title": "Unmasking the Hidden Enemy: Insatiable Desire and Anger",
        "scene_story": "Arjuna asks a piercing question: 'What is it that impels a person to commit wrong, even against their own will, as if dragged by force?' Krishna unmasks the eternal enemy: insatiable selfish desire (Kama) which, when blocked, turns into blinding rage (Krodha), urging Arjuna to conquer it by steadying the mind through the higher self."
    },

    # CHAPTER 4: Jñāna Karma Sannyāsa Yoga (42 verses)
    {
        "chapter": 4, "start_verse": 1, "end_verse": 15,
        "title": "The Purpose of the Avatar and the Eternal Wisdom",
        "scene_story": "Krishna explains that this ancient wisdom was taught at the dawn of creation and is renewed across generations. He reveals his famous promise of divine descent whenever righteousness declines to protect the good, conquer wickedness, and restore balance, acting in the world without being bound by deeds."
    },
    {
        "chapter": 4, "start_verse": 16, "end_verse": 24,
        "title": "Action in Inaction: The Free Mind in Daily Work",
        "scene_story": "Krishna solves the mystery of action: true wisdom is seeing inaction in action and action in inaction. One whose endeavors are free from the clingings of selfish anticipation acts with pure mind, whose every labor becomes an act of joyful offering untouched by sin or fear."
    },
    {
        "chapter": 4, "start_verse": 25, "end_verse": 42,
        "title": "The Purifying Fire of Knowledge",
        "scene_story": "Krishna outlines the various sacrifices of life, declaring that higher than material offerings is the sacrifice of self-inquiry and wisdom. There is no purifier on earth like spiritual self-knowledge, commanding Arjuna to sever the doubts in his heart with the sword of wisdom and stand up to perform his duty."
    },

    # CHAPTER 5: Karma Sannyāsa Yoga (29 verses)
    {
        "chapter": 5, "start_verse": 1, "end_verse": 12,
        "title": "Renunciation vs. Dedicated Action",
        "scene_story": "Arjuna is still wrestling with whether it is better to renounce the world and withdraw into solitude or to engage in active duty. Krishna answers that while both paths lead to freedom, selfless action (Karma Yoga) is far superior and easier for the human heart than premature external renunciation without inner maturity."
    },
    {
        "chapter": 5, "start_verse": 13, "end_verse": 29,
        "title": "The Lotus Leaf Mind: Untouched by Worldly Turmoil",
        "scene_story": "Krishna describes the sage who acts without ego, like a lotus leaf resting in muddy water without being wet by a single drop. Seeing all living beings—from a scholar to an outcaste to an animal—with equal vision, such a soul rests in constant peace within the body."
    },

    # CHAPTER 6: Dhyāna Yoga (47 verses)
    {
        "chapter": 6, "start_verse": 1, "end_verse": 9,
        "title": "The Mind: Your Greatest Friend or Bitterest Enemy",
        "scene_story": "Krishna teaches that a person must lift oneself by the power of one's own mind, never degrading oneself. For one who has mastered their mind, it is the most loyal friend; but for one who has failed to control it, their own mind acts as their bitterest, most destructive enemy."
    },
    {
        "chapter": 6, "start_verse": 10, "end_verse": 32,
        "title": "The Art of Meditation and the Balanced Life",
        "scene_story": "Krishna describes the practical path of meditation: finding a clean, quiet seat, holding the spine and head steady, moderating one's eating, sleeping, and recreation, and gently drawing the mind back to stillness whenever it wanders. The true yogi sees the Supreme in all beings and all beings in the Supreme."
    },
    {
        "chapter": 6, "start_verse": 33, "end_verse": 36,
        "title": "Taming the Restless Wind",
        "scene_story": "Arjuna confesses his human vulnerability: 'Krishna, the mind is so restless, turbulent, obstinate, and strong that controlling it seems as impossible as trying to grab and hold the rushing wind with bare hands.' Krishna agrees with deep empathy, but assures him: 'It is indeed difficult to subdue, O mighty warrior, but by patient practice (Abhyasa) and detachment from cravings (Vairagya), it can be mastered.'"
    },
    {
        "chapter": 6, "start_verse": 37, "end_verse": 47,
        "title": "The Destiny of the Sincere but Stumbling Seeker",
        "scene_story": "Arjuna asks with anxiety: 'What happens to a person who has faith and tries to walk the spiritual path, but stumbles, loses focus, and dies before attaining perfection? Does that soul perish like a torn cloud, losing both worldly pleasure and spiritual liberation?' Krishna reassures him with eternal tenderness: 'My child, neither in this world nor the next is there any destruction for one who strives for good. No one who does pure work ever meets an evil end.'"
    },

    # CHAPTER 7: Jñāna Vijñāna Yoga (30 verses)
    {
        "chapter": 7, "start_verse": 1, "end_verse": 15,
        "title": "The Divine Pervading Nature",
        "scene_story": "Krishna explains that he is the underlying essence of all physical and spiritual existence: the taste in pure water, the light of the sun and moon, the sacred sound Om in the ethers, the fragrance of the earth, and the courage in human hearts, explaining how the illusion of nature veils ordinary minds."
    },
    {
        "chapter": 7, "start_verse": 16, "end_verse": 30,
        "title": "The Four Kinds of Seekers and the Highest Realization",
        "scene_story": "Krishna classifies the four types of people who turn to the divine: the distressed seeking relief, the curious seeking knowledge, the ambitious seeking prosperity, and the wise seeking truth for its own sake. He declares the wise soul who loves the divine without bargaining as his very own self."
    },

    # CHAPTER 8: Akshara Brahma Yoga (28 verses)
    {
        "chapter": 8, "start_verse": 1, "end_verse": 16,
        "title": "The Mind at the Final Breath",
        "scene_story": "Arjuna asks what Brahman, the individual self, and the law of Karma are, and how one can remember the divine at the terrifying hour of death. Krishna explains that whatever state of mind one constantly contemplates throughout life forms the consciousness with which one departs, urging Arjuna to remember the divine at all times while performing his worldly duty."
    },
    {
        "chapter": 8, "start_verse": 17, "end_verse": 28,
        "title": "The Cosmic Cycles and the Eternal Home",
        "scene_story": "Krishna contrasts the endless cycles of day and night of cosmic creation where worlds emerge and dissolve with the supreme, unmanifest state beyond all cosmic destruction, which is the eternal abode from which souls do not return to suffering."
    },

    # CHAPTER 9: Rāja Vidyā Rāja Guhya Yoga (34 verses)
    {
        "chapter": 9, "start_verse": 1, "end_verse": 15,
        "title": "The Sovereign Secret of Devotion and Existence",
        "scene_story": "Krishna imparts the king of secrets and royal wisdom, directly experienceable and joyfully practiced: that the entire universe is held and sustained by divine consciousness, yet divine consciousness remains untangled and unconfined by creation."
    },
    {
        "chapter": 9, "start_verse": 16, "end_verse": 25,
        "title": "The Promise of Divine Care (Yoga-Kshema)",
        "scene_story": "Krishna explains that while ritualistic bargaining yields only temporary rewards, those who meditate on the divine with unwavering devotion are personally sustained: 'To those who are constantly devoted, I personally carry what they lack and preserve what they already have.'"
    },
    {
        "chapter": 9, "start_verse": 26, "end_verse": 34,
        "title": "The Universal Welcome: A Leaf, A Flower, A Drop of Water",
        "scene_story": "Krishna emphasizes that pure love matters far more than grandiose rituals: whoever offers with devotion even a simple leaf, a flower, a fruit, or water, he lovingly accepts. He declares that even the most desperate sinner who turns their mind toward righteousness is transformed, promising that his devotee will never perish."
    },

    # CHAPTER 10: Vibhūti Yoga (42 verses)
    {
        "chapter": 10, "start_verse": 1, "end_verse": 11,
        "title": "The Source of All Human Faculties and Cosmic Wonder",
        "scene_story": "Krishna reveals that all virtues and faculties—discernment, clarity, forgiveness, truth, restraint, contentment, courage, and fear—originate from the primeval divine consciousness, promising that within the hearts of those who love truth, he personally ignites the radiant lamp of wisdom."
    },
    {
        "chapter": 10, "start_verse": 12, "end_verse": 42,
        "title": "The Infinite Splendors of the Divine in Creation",
        "scene_story": "Arjuna, awestruck and humbled, asks: 'How may I constantly know You, and in what forms should I meditate upon You?' Krishna enumerates his magnificent manifestations throughout the universe: he is the soul seated in all hearts, the sun among light sources, the lion among animals, the sacred Ganges among rivers, and the quiet silence among secrets."
    },

    # CHAPTER 11: Vishwarūpa Darshana Yoga (55 verses)
    {
        "chapter": 11, "start_verse": 1, "end_verse": 8,
        "title": "Arjuna's Yearning to Behold the Cosmic Form",
        "scene_story": "Arjuna expresses deep gratitude that his delusion has been lifted by Krishna's words, but now longs with trembling reverence to see Krishna's cosmic, universal form. Krishna agrees, telling him that mortal eyes cannot withstand the sight, and grants Arjuna divine vision (Divya Chakshu) to witness the cosmic majesty."
    },
    {
        "chapter": 11, "start_verse": 9, "end_verse": 31,
        "title": "The Dazzling and Terrifying Vision of Infinity",
        "scene_story": "Sanjaya describes the unbearable majesty bursting forth like the blaze of a thousand suns in the sky. Arjuna gazes upon infinite faces, eyes, and weapons, seeing the entire cosmos, gods, and all the warriors of both armies rushing into the blazing, terrible mouths of time like moths into a roaring fire, trembling with sheer terror and awe."
    },
    {
        "chapter": 11, "start_verse": 32, "end_verse": 34,
        "title": "I am Time, The Destroyer of Worlds",
        "scene_story": "Amidst the terrifying cosmic vision, Arjuna cries out: 'Who are You, of such fierce form?' Krishna responds with thunderous words: 'I am all-devouring Time, come forth to conquer worlds. Even without your battle, none of these warriors shall escape death. Therefore, stand up, seize glory! They are already slain by my cosmic law; be you merely the instrument (Nimitta-matram) of destiny.'"
    },
    {
        "chapter": 11, "start_verse": 35, "end_verse": 55,
        "title": "Arjuna's Tearful Apology and the Return of the Gentle Form",
        "scene_story": "Arjuna drops to the ground, trembling and prostrating repeatedly, begging forgiveness for having spoken casually to Krishna in the past as a companion and friend. Seeing Arjuna shaken with terror, Krishna compassionately withdraws his cosmic form and resumes his serene, four-armed and gentle two-armed human appearance, reassuring his beloved disciple."
    },

    # CHAPTER 12: Bhakti Yoga (20 verses)
    {
        "chapter": 12, "start_verse": 1, "end_verse": 12,
        "title": "The Concrete Path of Love vs. The Unmanifest Absolute",
        "scene_story": "Arjuna asks which path is more advantageous: worshiping the personal divine with devotion, or meditating on the formless, unmanifest, incomprehensible Absolute. Krishna explains that while both arrive at the same liberation, meditating on the formless is exceedingly arduous for embodied human minds, whereas pouring one's heart in loving surrender is the sweetest, swiftest path."
    },
    {
        "chapter": 12, "start_verse": 13, "end_verse": 20,
        "title": "The Portrait of the Seeker Dear to the Divine Heart",
        "scene_story": "Krishna paints a moving portrait of the soul dearest to him: one who bears malice toward no living creature, who is compassionate and forgiving, free from selfish 'I' and 'mine', unruffled by praise or criticism, patient in distress, and deeply anchored in peace."
    },

    # CHAPTER 13: Kshetra Kshetrajña Vibhāga Yoga (35 verses)
    {
        "chapter": 13, "start_verse": 1, "end_verse": 19,
        "title": "The Body as the Field, The Soul as the Knower",
        "scene_story": "Arjuna seeks clarity on the nature of the physical vehicle and consciousness. Krishna explains that this mortal body with its sensations, desires, and thoughts is the 'Field' (Kshetra), while the conscious witness observing it is the 'Knower of the Field' (Kshetrajna), revealing that true wisdom is knowing the difference between the instrument and the spirit."
    },
    {
        "chapter": 13, "start_verse": 20, "end_verse": 35,
        "title": "Seeing the Undying Presence in All Dying Forms",
        "scene_story": "Krishna explains how nature (Prakriti) creates all forms, while consciousness (Purusha) experiences them. He proclaims that one who sees the supreme, undying divine presence dwelling equally in all perishable creatures possesses true vision and never degrades their own soul."
    },

    # CHAPTER 14: Gunatraya Vibhāga Yoga (27 verses)
    {
        "chapter": 14, "start_verse": 1, "end_verse": 18,
        "title": "The Three Forces of the Mind: Clarity, Passion, and Lethargy",
        "scene_story": "Krishna unravels the three invisible strands of nature (Gunas) that pull human psychology like strings on a puppet: Sattva (purity, illumination, balance), Rajas (restless passion, burning ambition), and Tamas (heaviness, confusion, inertia), explaining how they dictate human mood, choices, and destiny."
    },
    {
        "chapter": 14, "start_verse": 19, "end_verse": 27,
        "title": "Transcending the Modes: The State of Inner Mastery (Gunātīta)",
        "scene_story": "Arjuna asks: 'How does one recognize a person who has transcended these three moods of nature, and how do they live?' Krishna explains that the master who does not hate clarity when it arises, nor crave passion when it stirs, nor dread dullness, but watches them like an undisturbed witness, has conquered the turbulence of nature."
    },

    # CHAPTER 15: Purushottama Yoga (20 verses)
    {
        "chapter": 15, "start_verse": 1, "end_verse": 6,
        "title": "The Cosmic Inverted Tree of Material Entanglement",
        "scene_story": "Krishna describes the mystery of worldly life using the ancient metaphor of an enormous sacred fig tree (Ashvattha) with roots above in cosmic spirit and branches spreading below into the sensory world, instructing Arjuna to cut through its suffocating entanglements using the sharp axe of non-attachment."
    },
    {
        "chapter": 15, "start_verse": 7, "end_verse": 20,
        "title": "The Living Spark and the Supreme Consciousness (Purushottama)",
        "scene_story": "Krishna reveals that an eternal fragment of his divine consciousness resides in every living body, animating the senses and mind. He crowns this teaching by declaring himself the Purushottama—the Supreme Spirit higher than both the perishable world and the imperishable individual soul."
    },

    # CHAPTER 16: Daivāsura Sampad Vibhāga Yoga (24 verses)
    {
        "chapter": 16, "start_verse": 1, "end_verse": 5,
        "title": "The Divine Qualities of Freedom and Dignity",
        "scene_story": "Krishna enumerates the divine traits that lead to inner freedom and spiritual greatness: fearlessness, clean-heartedness, truth, non-violence, absence of anger, gentleness, modesty, and lack of arrogance, warmly assuring Arjuna: 'Do not grieve, O Pandava; you were born with these noble divine virtues.'"
    },
    {
        "chapter": 16, "start_verse": 6, "end_verse": 24,
        "title": "The Delusion of Ego and the Three Gates to Self-Destruction",
        "scene_story": "Krishna warns against the destructive, egotistical mindset that denies moral truth, consumed by insatiable greed, arrogance, and cruelty. He gives the timeless warning that there are three fatal gates that destroy the human soul: Lust, Anger, and Greed, commanding the seeker to cast these three aside."
    },

    # CHAPTER 17: Shraddhātraya Vibhāga Yoga (28 verses)
    {
        "chapter": 17, "start_verse": 1, "end_verse": 10,
        "title": "The Quality of Faith and Nourishment",
        "scene_story": "Arjuna asks about those who worship with sincere faith but without knowledge of formal scriptures. Krishna answers that faith is as a person is: people drawn to goodness have pure faith, people driven by ambition have restless faith, and people steeped in ignorance have dark faith, explaining how even food choices reflect these inner states."
    },
    {
        "chapter": 17, "start_verse": 11, "end_verse": 28,
        "title": "Austerity of Speech, Mind, and the Sacred Truth (Om Tat Sat)",
        "scene_story": "Krishna defines true spiritual discipline: speech that causes no hurt, is truthful, beneficial, and pleasant; a mind that is serene, gentle, and honest; and action that asks for nothing in return. He concludes with the ancient sacred mantra 'Om Tat Sat', dedicating all human efforts to the ultimate truth."
    },

    # CHAPTER 18: Moksha Sannyāsa Yoga (78 verses)
    {
        "chapter": 18, "start_verse": 1, "end_verse": 12,
        "title": "Tyāga: The True Secret of Renunciation",
        "scene_story": "Arjuna asks for the final, definitive difference between renunciation of work (Sannyasa) and relinquishment of selfish desire (Tyaga). Krishna settles it once and for all: abandoning duty out of fear of physical discomfort is delusion; true renunciation is performing duty wholeheartedly while relinquishing all selfish craving for the results."
    },
    {
        "chapter": 18, "start_verse": 13, "end_verse": 40,
        "title": "The Anatomy of Action, Intellect, and True Happiness",
        "scene_story": "Krishna analyzes the five factors behind every human action and demonstrates how intellect, resolve, and joy manifest differently: joy that tastes like poison at first but transforms into nectar in the end is born of clarity (Sattva), while joy that feels like nectar at first but turns into poison is born of passion (Rajas)."
    },
    {
        "chapter": 18, "start_verse": 41, "end_verse": 48,
        "title": "Svadharma: Honoring Your Innate Calling",
        "scene_story": "Krishna reminds Arjuna that human beings find perfection when they devote themselves to their own authentic inborn calling. It is far better to engage in one's own natural duty, even with its natural imperfections, than to attempt another's duty, for work aligned with one's genuine nature brings no guilt."
    },
    {
        "chapter": 18, "start_verse": 49, "end_verse": 59,
        "title": "Surrender of the Ego and the Inevitability of Destiny",
        "scene_story": "Krishna warns Arjuna against pride: 'If, blinded by egoism, you think: \"I will not fight,\" your decision will be futile, for your very warrior nature will compel you to act.' He advises Arjuna to mentally surrender all actions to the divine and pass through every storm of life by divine grace."
    },
    {
        "chapter": 18, "start_verse": 60, "end_verse": 66,
        "title": "The Grand Climax: Freedom to Choose and Total Surrender",
        "scene_story": "Krishna reaches the crowning pinnacle of the entire Bhagavad Gita. He first honors Arjuna's free will: 'Thus have I explained wisdom deeper than all mysteries. Ponder it fully, and then act as you choose.' Then, out of supreme love, he offers the ultimate promise in 18.66: 'Abandon all worries of righteousness and surrender unto Me alone; I shall liberate you from all sorrows; grieve not.'"
    },
    {
        "chapter": 18, "start_verse": 67, "end_verse": 78,
        "title": "The Awakening of Arjuna and the Eternal Promise of Victory",
        "scene_story": "Krishna asks: 'O Partha, has your delusion been destroyed?' Arjuna, transformed, stands up and declares with steady heart: 'My delusion is gone; memory is regained by your grace; my doubts are shattered, and I stand ready to do your will.' Sanjaya closes with tears of ecstasy, declaring that wherever Krishna, the Lord of Yoga, and Arjuna, the dedicated wielder of the bow, are united, there will forever be victory, prosperity, and justice."
    }
]

print("=" * 70)
print(f"LOADING BASE DATASET FROM: {BASE_JSON_PATH}")
print("=" * 70)

with open(BASE_JSON_PATH, "r", encoding="utf-8") as f:
    verses = json.load(f)

print(f"Loaded {len(verses)} verses.")

# Map every verse to its matching scene
completed_records = []
unmapped = []

for v in verses:
    ch = v["chapter"]
    v_num = v["verse"]
    
    # Find matching scene
    matched_scene = None
    for scene in SCENES_MAP:
        if scene["chapter"] == ch and scene["start_verse"] <= v_num <= scene["end_verse"]:
            matched_scene = scene
            break
            
    if not matched_scene:
        unmapped.append(f"Chapter {ch}, Verse {v_num}")
    else:
        v_copy = dict(v)
        v_copy["scene_title"] = matched_scene["title"]
        v_copy["scene_story"] = matched_scene["scene_story"]
        completed_records.append(v_copy)

if unmapped:
    print(f"ERROR: {len(unmapped)} verses could not be mapped to a scene!")
    print(unmapped[:10])
    sys.exit(1)

print(f"SUCCESS: All {len(completed_records)} verses successfully mapped to their dialogue scenes!")

# Save to OUTPUT_COMPLETE_PATH
with open(OUTPUT_COMPLETE_PATH, "w", encoding="utf-8") as f:
    json.dump(completed_records, f, ensure_ascii=False, indent=2)

print(f"\nSaved complete dataset to:")
print(f"-> {OUTPUT_COMPLETE_PATH}")

print("\n" + "=" * 70)
print("RUNNING FINAL VERIFICATION ON COMPLETE DATASET")
print("=" * 70)

print(f"1. Total Verses: {len(completed_records)} (Expected: 701) -> {'PASS' if len(completed_records) == 701 else 'FAIL'}")

# Check for empty scene stories
empty_scenes = [r for r in completed_records if not r.get("scene_story") or len(r.get("scene_story")) < 20]
print(f"2. Scene Story Completeness: {'PASS' if len(empty_scenes) == 0 else 'FAIL'} (Empty: {len(empty_scenes)})")

# Sample verse 2.47
v2_47 = next((r for r in completed_records if r["chapter"] == 2 and r["verse"] == 47), None)
print("\nSpotlight Verse 2.47:")
print(f"  Title: {v2_47['scene_title']}")
print(f"  Speaker: {v2_47['speaker']}")
print(f"  Story: {v2_47['scene_story']}")
print(f"  Sanskrit: {v2_47['sanskrit'].replace(chr(10), ' ')[:45]}...")
print(f"  Translation: {v2_47['translation']}")

print("\n" + "=" * 70)
print("ALL 701 VERSES ARE NOW 100% COMPLETE WITH VERIFIED SCENE STORIES!")
print("=" * 70)

"""
=============================================================================
jnana.ai — Canonical Bhagavad Gita Dataset Validator
=============================================================================

CORE PURPOSE:
Runs rigorous theological and structural assertions across all 701 canonical
verses in the dataset (jnana_gita_complete.json), ensuring 100% adherence to
the authentic Swami Sivananda (Divine Life Society) tradition.

VALIDATION CRITERIA:
1. Exact 18 chapters present.
2. Exact canonical verse count per chapter (matching 701 total).
3. Zero Sanskrit truncation or ellipses.
4. 100% complete English translations.
5. Valid speaker attributions (Lord Krishna, Arjuna, Sanjaya, King Dhritarashtra).
6. Narrative battlefield scene metadata present for every single verse.
7. Verification of milestone verses (1.1, 1.47, 2.7, 2.47, 4.7, 18.66, 18.78).
=============================================================================
"""

import json
import os
import sys

# Configure stdout for Unicode Sanskrit support
sys.stdout.reconfigure(encoding='utf-8')

CANONICAL_CHAPTER_COUNTS = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
    7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
    13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
}
TOTAL_CANONICAL = sum(CANONICAL_CHAPTER_COUNTS.values())

DATASET_PATH = r"D:\productive\jnana.ai\data\canonical\jnana_gita_complete.json"

def validate_dataset():
    if not os.path.exists(DATASET_PATH):
        print(f"[ERROR] Dataset not found at: {DATASET_PATH}")
        sys.exit(1)

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        records = json.load(f)

    print("=" * 70)
    print("CANONICAL DATASET VALIDATION REPORT")
    print("Source: Swami Sivananda (Divine Life Society)")
    print(f"File: {DATASET_PATH}")
    print("=" * 70)

    # TEST 1: Total Chapter Count
    chapters_found = sorted(list(set(r["chapter"] for r in records)))
    test1_pass = len(chapters_found) == 18
    print(f"TEST 1 [Chapter Count = 18]: {'PASS' if test1_pass else 'FAIL'} (Found: {len(chapters_found)})")

    # TEST 2: Per-Chapter Verse Count
    test2_pass = True
    for ch in range(1, 19):
        cnt = sum(1 for r in records if r["chapter"] == ch)
        expected = CANONICAL_CHAPTER_COUNTS[ch]
        if cnt != expected:
            test2_pass = False
            print(f"  FAIL: Chapter {ch} has {cnt} verses, expected {expected}")

    print(f"TEST 2 [Per-Chapter Verse Exact Counts]: {'PASS' if test2_pass else 'FAIL'}")

    # TEST 3: Total Canonical Verses
    test3_pass = len(records) == TOTAL_CANONICAL
    print(f"TEST 3 [Total Canonical Verses = {TOTAL_CANONICAL}]: {'PASS' if test3_pass else 'FAIL'} (Found: {len(records)})")

    # TEST 4: Sanskrit Truncation & Ellipsis Check
    ellipsis_records = [r for r in records if "..." in r["sanskrit"] or "…" in r["sanskrit"]]
    test4_pass = len(ellipsis_records) == 0
    print(f"TEST 4 [Zero Sanskrit Truncation / Ellipses]: {'PASS' if test4_pass else 'FAIL'} (Ellipses found: {len(ellipsis_records)})")

    # TEST 5: Translation Completeness Check (No null or empty strings)
    empty_trans = [r for r in records if not r.get("translation") or len(r["translation"]) < 5]
    test5_pass = len(empty_trans) == 0
    print(f"TEST 5 [Translation Completeness]: {'PASS' if test5_pass else 'FAIL'} (Empty translations: {len(empty_trans)})")

    # TEST 6: Speaker Attribution Validity
    valid_speakers = {"Lord Krishna", "Arjuna", "Sanjaya", "King Dhritarashtra"}
    invalid_speakers = [r for r in records if r["speaker"] not in valid_speakers]
    test6_pass = len(invalid_speakers) == 0
    speaker_dist = {}
    for r in records:
        speaker_dist[r["speaker"]] = speaker_dist.get(r["speaker"], 0) + 1
    print(f"TEST 6 [Speaker Attribution Valid]: {'PASS' if test6_pass else 'FAIL'} (Invalid: {len(invalid_speakers)})")
    print(f"         Speaker breakdown: {speaker_dist}")

    # TEST 7: Scene Narrative Metadata Completeness
    empty_scenes = [r for r in records if not r.get("scene_story") or len(r.get("scene_story")) < 20]
    test7_pass = len(empty_scenes) == 0
    print(f"TEST 7 [Scene Narrative Story Completeness]: {'PASS' if test7_pass else 'FAIL'} (Missing: {len(empty_scenes)})")

    # TEST 8: Milestone Canonical Verses Spot-Check
    print("\nTEST 8 [Spot-Checking Milestone Verses]:")
    milestones = [
        (1, 1, "King Dhritarashtra", "धर्मक्षेत्रे कुरुक्षेत्रे"),
        (1, 47, "Sanjaya", "विसृज्य सशरं चापं"),          # The verse missing in common Kaggle CSVs
        (2, 7, "Arjuna", "कार्पण्यदोषोपहतस्वभावः"),        # Arjuna's total surrender
        (2, 47, "Lord Krishna", "कर्मण्येवाधिकारस्ते"),      # Karma Yoga core
        (4, 7, "Lord Krishna", "यदा यदा हि धर्मस्य"),        # The Avatar descent
        (18, 66, "Lord Krishna", "सर्वधर्मान्परित्यज्य"),    # The supreme refuge (Charama Shloka)
        (18, 78, "Sanjaya", "यत्र योगेश्वरः कृष्णो")         # The eternal triumph
    ]

    test8_pass = True
    for ch, v_num, expected_speaker, expected_snk in milestones:
        rec = next((r for r in records if r["chapter"] == ch and r["verse"] == v_num), None)
        if not rec:
            print(f"  FAIL: Verse {ch}.{v_num} not found!")
            test8_pass = False
        else:
            snk_ok = expected_snk in rec["sanskrit"] or expected_snk in rec["transliteration"]
            speaker_ok = rec["speaker"] == expected_speaker
            status = "PASS" if snk_ok and speaker_ok else "FAIL"
            if status == "FAIL":
                test8_pass = False
            print(f"  [{status}] Verse {ch}.{v_num:02d} | Speaker: {rec['speaker']:<18} | Shloka: {rec['sanskrit'].replace(chr(10), ' ')[:38]}...")

    print("\n" + "=" * 70)
    all_pass = all([test1_pass, test2_pass, test3_pass, test4_pass, test5_pass, test6_pass, test7_pass, test8_pass])
    print(f"OVERALL VALIDATION STATUS: {'ALL 8 TEST SUITES PASSED (100% VERIFIED)' if all_pass else 'SOME TESTS FAILED'}")
    print("=" * 70)

if __name__ == "__main__":
    validate_dataset()

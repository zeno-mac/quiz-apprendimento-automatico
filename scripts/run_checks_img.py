import json
import re
import difflib

def normalize_whitespace(s):
    return re.sub(r'\s+', ' ', str(s).strip())

def main():
    with open('domande_estratte_img.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} questions from domande_estratte_img.json")

    # 1. 30 questions
    if len(data) == 30:
        print("OK: Exactly 30 questions.")
    else:
        print(f"ERROR: Expected 30, got {len(data)}")

    # 2. No duplicate numbers
    numeri = [int(q['numero_domanda']) for q in data]
    if len(numeri) == len(set(numeri)):
        print("OK: No duplicate numbering.")
    else:
        print("ERROR: Duplicates found in numbering.")

    # 3. Exactly 4 possible answers
    # 4. Perfect match for correct answers
    all_4_answers = True
    perfect_match = True
    for q in data:
        possibili = q['risposte_possibili']
        corrette = q['risposte_corrette']
        if len(possibili) != 4:
            all_4_answers = False
            print(f"ERROR: Question {q['numero_domanda']} has {len(possibili)} possible answers.")
        
        possibili_norm = [normalize_whitespace(p) for p in possibili]
        for c in corrette:
            if normalize_whitespace(c) not in possibili_norm:
                perfect_match = False
                print(f"ERROR: Question {q['numero_domanda']} correct answer not perfectly matching any possible answer: '{c}'")

    if all_4_answers:
        print("OK: All questions have exactly 4 possible answers.")
    if perfect_match:
        print("OK: Perfect text match between correct answers and possible answers.")

    # Cross-check with raggruppamento.json
    try:
        with open('raggruppamento.json', 'r', encoding='utf-8') as f:
            ragg = json.load(f)
        
        pool = ragg
                    
        print(f"\n--- Cross-check against {len(pool)} reference questions from 2023 pool ---")
        
        matches = 0
        for q in data:
            q_domanda = normalize_whitespace(q['domanda'])
            found = False
            for ref_q in pool:
                ref_domanda = normalize_whitespace(ref_q['domanda'])
                # strict match or fuzzy match
                if difflib.SequenceMatcher(None, q_domanda, ref_domanda).ratio() > 0.9:
                    found = True
                    break
            if found:
                matches += 1
            else:
                print(f"WARNING: Question {q['numero_domanda']} not found in reference pool: {q_domanda}")
                
        print(f"Semantic comparison: {matches}/30 exact/fuzzy matches found in the 2023 reference pool.")
    except Exception as e:
        print(f"Could not run cross-check: {e}")

if __name__ == '__main__':
    main()

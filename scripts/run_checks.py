import json
import re

def normalize_whitespace(s):
    return re.sub(r'\s+', ' ', str(s).strip())

def main():
    with open('../domande_estratte.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    exams = {}
    for d in data:
        ex = d.get('data_esame')
        if ex not in exams:
            exams[ex] = []
        exams[ex].append(d)

    report = ["# Report di Validazione `domande_estratte.json`\n"]

    for exam, questions in exams.items():
        report.append(f"## Esame: {exam}")
        
        # 1. Conteggio delle Domande
        if '22-11-2018' in exam or '2022-11-18' in exam:
            expected_count = 6
        elif '2023-02-12' in exam:
            expected_count = 24
        else:
            expected_count = 30
            
        if len(questions) != expected_count:
            report.append(f"- **ERRORE**: Numero di domande errato. Atteso {expected_count}, Trovato {len(questions)}.")
        else:
            report.append(f"- *OK*: Numero di domande corretto ({len(questions)}).")

        # 2. Numerazione Senza Duplicati
        numeri = []
        for q in questions:
            num = q.get('numero_domanda')
            try:
                numeri.append(int(num))
            except (ValueError, TypeError):
                report.append(f"- **ERRORE**: numero_domanda non intero: '{num}'")
        
        sorted_numeri = sorted(numeri)
        if len(numeri) != len(set(numeri)):
            report.append(f"- **ERRORE**: Ci sono duplicati nella numerazione delle domande.")
            from collections import Counter
            dups = [item for item, count in Counter(numeri).items() if count > 1]
            report.append(f"  - Duplicati: {dups}")
        if numeri != sorted_numeri:
            report.append(f"- **ERRORE**: La numerazione delle domande non è strettamente crescente.")
            
        # Per-question checks
        for q in questions:
            num = q.get('numero_domanda')
            possibili = q.get('risposte_possibili', [])
            corrette = q.get('risposte_corrette', [])
            
            issues = []
            
            # 3. Numero di Risposte Possibili
            if len(possibili) != 4:
                issues.append(f"Numero di risposte possibili errato ({len(possibili)} invece di 4).")
                
            # 4. Matching Corrette vs Possibili
            possibili_norm = [normalize_whitespace(p) for p in possibili]
            valid_corrette = []
            for c in corrette:
                c_norm = normalize_whitespace(c)
                if c_norm not in possibili_norm:
                    # Let's check if it's a completely spurious answer (e.g. metadata like "13/02/2023, 15:36")
                    # But the prompt says "Ogni stringa presente... deve essere presente... Se c'è un mismatch, segnalare"
                    issues.append(f"Risposta corretta non trovata tra le possibili: '{c}'")
                else:
                    valid_corrette.append(c_norm)
            
            # 5. Requisito Quantità Risposte Corrette
            if len(corrette) == 0:
                issues.append("ERRORE: 0 risposte corrette trovate.")
            elif len(valid_corrette) > 2:
                issues.append(f"AVVISO: Trovate {len(valid_corrette)} risposte corrette (più di 2). Le corrette estratte in totale erano {len(corrette)}.")
            
            if issues:
                report.append(f"- **Domanda {num}**:")
                for issue in issues:
                    report.append(f"  - {issue}")
                    
        report.append("")

    # Also check if there's any simulation from 2018 in the directory?
    # Or just use the extracted ones.

    with open('../agents/reports/validation_report.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(report))
    
    print("Report saved to validation_report.md")

if __name__ == '__main__':
    main()

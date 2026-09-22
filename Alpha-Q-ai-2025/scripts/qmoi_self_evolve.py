import os
import sys
from datetime import datetime
from transformers import pipeline

# Use HuggingFace code generation pipeline
try:
    codegen = pipeline('text-generation', model='Salesforce/codegen-350M-multi')
except Exception as e:
    codegen = None
    print(f"[QMOI Self-Evolve] Could not load HuggingFace model: {e}")

def analyze_codebase(path):
    print(f"[QMOI Self-Evolve] Analyzing codebase at: {path}")
    suggestions = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.js', '.ts', '.py', '.rs')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    code = f.read()[:512]  # Limit for demo
                if codegen:
                    prompt = f"# Suggest improvements for the following code:\n{code}\n# Suggestions:"
                    result = codegen(prompt, max_length=128, num_return_sequences=1)[0]['generated_text']
                    suggestions.append({
                        'file': file_path,
                        'suggestion': result.split('# Suggestions:')[-1].strip()
                    })
                else:
                    suggestions.append({
                        'file': file_path,
                        'suggestion': 'Model not available. (Stub suggestion)'
                    })
    return suggestions

def log_to_memory(suggestions):
    print(f"[QMOI Self-Evolve] Logging suggestions to QmoiMemory: {suggestions}")
    # TODO: Implement real logging

def main():
    codebase_path = sys.argv[1] if len(sys.argv) > 1 else '.'
    suggestions = analyze_codebase(codebase_path)
    for s in suggestions:
        print(f"[Suggestion] {s['file']}: {s['suggestion']}")
    log_to_memory(suggestions)
    print(f"[QMOI Self-Evolve] Evolution cycle complete at {datetime.now()}")

if __name__ == '__main__':
    main() 

import os
import re

def scan_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    issues = []

    # Regex patterns
    # 1. Text between JSX tags: >  Content  <
    # Excludes:
    # - Whitespace only
    # - purely numeric
    # - content starting with { (dynamic)
    # - &nbsp; etc
    text_pattern = re.compile(r'>\s*([^<{]+?)\s*<')

    # 2. Common attributes that should be translated
    attr_pattern = re.compile(r'(placeholder|alt|title|label)\s*=\s*"([^"]+)"')
    
    # 3. Text directly in JSX return but without tags is harder without a parser, 
    # but the above covers most <div>Text</div> cases.

    for i, line in enumerate(lines):
        # Skip import lines, comments
        if line.strip().startswith('import') or line.strip().startswith('//') or line.strip().startswith('/*'):
            continue
        
        # Check text content
        matches = text_pattern.findall(line)
        for match in matches:
            text = match.strip()
            # Filters
            if not text: continue
            if text.startswith('{'): continue # Dynamic content
            if re.match(r'^\d+$', text): continue # Numbers
            if re.match(r'^&[a-z]+;$', text): continue # Entities
            
            # Heuristic: if it looks like a variable or code
            if re.match(r'^[a-zA-Z0-9_]+$', text) and not ' ' in text:
                # might be a variable rendered alone? >Variable< is rare in JSX without brackets
                pass

            # Ignore if it looks like a localized string (e.g. simplified check)
            # Actually, standard strings to translate usually have spaces or are specific words.
            
            issues.append((i + 1, f"Text content: '{text}'"))

        # Check attributes
        attr_matches = attr_pattern.findall(line)
        for attr, value in attr_matches:
            # Ignore empty or code-like
            if not value.strip(): continue
            if value.startswith('{'): continue
            
            issues.append((i + 1, f"Attribute '{attr}': '{value}'"))

    return issues

def main():
    base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\src\app\[locale]\(public)"
    print(f"Scanning directory: {base_dir}\n")

    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                file_path = os.path.join(root, file)
                issues = scan_file(file_path)
                
                if issues:
                    rel_path = os.path.relpath(file_path, base_dir)
                    print(f"--- {rel_path} ---")
                    for line_num, issue in issues:
                        print(f"  Line {line_num}: {issue}")
                    print("")

if __name__ == "__main__":
    main()

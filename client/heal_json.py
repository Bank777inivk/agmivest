
import json
import re
import os

def extract_valid_json_parts(content):
    # Try to find common namespaces
    namespaces = [
        "Navigation", "Hero", "Stats", "AdBanner", "Services", "About", 
        "Testimonials", "Contact", "Simulator", "Partners", "Location", 
        "HomePage", "WhyChooseUs", "History", "Process", "Team", 
        "Documents", "Footer", "Dashboard", "Auth", "Legal", "Home"
    ]
    
    extracted = {}
    
    for ns in namespaces:
        # Look for "Namespace": { ... }
        # This is a bit tricky due to corruption, but we can try to find the starting brace
        pattern = rf'"{ns}"\s*:\s*\{{'
        match = re.search(pattern, content)
        if match:
            start = match.start()
            # Attempt to find the matching closing brace
            brace_count = 0
            for i in range(match.end() - 1, len(content)):
                if content[i] == '{':
                    brace_count += 1
                elif content[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        try:
                            # Try to parse this segment
                            segment = content[start:i+1]
                            # Clean up some common mojibake/fusion errors if possible
                            # This is very heuristic
                            segment = "{" + segment + "}"
                            data = json.loads(segment)
                            extracted[ns] = data[ns]
                            print(f"Successfully extracted {ns}")
                            break
                        except Exception as e:
                            # Try a smaller sub-segment or ignore
                            continue
    return extracted

def main():
    path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\fr_json_head.txt"
    if not os.path.exists(path):
        print("File not found")
        return

    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # The file might be a sequence of partial JSONs
    # Let's try to find all top-level keys
    extracted_data = {}
    
    # Try to clean known "welding" artifacts
    # For example, text directly following a closing brace or comma
    cleaned_content = content
    
    # Very basic extraction
    data = extract_valid_json_parts(content)
    
    if data:
        with open("fr_restored.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Restored {len(data)} namespaces to fr_restored.json")
    else:
        print("No valid namespaces found")

if __name__ == "__main__":
    main()

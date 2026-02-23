import subprocess
import os

ROOT_DIR = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client"
script_path = os.path.join(ROOT_DIR, "scripts", "full_audit.py")
output_path = os.path.join(ROOT_DIR, "audit_report.txt")

with open(output_path, "w", encoding="utf-8") as f:
    subprocess.run(["python", script_path], stdout=f, stderr=subprocess.STDOUT, cwd=ROOT_DIR)

print(f"Audit saved to {output_path}")

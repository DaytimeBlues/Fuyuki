import os

path = "src/index.css"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    
    new_lines = []
    in_conflict = False
    keep_head = True # By default we keep our version (HEAD)
    
    for line in lines:
        if line.startswith("<<<<<<<"):
            in_conflict = True
            continue
        if line.startswith("======="):
            keep_head = False
            continue
        if line.startswith(">>>>>>>"):
            in_conflict = False
            keep_head = True
            continue
        
        if not in_conflict:
            new_lines.append(line)
        else:
            if keep_head:
                new_lines.append(line)
    
    with open(path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print(f"Sanitized {path}")
else:
    print(f"{path} not found")

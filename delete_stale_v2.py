import subprocess

KEEP = [
    "add-test-files-for-redux-and-performance",
    "create-test-suite-for-aramancia-tracker",
    "design-single-player-wizard-combat-system",
    "perform-compatibility-and-static-analysis-review",
    "add-copilot-instructions-file",
    "fix-smooth-performance-issues",
    "minion-attack-roll-formula-c77f",
    "minion-attack-roll-formula-e333",
    "video-deletion-and-battery-optimization-7e8c",
    "multiclass-slots-data-loss",
    "master"
]

def get_remote_heads():
    result = subprocess.run("git ls-remote --heads origin", shell=True, capture_output=True, text=True)
    heads = []
    for line in result.stdout.split('\n'):
        if line.strip():
            parts = line.split('\t')
            if len(parts) > 1:
                ref = parts[1]
                name = ref.replace("refs/heads/", "")
                heads.append(name)
    return heads

heads = get_remote_heads()
to_delete = []

for h in heads:
    matched = False
    for k in KEEP:
        if h.endswith(k):
            matched = True
            break
    if not matched:
        to_delete.append(h)

print(f"Heads discovered: {len(heads)}")
print(f"Heads to delete: {len(to_delete)}")

failed = []
for h in to_delete:
    print(f"Deleting: {h}")
    res = subprocess.run(f"git push origin --delete {h}", shell=True)
    if res.returncode != 0:
        failed.append(h)

if failed:
    print("\nSome deletions failed (likely protected or missing):")
    for f in failed:
        print(f" - {f}")

print("\nFinished process.")

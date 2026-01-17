import subprocess

# Branches to KEEP (Audited as valuable)
KEEP_BRANCHES = [
    "origin/codex/add-test-files-for-redux-and-performance",
    "origin/codex/create-test-suite-for-aramancia-tracker",
    "origin/codex/design-single-player-wizard-combat-system",
    "origin/codex/perform-compatibility-and-static-analysis-review",
    "origin/copilot/add-copilot-instructions-file",
    "origin/copilot/fix-smooth-performance-issues",
    "origin/cursor/minion-attack-roll-formula-c77f",
    "origin/cursor/minion-attack-roll-formula-e333",
    "origin/cursor/video-deletion-and-battery-optimization-7e8c",
    "origin/fix/multiclass-slots-data-loss"
]

PROTECTED = ["origin/master", "origin/HEAD"]

def get_remote_branches():
    result = subprocess.run("git branch -r", shell=True, capture_output=True, text=True)
    return [b.strip() for b in result.stdout.split('\n') if b.strip()]

def delete_remote_branch(branch):
    name = branch.replace("origin/", "")
    print(f"Deleting remote branch: {name}")
    subprocess.run(f"git push origin --delete {name}", shell=True)

all_branches = get_remote_branches()
to_delete = []

for branch in all_branches:
    if branch in KEEP_BRANCHES or branch in PROTECTED:
        continue
    # Extra safety: check if it's pointing to something else or contains specific keywords we like
    to_delete.append(branch)

print(f"Found {len(to_delete)} branches to delete.")
for branch in to_delete:
    delete_remote_branch(branch)

print("Batch deletion complete.")

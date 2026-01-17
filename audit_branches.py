import subprocess

def run_command(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

unmerged_branches_raw = run_command("git branch -r --no-merged origin/master")
unmerged_branches = [b.strip() for b in unmerged_branches_raw.split('\n') if b.strip()]

report = []
for branch in unmerged_branches:
    log = run_command(f"git log origin/master..{branch} --oneline")
    count = len(log.split('\n')) if log else 0
    report.append(f"Branch: {branch}")
    report.append(f"Commits: {count}")
    report.append("Log:")
    report.append(log)
    report.append("-" * 40)

with open("branch_audit_report.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(report))

print(f"Audit complete. Audited {len(unmerged_branches)} branches.")

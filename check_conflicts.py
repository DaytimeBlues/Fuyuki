import os

files = [
    "index.html",
    "src/App.tsx",
    "src/components/layout/BiographyView.tsx",
    "src/components/layout/BackgroundVideo.tsx",
    "src/components/widgets/HealthWidget.tsx",
    "src/index.css"
]

for f in files:
    if os.path.exists(f):
        print(f"File {f} exists. Checking for markers...")
        with open(f, "r", encoding="utf-8", errors="ignore") as file:
            content = file.read()
            if "<<<<<<<" in content:
                print(f"Conflict markers FOUND in {f}")
            else:
                print(f"Conflict markers NOT found in {f}")
    else:
        print(f"File {f} DOES NOT EXIST.")

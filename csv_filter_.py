import csv
import re

IN  = "data.csv"
OUT = "filtered.csv"

splitter = re.compile(r'\s*,\s*')

categories = set()

with open(IN, newline="", encoding="utf-8") as infile:
    reader = csv.DictReader(infile)

    for row in reader:
        cat_raw = (row.get("Tags") or "").strip()
        if not cat_raw:
            continue

        cats = [c.strip() for c in splitter.split(cat_raw)]
        categories.update(cats)  

with open(OUT, "w", newline="", encoding="utf-8") as outfile:
    writer = csv.writer(outfile)
    writer.writerow(["Tags"])
    for cat in sorted(categories):
        writer.writerow([cat])

print(f"Done -> {OUT}")

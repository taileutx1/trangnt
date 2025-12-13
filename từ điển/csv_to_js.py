import csv
import json

# Đường dẫn CSV
csv_file = "dictionary.csv"

# Đường dẫn file JS sẽ tạo ra
js_file = "dictionary.js"

# Đọc CSV
with open(csv_file, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    # Tạo dictionary
    data = {row['word']: row['meaning'] for row in reader}

# Ghi ra file JS
with open(js_file, "w", encoding="utf-8") as f:
    f.write("const dictionary = ")
    f.write(json.dumps(data, ensure_ascii=False, indent=2))
    f.write(";")

print(f"Đã tạo file {js_file} thành công!")

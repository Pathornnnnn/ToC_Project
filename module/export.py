import csv


class Export:
    def export_csv(self, data, file_name):
        if not data:
            return
        fieldnames = data[0].keys()
        with open(file_name, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)

# model/Action.py
import pandas as pd
import numpy as np
import os
from typing import List, Dict

DATA_CSV = "./data.csv"

# ------------------------------
# Global variables
# ------------------------------
data_json: List[Dict] = []      # source of truth
data_game: pd.DataFrame = pd.DataFrame()  # DataFrame จาก data_json

# ------------------------------
# ฟังก์ชันช่วยเหลือ
# ------------------------------
def save_json_to_csv():
    """Sync data_json → data.csv"""
    global data_json
    if not data_json:
        print("⚠️ save_json_to_csv: ไม่มีข้อมูล")
        return
    df = pd.DataFrame(data_json)
    df.to_csv(DATA_CSV, index=False, encoding="utf-8-sig")
    print(f"✅ save_json_to_csv: บันทึก {len(df)} records ลง {DATA_CSV}")


def load_csv_to_json():
    """Sync data.csv → data_json และ update data_game"""
    global data_json, data_game
    if not os.path.exists(DATA_CSV):
        print(f"⚠️ load_csv_to_json: {DATA_CSV} ยังไม่มีไฟล์")
        data_json = []
        data_game = pd.DataFrame()
        return

    df = pd.read_csv(DATA_CSV)
    df = df.replace([np.inf, -np.inf], np.nan)
    # แปลง Tags เป็น list เสมอ
    df["Tags"] = df["Tags"].apply(
        lambda x: [tag.strip() for tag in x.split(",")] if isinstance(x, str) else []
    )
    df = df.where(pd.notnull(df), None)
    data_json = df.to_dict(orient="records")
    data_game = pd.DataFrame(data_json)
    print(f"✅ load_csv_to_json: โหลด {len(df)} records จาก {DATA_CSV}")


def update_data(new_data: List[Dict]):
    """
    Merge ข้อมูลใหม่เข้า data_json
    - กันซ้ำ ID
    - sync → CSV
    - update data_game
    """
    global data_json, data_game

    if not new_data:
        print("⚠️ update_data: ไม่มีข้อมูลใหม่")
        return data_json  # คืนค่า list เสมอ

    if not data_json:
        data_json = new_data
    else:
        existing_ids = set(item["ID"] for item in data_json)
        for item in new_data:
            if item["ID"] not in existing_ids:
                data_json.append(item)
                existing_ids.add(item["ID"])

    # sync → CSV
    save_json_to_csv()

    # update DataFrame
    data_game = pd.DataFrame(data_json)

    print(f"✅ update_data: รวมข้อมูลทั้งหมด {len(data_json)} records")
    return data_json


def get_data_category(category: str) -> List[Dict]:
    """กรองข้อมูลตาม category (Tags)"""
    global data_json
    if not data_json:
        return []

    # filter ข้อมูล
    data_by_cate = [
        item for item in data_json
        if isinstance(item.get("Tags"), list) and category in item.get("Tags")
    ]
    return data_by_cate


# ------------------------------
# Load CSV ตอนโมดูลถูก import
# ------------------------------
load_csv_to_json()

import pandas as pd
import numpy as np
import sys 
import os
from typing import List, Dict

print("Current working directory:", os.getcwd())
data_game = pd.read_csv('./data.csv')
df = pd.read_csv('./data.csv')
df = df.replace([np.inf, -np.inf], np.nan)
df["Tags"] = df["Tags"].apply(lambda x: [tag.strip() for tag in x.split(",")] if x else [])
df = df.where(pd.notnull(df), None)
data_json = df.to_dict(orient="records")

def get_data_category(category: str):
    # แปลง Tags ให้เป็น list
    df["Tags"] = df["Tags"].apply(lambda x: [tag.strip() for tag in x.split(",")] if isinstance(x, str) else (x if isinstance(x, list) else []))

    # filter
    data_by_cate = df[df["Tags"].apply(lambda tags: category in tags)]

    # จัดการ NaN / Infinity
    data_by_cate = data_by_cate.replace([np.inf, -np.inf], np.nan)
    data_by_cate = data_by_cate.where(pd.notnull(data_by_cate), None)

    return data_by_cate.to_dict(orient="records")

DATA_CSV = "./data.csv"
data_json: list[Dict] = []  # global source of truth

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
    """Sync data.csv → data_json"""
    global data_json
    try:
        df = pd.read_csv(DATA_CSV)
        df = df.replace([np.inf, -np.inf], np.nan)
        df["Tags"] = df["Tags"].apply(
            lambda x: [tag.strip() for tag in x.split(",")] if isinstance(x, str) else []
        )
        df = df.where(pd.notnull(df), None)
        data_json = df.to_dict(orient="records")
        print(f"✅ load_csv_to_json: โหลด {len(df)} records จาก {DATA_CSV}")
    except FileNotFoundError:
        print(f"⚠️ load_csv_to_json: {DATA_CSV} ยังไม่มีไฟล์")
        data_json = []
        
def update_data(new_data: list[dict]):
    """
    รับ list[dict] จาก crawl / fetch
    - merge ข้อมูลใหม่
    - กันซ้ำ ID
    - sync data_json → data.csv
    """
    global data_json

    if not new_data:
        print("⚠️ update_data: ไม่มีข้อมูลใหม่")
        return

    # ถ้ายังไม่มี data_json → ใช้ new_data ตรง ๆ
    if not data_json:
        data_json = new_data
    else:
        # merge ข้อมูลใหม่ แต่กันซ้ำ ID
        existing_ids = set(item["ID"] for item in data_json)
        for item in new_data:
            if item["ID"] not in existing_ids:
                data_json.append(item)
                existing_ids.add(item["ID"])

    # sync → CSV
    save_json_to_csv()
    print(f"✅ update_data: รวมข้อมูลทั้งหมด {len(data_json)} records")
    return data_json  # ✅ คืนค่า list เสมอ
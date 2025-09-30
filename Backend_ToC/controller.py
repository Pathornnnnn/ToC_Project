from fastapi import Request
from fastapi.templating import Jinja2Templates
import numpy as np
import re
import requests
import csv
import pandas as pd
import sys
from model import Action, Category 
from pydantic import BaseModel
from datetime import datetime
import traceback
import os

data = Action.data_game
data_json = Action.data_json
categories = Category.category_name[:15]
favorite_list =  []
web = Jinja2Templates(directory="resources/view")

# ใช้ BASE_PATH ที่กำหนดใน Action.py
BASE_PATH = Action.get_base_path()
CSV_FILE = os.path.join(BASE_PATH, "fetch_date.csv")
FAVORITE_CSV_FILE = os.path.join(BASE_PATH, "favorite.csv")


def welcome(request: Request, web:Jinja2Templates):    
    return web.TemplateResponse("home.html",{"request": request})

def home(request: Request, web: Jinja2Templates, page: int = 1, limit: int = 8):
    start = (page - 1) * limit
    end = start + limit 
    chunk = data.iloc[start:end].to_dict(orient="records")
    items = {
        "request": request,
        "data_list": chunk,
        "current_page": page,
        "categories": categories
    }    
    return web.TemplateResponse("home.html", items)


def get_data_by_category(category: str):
    df = Action.get_data_category(category)
    return df


class Crawler:
    def fetch(self, url: str) -> str:
        """ดึง HTML จาก URL"""
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"❌ fetch error: {e} | URL: {url}")
            return ""

    def crawl_nav(self, web_txt: str) -> list[str]:
        """ดึงลิงก์หมวดหมู่จาก navigation"""
        regex_nav = r'<li\sid="menu-item-[\d]*"\sclass="menu-[\w]*"><a\shref="([\w:/.-]*)">[\w\s]*<span\sclass="p"></span></a></li>'
        return re.findall(regex_nav, web_txt)

    def next_page(self, web_txt: str) -> str | None:
        """ดึงลิงก์หน้าถัดไป"""
        regex_next_page = r'<a\s+class="next"\s+href="([^"]+)">'
        link = re.findall(regex_next_page, web_txt)
        return link[0] if link else None

    def crawl(self, web_text: str, ids_seen: set) -> list[dict]:
        """ดึงข้อมูลโพสต์จากหน้าเว็บ และกันซ้ำด้วย ids_seen"""
        posts = []
        titles = re.findall(
            r'<a\sclass="post-thumb\s"\sid="thumb-[\d]*"\shref="[\w:/.-]*"\stitle="([\w\s.]*)">',
            web_text,
        )
        ids = re.findall(r'<a\sclass="post-thumb\s"\sid="thumb-([\d]*)"', web_text)
        imgs = re.findall(r'<img\swidth="140"\sheight="140"\ssrc="([\w:/.-]*)"', web_text)
        dates = re.findall(
            r'<div\sclass="post-std\sclear-block">[\w\W]*?<div\sclass="post-date"><span\sclass="ext">([\d\s\w]+)</span></div>',
            web_text,
        )
        descriptions = re.findall(
            r'<div\sclass="post-content\sclear-block">[\w\W]*?([\w\W]+?)\s*[(]more&hellip;',
            web_text,
        )
        tag_blocks = re.findall(r'<div class="post-info">([\w\W]*?)</div>', web_text)

        for i in range(len(titles)):
            pid = ids[i].strip()
            if pid in ids_seen:
                continue
            ids_seen.add(pid)

            tags = (
                ", ".join(re.findall(r'\srel="tag"\stitle="([\w]+)', tag_blocks[i]))
                if i < len(tag_blocks)
                else []
            )

            post = {
                "ID": pid,
                "Title": titles[i].strip() if i < len(titles) else None,
                "Tags": tags,
                "Image": imgs[i].strip() if i < len(imgs) else None,
                "Date": dates[i].strip() if i < len(dates) else None,
                "Description": descriptions[i].strip() if i < len(descriptions) else None,
            }
            posts.append(post)

        return posts

    def crawl_loop(self, links_list: list[str], max_page_per_cate: int = 2) -> list[dict]:
        """
        ดึงข้อมูลจากลิงก์หมวดหมู่ทั้งหมด
        กันซ้ำด้วย ids_seen ทั้งหมด
        """
        data = []
        ids_seen = set()  # กันซ้ำทั่วทั้ง crawl
        for web_travse in links_list:
            web = self.fetch(web_travse)
            if not web:
                continue
            page = 1
            while page <= max_page_per_cate:
                data += self.crawl(web, ids_seen)
                next_page = self.next_page(web)
                if next_page:
                    web = self.fetch(next_page)
                else:
                    break
                page += 1
        print(f"✅ crawl_loop: collected {len(data)} unique items")
        return data


class Export:
    def export_csv(self, data, file_name):
        if not data:
            return
        fieldnames = data[0].keys()
        with open(file_name, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)


class FavoriteRequest(BaseModel):
    game_id: str # เปลี่ยนเป็น str เพื่อให้ตรงกับ ID ที่มาจาก web


# ฟังก์ชั่นค้นหาข้อมูลเต็มตาม id list (ใช้ Action.data_json เสมอ)
def get_full_data_by_ids(ids: list):
    if not ids or not isinstance(ids, list):
        return []

    if not Action.data_json:
        return []

    result = []
    seen_ids = set()
    for item in Action.data_json:
        item_id = str(item.get("ID"))
        if item_id in ids and item_id not in seen_ids:
            result.append(item)
            seen_ids.add(item_id)

    return result


def favorite_data_export(favorite_list):
    try:
        # ลบ id ซ้ำออกก่อน export
        unique_favorite_list = list(dict.fromkeys(favorite_list))
        data = [
            item for item in data_json
            if str(item.get("ID")) in unique_favorite_list
        ]
        if not data:
            return "no favorite data to export"

        df = pd.DataFrame(data)
        df['Tags'] = df['Tags'].apply(
            lambda x: ', '.join(x) if isinstance(x, list) else str(x)
        )
        # บันทึกไปที่ Path ที่ถูกต้อง (Local หรือ /tmp)
        df.to_csv(FAVORITE_CSV_FILE, index=False, encoding='utf-8-sig')
        print(f"Exported {FAVORITE_CSV_FILE} successfully!")
        return "export successfully"
    except Exception as e:
        return f"Error during export: {e}"


def fetch_data():
    """ฟังก์ชันดึงข้อมูลจากเว็บ และ reset global data"""
    try:
        data_fetch = Crawler()
        web = data_fetch.fetch("https://oceanofgames.com/")
        links_cate = data_fetch.crawl_nav(web)
        data_update = data_fetch.crawl_loop(links_list=links_cate)

        # 🔥 reset ข้อมูลเก่า แล้วใช้แต่ข้อมูลใหม่
        Action.data_json = data_update or []
        Action.data_game = pd.DataFrame(Action.data_json)

        # sync ลง CSV จาก Action.data_json
        Action.save_json_to_csv()

        # sync ตัวแปรใน controller ให้ตรงกับ Action ด้วย
        global data, data_json
        data = Action.data_game
        data_json = Action.data_json

        print("✅ Fetch success, total items:", len(Action.data_game))
        return "fetching successfully"

    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"❌ Error while fetching: {e}"


def safe_read_csv(file):
    """อ่าน CSV แบบปลอดภัย ไม่เจอ EmptyDataError"""
    if not os.path.exists(file):
        return pd.DataFrame()  # ยังไม่มีไฟล์
    if os.path.getsize(file) == 0:
        return pd.DataFrame()  # ไฟล์ว่าง
    try:
        return pd.read_csv(file)
    except pd.errors.EmptyDataError:
        return pd.DataFrame()


def save_fetch_time(source="manual"):
    """บันทึกเวลา fetch + สถานะ ลง CSV แบบปลอดภัย และคืนเวลาที่ fetch"""
    result = fetch_data()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_data = pd.DataFrame([{
        "fetch_time": now,
        "status": result,
        "source": source
    }])

    old_data = safe_read_csv(CSV_FILE)
    df = pd.concat([old_data, new_data], ignore_index=True)
    df.to_csv(CSV_FILE, index=False, encoding="utf-8-sig")

    print(f"📝 Logged fetch at {now} | {source} | {result}")
    return now, result  # <-- คืนค่าเวลาที่ fetch เสร็จ

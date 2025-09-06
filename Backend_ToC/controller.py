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


data = Action.data_game
data_json = Action.data_json
categories = Category.category_name[:15]
favorite_list =  []
web = Jinja2Templates(directory="resources/view")


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
    def fetch(self, url):
        web_txt = requests.get(url).text
        return web_txt

    def crawl_nav(self, web_txt):
        regex_nav = r'<li\sid="menu-item-[\d]*"\sclass="menu-[\w]*"><a\shref="([\w:/.-]*)">[\w\s]*<span\sclass="p"></span></a></li>'
        return re.findall(regex_nav, web_txt)

    def next_page(self, web_txt):
        regex_next_page = r'<a\s+class="next"\s+href="([^"]+)">'
        link = re.findall(regex_next_page, web_txt)
        if link:
            return link[0]
        else:
            return

    def crawl(self, web_text):
        posts = []
        titles = re.findall(
            r'<a\sclass="post-thumb\s"\sid="thumb-[\d]*"\shref="[\w:/.-]*"\stitle="([\w\s.]*)">',
            web_text,
        )
        ids = re.findall(r'<a\sclass="post-thumb\s"\sid="thumb-([\d]*)"', web_text)
        imgs = re.findall(
            r'<img\swidth="140"\sheight="140"\ssrc="([\w:/.-]*)"', web_text
        )
        dates = re.findall(
            r'<div\sclass="post-std\sclear-block">[\w\W]*?<div\sclass="post-date"><span\sclass="ext">([\d\s\w]+)</span></div>',
            web_text,
        )
        descriptions = re.findall(
            r'<div\sclass="post-content\sclear-block">[\w\W]*?([\w\W]+?)\s*[(]more&hellip;',
            web_text,
        )
        tag_blocks = re.findall(r'<div class="post-info">([\w\W]*?)</div>', web_text)
        ids_seen = set()
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
                "ID": ids[i].strip() if i < len(ids) else None,
                "Title": titles[i].strip() if i < len(titles) else None,
                "Tags": tags,
                "Image": imgs[i].strip() if i < len(imgs) else None,
                "Date": dates[i].strip() if i < len(dates) else None,
                "Description": (
                    descriptions[i].strip() if i < len(descriptions) else None
                ),
            }
            posts.append(post)

        return posts

    def crawl_loop(self, links_list: list, max_page_per_cate=2):
        data = []
        for web_travse in links_list:
            web = self.fetch(web_travse)
            if not web:
                continue
            page = 1
            while page <= max_page_per_cate:
                data += self.crawl(web)
                next_page = self.next_page(web)
                if next_page:
                    web = self.fetch(next_page)
                else:
                    break
                page += 1
        return data
        print("crawl_loop :",data)

class Export:
    def export_csv(self, data, file_name):
        if not data:
            return
        fieldnames = data[0].keys()
        with open(file_name, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)


def fetch_data():
    data_fetch = Crawler()
    web = data_fetch.fetch("https://oceanofgames.com/")
    links_cate = data_fetch.crawl_nav(web)
    data_update = data_fetch.crawl_loop(links_list=links_cate)
    
    game_update = Action.update_data(data_update)
    global data
    data = game_update
    print(data)
    return "fetching successfully"

# download_data_csv()


class FavoriteRequest(BaseModel):
    game_id: int
    
# ฟังก์ชั่นค้นหาข้อมูลเต็มตาม id list
def get_full_data_by_ids(ids: list):
    """
    รับ ids: list ของ ID (int หรือ str)
    คืนค่าข้อมูลเต็มจาก data_json
    ถ้าไม่มี id ใด match จะ return []
    """
    if not ids or not isinstance(ids, list):
        return []

    # ดักกรณี data_json ว่าง
    if not data_json:
        return []

    result = []
    ids_set = set(str(i) for i in ids)  # แปลงทุก id เป็น string เพื่อให้ตรงกับ data_json

    for item in data_json:
        if str(item.get("ID")) in ids_set:
            result.append(item)

    return result


def favorite_data_export(favorite_list):
    try:
        data = get_full_data_by_ids(favorite_list)
        df = pd.DataFrame(data)
        df['Tags'] = df['Tags'].apply(lambda x: ', '.join(x))
        df.to_csv('favorite.csv', index=False, encoding='utf-8-sig')
        print("Exported data.csv successfully!")
        print("Exported favorite_list.csv successfully.")
        print(data)
        return "export successfully"
    except Exception as e:
        return f"Error during export: {e}"

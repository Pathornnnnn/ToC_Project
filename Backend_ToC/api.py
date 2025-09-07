from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler
import controller as controller 
import sys
import os
from resources.contact import contacts

web = Jinja2Templates(directory="resources/view")

app = FastAPI()
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # เผื่อใช้ 127.0.0.1
    "https://tog-project-eiei.web.app/",  # Firebase Hosting
    "https://tog-project-eiei.web.app",  # Firebase Hosting แบบไม่มี /
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # หรือ ["*"] ถ้าอยากเปิดทุก origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_data(request):
    return request.app.state.data_game

@app.get("/", response_class=HTMLResponse)
async def welcome(request: Request,page: int = 1):
    return controller.home(request, web=web, page=page, limit=8)

@app.get("/get_data_by_category/{category}")
async def get_data(category: str):
    return controller.get_data_by_category(category)

@app.get("/fetch_data")
async def fetch():
    return controller.fetch_data()
    
@app.get("/download_Data_CSV")
async def download():
    return FileResponse("data.csv", media_type="text/csv", filename="data.csv")

@app.get("/download_Data_Favorite_CSV")
async def download():
    controller.favorite_data_export(controller.favorite_list)
    return FileResponse("favorite.csv", media_type="text/csv", filename="favorite.csv")


@app.get("/getdata")
async def get_data():
    return controller.data_json

@app.get("/getcategory")
async def get_category():
    return controller.categories.to_list()

@app.get("/favorite/full")
def get_full_favorites():
    """คืนค่า favorite list แบบเต็ม"""
    full_data = controller.get_full_data_by_ids(controller.favorite_list)
    return full_data

@app.get("/favorite/list")
def get_favorites():
    """คืนค่า favorite list"""
    return {"favorite_list": controller.favorite_list}

@app.post("/favorite/add")
def add_favorite(req: controller.FavoriteRequest):
    """เพิ่มเกมเข้า favorite"""
    game_id = str(req.game_id)
    if game_id not in controller.favorite_list:
        controller.favorite_list.append(game_id)
    return {"favorite_list": controller.favorite_list}

@app.post("/favorite/remove")
def remove_favorite(req: controller.FavoriteRequest):
    """ลบเกมออกจาก favorite"""
    if req.game_id in controller.favorite_list:
        controller.favorite_list.remove(req.game_id)
    return {"favorite_list": controller.favorite_list}


@app.post("/favorite/reset")
def reset_favorites():
    """ลบเกมทั้งหมดใน favorite"""
    controller.favorite_list = []
    return {"favorite_list": controller.favorite_list}

@app.on_event("startup")
def start_scheduler():
    scheduler = BackgroundScheduler()
    # รัน auto fetch ทุกวันเที่ยงคืน
    scheduler.add_job(lambda: controller.save_fetch_time(source="auto"), "cron", hour=0, minute=0)
    scheduler.start()

@app.get("/fetch_now")
def fetch_now():
    """Manual fetch จากปุ่มกด"""
    print("Manual fetch triggered")
    now , result = controller.save_fetch_time(source="manual")
    print("Fetch completed")
    return JSONResponse(content={
        "status": result,
        "message": "Fetched manually!",
        "fetch_time": now  # ต้องแน่ใจว่ามี key นี้
    })

@app.get("/fetch_last_time")
def fetch_last_time():
    df = controller.safe_read_csv("fetch_date.csv")
    if df.empty:
        return JSONResponse(content={"last_fetch": None})
    last_time = df["fetch_time"].iloc[-1]
    return JSONResponse(content={"last_fetch": last_time})

@app.get("/get_contacts")
async def get_contacts():
    return contacts

@app.get("/favorites_count")
def favorites_count():
    # สมมติเก็บ favorites เป็น list หรือใน DB
    count = len(controller.favorite_list)  # หรือวิธีที่คุณเก็บ favorite
    return {"count": count}

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import controller 
import sys



web = Jinja2Templates(directory="resources/view")

app = FastAPI()
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # เผื่อใช้ 127.0.0.1
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # หรือ ["*"] ถ้าอยากเปิดทุก origin
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
    if req.game_id not in controller.favorite_list:
        controller.favorite_list.append(req.game_id)
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
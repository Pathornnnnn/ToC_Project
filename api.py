from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import controller 
import sys



web = Jinja2Templates(directory="resources/view")

app = FastAPI()

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
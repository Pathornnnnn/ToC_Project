import pandas as pd
import numpy as np
import sys 
import os

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

def update_data(data: str):
    data_update = pd.DataFrame(data)
    data_update.to_csv('./data.csv', index=False)
    global data_game , data_json
    data_game = pd.read_csv('./data.csv')
    df = pd.read_csv('./data.csv')
    df = df.replace([np.inf, -np.inf], np.nan)
    df["Tags"] = df["Tags"].apply(lambda x: [tag.strip() for tag in x.split(",")] if x else [])
    df = df.where(pd.notnull(df), None)
    data_json = df.to_dict(orient="records")
    return data_game
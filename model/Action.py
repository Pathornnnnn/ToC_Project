import pandas as pd
import sys 

data_game = pd.read_csv('data.csv')



def get_data_category(category: str):
    data_by_cate = data_game[data_game["Tags"].str.contains(category)]
    return data_by_cate.to_dict(orient="records")

def update_data(data: str):
    data_update = pd.DataFrame(data)
    data_update.to_csv('data.csv', index=False)
    global data_game
    data_game = pd.read_csv('data.csv')

    return data_game
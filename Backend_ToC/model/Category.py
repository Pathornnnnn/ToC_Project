import pandas as pd
import sys

category = pd.read_csv('filtered.csv')
category['id'] = category.reset_index().index + 1

id = category['id']
category_name = category['Tags']

db_category = {"id": id,
            "category_name": category_name}

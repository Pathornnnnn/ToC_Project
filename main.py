import re
from bs4 import BeautifulSoup
import requests

'''
Link
https://oceansofgamess.com/
'''

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

url = 'https://oceansofgamess.com/'


#Category Link export to links.txt
web = requests.get(url, headers=headers)
txt = BeautifulSoup(web.text, 'html.parser')
filter_ul = txt.find_all(['ul'], id='menu-menu')

with open('links.txt', 'w',encoding='utf-8') as txt:
        for filter in filter_ul:
            f = filter.find_all(['li'], class_=re.compile('^menu-*'))
            for link in f:
                add_link = link.find('a')
                txt.write(f'{add_link.get('href')}\n')

import re
from bs4 import BeautifulSoup
import requests
import pandas as pd 

'''
Link
https://oceansofgamess.com/
'''

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

url = 'https://oceansofgamess.com/'

web = requests.get(url, headers=headers)
txt = BeautifulSoup(web.text, 'html.parser')
filter_ul = txt.find_all(['ul'], id='menu-menu')

links = []
for filter in filter_ul:
    f = filter.find_all(['li'], class_=re.compile(r'menu-\D+'))
    for link in f:
        add_link = link.find('a')
        links.append(add_link.get('href'))
links.pop(0)

post_to_csv = []
post_seen = set()

for link_web in links:
    url = link_web
    while True:
        web = requests.get(url, headers=headers)
        html = BeautifulSoup(web.text, 'html.parser')
        cp_post = html.find_all('div', id=re.compile(r'^post-\d+'))

        if not cp_post:
            break

        for post in cp_post: 
            post_title = post.find('h2', class_="title")
            title_text = post_title.get_text(strip=True) if post_title else ' '

            #check duplicate
            if title_text in post_seen:
                continue
            post_seen.add(title_text)

            post_img = post.find('img', class_='attachment-140x140')
            img_text = post_img.get('src') if post_img else " "

            post_date = post.find('div', class_='post-date')
            date_text = post_date.get_text(strip=True) if post_date else ' '

            post_info = post.find('div', class_='post-info')
            if post_info:
                cate = post_info.find_all('a', attrs={'title': True})
                cate_text = ', '.join(i.get_text(strip=True)for i in cate)
            else:
                cate_text = ' '

            post_content = post.find('div', class_='post-content')
            content_text = post_content.get_text(strip=True) if post_content else ' '
            
            post_to_csv.append({
                "Title": title_text,
                "Img": img_text,
                "Date": date_text,
                "Category": cate_text,
                "Content" : content_text
            })

        #next
        next = html.find('a', class_='next')
        if next and next.get('href'):
            url = next['href']
        else:
            break

df = pd.DataFrame(post_to_csv)
df.to_csv("data.csv", index=False, encoding="utf-8-sig")
print(f"saved")

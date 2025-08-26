import requests
import re
import pandas as pd

url1 = "https://oceanofgames.com/"
web = requests.get(url1).text

navbar = r'<li\sid="menu-item-[\d]*"\sclass="menu-[\w]*"><a\shref="([\w:/.-]*)">[\w\s]*<span\sclass="p"></span></a></li>'
links = re.findall(navbar, web)

all_posts = []
ids_seen = set()
url_seen = set()
for link in links:
    url2 = link
    while True:
        if url2 in url_seen:
            break
        url_seen.add(url2)
        div = requests.get(url2).text
        if not div:
            break
        titles = re.findall(r'<a\sclass="post-thumb\s"\sid="thumb-[\d]*"\shref="[\w:/.-]*"\stitle="([\w\s.]*)">', div)
        id = re.findall(r'<a\sclass="post-thumb\s"\sid="thumb-([\d]*)"', div)
        imgs = re.findall(r'<img\swidth="140"\sheight="140"\ssrc="([\w:/.-]*)"', div)
        dates = re.findall(r'<div\sclass="post-std\sclear-block">[\w\W]*?<div\sclass="post-date"><span\sclass="ext">([\d\s\w]+)</span></div>', div)
        descriptions = re.findall(r'<div\sclass="post-content\sclear-block">[\w\W]*?([\w\W]+?)\s*[(]more&hellip;', div)
        tag_blocks = re.findall(r'<div class="post-info">([\w\W]*?)</div>', div)

        for i in range(len(titles)):
            if id[i] in ids_seen:
                continue
            ids_seen.add(id[i])
            tags = re.findall(r'\srel="tag"\stitle="([\w]+)', tag_blocks[i]) if i < len(tag_blocks) else []
            post = {
                "ID": id[i].strip() if i < len(id) else None,
                "Title": titles[i].strip()if i < len(titles) else None,
                "Tags": tags,
                "Image": imgs[i].strip()if i < len(imgs) else None,
                "Date": dates[i].strip()if i < len(dates) else None,
                "Description": descriptions[i].strip()if i < len(descriptions) else None,
            }
            all_posts.append(post)
            
        next_page = re.findall(r'<a\s+class="next"\s+href="([^"]+)">', div)
        if next_page:
            url2 = next_page[0]
        else:
            break

df = pd.DataFrame(all_posts)
df.to_csv("data.csv", index=False, encoding="utf-8-sig")
print(f"saved")
    
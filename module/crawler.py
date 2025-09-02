import re
import requests


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
            return "None"

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

        for i in range(len(titles)):
            tags = (
                re.findall(r'\srel="tag"\stitle="([\w]+)', tag_blocks[i])
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

    def crawl_loop(self, links_list: list, max_post_per_cate=10):
        url = links_list
        for web_travse in url:
            pass

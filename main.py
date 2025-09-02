from module import *

crawler = Crawler()
exporter = Export()
url = "https://oceanofgames.com/"
data = crawler.crawl_loop(crawler.crawl_nav(crawler.fetch(url)), max_post_per_cate=10)

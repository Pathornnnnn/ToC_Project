from module import *

crawler = Crawler()
exporter = Export()
url = "https://oceanofgames.com/"


# Sample
web = crawler.fetch(url)
links_cate = crawler.crawl_nav(web)
data = crawler.crawl_loop(links_list=links_cate)
exporter.export_csv(data, "data.csv")

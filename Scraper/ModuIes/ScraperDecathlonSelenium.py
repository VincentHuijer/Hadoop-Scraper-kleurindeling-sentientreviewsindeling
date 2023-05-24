import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument("--window-size=1920,1200")

driver = webdriver.Chrome(options=options)

url = 'https://www.decathlon.nl/browse/c0-heren-sportkleding/nature-t-shirt-korte-mouwen/_/N-178c3k0Z6d5bkr'
driver.get(url)

time.sleep(5)
driver.findElement(By.xpath('//*[@id="didomi-notice-agree-button"]')).click()
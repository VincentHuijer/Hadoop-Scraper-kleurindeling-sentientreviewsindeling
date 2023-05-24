import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up the Chrome webdriver and options
options = Options()
options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)
driver = webdriver.Chrome(options=options)

# Set up the URL to scrape
url = 'https://www.amazon.nl/s?bbn=16392189031&rh=n%3A16392189031%2Cp_n_feature_three_browse-bin%3A16391163031&dc&qid=1680695556&rnid=16390852031&ref=lp_16392189031_nr_p_n_feature_three_browse-bin_1'

# Load the webpage and wait for the first result to appear
driver.get(url)
wait = WebDriverWait(driver, 10)
first_result = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-component-type="s-search-result"]')))

# Scroll down to the bottom of the page to load all results
SCROLL_PAUSE_TIME = 2
last_height = driver.execute_script("return document.body.scrollHeight")
while True:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(SCROLL_PAUSE_TIME)
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

# Find all t-shirt links on the page
t_shirt_links = driver.find_elements(By.CSS_SELECTOR, '.s-result-item.s-asin a')

# Set up the CSV file to write to
csv_file = open('t_shirt_reviews555.csv', 'w', newline='', encoding='utf-8')
writer = csv.writer(csv_file)

# Write headers to CSV file
writer.writerow(['T-Shirt Name', 'Image Link', 'Review'])

# Iterate through each t-shirt link and scrape the name, image link, and reviews
for t_shirt_link in t_shirt_links:
    # Click on the t-shirt link to load the t-shirt's page
    t_shirt_link.click()
    time.sleep(2)  # Wait for the page to load

    # Find the t-shirt name and image link
    t_shirt_name = driver.find_element(By.ID, 'productTitle').text.strip()
    try:
        t_shirt_image = driver.find_element(By.CSS_SELECTOR, '.imgTagWrapper img[src*="500x500"]').get_attribute('src')
    except:
        t_shirt_image = ""

    # Find all reviews and write each one to the CSV file
    reviews = driver.find_elements(By.CSS_SELECTOR, '.review-text-content span')
    for review in reviews:
        if len(review.text.split()) >= 100:  # Only include reviews with 100 or more words
            writer.writerow([t_shirt_name, t_shirt_image, review.text.strip()])

    # Go back to the previous page to continue scraping
    driver.execute_script("window.history.go(-1)")
    time.sleep(2)  # Wait for the page to load

# Close the CSV file and Chrome webdriver
csv_file.close()
driver.quit()

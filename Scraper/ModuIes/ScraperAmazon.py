import requests
from bs4 import BeautifulSoup
import csv

url = "https://www.amazon.nl/s?bbn=16392189031&rh=n%3A16392189031%2Cp_n_feature_three_browse-bin%3A16391163031&dc&qid=1680695556&rnid=16390852031&ref=lp_16392189031_nr_p_n_feature_three_browse-bin_1"

response = requests.get(url)
html_content = response.content

soup = BeautifulSoup(html_content, "html.parser")
product_links = soup.select("a.a-link-normal.a-text-normal")

# Define a function to extract all reviews and images from a product page
def extract_product_data(url):
    response = requests.get(url)
    html_content = response.content
    soup = BeautifulSoup(html_content, "html.parser")

    # Extract product details
    title = soup.select_one("#productTitle").get_text().strip()
    description = soup.select_one("#feature-bullets ul").get_text().strip()
    price = soup.select_one("#priceblock_ourprice").get_text().strip()

    # Extract reviews with at least 100 words
    reviews = []
    for review in soup.select(".review-text-content"):
        text = review.get_text().strip()
        if len(text.split()) >= 100:
            reviews.append(text)

    # Extract images with width and height of 500 pixels
    images = []
    for img in soup.select("img"):
        if "s-image" in img.get("class", []):
            width = int(img.get("width", 0))
            height = int(img.get("height", 0))
            if width == height == 500:
                images.append(img.get("src"))

    # Return a dictionary containing all the extracted data
    return {
        "title": title,
        "description": description,
        "price": price,
        "reviews": reviews,
        "images": images
    }

# Open the CSV file and write the headers
with open("AmazonTshirts.csv", mode="w", newline="", encoding="utf-8") as csv_file:
    fieldnames = ["title", "description", "price", "review", "image_url"]
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    # Loop through all the product links and extract data from each product page
    for link in product_links:
        if "amazon.nl/dp/" in link["href"]:
            product_page_data = extract_product_data(link["href"])

            # Write reviews to the CSV file
            for review in product_page_data["reviews"]:
                writer.writerow({
                    "title": product_page_data["title"],
                    "description": product_page_data["description"],
                    "price": product_page_data["price"],
                    "review": review,
                    "image_url": ""
                })

            # Write images to the CSV file
            for image_url in product_page_data["images"]:
                writer.writerow({
                    "title": product_page_data["title"],
                    "description": product_page_data["description"],
                    "price": product_page_data["price"],
                    "review": "",
                    "image_url": image_url
                })

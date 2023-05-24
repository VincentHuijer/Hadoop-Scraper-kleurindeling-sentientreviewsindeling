from bs4 import BeautifulSoup
import requests
import csv

headers = {'User-Agent': 'Mozilla/5.0'}

url = 'https://www.decathlon.nl/browse/c0-heren-sportkleding/nature-t-shirt-korte-mouwen/_/N-178c3k0Z6d5bkr'
response = requests.get(url, headers=headers)
html_content = response.content

soup = BeautifulSoup(html_content, 'html.parser')
t_shirts = soup.find_all('div', class_='product-card')

print(soup)


# Create the CSV file and write the headers
with open('DecathlonTshirts.csv', mode='w', newline='') as csv_file:
    fieldnames = ['title', 'review', 'image_url']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    for t_shirt in t_shirts:
        title = t_shirt.find('h2', role='listitem').text.strip()
        url = t_shirt.find('a', class_='product-card__anchor')['href']

        # Send a GET request to the t-shirt's URL
        t_shirt_response = requests.get(url)
        t_shirt_html_content = t_shirt_response.content

        # Parse the HTML content and find the reviews and images
        t_shirt_soup = BeautifulSoup(t_shirt_html_content, 'html.parser')
        reviews = t_shirt_soup.find_all('div', class_='review__text')
        images = t_shirt_soup.find_all('img', class_='media__img')

        # Loop through the reviews and extract those with at least 100 words
        for review in reviews:
            if len(review.text.split()) >= 100:
                writer.writerow({
                    'title': title,
                    'review': review.text.strip(),
                    'image_url': ''
                })

        # Loop through the images and extract their URLs
        for image in images:
            writer.writerow({
                'title': title,
                'review': '',
                'image_url': image['src']
            })

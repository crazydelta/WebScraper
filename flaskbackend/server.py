from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests
import csv
import json
import os

app = Flask(__name__)

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    file= data.get('file')
    directory = data.get('directory')

    if not url or not directory:
        return jsonify({'error': 'URL and directory are required'}), 400

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract data
        extracted_data = []
        for tag in soup.find_all(True):  # find_all(True) finds all tags
            tag_data = {
                'tag': tag.name,
                'attributes': tag.attrs,
                'text': tag.get_text(strip=True)
            }
            extracted_data.append(tag_data)

        # Ensure directory exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Define file paths
        csv_file_path = os.path.join(directory, f'{file}.csv')
        json_file_path = os.path.join(directory, f'{file}.json')

        # Save data to CSV
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
            fieldnames = ['tag', 'attributes', 'text']
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
            for item in extracted_data:
                writer.writerow(item)

        # Save data to JSON
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(extracted_data, json_file, indent=4, ensure_ascii=False)

        return jsonify({'message': f'Files saved to {directory}'}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

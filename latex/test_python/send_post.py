import requests

files = {'upload_file': open('coug.mp3','rb')}
#files = {'upload_file': open('coug.mp3','rb'), 'upload_file2': open('coug.mp3','rb')} # Contoh Multifile
values = {'DB': 'photcat', 'OUT': 'csv', 'SHORT': 'short'}

r = requests.post("https://webhook.site/d717402a-4a8a-4c81-a6d2-af0f6bef2085", files=files, data=values)
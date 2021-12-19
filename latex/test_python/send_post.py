import requests

#files = {'upload_file': open('coug.mp3','rb'), 'upload_file2': open('coug.mp3','rb')} # Contoh Multifile
files = {'file_batuk': open('coug.mp3','rb')}
values = {'nama': 'pasien', 'gender': 'unknown', 'umur': 0}

r = requests.post("http://10.124.5.198/api/device/sendData/303", files=files, data=values)

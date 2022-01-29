#!/usr/bin/env python
# -*- coding: utf-8 -*-

# example usage
#python send_wav.py covid_dataset/wav_normalized/0aa64689-c48a-421d-b353-c3496bad51ed.wav

import os
import sys
import requests

wavrecfile = sys.argv[1]
servertarget = "http://103.147.32.143"
recserver = servertarget + "/api/device/sendData/303"

if os.path.exists(wavrecfile):
    print("Sending:" + wavrecfile + "to: " + recserver)
    files = {'file_batuk': open(wavrecfile,"rb")}
    values = {'nama': 'pasien', 'gender': 'unknown', 'umur': 0}
    requests.post(recserver,files=files, data=values)
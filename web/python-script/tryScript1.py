import librosa as lb
import numpy as np
import tensorflow as tf
from tensorflow import keras
import time
import sys

start_time = time.time()
# Folder Web = /usr/src/app/

sound, sample_rate = lb.load("/usr/src/app/public/uploads/batuk/" + sys.argv[1])
model = keras.models.load_model("./python-script/saved-model/cough_01.h5")

stft = np.abs(lb.stft(sound))  
mfccs = np.mean(lb.feature.mfcc(y=sound, sr=sample_rate, n_mfcc=40),axis=1)
chroma = np.mean(lb.feature.chroma_stft(S=stft, sr=sample_rate),axis=1)
mel = np.mean(lb.feature.melspectrogram(sound, sr=sample_rate),axis=1)
contrast = np.mean(lb.feature.spectral_contrast(S=stft, sr=sample_rate),axis=1)
tonnetz = np.mean(lb.feature.tonnetz(y=lb.effects.harmonic(sound), sr=sample_rate),axis=1)
concat = np.concatenate((mfccs,chroma,mel,contrast,tonnetz))

images_tes = np.array(concat)
images_tes = np.reshape(images_tes, (1, images_tes.shape[0], 1))

preds = model.predict(images_tes)
classpreds = np.argmax(preds, axis=1)

if (classpreds == 0):
        print("cough")
elif (classpreds== 1):
        print("talk")

print("--- %s seconds ---" % (time.time() - start_time))
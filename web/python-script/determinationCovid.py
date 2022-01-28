import glob
import os
import librosa
import numpy as np
import ntpath

from keras.models import Sequential
from keras.layers import Dense, Activation, Flatten, LSTM, Flatten, InputLayer, Conv1D, MaxPooling1D
from keras.layers import Dropout, BatchNormalization, Bidirectional
from sklearn.model_selection import train_test_split  
from tensorflow.keras.utils import plot_model,to_categorical
import time

import pandas as pd  
import matplotlib.pyplot as plt
from keras.callbacks import EarlyStopping, ModelCheckpoint

import random as rn
import tensorflow as tf

import sys

start_time = time.time()

def extract_feature(file_name):
    X, sample_rate = librosa.load(file_name)
    mfcc = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40), axis=1)
    return mfcc

def parse_audio_files(filename):
    features = []
    extracted = extract_feature(filename)
    features.append(extracted) 
    return np.array(features)

def create_model():  
    model = Sequential()
    model.add(BatchNormalization(axis=-1, input_shape=(X.shape[1], X.shape[2]))) 
    model.add(LSTM(64, return_sequences=(True)))
    model.add(LSTM(128, return_sequences=True))
    model.add(LSTM(256))
    model.add(Flatten())
    model.add(Dropout(0.2))
    model.add(Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy', metrics=['accuracy'])  
    return model

X = parse_audio_files("/usr/src/app/public/uploads/batuk/" + sys.argv[1])
X = X.reshape((X.shape[0], 1, X.shape[1]))

model = create_model()
model.load_weights('./python-script/saved-model/model_covid.h5')

classes = model.predict(X)
selisih_to_0 = abs(0-classes[0][0])
selisih_to_1 = abs(1-classes[0][0])
if(min(selisih_to_0, selisih_to_1) == selisih_to_0):
    print(0)
else:
    print(1)

print("Execution Covid Script : --- %s seconds ---" % (time.time() - start_time))
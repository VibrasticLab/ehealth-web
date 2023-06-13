FROM tensorflow/tensorflow

RUN apt-get update -yq \
    && apt-get -yq install curl gnupg ca-certificates zip \
    && curl -L https://deb.nodesource.com/setup_12.x | bash \
    && apt-get update -yq \
    && apt-get install -yq \
        dh-autoreconf=19 \
        nodejs build-essential gcc libsndfile1

RUN if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi
RUN python3 -m pip install --upgrade pip

RUN pip install tensorflow
RUN pip install numpy
RUN pip install matplotlib
RUN pip install seaborn
RUN pip install librosa==0.9.2

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --verbose

COPY . .

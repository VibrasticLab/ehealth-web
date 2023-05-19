# ehealth-web

This is a development repository for webserver as central data and IoT system for our e-Health management system.

## Deployment

### Check machine's IP

```sh
ifconfig
```

### Docker Install
To deploy in Linux/Unix servers, a docker container system need to be installed.
For example in Arch-Linux

```sh
sudo pacman -S docker docker-compose
```

then try to run using minimum setting:

```sh
sudo groupadd -f docker
sudo gpasswd -a $USER docker

# temporarily reload group
newgrp docker

sudo systemctl enable docker.service
sudo systemctl start docker.service
```

### Change Docker Root Path

~~~sh
sudo systemctl stop docker

mkdir -p /path/to/your/docker
sudo chown -R root:root /path/to/your/docker
sudo touch /etc/docker/daemon.json

echo '
{
    "data-root": "/path/to/your/docker"
}' | sudo tee /etc/docker/daemon.json

sudo rsync -aP /var/lib/docker/ /path/to/your/docker

sudo systemctl start docker
~~~

### Service Image deployment

First, clone this repository

~~~sh
git clone https://github.com/VibrasticLab/ehealth-web.git
~~~

then, build the image into container:

~~~sh
cd ehealth-web/
docker-compose up --build
~~~

if need to update:

~~~sh
docker-compose down
docker-compose up --build
~~~

and if need to run as background daemon:

~~~sh
docker-compose down
docker-compose up -d --build
~~~

log server

~~~sh
docker-compose logs -f
~~~

kill all docker:

~~~sh
sudo docker kill $(sudo docker ps -q)
~~~

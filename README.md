# ehealth-web

This is a development repository for webserver as central data and IoT system for our e-Health management system.

### Deployment

##### Docker Install
To deploy in Linux/Unix servers, a docker container system need to be installed.
For example in Arch-Linux

```
sudo pacman -S docker docker-compose
```

then try to run using minimum setting:
```
sudo groupadd -f docker
sudo gpasswd -a $USER docker

sudo systemctl enable docker.service
sudo systemctl start docker.service
```

##### Change Docker Root Path

~~~
udo systemctl stop docker

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

##### Service Image deployment

First, clone this repository
~~~
git clone https://github.com/VibrasticLab/ehealth-web.git
~~~

then, build the image into container
~~~
cd ehealth-web/
docker-compose up --build
~~~

if need to update
~~~
docker-compose down
docker-compose up --build
~~~

and if need to run as background daemon
~~~
docker-compose down
docker-compose up -d --build
~~~

log server
~~~
docker-compose logs -f
~~~

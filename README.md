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
echo "loop" | sudo tee /etc/modules-load.d/loop.conf
sudo modprobe loop

sudo groupadd -f docker
sudo gpasswd -a $USER docker

sudo systemctl enable docker.service
sudo systemctl start docker.service
```

##### Service Image deployment

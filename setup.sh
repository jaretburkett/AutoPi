#!/bin/bash

# install nodejs and tools
sudo apt-get update
sudo apt-get remove nodejs nodejs-legacy -y
sudo apt-get remove npm -y
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm install yarn -g
sudo npm install forever -g


# install chromium browser
sudo apt-get install chromium-browser -y

#install packages
cd /opt/AutoPi && yarn install
sudo yarn buildReact

#install matchbox
sudo apt-get install -y matchbox matchbox-window-manager xorg xinit unclutter fbi insserv

#tell pi to boot into gui and turn on componets
echo ""
echo ""
echo "Setting config.txt settings"
echo ""
echo ""

echo "disable_splash=1" | sudo tee -a /boot/config.txt
echo "avoid_warnings=1" | sudo tee -a /boot/config.txt


#boot using matchbox
echo '#!/bin/bash' >> /home/pi/startAutopi.sh
echo 'xset s off' >> /home/pi/startAutopi.sh
echo 'xset s noblank' >> /home/pi/startAutopi.sh
echo 'xset -dpms' >> /home/pi/startAutopi.sh
echo 'unclutter -idle 0.01 &' >> /home/pi/startAutopi.sh
echo 'matchbox-window-manager -use_cursor no -use_titlebar no &' >> /home/pi/startAutopi.sh
echo 'chromium-browser --noerrdialogs --kiosk --incognito http://localhost:8080' >> /home/pi/startAutopi.sh

chmod +x /home/pi/startAutopi.sh

sudo cp /opt/AutoPi/pifiles/splashscreen.service /etc/systemd/system/splashscreen.service
sudo systemctl enable splashscreen

#quiet boot
sudo mkdir /apbackup
sudo cp /boot/cmdline.txt /apbackup/cmdline.txt
sudo sed -i 's/ root=/ loglevel=0 root=/g' /boot/cmdline.txt
sudo sed -i 's/ rootwait/ rootwait logo.nologo quiet splash vt.global_cursor_default=0/g' /boot/cmdline.txt

#clear text from screen so we dont see it on boot
sudo sed -i '/fi/a clear' /etc/rc.local
sudo sed -i '/clear/a /usr/bin/forever start /opt/AutoPi/index.js' /etc/rc.local
sudo sed -i '/^exit 0/c\chmod g+rw /dev/tty?\nexit 0' /etc/rc.local

echo "if [ -z \"\${SSH_TTY}\" ]; then" | sudo tee -a /home/pi/.bashrc
echo "    xinit ~/startAutopi.sh" | sudo tee -a /home/pi/.bashrc
echo "fi" | sudo tee -a /home/pi/.bashrc

sudo gpasswd -a pi tty

#make update alias
echo "alias autopi-update='cd /opt/AutoPi && sudo git fetch --all && sudo git reset --hard origin/master && sudo yarn install && sudo yarn buildReact && sudo reboot'" | sudo tee -a /etc/bash.bashrc

echo ""
echo "Well, that is all. You probably want to reboot now using sudo reboot"
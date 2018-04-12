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

#install chromium
#wget http://launchpadlibrarian.net/219267135/chromium-codecs-ffmpeg-extra_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#wget http://launchpadlibrarian.net/219267133/chromium-browser_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#
#sudo dpkg -i libgcrypt11_1.5.3-2ubuntu4.2_armhf.deb
#sudo dpkg -i chromium-codecs-ffmpeg-extra_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#sudo dpkg -i chromium-browser_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#
#sudo rm libgcrypt11_1.5.3-2ubuntu4.2_armhf.deb
#sudo rm chromium-codecs-ffmpeg-extra_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#sudo rm chromium-browser_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb

# install chromium browser
sudo apt-get install chromium-browser -y

#install packages
cd /opt/AutoPi && yarn install

#install matchbox
sudo apt-get install -y matchbox-window-manager xorg xinit unclutter fbi

#set chromium on boot
#sed -i 's/@xscreensaver -no-splash/#@xscreensaver -no-splash/g' /home/pi/.config/lxsession/LXDE-pi/autostart
#echo '@xset s off' >> /home/pi/.config/lxsession/LXDE-pi/autostart
#echo '@xset s noblank' >> /home/pi/.config/lxsession/LXDE-pi/autostart
#echo '@xset -dpms' >> /home/pi/.config/lxsession/LXDE-pi/autostart
#echo '@chromium-browser --noerrdialogs --kiosk --incognito http://localhost:8080' >> /home/pi/.config/lxsession/LXDE-pi/autostart

#tell pi to boot into gui and turn on componets
echo ""
echo ""
echo "Setting config.txt settings"
echo ""
echo ""
#boot to x server
echo "start_x=1" | sudo tee -a /boot/config.txt
#hide power warning
echo "avoid_warnings=1" | sudo tee -a /boot/config.txt


#boot using matchbox
echo '#!/bin/bash' >> /home/pi/.xsession
echo 'xset s off' >> /home/pi/.xsession
echo 'xset s noblank' >> /home/pi/.xsession
echo 'xset -dpms' >> /home/pi/.xsession
echo 'chromium-browser --noerrdialogs --kiosk --incognito http://localhost:8080 &' >> /home/pi/.xsession
echo 'exec matchbox-window-manager  -use_titlebar no' >> /home/pi/.xsession

#prevent screen off
## todo file is not there, is this needed?
echo "BLANK_TIME=0" >> /etc/kbd/config
echo "POWERDOWN_TIME=0" >> /etc/kbd/config

#quiet boot
sudo mkdir /apbackup
sudo cp /lib/lsb/init-functions /apbackup/init-functions
sudo cp /etc/init.d/dphys-swapfile /apbackup/dphys-swapfile
sudo cp /etc/init.d/fake-hwclock /apbackup/fake-hwclock
sudo cp /lib/lsb/init-functions.d/20-left-info-blocks /apbackup/20-left-info-blocks

sudo sed -i 's/ echo/# echo/g' /lib/lsb/init-functions
sudo sed -i 's/ \/bin\/echo/# \/bin\/echo/g' /lib/lsb/init-functions
sudo sed -i 's/ echo/# echo/g' /etc/init.d/dphys-swapfile
sudo sed -i 's/ \/bin\/echo/# \/bin\/echo/g' /etc/init.d/dphys-swapfile
sudo sed -i 's/ echo "S/# echo "S/g' /etc/init.d/fake-hwclock
sudo sed -i 's/ \/bin\/echo/# \/bin\/echo/g' /lib/lsb/init-functions.d/20-left-info-blocks

# autostart node
sudo cp /opt/AutoPi/pifiles/startautopi /etc/init.d/startautopi
sudo chmod a+x /etc/init.d/startautopi
#sudo insserv /etc/init.d/startautopi
sudo update-rc.d startautopi defaults

#setup splash screen
sudo cp /opt/AutoPi/pifiles/aaautopisplash /etc/init.d/aaautopisplash
sudo chmod a+x /etc/init.d/aaautopisplash
sudo update-rc.d aaautopisplash defaults

#sudo insserv /etc/init.d/aaautopisplash
#clear text from screen so we dont see it on boot
sudo sed -i '/fi/a clear' /etc/rc.local

# set github master
#cd /opt/AutoPi && git fetch --all && git reset --hard origin/master

#make update alias
echo "alias autopi-update='cd /opt/AutoPi && sudo git fetch --all && sudo git reset --hard origin/master && sudo yarn install && sudo reboot'" | sudo tee -a /etc/bash.bashrc

echo ""
echo "Well, that is all. You probably want to reboot now using sudo reboot"
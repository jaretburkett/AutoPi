#!/bin/sh
#setup tft display
echo 'max_usb_current=1' >> /boot/config.txt
echo 'hdmi_group=2' >> /boot/config.txt
echo 'hdmi_mode=87' >> /boot/config.txt
echo 'hdmi_cvt=800 480 60 6 0 0 0' >> /boot/config.txt
wget http://www.waveshare.com/w/upload/3/3d/LCD-show-160811.tar.gz
tar xzvf LCD-show-160811.tar.gz
rm LCD-show-160811.tar.gz
#run if after removing forced reboot
cd LCD-show && sed -i 's/sudo reboot/#sudo reboot/g' LCD5-show && sudo ./LCD5-show && cd .. && rm -rf LCD-show

#update apt-get
apt-get update

#replace syslog with busybox
apt-get install busybox-syslogd
dpkg --purge rsyslog

#remove problem packages
apt-get remove --purge logrotate dphys-swapfile

#move random seed file to tmp system
rm /var/lib/systemd/random-seed
ln -s /tmp/random-seed /var/lib/systemd/random-seed

#create random seed file on boot
sed -i '/RemainAfterExit=yes/a ExecStartPre=/bin/echo "" >\/tmp\/random-seed' /lib/systemd/system/systemd-random-seed.service

#disable filesystem check and swap
sed -i 's/rootfstype=ext4/rootfstype=ext4 fastboot noswap ro/g' /boot/cmdline.txt

echo 'tmpfs           /tmp            tmpfs   nosuid,nodev         0       0' >> /etc/fstab
echo 'tmpfs           /var/log        tmpfs   nosuid,nodev         0       0' >> /etc/fstab
echo 'tmpfs           /var/tmp        tmpfs   nosuid,nodev         0       0' >> /etc/fstab

# set easy way to lock the filesystem in readonly and show in command prompt
echo '# set variable identifying the filesystem you work in (used in the prompt below)' >> /etc/bash.bashrc
echo 'set_bash_prompt(){' >> /etc/bash.bashrc
echo '    fs_mode=$(mount | sed -n -e "s/^\/dev\/.* on \/ .*(\(r[w|o]\).*/\1/p")' >> /etc/bash.bashrc
echo "    PS1='\\[\\033[01;32m\\]\\u@\\h\${fs_mode:+(\$fs_mode)}\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '" >> /etc/bash.bashrc
echo '}' >> /etc/bash.bashrc
echo "alias ro='sudo mount -o remount,ro / ; sudo mount -o remount,ro /boot'" >> /etc/bash.bashrc
echo "alias rw='sudo mount -o remount,rw / ; sudo mount -o remount,rw /boot'" >> /etc/bash.bashrc
echo '# setup fancy prompt' >> /etc/bash.bashrc
echo 'PROMPT_COMMAND=set_bash_prompt' >> /etc/bash.bashrc

#install chromium
#wget http://launchpadlibrarian.net/201290259/libgcrypt11_1.5.3-2ubuntu4.2_armhf.deb
#wget http://launchpadlibrarian.net/219267135/chromium-codecs-ffmpeg-extra_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#wget http://launchpadlibrarian.net/219267133/chromium-browser_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb

#sudo dpkg -i libgcrypt11_1.5.3-2ubuntu4.2_armhf.deb
#sudo dpkg -i chromium-codecs-ffmpeg-extra_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#sudo dpkg -i chromium-browser_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb

#sudo rm libgcrypt11_1.5.3-2ubuntu4.2_armhf.deb
#sudo rm chromium-codecs-ffmpeg-extra_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb
#sudo rm chromium-browser_45.0.2454.101-0ubuntu0.14.04.1.1099_armhf.deb

#install packages
sudo apt-get remove nodered -y
sudo apt-get remove nodejs nodejs-legacy -y
sudo apt-get remove npm -y
sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install -y nodejs

sudo apt-get install unclutter -y
sudo apt-get -f install -y
sudo npm install

echo ""
echo "Well, that is all. You probably want to reboot now using sudo reboot"
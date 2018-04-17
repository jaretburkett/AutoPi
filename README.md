# Auto Pi

![alt text](https://github.com/jaretburkett/AutoPi/raw/master/pifiles/splash480.png "Auto Pi")

# Under Construction

To install run the following command on a fresh version of Raspbian streatch

```
sudo curl -sL https://raw.githubusercontent.com/jaretburkett/AutoPi/master/remoteinstall | sudo bash -
```
### Important!

Currently, you must set autologin to console for this to work. Still working on a workaround;

### Notes

To rotate official pi display add the following to /boot/config.txt
```
lcd_rotate=2
```
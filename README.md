# Projet Mobile Hybrid: server

## Autors
* robert_u (Thomas Robert de Saint Vincent)
* vibrac_b (Benjamin Vibrac)

## About the project:
This is a game in development at a stage before a pre-alpha, that's why the game rules are not all implemented.
We imagine this game like a sim-city but with an aspect of community, which mean that in a close future, players would need help from other people in order to make the city grow by building relationships between cities.
Thanks to the module we plan to make the game happen.

## Prerequisites
* npm
* ionic
* cordova
* APK android

## How to make it works:
```
$ npm install
```
then :
```
$ ionic cordova run android
```
*If your device is linked to the computer or if you have an android emulator already setup.*

You also need the [server](https://github.com/desaintvincent/mobile_server.git)

##Technicals features :

* All the graphical part of the games is based on Canvas without any AngularJs and is made without external library.
* For the connection and the user management is base on Firebase.
* There is a share option to send a pre-write message to your contact to make them come play the game

##Known Bugs:
* When try to connect to Google after register by email with the same email, game doesn't start.
* On some devices, the countdown during building appears filled all time.


##Control of the game:
* Move the map: Slide
* Zoom: Pinch
* Select a tile: Tap
* Open menu of curent tile: Long press
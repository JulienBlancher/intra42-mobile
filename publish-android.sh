#!/bin/sh

cordova build --release android
cd platforms/android/build
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore/intra42.keystore outputs/apk/android-release-unsigned.apk intra42
cd outputs/apk
rm intra42.apk
zipalign -v 4 android-release-unsigned.apk intra42.apk

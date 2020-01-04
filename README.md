# Ngobrol Dong App

Ngobrol is chat application that user track friends location, built with React Native integrated with Firebase and Mapbox

<div align='center'>
    <img title="MIT license" src="https://res.cloudinary.com/iyansrcloud/image/upload/v1578126208/screenshot/banner_fwvuaf.png"                    width='700'>
</div>


<div align='center'>
  <a href="https://opensource.org/licenses/MIT">
    <img title="MIT license" src="http://img.shields.io/badge/license-MIT-brightgreen.svg">
  </a>
  <a href="#">
    <img title="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=102">
  </a>
   <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
</div>

---

## Features

- List Users
- Chat
- Edit Profile
- Upload Image
- Show Friends Location
- Map

## Build Setup

- Make sure you have [Firebase Account](https://firebase.google.com/)
- Make sure you have [MapBox API Key](https://www.mapbox.com/)
- Clone this Repository `git clone https://github.com/iyansr/ngobrol-dong.git`
- Create Firebase config on `src/Configs/Firebase.js`

  ```javascript
  import firebase from 'firebase'

  const firebaseConfig = {
    apiKey: 'xxxxxxxxxxx',
    authDomain: 'xxxxxxxxxxx',
    databaseURL: 'xxxxxxxxxxx',
    projectId: 'xxxxxxxxxxx',
    storageBucket: 'xxxxxxxxxxx',
    messagingSenderId: 'xxxxxxxxxxx',
    appId: 'xxxxxxxxxxx',
    measurementId: 'xxxxxxxxxxx',
  }

  let app = firebase.initializeApp(firebaseConfig)

  export const Database = app.database()
  export const Auth = app.auth()
  ```

- Create MapBox API config on `src/Configs/MapBoxAPI.js`

  ```javascript
  export const mapBoxAPiKey = 'xxxxxxxxxx'

  ```

- Install Dependencies 

  ```bash
  # with yarn
  $ yarn install

  # or with npm
  $ npm install
  ```

- Connect device or use emulator

- Run the app 

  ```bash
  $ npx react-native run-android
  ```

## Stacks

- React Native
- Firebase
- MapBox
- NativeBase
- React Navigation

## Dependencies

- react-native-gifted-chat
- react-native-image-picker
- @react-native-community/async-storage
- react-navigation-transitions
- react-navigation-tabs
- react-navigation-stack
- rn-fetch-blob

## Screenshots

<div align='center'>
<img title="Home" src="https://res.cloudinary.com/iyansrcloud/image/upload/v1578125626/screenshot/ChatList_qf0yog.png" width='400'>
<img title="Chat Screen" src="https://res.cloudinary.com/iyansrcloud/image/upload/v1578125627/screenshot/chatscreen_thlytj.png" width='400'>
<img title="Map Screen" src="https://res.cloudinary.com/iyansrcloud/image/upload/v1578125627/screenshot/map_s3ktnf.png" width='400'>
<img title="Profile Screen" src="https://res.cloudinary.com/iyansrcloud/image/upload/v1578125627/screenshot/profile_y1lfzs.png" width='400'>
</div>

---

Copyright © 2020 by I Putu Saputrayana (Iyan Saputra)

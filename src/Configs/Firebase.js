import firebase from 'firebase'

const firebaseConfig = {
	apiKey: 'AIzaSyD_9f6adA2zGOmH-q65tI3ZHaI5rRMWCwk',
	authDomain: 'naka-chat-rnproject.firebaseapp.com',
	databaseURL: 'https://naka-chat-rnproject.firebaseio.com',
	projectId: 'naka-chat-rnproject',
	storageBucket: 'naka-chat-rnproject.appspot.com',
	messagingSenderId: '577217205472',
	appId: '1:577217205472:web:f61e1ea1d02832ce122c85',
	measurementId: 'G-RX4E2ZZBCQ',
}

let app = firebase.initializeApp(firebaseConfig)

export const Database = app.database()
export const Auth = app.auth()

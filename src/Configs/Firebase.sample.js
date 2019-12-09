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

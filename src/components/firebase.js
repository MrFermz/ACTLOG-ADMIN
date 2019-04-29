import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyBHwakqkRXJ94foc8_unxo-IiI0_eo_zsQ',
    authDomain: 'actlog-912c1.firebaseapp.com',
    databaseURL: 'https://actlog-912c1.firebaseio.com',
    projectId: 'actlog-912c1',
    storageBucket: 'actlog-912c1.appspot.com',
    messagingSenderId: '550723713394'
}
firebase.initializeApp(config)

export default firebase
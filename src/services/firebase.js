import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyC14hJ31aB7YF_0_yOZ_3KG1sPmKlEtLh0',
  authDomain: 'glean-tennessee.firebaseapp.com',
  databaseURL: 'https://glean-tennessee.firebaseio.com',
  projectId: 'glean-tennessee',
  storageBucket: 'glean-tennessee.appspot.com',
  messagingSenderId: '272130733451'
}

firebase.initializeApp(config)

const FirebaseService = () => {
  const signup = ({email, password}) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          const currentUser = user
          resolve(currentUser)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const login = ({email, password}) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(profile => {
          const currentUser = profile.uid
          sessionStorage.setItem('user_id', currentUser)
          resolve(profile)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const logout = () => {
    return new Promise((_, reject) =>
      firebase
        .auth()
        .signOut()
        .catch(err => {
          reject('error logging out', err.message)
        })
    )
  }

  // data: { name: string, street: string, city: string, state: string, zip: string, phone: string, email: string, is_organic: boolean, uid: string, uid: string }
  const updateProfile = data => {
    new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('users/' + data.uid)
        .update(data, error => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        })
    })
  }

  const getUserProfile = () =>
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .once('value')

  const sendMessage = message => {
    return new Promise((resolve, reject) => {
      try {
        var sendMessage = firebase.functions().httpsCallable('sendMessage')
        sendMessage(message)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  return {
    signup,
    login,
    logout,
    updateProfile,
    getUserProfile,
    sendMessage
  }
}

export default FirebaseService()

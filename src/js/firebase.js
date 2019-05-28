const db = firebase.firestore();

/**
 * Functions exported to be used in other files
 */
function signup(email, password) {
	// Tell firebase to create a new user.
	// Returns a promise
	// It will fail if:
	// - There is no email or password
	// - Email already exists
	// - Password is less than 6 characters
	return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function signin(email, password) {
	// Tell firebase to signin the user.
	// Returns a promise
	// It will fail if:
	// - An account with that email doesn't exist
	// - The password is wrong
	return firebase.auth().signInWithEmailAndPassword(email, password);
}

function logout() {
	// Tell firebase to logout the current user.
	// Returns a promise
	return firebase.auth().signOut();
}

function createUserInDB(user, additionalData) {
	// We create a promise so we can wait for it at the place where the function is called.
	// Returns a promise
	return new Promise((resolve, reject) => {
		if (!user) { reject('no user'); }

		// Get a reference to the place in the database where a user document might exist
		const userRef = db.doc(`users/${user.uid}`);
			// Try to fetch the document from that location
			userRef.get()
			.then(snapshot => {
				if (!snapshot.exists) {
					// User does not exist in the db - create a document for him
					userRef.set({
						createdAt: new Date(),
						...additionalData
					});
				}
				// Get the user document
				return db.collection('users').doc(user.uid);
			})
			.then(userRef => {
				// Get the user (new or old) from the database.
				// Set his id and all of his data in an object and return it.
				// We do that cause normally, the data returned from firebase do not include
				// the document id and we need it so we can do things like "delete user by id".
				userRef.onSnapshot(snapshot => {
					const user = {
						uid: snapshot.id,
						...snapshot.data()
					};

					resolve(user);
				});
			})
			.catch(err => {
				reject(err);
			})
		});
	}

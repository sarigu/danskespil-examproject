import { signup, signin, logout, createUserInDB } from './firebase';

/**
 * HTML ELEMENTS
 */
var formEl = document.getElementById("form-popup-signup");
var usernameEl = document.getElementById("exampleInputUsername");
var emailInputEl = document.getElementById("exampleInputEmail1");
var passwordInputEl = document.getElementById("exampleInputPassword1");
var logoutButtonEl = document.getElementById("logout");

/**
 * EVENT LISTENERS
 */
formEl.addEventListener("submit", onSignup);
logoutButtonEl.addEventListener("click", onLogout);

/**
 * SIGN-UP METHOD
 * 
 * TODO: Somehow show the error messages to the user
 */
let username = "";
let email = "";
function onSignup(e) {
	e.preventDefault();

	username = usernameEl.value;
	email = emailInputEl.value;
	const password = passwordInputEl.value;

	signup(email, password)
		.then(res => $('#exampleModalCenter').modal('hide'))
		.catch(err => console.log('err: ', err.message))
}

/**
 * SIGN-IN METHOD
 * 
 * TODO: Actually create the login form so this can be called
 * TODO: Somehow show the error messages to the user
 */
function onSignin() {
	signin(email, password)
		.then(res => console.log('res: ', res))
		.catch(err => console.log('err: ', err.message))
}

/**
 * LOGOUT METHOD
 */
function onLogout() {
	logout();
}

/**
 * USER AUTHENTICATION LISTENER
 * This is an listener created from firebase.
 * It runs automatically on user login or logout
 */
firebase.auth().onAuthStateChanged(userAuth => {
  if (userAuth) {
		// We get here if:
		// - User navigated to the site and is logged in (remembers him)
		// - User just created a new account (new sign-up)

		// In case it's a new sign-up, we need to prepare what info we want to save in the DB
		// TODO: Actually prepare what we will save.
		const additionalInformation = {
			username: username,
			email: email
		};

		// This function creates a new user document in the DB if it doesn't exist
		// or finds and returns the existing user document.
		// Either way, we get back the user document.
		createUserInDB(userAuth, additionalInformation)
			.then(user => {
				// This is where we actually get the currently logged in user document.
				console.log('user: ', user)
			})
			.catch(err => console.log('err: ', err))
  } else {
		// We get here if:
		// - User navigated to the site and is not logged in
		// - User just clicked logout
		console.log('User is signed out');
  }
});





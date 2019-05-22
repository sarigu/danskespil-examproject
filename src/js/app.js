import { signup, signin, logout, createUserInDB } from './firebase';


// HTML ELEMENTS

const formEl = document.getElementById("form-popup-signup");
const formSignInEl = document.getElementById("form-popup-signin");
const usernameEl = document.getElementById("exampleInputUsername");
const emailInputEl = document.getElementById("exampleInputEmail1");
const emailInputSignInEl = document.getElementById("inputEmail1");
const passwordInputSignInEl = document.getElementById("inputPassword1");
const passwordInputEl = document.getElementById("exampleInputPassword1");
const logoutButtonEl = document.getElementById("logout");
const signupButtonEl = document.getElementById("btn-signup");
const greetingUserEl = document.getElementById("userName");



// EVENT LISTENERS

formEl.addEventListener("submit", onSignup);
formSignInEl.addEventListener("submit", onSignin);
logoutButtonEl.addEventListener("click", onLogout);
signupButtonEl.addEventListener("submit", onSignup);



// SIGN-UP METHOD

let user = {
	username: "",
	email: "",
	spins: 3,
	score: 1000
}

function onSignup(e) {
	e.preventDefault();

	user.username = usernameEl.value;
	user.email = emailInputEl.value;
	const password = passwordInputEl.value;

	signup(user.email, password)
		.then(res => $('#exampleModalCenter').modal('hide'))
		.catch(err => {
			console.log('err: ', err.message);
			window.alert(err.message);
		})
}


// SIGN-IN METHOD

function onSignin(e) {
	e.preventDefault();

	user.email = emailInputSignInEl.value;
	const password = passwordInputSignInEl.value;

	signin(user.email, password)
		.then(res => {
			console.log('res: ', res);
			$('#modalSignIn').modal('hide');
			greetingUserEl.textContent = user.username;
		})
		.catch(err => {
			console.log('err: ', err.message);
			window.alert(err.message);
		})
}


// LOGOUT METHOD

function onLogout() {
	logout();
}

/**
 * USER AUTHENTICATION LISTENER
 * This is a listener created from firebase.
 * It runs automatically on user login or logout
 */
firebase.auth().onAuthStateChanged(userAuth => {
  if (userAuth) {
	// We get here if:
	// - User navigated to the site and is logged in (remembers him)
	greetingUserEl.textContent = user.username;

	// In case it's a new sign-up, we need to prepare what info we want to save in the DB
	const additionalInformation = {
		username: user.username,
		email: user.email,
		spins: user.spins,
		score: user.score
	};
	// This function creates a new user document in the DB if it doesn't exist
	// or finds and returns the existing user document.
	// Either way, we get back the user document.
	createUserInDB(userAuth, additionalInformation)
		.then(user => {
			// This is where we actually get the currently logged in user document.
			console.log('user: ', user);
			greetingUserEl.textContent = user.username;
		})
		.catch(err => {
			console.log('err: ', err);
			window.alert(err);
		})
  } else {
		// We get here if:
		// - User navigated to the site and is not logged in
		// - User just clicked logout
		
		console.log('User is signed out');
  }
});





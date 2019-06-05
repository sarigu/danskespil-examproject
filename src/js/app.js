// HTML ELEMENTS

const formEl = document.getElementById("form-popup-signup");
const formSignInEl = document.getElementById("form-popup-signin");
const formSubscribeEl = document.getElementById("subscribebox");
const usernameEl = document.getElementById("exampleInputUsername");
const emailInputEl = document.getElementById("exampleInputEmail1");
const emailInputSignInEl = document.getElementById("inputEmail1");
const passwordInputSignInEl = document.getElementById("inputPassword1");
const passwordInputEl = document.getElementById("exampleInputPassword1");
const logoutButtonEl = document.getElementById("logout");
const loginButtonEl = document.getElementById("btn-login");
const greetingUserEl = document.getElementById("userName");
const btnSpin = document.getElementById("btnSpin");

let openedModalId;
let loginDayNum;
let date = new Date();
let today = date.getDate();

let user = {
  username: "",
  email: "",
  spins: 0,
  score: 1000
};

// INIT

window.addEventListener("DOMContentLoaded", init());

function init() {
  // Event listeners
  formEl.addEventListener("submit", onSignup);
  formSignInEl.addEventListener("submit", onSignin);
  logoutButtonEl.addEventListener("click", onLogout);
  formSubscribeEl.addEventListener("submit", subscribe);
  btnSpin.addEventListener("click", fakeSpinForModalsTesting);
  let introSound = document.getElementById("myAudioIntro");
  introSound.volume = 0.35;
  introSound.play();
}

// UTILITIES

// Fake gameplay
function fakeSpinForModalsTesting(params) {
  console.log("spin clicked");

  // TODO: Add new score to the local user here

  // Spins left?

  if (user.spins > 0) {
    // Remove 1 spin
    user.spins = user.spins - 1;
    console.log("Spins left: ", user.spins);
    let spin = document.querySelector(".playerScore");
    spin.innerHTML = user.spins;
    console.log(user);
  }

  // Is user logged in?
  else if (user.name === "" || user.name === "guest") {
    // User is NOT logged in. Has he subscribed already?
    if (user.email === "") {
      // No. Ask to subscribe (subscribe modal)

      subscribeModal();
    } else {
      // Yes. Ask to sign up (signup midal)
      // TODO: Call sign up function + Add different text to the modal (get +10 now and +10 daily)
    }
  } else {
  }

  // Notify: Oh shoot, you have no more spins, here are your options:....
  // TODO: Make the modal and call it here
}

// Modals general
function setOpenedModal(modalId) {
  openedModalId = modalId;
}

function closePreviousModal(nextModalId) {
  $(openedModalId).modal("hide");
  setOpenedModal(nextModalId);
}

function welcomeUser(user) {
  console.log("welcome loading....");
  setTimeout(() => {
    if (user.username === "" || user.username === "guest") {
      $("#modalWelcomeNew").modal("show");
      user.spins = 3;
      user.username = "guest";

      console.log("welcome: ", user);
    } else {
      console.log("User online: ", user);

      if (lastLogin !== today) {
        console.log(
          "last signin: not today -- Get a gift! ",
          "Last login: ",
          lastLogin,
          "Today: ",
          today
        );

        document.getElementById(
          "modalWelcomeNewTitle"
        ).innerHTML = `Welcome back to Casino, ${user.username}!`;
        document.getElementById(
          "welcomeText"
        ).innerHTML = `Here is a welcome back 🎁<br>take 10 free spins to play the BRAIN SPIN game!<br>Good luck!`;
        $("#modalWelcomeNew").modal("show");
        user.spins = user.spins + 10;
      }
    }
  }, 1000);
}

// SUBSCRIBE
// Subscribe section
function subscribe(e) {
  e.preventDefault();

  let email = formSubscribeEl.querySelector("input").value;

  if (user.email === "") {
    user.email = email;
  } else {
    window.alert(`You have already subscribed using this email: ${user.email}`);
  }
  console.log(user);
}

// Subscribe modal
function subscribeModal(params) {
  console.log("Subscribe modal func.");
}

// SIGN-UP METHOD

function onSignup(e) {
  console.log(e);

  e.preventDefault();

  user.username = usernameEl.value;
  user.email = emailInputEl.value;
  const password = passwordInputEl.value;

  signup(user.email, password)
    .then(res => $("#exampleModalCenter").modal("hide"))
    .catch(err => {
      console.log("err: ", err.message);
      window.alert(err.message);
    });
}

// SIGN-IN METHOD

function onSignin(e) {
  e.preventDefault();

  user.email = emailInputSignInEl.value;
  const password = passwordInputSignInEl.value;

  signin(user.email, password)
    .then(res => {
      console.log("res: ", res);
      $("#modalSignIn").modal("hide");
      greetingUserEl.textContent = user.username;
      document.getElementById("greetingUser").style.display = "initial";
    })
    .catch(err => {
      console.log("err: ", err.message);
      window.alert(err.message);
    });
}

// LOGOUT METHOD

function onLogout() {
  window.alert("Have a great day and see you next time! 👋");
  logout();
  greetingUserEl.textContent = "";
  document.getElementById("greetingUser").style.display = "none";
}

//  USER AUTHENTICATION LISTENER
//  This is a listener created from firebase.
//  It runs automatically on user login or logout
firebase.auth().onAuthStateChanged(userAuth => {
  if (userAuth) {
    console.log(userAuth);
    // We get here if:
    // - User navigated to the site and is logged in (remembers him)
    lastLogin = Number(userAuth.metadata.lastSignInTime.toString().slice(5, 7));
    // In case it's a new sign-up, we need to prepare what info we want to save in the DB
    const additionalInformation = {
      username: user.username,
      email: user.email,
      spins: user.spins,
      score: user.score
    };

    // Update lastLogin on user in db
    // updateUser();

    // This function creates a new user document in the DB if it doesn't exist
    // or finds and returns the existing user document.
    // Either way, we get back the user document.
    createUserInDB(userAuth, additionalInformation)
      .then(dbUser => {
        // This is where we actually get the currently logged in user document.
        // console.log('user: ', user);
        user = { ...dbUser };

        greetingUserEl.textContent = user.username;
        loginButtonEl.style.display = "none";
        logoutButtonEl.style.display = "block";
        document.getElementById("greetingUser").style.display = "block";
        welcomeUser(user);
      })
      .catch(err => {
        // console.log('err: ', err);
        window.alert(err);
      });
  } else {
    // We get here if:
    // - User navigated to the site and is not logged in
    // - User just clicked logout
    loginButtonEl.style.display = "block";
    logoutButtonEl.style.display = "none";
    document.getElementById("greetingUser").style.display = "none";

    welcomeUser(user);
    console.log("User not logged in");
  }
});

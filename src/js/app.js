// HTML ELEMENTS
// Forms
const formEl = document.getElementById("form-popup-signup");
const formSignInEl = document.getElementById("form-popup-signin");
const formSubscribeEl = document.getElementById("subscribebox");
const formSubscribeModEl = document.getElementById("modalSubscribe");
// Imputs
const usernameEl = document.getElementById("exampleInputUsername");
const emailInputEl = document.getElementById("exampleInputEmail1");
const emailInputSignInEl = document.getElementById("inputEmail1");
const emailInputModalEl = document.getElementById("inputEmail");
const passwordInputSignInEl = document.getElementById("inputPassword1");
const passwordInputEl = document.getElementById("exampleInputPassword1");
// Buttons
const logoutButtonEl = document.getElementById("logout");
const loginButtonEl = document.getElementById("btn-login");
const btnSpin = document.getElementById("btnSpin");
const btnSubscribeModal = document.getElementById("btnSubscribeModal");
const btnCancelSubscribeModal = document.getElementById(
  "btnCancelSubscribeModal"
);

// DOM other elements
const greetingUserEl = document.getElementById("userName");
// Help variables
let openedModalId;
let loginDayNum;
let date = new Date();
let today = date.getDate();
let isModalWelcomeNewSeen = false;

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
  btnSpin.addEventListener("click", spin);
  btnSubscribeModal.addEventListener("click", subscribeGuest);
  btnCancelSubscribeModal.addEventListener("click", () => {
    const response = window.confirm(
      "You are about to lose free spins and the chance to play more for free! Are you sure?"
    );
    if (response) {
      $("#modalSubscribe").modal("hide");
    } else {
      $("#modalSubscribe").modal("show");
    }
  });
  let introSound = document.getElementById("myAudioIntro");
  introSound.volume = 0.35;
  introSound.play();
}

// UTILITIES
function subscribeGuest(e) {
  e.preventDefault();

  user.email = emailInputModalEl.value;
  user.spins = user.spins + 10;

  console.log(user);
}

// Gameplay
function spin() {
  console.log("spin clicked");

  // TODO: Add new score to the local user here

  // Spins left?
  if (user.spins > 0) {
    // Remove 1 spin
    user.spins = user.spins - 1;
    console.log("Spins left: ", user.spins);
    let spin = document.querySelector(".playerScore");
    spin.innerHTML = user.spins;
  } else {
    // Is user logged in?
    if (!user.name) {
      console.log("user not logged in");

      // User is NOT logged in. Has he subscribed already?
      if (!user.email) {
        // No. Ask to subscribe (subscribe modal)
        subscribeModalOpen();
      } else {
        // Yes, subscribed. Ask to sign up (signup modal)
        // TODO: Call sign up function + Add different text to the modal (get +10 now and +10 daily)
      }
    } else {
      // User is logged in
      // Notify: Oh shoot, you have no more spins, here are your options:....
      // TODO: Make the modal and call it here
      // TODO: Update user in db
    }
  }
}

// Modals
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
    if (!user.username && !isModalWelcomeNewSeen) {
      isModalWelcomeNewSeen = true;
      $("#modalWelcomeNew").modal("show");
      user.spins = 2; // TODO: change this to 5 or 3 for production

      console.log("welcome: ", user);
    } else if (user.email) {
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
        ).innerHTML = `Here is a welcome back 🎁<br>take 15 free spins to play the BRAIN SPIN game!<br>Good luck!`;
        $("#modalWelcomeNew").modal("show");
        user.spins = user.spins + 15;
        user.lastLogin = today;
      }
      user.lastLogin = today;
      updateUser(user.uid, user);
    }
  }, 1000);
}

function subscribeModalOpen() {
  $("#modalSubscribe").modal("show");
}

// SUBSCRIBE section
function subscribe(e) {
  e.preventDefault();

  let email = formSubscribeEl.querySelector("input").value;

  if (!user.email) {
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

  user = {
    username: "",
    email: "",
    spins: 0,
    score: 1000
  };

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
    const additionalInformation = { ...user };

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

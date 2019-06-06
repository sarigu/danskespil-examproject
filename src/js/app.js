// HTML ELEMENTS
// Forms & Modals
const formEl = document.getElementById("form-popup-signup");
const formSignInEl = document.getElementById("form-popup-signin");
const formSubscribeEl = document.getElementById("subscribebox");
const formSubscribeModEl = document.getElementById("modalSubscribe");
const formOutOfSpinsModEl = document.getElementById("modalOutOfSpins");
const formSignupModal = document.getElementById("form-signup");
const signUp2Modal = document.getElementById("signUp2Modal");
// Inputs
const usernameEl = document.getElementById("exampleInputUsername");
const usernameModalEl = document.getElementById("inputUsername");
const emailInputEl = document.getElementById("exampleInputEmail1");
const emailInputSignInEl = document.getElementById("inputEmail1");
const emailInputModalEl = document.getElementById("inputEmail");
const emailInputModalSignUpEl = document.getElementById("inputEmail2");
const passwordInputSignInEl = document.getElementById("inputPassword1");
const passwordInputEl = document.getElementById("exampleInputPassword1");
const passwordInputModalEl = document.getElementById("inputPassword2");
// Buttons
const logoutButtonEl = document.getElementById("logout");
const loginButtonEl = document.getElementById("btn-login");
const btnSpin = document.getElementById("btnSpin");
const btnSubscribeModal = document.getElementById("btnSubscribeModal");
const btnCancelSubscribeModal = document.getElementById(
  "btnCancelSubscribeModal"
);
const btnCancelOutOfSpinsModal = document.getElementById(
  "btnCancelOutOfSpinsModal"
);
const closeSignupModal2 = document.getElementById("closeSignupModal2");

const spinsAmountEl = document.getElementById("spinAmount");
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
  spins: 5,
  score: 1000
};

let leaderboardNames = document.querySelector("#leaderboardNames");
let leaderboardScores = document.querySelector("#leaderboardScores");

// INIT

window.addEventListener("DOMContentLoaded", init());

function init() {
  checkSpins();
  getTopPlayersOnce();
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
    playIntro();
  });
  btnCancelOutOfSpinsModal.addEventListener("click", () => {
    $("#modalOutOfSpins").modal("hide");
  });
  formSignupModal.addEventListener("submit", onSignupGuest);
  closeSignupModal2.addEventListener("click", () => {
    const response = window.confirm(
      "You are about to lose free spins and the chance to play more for free! Are you sure?"
    );
    if (response) {
      $("#signUp2Modal").modal("hide");
    } else {
      $("#signUp2Modal").modal("show");
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

  // $(".playFancy").removeClass("disabled");
  spinsAmountEl.textContent = user.spins;

  console.log(user);
}
function playIntro() {
  let introSound = document.getElementById("myAudioIntro");
  introSound.volume = 0.2;
  introSound.play();
}
function checkSpins() {
  if (user.spins < 1) {
    document.querySelector(".playFancy").classList.add("disabled");
    // $(".playFancy").addClass("disabled");
  } else {
    // $(".playFancy").removeClass("disabled");
    document.querySelector(".playFancy").classList.remove("disabled");
  }
}

// Gameplay
function spin() {
  getPlayers(user.username);

  console.log("spin clicked");
  // Remove 1 spin
  user.spins = user.spins - 1;
  console.log("Spins left: ", user.spins);
  let spin = document.querySelector(".playerScore");
  setTimeout(() => {
    spin.innerHTML = user.spins;
  }, 100);

  // Spins left?
  if (user.spins > 0) {
    // Remove 1 spin
    let score = document.querySelector("#PlayerScore");
    user.score = user.score + Number(score.innerText);
    // console.log(user);
  } else {
    // Is user logged in?
    if (!user.username) {
      console.log("user not logged in");
      // User is NOT logged in. Has he subscribed already?
      if (!user.email) {
        // No. Ask to subscribe (subscribe modal)
        setTimeout(() => {
          subscribeModalOpen();
        }, 3000);
      } else {
        // Yes, subscribed. Ask to sign up (signup modal)
        setTimeout(() => {
          SignUpModal2Open();
        }, 2500);
      }
    } else {
      // User is logged in
      // Notify: Oh shoot, you have no more spins, here are your options:....
      // TODO: Make the modal and call it here
      $(".playFancy").addClass("disabled");
      setTimeout(() => {
        outOfSpinsModalOpen();
      }, 2500);
    }
  }
  // Update user if exists
  if (user.username) {
    updateUser(user.uid, user);
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
      user.spins = 5; // TODO: change this to 5 or 3 for production

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
        ).innerHTML = `Here is a welcome back 🎁<br>take 20 free spins to play the BRAIN SPIN game!<br>Good luck!`;
        $("#modalWelcomeNew").modal("show");
        user.spins = user.spins + 20;
        user.lastLogin = today;
      }
      user.lastLogin = today;
      updateUser(user.uid, user);
    }
  }, 1000);
}

function SignUpModal2Open(params) {
  setOpenedModal("#signUp2Modal");
  emailInputModalSignUpEl.value = user.email;
  $("#signUp2Modal").modal("show");
}

function subscribeModalOpen() {
  $("#modalSubscribe").modal("show");
}

function outOfSpinsModalOpen() {
  $("#modalOutOfSpins").modal("show");
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
function onSignupGuest(e) {
  e.preventDefault();

  user.username = usernameModalEl.value;
  user.email = emailInputModalSignUpEl.value;
  user.spins = user.spins + 15;
  const password = passwordInputModalEl.value;

  signup(user.email, password)
    .then(res => $("#signUp2Modal").modal("hide"))
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

//LEADERBOARD

function getTopPlayersOnce() {
  let counter = 1;
  const db = firebase.firestore();
  //Reference to the collection
  userRef = db.collection("users");
  var query = userRef.orderBy("score", "desc").limit(9);
  query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      let lead = document.createElement("li");
      let text = document.createTextNode(counter + ".  " + doc.data().username);
      lead.appendChild(text);
      let leadScore = document.createElement("li");
      let textScore = document.createTextNode(doc.data().score);
      leadScore.appendChild(textScore);

      leaderboardNames.appendChild(lead);
      leaderboardScores.appendChild(leadScore);

      counter++;
    });
  });
}

function getPlayers(currentUser) {
  let counter = 1;
  const db = firebase.firestore();
  let inLead = false;

  //Delete the current list as long as <ul> has a child nodes
  while (leaderboardNames.hasChildNodes() && leaderboardScores.hasChildNodes) {
    leaderboardNames.removeChild(leaderboardNames.firstChild);
    leaderboardScores.removeChild(leaderboardScores.firstChild);
  }
  //Reference to the collection
  userRef = db.collection("users");

  //orders the data by score, from top to bottom and the return is limited to 9
  var query = userRef.orderBy("score", "desc").limit(9);
  query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      //Check if the current user has one of the top 9 scores
      if (doc.data().username == currentUser) {
        inLead = true;

        let lead = document.createElement("li");
        let text = document.createTextNode(
          counter + ".  " + doc.data().username
        );

        //highlighting the user
        lead.appendChild(text);
        lead.style.padding = "10px";
        lead.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        lead.style.width = "100%";

        let leadScore = document.createElement("li");
        let textScore = document.createTextNode(doc.data().score);
        leadScore.appendChild(textScore);
        leadScore.style.padding = "10px";
        leadScore.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        leadScore.style.width = "100%";

        leaderboardNames.appendChild(lead);
        leaderboardScores.appendChild(leadScore);

        counter++;
      } else {
        //adds the username from the current document from the database to the list item
        let lead = document.createElement("li");
        let text = document.createTextNode(
          counter + ".  " + doc.data().username
        );
        lead.appendChild(text);
        //adds the score from the current document from the database to the list item
        let leadScore = document.createElement("li");
        let textScore = document.createTextNode(doc.data().score);
        leadScore.appendChild(textScore);

        //appends list items to the lists for names
        leaderboardNames.appendChild(lead);
        //appends list items to the lists for scores
        leaderboardScores.appendChild(leadScore);

        //increases counter; counter is used to count the place of each player
        counter++;
      }
    });

    //checks if the current user was in the returned data, if not it calls the function to look for the place the user is on right now
    if (inLead === false) {
      getCurrentUsersPlace(currentUser);
    } else {
    }
  });
}

//To show the current user or guest
function getCurrentUsersPlace(currentUser) {
  let counter = 0;
  const db = firebase.firestore();

  //if not sorted the position wouldn't make sense
  userRef = db.collection("users");

  if (currentUser === "") {
    let dot = document.createElement("li");
    let dots = document.createTextNode("...");
    dot.appendChild(dots);

    let empty = document.createElement("li");
    let emptyspace = document.createTextNode("...");
    empty.appendChild(emptyspace);

    let lead = document.createElement("li");
    let text = document.createTextNode("guest");
    lead.appendChild(text);
    lead.style.padding = "10px";
    lead.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    lead.style.width = "100%";

    let leadScore = document.createElement("li");
    let textScore = document.createTextNode(user.score);
    leadScore.appendChild(textScore);
    leadScore.style.padding = "10px";
    leadScore.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    leadScore.style.width = "100%";

    leaderboardNames.appendChild(dot);
    leaderboardScores.appendChild(empty);
    leaderboardNames.appendChild(lead);
    leaderboardScores.appendChild(leadScore);
  } else {
    //not limit to the order since we want to find the current users positioning
    var query = userRef.orderBy("score", "desc");
    query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        //increases the counter each loop, to see how many loops went by until the current user appears
        //a workaround because firebase apparently can't find the position of data in the database
        counter++;

        //checks if the username in the document is equal to the current user, if so it adds the name and score to the list
        if (doc.data().username == currentUser) {
          let dot = document.createElement("li");
          let dots = document.createTextNode("...");
          dot.appendChild(dots);

          let empty = document.createElement("li");
          let emptyspace = document.createTextNode("...");
          empty.appendChild(emptyspace);

          let lead = document.createElement("li");
          let text = document.createTextNode(
            counter + ".  " + doc.data().username
          );
          lead.appendChild(text);
          lead.style.padding = "10px";
          lead.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          lead.style.width = "100%";

          let leadScore = document.createElement("li");
          let textScore = document.createTextNode(doc.data().score);
          leadScore.appendChild(textScore);
          leadScore.style.padding = "10px";
          leadScore.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          leadScore.style.width = "100%";

          leaderboardNames.appendChild(dot);
          leaderboardScores.appendChild(empty);
          leaderboardNames.appendChild(lead);
          leaderboardScores.appendChild(leadScore);
        }
      });
    });
  }
}

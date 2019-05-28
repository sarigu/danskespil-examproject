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


//  USER AUTHENTICATION LISTENER
//  This is a listener created from firebase.
//  It runs automatically on user login or logout

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


// SLOTS USING PIXI JS
// https://www.pixijs.com

const app = new PIXI.Application({ backgroundColor: 0x001f2f });
document.body.appendChild(app.view);

app.loader
	.add('../src/img/slots/brain.png', '../src/img/slots/brain.png')
	.add('../src/img/slots/discotimes.png', '../src/img/slots/discotimes.png')
	.add('../src/img/slots/grumpyman.png', '../src/img/slots/grumpyman.png')
	.add('../src/img/slots/headball.png', '../src/img/slots/headball.png')
	.load(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
	// Create different slot symbols.
	const slotTextures = [
		PIXI.Texture.from('../src/img/slots/brain.png'),
		PIXI.Texture.from('../src/img/slots/discotimes.png'),
		PIXI.Texture.from('../src/img/slots/grumpyman.png'),
		PIXI.Texture.from('../src/img/slots/headball.png'),
		PIXI.Texture.from('../src/img/slots/johnybravo.png'),
		PIXI.Texture.from('../src/img/slots/joker.png'),
		PIXI.Texture.from('../src/img/slots/rabbit.png'),
		PIXI.Texture.from('../src/img/slots/monk.png'),
		PIXI.Texture.from('../src/img/slots/merlin.png'),
		PIXI.Texture.from('../src/img/slots/mermaid.png'),
		PIXI.Texture.from('../src/img/slots/skateboarder.png'),
	];

	// Build the reels
	const reels = [];
	const reelContainer = new PIXI.Container();
	for (let i = 0; i < 5; i++) {
		const rc = new PIXI.Container();
		rc.x = i * REEL_WIDTH;
		reelContainer.addChild(rc);

		const reel = {
			container: rc,
			symbols: [],
			position: 0,
			previousPosition: 0,
			blur: new PIXI.filters.BlurFilter(),
		};
		reel.blur.blurX = 0;
		reel.blur.blurY = 0;
		rc.filters = [reel.blur];

		// Build the symbols
		for (let j = 0; j < 4; j++) {
			const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
			// Scale the symbol to fit symbol area.
			symbol.y = j * SYMBOL_SIZE;
			symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
			symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
			reel.symbols.push(symbol);
			rc.addChild(symbol);
		}
		reels.push(reel);
	}
	app.stage.addChild(reelContainer);

	// Build top & bottom covers and position reelContainer
	const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
	reelContainer.y = margin;
	reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
	const top = new PIXI.Graphics();
	top.beginFill(0, 1);
	top.drawRect(0, 0, app.screen.width, margin);
	const bottom = new PIXI.Graphics();
	bottom.beginFill(0, 1);
	bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

	// Add play text
	const style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 36,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fill: '#00ff99',
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 440,
	});

	const playText = new PIXI.Text('Spin the wheels!', style);
	playText.x = Math.round((bottom.width - playText.width) / 2);
	playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
	bottom.addChild(playText);

	// Add header text
	const headerText = new PIXI.Text('BRAIN SPIN', style);
	headerText.x = Math.round((top.width - headerText.width) / 2);
	headerText.y = Math.round((margin - headerText.height) / 2);
	top.addChild(headerText);

	app.stage.addChild(top);
	app.stage.addChild(bottom);

	// Set the interactivity.
	bottom.interactive = true;
	bottom.buttonMode = true;
	bottom.addListener('pointerdown', () => {
		startPlay();
	});

	let running = false;

	// Function to start playing.
	function startPlay() {
		if (running) return;
		running = true;

		for (let i = 0; i < reels.length; i++) {
			const r = reels[i];
			const extra = Math.floor(Math.random() * 3);
			const target = r.position + 10 + i * 5 + extra;
			const time = 2500 + i * 600 + extra * 600;
			tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
		}
	}

	// Reels done handler.
	function reelsComplete() {
		running = false;
	}

	// Listen for animate update.
	app.ticker.add((delta) => {
		// Update the slots.
		for (let i = 0; i < reels.length; i++) {
			const r = reels[i];
			// Update blur filter y amount based on speed.
			// This would be better if calculated with time in mind also. Now blur depends on frame rate.
			r.blur.blurY = (r.position - r.previousPosition) * 8;
			r.previousPosition = r.position;

			// Update symbol positions on reel.
			for (let j = 0; j < r.symbols.length; j++) {
				const s = r.symbols[j];
				const prevy = s.y;
				s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
				if (s.y < 0 && prevy > SYMBOL_SIZE) {
					// Detect going over and swap a texture.
					// This should in proper product be determined from some logical reel.
					s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
					s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
					s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
				}
			}
		}
	});
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
	const tween = {
		object,
		property,
		propertyBeginValue: object[property],
		target,
		easing,
		time,
		change: onchange,
		complete: oncomplete,
		start: Date.now(),
	};

	tweening.push(tween);
	return tween;
}
// Listen for animate update.
app.ticker.add((delta) => {
	const now = Date.now();
	const remove = [];
	for (let i = 0; i < tweening.length; i++) {
		const t = tweening[i];
		const phase = Math.min(1, (now - t.start) / t.time);

		t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
		if (t.change) t.change(t);
		if (phase === 1) {
			t.object[t.property] = t.target;
			if (t.complete) t.complete(t);
			remove.push(t);
		}
	}
	for (let i = 0; i < remove.length; i++) {
		tweening.splice(tweening.indexOf(remove[i]), 1);
	}
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
	return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
	return t => (--t * t * ((amount + 1) * t + amount) + 1);
}







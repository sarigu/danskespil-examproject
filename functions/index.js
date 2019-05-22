const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.deleteUser = functions.firestore
    .document('users/{userID}')
    .onDelete((snap, context) => {
        // const deletedUser = snap.data();

        const deletedUserId = snap.id;

        console.log('Attempting to delete user: ', deletedUserId);

        admin.auth().deleteUser(deletedUserId)
            .then(function () {
                console.log('Successfully deleted user');
                return true;
            })
            .catch(function (error) {
                console.log('Error deleting user:', error);
                return false;
            });
    });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { user } = require('firebase-functions/lib/providers/auth');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    //Get user and Add custom claim (Admin)
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return{
            message: `Success! ${data.email} has been made an admin`
        }
    }).catch(err => {
        return err;
    });
});
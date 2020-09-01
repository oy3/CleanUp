//Add Admin cloud functions
const adminForm = document.querySelector('.admin-actions');
adminForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');

    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
    });
})

// Listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        console.log('user logged in: ', user);

        // user.getIdTokenResult().then(idTokenResult => {
        //     user.admim = idTokenResult.claims.admim;
        //     checkRole()
        // });

        setupUi(user);
        setupProfileUi(user);
        // setupCleanerProfileUi(user);
    } else {
        // User is signed out.
        setupUi();
        console.log('user logged out');
    }
});




//Sign up
const registerform = document.querySelector('#register_form');
registerform?.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = registerform['inputEmail'].value;
    const password = registerform['inputPassword'].value;
    const fullname = registerform['inputfullName'].value;
    const phoneNumber = registerform['inputPhoneNumber'].value;
    const address = registerform['inputAddress'].value;
    const role = "client";
    const state = registerform['inputState'].value;
    const country = registerform['inputCountry'].value;
    const gender = registerform['gender'].value;

    // const gender = $("input:radio[name=gender]:checked").val()

    //Sign up the user to firebase auth and firestore
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // Add a new user to firestore
        return db.collection('users').doc(cred.user.uid).set({
            address: address,
            country: country,
            email: email,
            fullname: fullname,
            gender: gender,
            password: password,
            phonenumber: phoneNumber,
            role: role,
            state: state,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: cred.user.uid
        });
    }).then(() => {

        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
            $('.alert-danger').addClass('hidden');
            $('.alert-success').text("Registered successfully").removeClass('hidden');
        }).catch(function (error) {
            // An error happened.
        });
        registerform.reset();
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('The password is too weak.\n' + errorMessage).removeClass('hidden');
        } else if (errorCode == 'auth/network-request-failed') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('A network error has occurred, check your connection and try again.').removeClass('hidden');
        } else {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text(errorMessage).removeClass('hidden');


            // setTimeout(function() {$('#alertBox').text(errorMessage).addClass('alert-danger').removeClass('hidden');}, 5000);
        }
        console.log(error);
    });
});

//Log out user
const logout = document.querySelector('#logoutBtn');
logout?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        window.open('../index.html');
        window.parent.close();
    });
});

// Login user
const loginForm = document.querySelector('#login_form');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['inputEmail'].value;
    const password = loginForm['inputPassword'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        $('.alert-danger').addClass('hidden');
        $('.alert-success').text('Logged in successfully').removeClass('hidden');
        loginForm.reset();

        checkRole();

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('Wrong username or password').removeClass('hidden');
        } else if (errorCode == 'auth/network-request-failed') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('A network error has occurred, check your connection and try again.').removeClass('hidden');
        } else if (errorCode == 'auth/user-not-found') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text("There is no user registered with this email address").removeClass('hidden');
        } else {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text(errorMessage).removeClass('hidden');
        }
        console.log(error);
    });
});

//Forgot password
const forgotPwdForm = document.querySelector('#forgotPwdForm');
forgotPwdForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    //get email
    const email = forgotPwdForm['inputEmail'].value;
    auth.sendPasswordResetEmail(email).then(cred => {
        $('.alert-danger').addClass('hidden');
        $('.alert-success').text("Password Reset Email Sent!").removeClass('hidden');
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text(errorMessage).removeClass('hidden');
        } else if (errorCode == 'auth/network-request-failed') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('A network error has occurred, check your connection and try again.').removeClass('hidden');
        } else if (errorCode == 'auth/user-not-found') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text("There is no user registered with this email address").removeClass('hidden');
        }
        console.log(error);
    });
});

// Change password
const chgePwdForm = document.querySelector('#changePasswordForm');
chgePwdForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    var user = auth.currentUser;
    // Get current password and new password
    const currentPwd = chgePwdForm['currentPassword'].value;
    const newPwd = chgePwdForm['newPassword'].value;
    const confirmNewPwd = chgePwdForm['confirmNewPassword'].value;

    user.reauthenticateWithCredential(
        firebase.auth.EmailAuthProvider.credential(user.email, currentPwd)
    ).then(cred => {
        console.log('User authenticated successfully');

        if (newPwd != confirmNewPwd) {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text("Passwords do not match").removeClass('hidden');
        } else {
            user.updatePassword(newPwd).then(function () {
                return db.collection('users').doc(cred.user.uid).update({
                    password: newPwd
                });
            }).then(() => {
                // Update successful.
                chgePwdForm.reset();
                $('.alert-danger').addClass('hidden');
                $('.alert-success').text("Password updated successfully").removeClass('hidden');
            }).catch(function (error) {
                // An error happened.
                $('.alert-success').addClass('hidden');
                $('.alert-danger').text(error).removeClass('hidden');
            });
        }
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('The password is invalid').removeClass('hidden');
        } else if (errorCode == 'auth/network-request-failed') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('A network error has occurred, check your connection and try again.').removeClass('hidden');
        } else {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text(errorMessage).removeClass('hidden');
        }
        console.log(error);
    });
});

// Contact us form
const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get data
    const name = contactForm['input-name'].value;
    const email = contactForm['input-email'].value;
    const message = contactForm['input-message'].value;

    db.collection("contact-messages").add({
        fullname: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        $('.alert-danger').addClass('hidden');
        $('.alert-success').text("Successfully sent message").removeClass('hidden');
        contactForm.reset();
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/network-request-failed') {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text('A network error has occurred, check your connection and try again.').removeClass('hidden');
        } else {
            $('.alert-success').addClass('hidden');
            $('.alert-danger').text(errorMessage).removeClass('hidden');
        }
        console.log(error);
    });

});


function checkRole() {
    // Listen for auth status changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            var uid = user.uid;
            console.log("Current user:", uid);


            var docRef = db.collection("users").doc(uid);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    var role = doc.data().role;
                    console.log("Current users role: ", role);

                    if (role == "client") {
                        window.location.replace("dashboard.html");
                    } else if (role == "cleaner") {
                        window.location.replace("cleaner/dashboard.html");
                    } else if (role == "admin") {
                        window.location.replace("admin/dashboard.html");
                    }
                    else {
                        console.log("Unknow user role");
                    }
                } else {
                    console.log("No user record!");
                }
            }).catch(function (error) {
                console.log("Error getting role:", error);
            });



        }
    });
}
const fullname = document.querySelector('#fullName');
const email = document.querySelector('#email');
const phonenumber = document.querySelector('#phone');
const gender = document.querySelector('#gender');
const address = document.querySelector('#address');
const state = document.querySelector('#state');
const country = document.querySelector('#country');

const setupProfileUi = (user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            renderUserData(doc);
        })
    } else {
        renderUserData();
    }
}


function renderUserData(doc) {
    fullname.textContent = doc.data().fullname.toUpperCase();
    email.textContent = doc.data().email.toUpperCase();
    phonenumber.textContent = doc.data().phonenumber.toUpperCase();
    gender.textContent = doc.data().gender.toUpperCase();
    address.textContent = doc.data().address.toUpperCase();
    state.textContent = doc.data().state.toUpperCase();
    country.textContent = doc.data().country.toUpperCase();
}



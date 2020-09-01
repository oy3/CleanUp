const cleanerform = document.querySelector('#cleaner-profile-form');

const cname = cleanerform['fullname'];
const cdob = cleanerform['dob'];
const cgender = cleanerform['gender'];
const cemail = cleanerform['email'];
const cphone = cleanerform['phone'];
const caddress = cleanerform['address'];
const cbank = cleanerform['bank'];
const caccNum = cleanerform['accNum'];
const caccName = cleanerform['accName'];

const setupCleanerProfileUi = (user) => {
    if (user) {

        console.log("log", user.uid);

        db.collection('users').doc(user.uid).onSnapshot(function (snapshot) {
            console.log("log = ", snapshot.data());
            renderCleanerData(snapshot);
        });

        // db.collection('users').doc(user.uid).onSnapshot(function (snapshot) {
        //     snapshot.docChanges().forEach(function (change) {
        //         if (change.type === "added") {
        //             renderCleanerData(change);
        //             console.log("log", change);
        //         }
        //         if (change.type === "modified") {
        //             renderCleanerData(change);
        //             console.log("log", change);
        //         }
        //         if (change.type === "removed") {
        //             console.log("Removed city: ", change.doc.data());
        //         }
        //     });
        // });


        // db.collection('users').doc(user.uid).get().then(doc => {
        //     renderCleanerData(doc);
        //     console.log("log", doc);

        // }).catch(function (error) {
        //     console.log(error);
        // });
    } else {
        renderCleanerData();
    }
}


function renderCleanerData(doc) {
    $("#cleaner_img").attr("src", doc.data().profileImage);
    $("#sidename").html(doc.data().name.toUpperCase());
    $("#siderole").html(doc.data().role.toUpperCase());
    $("#sidejoined").html(doc.data().timestamp.toDate().toDateString());

    cname.value = doc.data().name.toUpperCase();
    cdob.value = doc.data().dob.toUpperCase();
    cgender.value = doc.data().gender.toUpperCase();
    cemail.value = doc.data().email.toUpperCase();
    cphone.value = doc.data().phoneNumber.toUpperCase();
    caddress.value = doc.data().address.toUpperCase();
    cbank.value = doc.data().accountDetails.bank.toUpperCase();
    caccNum.value = doc.data().accountDetails.accountNumber.toUpperCase();
    caccName.value = doc.data().accountDetails.accountName.toUpperCase();
}
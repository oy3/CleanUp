//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitche

// $('.next').click(function () {

//     var parent_fieldset = $(this).parents('fieldset');
//     var next_step = false;

//     parent_fieldset.find('.required').each(function () {
//         if ($(this).val() == "") {
//             $(this).addClass('input-error');
//             next_step = false;
//         } else {
//             $(this).removeClass('input-error');
//             next_step = true;
//         }
//     });

//     if (next_step) {

//         if (animating) return false;
//         animating = true;

//         current_fs = $(this).parent();
//         next_fs = $(this).parent().next();

//         //activate next step on progressbar using the index of next_fs
//         $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

//         //show the next fieldset
//         next_fs.show();

//         //hide the current fieldset with style
//         current_fs.animate({ opacity: 0 }, {
//             step: function (now, mx) {
//                 //as the opacity of current_fs reduces to 0 - stored in "now"
//                 //1. scale current_fs down to 80%
//                 scale = 1 - (1 - now) * 0.2;
//                 //2. bring next_fs from the right(50%)
//                 left = (now * 50) + "%";
//                 //3. increase opacity of next_fs to 1 as it moves in
//                 opacity = 1 - now;
//                 current_fs.css({
//                     'transform': 'scale(' + scale + ')',
//                     'position': 'absolute'
//                 });
//                 next_fs.css({ 'left': left, 'opacity': opacity });
//             },
//             duration: 800,
//             complete: function () {
//                 current_fs.hide();
//                 animating = false;
//             },
//             //this comes from the custom easing plugin
//             easing: 'easeInOutBack'
//         });
//     }
// });

// $('.previous').click(function () {
//     if (animating) return false;
//     animating = true;

//     current_fs = $(this).parent();
//     previous_fs = $(this).parent().prev();

//     //de-activate current step on progressbar
//     $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

//     //show the previous fieldset
//     previous_fs.show();
//     //hide the current fieldset with style
//     current_fs.animate({ opacity: 0 }, {
//         step: function (now, mx) {
//             //as the opacity of current_fs reduces to 0 - stored in "now"
//             //1. scale previous_fs from 80% to 100%
//             scale = 0.8 + (1 - now) * 0.2;
//             //2. take current_fs to the right(50%) - from 0%
//             left = ((1 - now) * 50) + "%";
//             //3. increase opacity of previous_fs to 1 as it moves in
//             opacity = 1 - now;
//             current_fs.css({ 'left': left });
//             previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
//         },
//         duration: 800,
//         complete: function () {
//             current_fs.hide();
//             animating = false;
//         },
//         //this comes from the custom easing plugin
//         easing: 'easeInOutBack'
//     });
// });

// $('.submit').click(function () {
//     return true
// });


// $('.next').click(function () {
//     alert('clicked');

//     var parent_fieldset = $(this).parents('fieldset');
//     var fields = parent_fieldset.find("input, select, textarea").serializeArray();

//     $.each(fields, function (i, field) {
//         if (!field.value)
//             alert(field.name + ' is required');
//     });
//     console.log(fields);


//     // var parent_fieldset = $(this).parents('fieldset');
//     // var fields = parent_fieldset.find("input, select, textarea").find('.required').each(fields, function (i, field) {
//     //     if ($(this).val() == "") {
//     //         $(this).addClass('input-error');
//     //         alert(field.name + ' is required');
//     //     } else {
//     //         $(this).removeClass('input-error');
//     //     }
//     // });
//     // console.log(fields);
// });


//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function () {

    var parent_fieldset = $(this).parents('fieldset');
    var next_step = false;

    parent_fieldset.find('.required').each(function () {
        if ($(this).val() == "") {
            $(this).addClass('invalid');

            $('#error-text').css("visibility", "visible");
            $('#error-text').text("**Please fill all highlighted input fields.**");
            next_step = false;
        } else {
            $(this).removeClass('invalid');
            $("#error-text").css("visibility", "hidden");
            next_step = true;
        }
    });

    const pass = document.getElementById('inputPassword').value;
    const cpass = document.getElementById('inputConfirmPassword').value;
    if (pass != cpass) {
        $('#inputPassword').addClass('invalid');
        $('#inputConfirmPassword').addClass('invalid');
        next_step = false;

        $('#error-text').css("visibility", "visible");
        $('#error-text').text("**The passwords entered dont match. Please try again.**");
    }


    if (next_step) {

        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50) + "%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({
                    'transform': 'scale(' + scale + ')',
                    'position': 'absolute'
                });
                next_fs.css({ 'left': left, 'opacity': opacity });
            },
            duration: 800,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });

    }

});

$(".previous").click(function () {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
        step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({ 'left': left });
            previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
        },
        duration: 800,
        complete: function () {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".submit").click(function () {
    regCleaner()
})

function regCleaner() {

    const cleanerForm = document.querySelector('#register-cleaner-form');

    const regBtn = cleanerForm['register-cleaner'];

    $('#spinner').removeClass('hide');
    regBtn.setAttribute("disabled", "true");

    //Cleaner info
    var imgStorageRef = storage.ref('cleaner-profile-images');
    var idStorageRef = storage.ref('cleaner-identification-files');
    const img = cleanerForm['inputProfileImage'].files[0];
    const metadata = { contentType: img.type };

    const cFullname = cleanerForm['inputfullName'].value;
    const cEmail = cleanerForm['inputEmail'].value;
    const cPhone = cleanerForm['inputPhoneNumber'].value;
    const cGender = cleanerForm['gender'].value;
    const cAge = cleanerForm['inputDob'].value;
    const cAddress = cleanerForm['inputCleanerAddress'].value;
    const cState = cleanerForm['inputState'].value;
    const cCountry = cleanerForm['inputCountry'].value;
    const cPrimaryLang = cleanerForm['inputLanguage'].value;
    const cOtherLang = cleanerForm['inputLanguage2'].value;
    const cOtherServices = cleanerForm['inputAddServices'].value;
    const cPassword = cleanerForm['inputPassword'].value;
    const cCpassword = cleanerForm['inputConfirmPassword'].value;
    const cFid = cleanerForm['inputID'].value;
    const cFidFile = cleanerForm['inputIDfile'].files[0];

    //Guarantor's info
    const gFullname = cleanerForm['inputGName'].value;
    const gEmail = cleanerForm['InputGEmail'].value;
    const gPhone = cleanerForm['InputGPhone'].value;
    const gAddress = cleanerForm['inputGAddress'].value;

    //Bank info
    const cBank = cleanerForm['inputCBank'].value;
    const cAccNum = cleanerForm['inputCAccNum'].value;
    const cAccName = cleanerForm['inputCAccName'].value;

    var imgName = (+new Date()) + '-' + cFullname.trim();
    var idFileName = cFullname.trim() + '-' + cFid.trim();


    if (cPassword == cCpassword) {

        const imagesRef = imgStorageRef.child(imgName);
        const idRef = idStorageRef.child(idFileName);

        imagesRef.put(img, metadata).then(snapshot => {
            return idRef.put(cFidFile).then(snapshot => {

                let idFileURL;
                //Identification File
                const idUrl = idRef.getDownloadURL().then(url => {
                    // url is the download URL
                    console.log('Cleaner Profile Image Url -> ' + url);
                    idFileURL = url;

                    //Profile Image
                    return imagesRef.getDownloadURL().then(url => {
                        // url is the download URL
                        console.log('ID file Url -> ' + url);
                        // idFileURL = url;

                        //Sign up the user to firebase auth and firestore
                        auth.createUserWithEmailAndPassword(cEmail, cPassword).then(cred => {
                            db.collection('users').doc(cred.user.uid).set({
                                profileImage: url,
                                name: cFullname,
                                email: cEmail,
                                phoneNumber: cPhone,
                                gender: cGender,
                                dob: cAge,
                                address: cAddress,
                                state: cState,
                                country: cCountry,
                                primaryLang: cPrimaryLang,
                                otherLang: cOtherLang,
                                addServcies: cOtherServices,
                                password: cPassword,
                                accountDetails: {
                                    bank: cBank,
                                    accountNumber: cAccNum,
                                    accountName: cAccName
                                },
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                userId: cred.user.uid,
                                identification: {
                                    formOfId: cFid,
                                    formOfIdFile: idFileURL
                                },
                                guarantorDetails: {
                                    guarantorName: gFullname,
                                    guarantorEmail: gEmail,
                                    guarantorPhone: gPhone,
                                    guarantorAddress: gAddress
                                },
                                status: 'Pending',
                                role: "cleaner"
                            }).then(function () {
                                document.getElementById('profileImagePreview').src = "";
                                cleanerForm.reset();
                                regBtn.removeAttribute("disabled");
                                $('#spinner').addClass('hide');
                                $('.alert').text('Registered successfully').removeClass('alert-danger').addClass('alert-success').removeClass('invisible');
                                setTimeout(function () {
                                    $('.alert').addClass('invisible');
                                    location.reload();
                                }, 5000);
                            }).catch(function (error) {
                                // Handle Errors here.
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                $('#spinner').addClass('hide');
                                regBtn.removeAttribute("disabled");
                                $('.alert').text("Error registering user: ", errorMessage).addClass('alert-danger').removeClass('invisible');
                                setTimeout(function () {
                                    $('.alert').addClass('invisible');
                                }, 5000);
                                console.error("Error registering user: ", errorMessage);
                            });
                        }).catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            $('#spinner').addClass('hide');
                            regBtn.removeAttribute("disabled");
                            $('.alert').text("Error registering user: ", errorMessage).addClass('alert-danger').removeClass('invisible');
                            setTimeout(function () {
                                $('.alert').addClass('invisible');
                            }, 5000);
                            console.error("Error registering user: ", errorMessage);
                        });
                    });
                });


            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                $('#spinner').addClass('hide');
                regBtn.removeAttribute("disabled");
                $('.alert').text("Error registering user: ", errorMessage).addClass('alert-danger').removeClass('invisible');
                setTimeout(function () {
                    $('.alert').addClass('invisible');
                }, 5000);
                console.error("Error registering user: ", errorMessage);
            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            $('#spinner').addClass('hide');
            regBtn.removeAttribute("disabled");
            $('.alert').text("Error registering user: ", errorMessage).addClass('alert-danger').removeClass('invisible');
            setTimeout(function () {
                $('.alert').addClass('invisible');
            }, 5000);
            console.error("Error registering user: ", errorMessage);
        });

    }

}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profileImagePreview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}
// const fullname = document.querySelector('#fullName');
// const email = document.querySelector('#email');
// const phonenumber = document.querySelector('#phone');
// const gender = document.querySelector('#gender');
// const address = document.querySelector('#address');
// const state = document.querySelector('#state');
// const country = document.querySelector('#country');

// function renderUserData(doc){

//     fullname.textContent = doc.data().fullname.toUpperCase();
//     email.textContent = doc.data().email.toUpperCase();
//     phonenumber.textContent = doc.data().phonenumber.toUpperCase();
//     gender.textContent = doc.data().gender.toUpperCase();
//     address.textContent = doc.data().address.toUpperCase();
//     state.textContent = doc.data().state.toUpperCase();
//     country.textContent = doc.data().country.toUpperCase();
// }

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUi = (user) => {
    if (user) {
        // db.collection('users').doc(user.uid).get().then(doc => {
        //    renderUserData(doc);
        // })
        
        // if (user.admim) {
        //     window.location.replace("admin/dashboard.html");
        // } else {}


        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // renderUserData()
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}



var paystackReferenceId = "";
function payWithPaystack() {
    const phonenumber = document.getElementById('userphone').value;
    var handler = PaystackPop.setup({
        key: 'pk_test_fe167fe506747ccdf6c88ae8135a60c2e191d22e',
        email: document.getElementById("useremail").value,
        amount: totalAmount * 100,
        currency: "NGN",
        // ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
                {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: "+234" + phonenumber
                }
            ]
        },
        callback: function (response) {
            // alert('uccess transaction ref is ' + response.reference);
            paystackReferenceId = response.reference;

            submitToFirestore()
            return true
        },
        onClose: function () {
            return false
        }
    });
    handler.openIframe();
}

function onTimeChange(element) {
    let time;
    var timeSplit = element.value.split(':'),
        hours,
        minutes,
        meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
    } else if (hours < 12) {
        meridian = 'AM';
        if (hours == 0) {
            hours = 12;
        }
    } else {
        meridian = 'PM';
    }

    document.getElementById('time-format').value = hours + ':' + minutes + ' ' + meridian;
}

function submitToFirestore() {
    $(document).ready(function () {
        const bookingform = document.querySelector('#booking-form');
        // const brooms = bookingform['bedroom'].value;

        //get data
        const bduration = totalHours + " hours";
        const bamount = totalAmount.toLocaleString('en');
        const brooms = document.getElementById('bedroom').value;
        const bbath = document.getElementById('bathroom').value;
        const bservice = document.getElementById('service').value;
        const bproduct = $("input:radio[name=product]:checked").val();
        const bfrequency = document.getElementById('frequent').value;
        const bdate = document.getElementById('select-date').value;
        const btime = document.getElementById('time-format').value;
        const bname = document.getElementById('user-name').value;
        const bemail = document.getElementById('useremail').value;
        const bphone = document.getElementById('userphone').value;
        const bAltPhone = (document.getElementById('useralt') || {}).value;
        const baddress = document.getElementById('user-address').value;
        const blocation = document.getElementById('userstate').value + " ," + document.getElementById('usercountry').value;
        const binstructions = (document.getElementById('userinstruction') || {}).value;

        db.collection('bookings').doc().set({
            userId: auth.currentUser.uid,
            paystackId: paystackReferenceId,
            cleaningDuration: bduration,
            amount: bamount,
            numberOfRooms: brooms,
            numberOfBath: bbath,
            typeOfService: bservice,
            needCleaningProduct: bproduct,
            frequency: bfrequency,
            date: bdate,
            time: btime,
            customerName: bname,
            customerEmail: bemail,
            customerPhone: bphone,
            customerAltPhone: bAltPhone,
            customerAddress: baddress,
            customerLocation: blocation,
            specialInstruction: binstructions,
            bookedTime: firebase.firestore.FieldValue.serverTimestamp(),
            status: "Pending"
        }).then(() => {

            alert('Booked order successfully');
            location.reload();

            bookingform.reset();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/network-request-failed') {
                console.log('A network error has occurred, check your connection and try again.')
            } else {
                console.log(errorMessage);
            }
            console.log(error);
        });
    });
}

// function renderToTable(doc) {
//     var table = document.getElementById("dataTable");

//     var row = table.insertRow(1);
//     var idCell = row.insertCell(0);
//     var timeCell = row.insertCell(1);
//     var dateCell = row.insertCell(2);
//     var amountCell = row.insertCell(3);
//     var statusCell = row.insertCell(4);
//     var cleanerCell = row.insertCell(5);
//     var phoneCell = row.insertCell(6);

//     idCell.innerHTML = doc.id;
//     timeCell.innerHTML = doc.data().time;
//     dateCell.innerHTML = doc.data().date;
//     amountCell.innerHTML = doc.data().amount;
//     statusCell.innerHTML = "Waiting";
//     cleanerCell.innerHTML = "Not assigned";
//     phoneCell.innerHTML = doc.data().customerPhone;
// }


// function getTableData() {
//     // Get table data from firestore : Real-time listener
//     db.collection('bookings').where("userId", "==", auth.currentUser.uid).orderBy('bookedTime').onSnapshot(snapshot => {
//         let changes = snapshot.docChanges();

//         if (snapshot.size > 10) {
//             $('#moreBtn').addClass('show');
//         }
//         document.getElementById("no_of_news").textContent = snapshot.size;

//         changes.forEach(change => {
//             if (change.type == 'added') {
//                 renderToTable(change.doc);
//             }
//         });
//     });
// }

function getBriefTableData() {
    var dataSet = new Array();

    // Get news from firestore: Real-time listener
    var bookingRef = db.collection('bookings').where("userId", "==", auth.currentUser.uid);

    bookingRef.where("status", "==", "Completed").onSnapshot(snapshot => {
        document.getElementById("no_orders_done").textContent = snapshot.size;
    });

    bookingRef.onSnapshot(snapshot => {
        if (snapshot.size > 5) {
            $('#moreBtn').addClass('show');
        }
        document.getElementById("no_of_orders").textContent = snapshot.size;
    });

    bookingRef.orderBy('bookedTime').limit(5).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {

                var date = change.doc.data().bookedTime.seconds
                var formatDate = timeConverter(date)

                var uid = change.doc.id;
                var time = change.doc.data().time;
                var date = change.doc.data().date;
                var amount = change.doc.data().amount;
                var status = change.doc.data().status;


                let cleanerName = "Not assigned";
                let cleanerPhone = "None";
                // var cleaner = change.doc.data().cleanerId;
                // if (cleaner !== null && cleaner !== '') {
                //     db.collection('users').doc(cleaner).onSnapshot(function (doc) {
                //         // console.log("cleaner details = ", doc.data());
                //         cleanerName = doc.data().name;
                //         cleanerPhone = doc.data().phoneNumber;
                //     });
                // }

                dataSet.push([
                    uid,
                    formatDate,
                    time,
                    date,
                    amount,
                    status,
                    cleanerName,
                    cleanerPhone]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#dashboardTable').DataTable({
            data: dataSet,
            paging: false,
            pageLength: 5,
            searching: false,
            info: false,
            ordering: true,
            destroy: true,
            // pageLength: 5,
            order: [1, "desc"],
            columns: [
                { title: 'Order ID' },
                { title: 'Booking Timestamp' },
                { title: 'Cleaning Time' },
                { title: 'Cleaning Date' },
                { title: 'Amount(&#8358;)' },
                { title: 'Status' },
                { title: 'Assigned Cleaner' },
                { title: 'Cleaner Phone' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();
    });
}

function getTableData() {
    var dataSet = new Array();

    // Get news from firestore: Real-time listener
    db.collection('bookings').where("userId", "==", auth.currentUser.uid).orderBy('bookedTime').onSnapshot(snapshot => {
        // if (snapshot.size > 5) {
        //     $('#moreBtn').addClass('show');
        // }
        // document.getElementById("no_of_news").textContent = snapshot.size;

        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {

                let cleanerName = "Not assigned";
                let cleanerPhone = "None";
                // var cleaner = change.doc.data().cleanerId;
                // if (cleaner !== null || cleaner !== '' || cleaner !== undefined) {
                //     db.collection('users').doc(cleaner).onSnapshot(function (doc) {
                //         cleanerName = doc.data().name;
                //         cleanerPhone = doc.data().phoneNumber;
                //         console.log("cleaner details = ", cleanerName + ', ' + cleanerPhone);
                //     });
                // }

                var date = change.doc.data().bookedTime.seconds;
                var formatDate = timeConverter(date);
                dataSet.push([
                    change.doc.id,
                    formatDate,
                    change.doc.data().time,
                    change.doc.data().date,
                    change.doc.data().amount,
                    change.doc.data().status,
                    cleanerName,
                    cleanerPhone]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#historyTable').DataTable({
            data: dataSet,
            ordering: true,
            destroy: true,
            // pageLength: 5,
            order: [1, "desc"],
            columns: [
                { title: 'Order ID' },
                { title: 'Timestamp' },
                { title: 'Time' },
                { title: 'Date' },
                { title: 'Amount(&#8358;)' },
                { title: 'Status' },
                { title: 'Assigned Cleaner' },
                { title: 'Cleaner Phone' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();

        // $('#datepicker_from').addClass('date').attr('type','text');
        $("#datepicker_from").datepicker({
            "onSelect": function (date) {
                minDateFilter = new Date(date).getTime();
            }
        })

        $("#datepicker_to").datepicker({
            "onSelect": function (date) {
                maxDateFilter = new Date(date).getTime();
            }
        })

        $("#filter_date").click(function (e) {
            e.preventDefault();

            dataTable.draw();
        });

    });

    // Date range filter
    minDateFilter = "";
    maxDateFilter = "";

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (typeof data._date == 'undefined') {
                data._date = new Date(data[1]).getTime();
            }

            if (minDateFilter && !isNaN(minDateFilter)) {
                if (data._date < minDateFilter) {
                    return false;
                }
            }

            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (data._date > maxDateFilter) {
                    return false;
                }
            }

            return true;
        }
    );
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + '/' + date + '/' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}


function cleanerDashboardTableData() {
    var dataSet = new Array();

    // Get news from firestore: Real-time listener
    var bookingref = db.collection('bookings').where("cleanerId", "==", auth.currentUser.uid);

    bookingref.where("status", "==", "Completed").onSnapshot(snapshot => {
        document.getElementById("num_work_done").textContent = snapshot.size;
    });

    bookingref.onSnapshot(snapshot => {
        if (snapshot.size > 5) {
            $('#moreBtn').addClass('show');
        }
        document.getElementById("num_work").textContent = snapshot.size;
    });
    bookingref.orderBy('bookedTime').limit(5).onSnapshot(snapshot => {

        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {


                var bookedDate = change.doc.data().bookedTime.seconds;
                var formatDate = timeConverter(bookedDate);

                dataSet.push([
                    change.doc.id,
                    formatDate,
                    change.doc.data().date + " AT " + change.doc.data().time,
                    change.doc.data().customerName,
                    change.doc.data().customerAddress,
                    change.doc.data().typeOfService,
                    change.doc.data().status]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#cleanerDashboardTable').DataTable({
            data: dataSet,
            paging: false,
            pageLength: 5,
            searching: false,
            info: false,
            ordering: true,
            destroy: true,
            recordsTotal: 5,
            order: [1, "desc"],
            columns: [
                { title: 'Order ID' },
                { title: 'Booked Timestamp' },
                { title: 'Cleaning Timestamp' },
                { title: 'Customers Name' },
                { title: 'Customers Address' },
                { title: 'Type of Service' },
                { title: 'Status' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();
    });
}

function cleanerHistoryTableData() {
    var dataSet = new Array();

    db.collection('bookings').where("cleanerId", "==", auth.currentUser.uid).orderBy('bookedTime').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        console.log("changes", changes);
        changes.forEach(change => {
            if (change.type == 'added') {
                var date = change.doc.data().bookedTime.seconds;
                var formatDate = timeConverter(date);
                dataSet.push([
                    change.doc.id,
                    formatDate,
                    change.doc.data().date + " AT " + change.doc.data().time,
                    change.doc.data().customerName,
                    change.doc.data().customerAddress,
                    change.doc.data().typeOfService,
                    change.doc.data().status]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#cleanerHistoryTable').DataTable({
            data: dataSet,
            ordering: true,
            destroy: true,
            order: [1, "desc"],
            columns: [
                { title: 'Order ID' },
                { title: 'Booked Timestamp' },
                { title: 'Cleaning Timestamp' },
                { title: 'Customers Name' },
                { title: 'Customers Address' },
                { title: 'Type of Service' },
                { title: 'Status' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();

        $("#datepicker_from").datepicker({
            "onSelect": function (date) {
                minDateFilter = new Date(date).getTime();
            }
        })

        $("#datepicker_to").datepicker({
            "onSelect": function (date) {
                maxDateFilter = new Date(date).getTime();
            }
        })

        $("#filter_date").click(function (e) {
            e.preventDefault();

            dataTable.draw();
        });

    });

    // Date range filter
    minDateFilter = "";
    maxDateFilter = "";

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (typeof data._date == 'undefined') {
                data._date = new Date(data[1]).getTime();
            }

            if (minDateFilter && !isNaN(minDateFilter)) {
                if (data._date < minDateFilter) {
                    return false;
                }
            }

            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (data._date > maxDateFilter) {
                    return false;
                }
            }

            return true;
        }
    );
}
function getUserData() {
    var userRef = db.collection('users');
    userRef.where("userId", "==", auth.currentUser.uid).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {
                var name = change.doc.data().fullname;
                var email = change.doc.data().email;
                var img = change.doc.data()

                document.getElementById("adminName").textContent = name;
                document.getElementById("adminFullname").value = name;
                document.getElementById("adminEmail").value = email;
            }
        });
    });

    userRef.where("role", "==", "client").onSnapshot(snapshot => {
        document.getElementById("no_clients").textContent = snapshot.size;
    });

    userRef.where("role", "==", "cleaner").onSnapshot(snapshot => {
        document.getElementById("no_cleaners").textContent = snapshot.size;
    });

    var bookingRef = db.collection('bookings');
    bookingRef.onSnapshot(snapshot => {
        document.getElementById("no_jobs").textContent = snapshot.size;
    });

    bookingRef.onSnapshot(snapshot => {
        var dataSet = new Array();

        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {
                var amount = parseInt(change.doc.data().amount);
                dataSet.push([
                    amount]);
            }
        });

        // const sum = dataSet
        //     .map(v => v[0])
        //     .reduce((sum, current) => sum + current, 0);

        var sum = 0;
        for (var i = 0, len = dataSet.length; i < len; i++) {
            sum += dataSet[i][0];
        }

        document.getElementById("totalEarnings").textContent = "₦" + sum.toLocaleString();

    });

}


function getUserTableData() {
    var dataSet = new Array();
    var userRef = db.collection('users');

    userRef.onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {

                // var date = change.doc.data().timestamp.seconds;
                // var formatDate = timeConverter(date);

                var editBtn = '<button class="btn btn-sm btn-info">View/Edit</button>';
                var delBtn = '<button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>';


                dataSet.push([
                    "",
                    change.doc.data().fullname,
                    change.doc.data().email,
                    change.doc.data().role,
                    change.doc.data().timestamp.toDate(),
                    editBtn,
                    delBtn]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#usersTable').DataTable({
            data: dataSet,
            paging: false,
            pageLength: 5,
            searching: false,
            info: false,
            ordering: true,
            destroy: true,
            // pageLength: 5,
            order: [1, "asc"],
            columns: [
                { title: '#' },
                { title: 'Name' },
                { title: 'Email' },
                { title: 'Role' },
                { title: 'Registered Date' },
                { title: '' },
                { title: '' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();
    });
}

function getBookingTableData() {
    var dataSet = new Array();
    var bookingRef = db.collection('bookings');

    bookingRef.onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {

                // var date = change.doc.data().timestamp.seconds;
                // var formatDate = timeConverter(date);

                var editBtn = '<button class="btn btn-sm btn-info">View/Edit</button>';


                dataSet.push([
                    "",
                    change.doc.data().bookedTime.toDate(),
                    change.doc.data().customerName,
                    change.doc.data().customerAddress,
                    change.doc.data().status,
                    change.doc.data().typeOfService,
                    "₦" + change.doc.data().amount.toLocaleString(),
                    editBtn]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#bookingsTable').DataTable({
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
                { title: '#' },
                { title: 'Date booked' },
                { title: 'Client Name' },
                { title: 'Address' },
                { title: 'Status' },
                { title: 'Type of Service' },
                { title: 'Amount' },
                { title: '' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();
    });
}

function getMessagesTableData() {
    var dataSet = new Array();
    var userRef = db.collection('contact-messages');

    userRef.onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {

                var viewBtn = '<button class="btn btn-sm btn-info">View</button>';
                var replyBtn = '<button class="btn btn-sm btn-success">Reply</button>';


                dataSet.push([
                    "",
                    change.doc.data().fullname,
                    change.doc.data().message,
                    viewBtn,
                    replyBtn]);
            }
        })

        console.log("data", dataSet);

        const dataTable = $('#messagesTable').DataTable({
            data: dataSet,
            paging: false,
            pageLength: 5,
            searching: false,
            info: false,
            ordering: true,
            destroy: true,
            order: [1, "asc"],
            columns: [
                { title: '#' },
                { title: 'Sender Name' },
                { title: 'Messages' },
                { title: '' },
                { title: '' }
            ]
        });
        dataTable.clear();
        dataTable.rows.add(dataSet);
        dataTable.draw();
    });
}

//Log out admin
const logout = document.querySelector('#logout');
logout?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        window.open('../index.html');
        window.parent.close();
    });
});
const  { admin, db } = require('../util/admin');
const firebase = require('firebase/compat/app');
require("firebase/compat/firestore");


// new fields: 
// status: posted, in progress, completed, 
// user who was accepted
exports.getAllFavours = (request, response) => {
    db.collection('favours')
    .orderBy('timestamp_posted', 'desc')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            let is_requestor_accepted = 0;
            doc.data().requestors.forEach((requestor) => {
                if (requestor.isAccepted == 1) {
                    is_requestor_accepted = 1;
                }
            })

        if (is_requestor_accepted == 0 && doc.data().timestamp_due.toDate() > Date.now()) {
            favours.push({
                favour_id: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                urgent: doc.data().urgent,
                category: doc.data().category,
                poster: doc.data().poster,
                timestamp_posted: doc.data().timestamp_posted,
                timestamp_due: doc.data().timestamp_due,
                location: doc.data().location,
                requestors: doc.data().requestors,
                status: doc.data().status,
                completedBy: doc.data().completedBy,
            })
        }
        });
        return response.json(favours);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
};

// getAllFavours sorted by timestamp_due
exports.getAllFavoursSortedByDue = (request, response) => {
    db.collection('favours')
    .orderBy('timestamp_due', 'asc')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            let is_requestor_accepted = 0;
            doc.data().requestors.forEach((requestor) => {
                if (requestor.isAccepted == 1) {
                    is_requestor_accepted = 1;
                }
            })
    
            if (is_requestor_accepted == 0 && doc.data().timestamp_due.toDate() > Date.now()) {
                favours.push({
                    favour_id: doc.id,
                    title: doc.data().title,
                    body: doc.data().body,
                    urgent: doc.data().urgent,
                    category: doc.data().category,
                    poster: doc.data().poster,
                    timestamp_posted: doc.data().timestamp_posted,
                    timestamp_due: doc.data().timestamp_due,
                    location: doc.data().location,
                    requestors: doc.data().requestors,
                    status: doc.data().status,
                    completedBy: doc.data().completedBy
                });
            }
        });
        return response.json(favours);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
};

exports.getCasualFavours = (request, response) => {
    db.collection('favours')
    .orderBy('timestamp_posted', 'desc')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            var deadline = doc.data().timestamp_due.toDate();
            var now = Date.now();
            var timeLeft = deadline - now;

            let is_requestor_accepted = 0;
            doc.data().requestors.forEach((requestor) => {
                if (requestor.isAccepted == 1) {
                    is_requestor_accepted = 1;
                }
            })

            if (doc.data().category == "Casual" && timeLeft >= 0 && is_requestor_accepted == 0) {
                favours.push({
                favour_id: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                urgent: doc.data().urgent,
                category: doc.data().category,
                poster: doc.data().poster,
                timestamp_posted: doc.data().timestamp_posted,
                timestamp_due: doc.data().timestamp_due.toDate().toString(),
                location: doc.data().location,
                requestors: doc.data().requests,
                });
            }
        });
        return response.json(favours);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
}

exports.getCasualFavoursSortedByDue = (request, response) => {
    db.collection('favours')
    .orderBy('timestamp_due', 'asc')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            var deadline = doc.data().timestamp_due.toDate();
            var now = Date.now();
            var timeLeft = deadline - now;

            let is_requestor_accepted = 0;
            doc.data().requestors.forEach((requestor) => {
                if (requestor.isAccepted == 1) {
                    is_requestor_accepted = 1;
                }
            })

            if (doc.data().category == "Casual" && timeLeft >= 0 && is_requestor_accepted == 0) {
                favours.push({
                favour_id: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                urgent: doc.data().urgent,
                category: doc.data().category,
                poster: doc.data().poster,
                timestamp_posted: doc.data().timestamp_posted,
                timestamp_due: doc.data().timestamp_due.toDate().toString(),
                location: doc.data().location,
                requestors: doc.data().requests,
                });
            }
        });
        return response.json(favours);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
}

exports.getProfessionalFavours = (request, response) => {
    db.collection('favours')
    .orderBy('timestamp_posted', 'desc')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            var deadline = doc.data().timestamp_due.toDate();
            var now = Date.now();
            var timeLeft = deadline - now;

            let is_requestor_accepted = 0;
            doc.data().requestors.forEach((requestor) => {
                if (requestor.isAccepted == 1) {
                    is_requestor_accepted = 1;
                }
            })

            if (doc.data().category == "Professional" && timeLeft >= 0 && is_requestor_accepted == 0) {
                favours.push({
                favour_id: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                urgent: doc.data().urgent,
                category: doc.data().category,
                poster: doc.data().poster,
                timestamp_posted: doc.data().timestamp_posted,
                timestamp_due: doc.data().timestamp_due.toDate().toString(),
                location: doc.data().location,
                });
            }
        });
        return response.json(favours);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
}

exports.getProfessionalFavoursSortedByDue = (request, response) => {
    db.collection('favours')
    .orderBy('timestamp_due', 'asc')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            console.log(doc.data().timestamp_due.toDate().toString());
            var deadline = doc.data().timestamp_due.toDate();
            var now = Date.now();
            var timeLeft = deadline - now;

            let is_requestor_accepted = 0;
            doc.data().requestors.forEach((requestor) => {
                if (requestor.isAccepted == 1) {
                    is_requestor_accepted = 1;
                }
            })

            if (doc.data().category == "Professional" && timeLeft >= 0 && is_requestor_accepted == 0) {
                favours.push({
                favour_id: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                urgent: doc.data().urgent,
                category: doc.data().category,
                poster: doc.data().poster,
                timestamp_posted: doc.data().timestamp_posted,
                timestamp_due: doc.data().timestamp_due.toDate().toString(),
                location: doc.data().location,
                });
            }
        });
        return response.json(favours);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
}

// Get single favour by favour_id
exports.getSingleFavour = (request, response) => {
    if (request.params.favourId) {
        const favour_id = request.params.favourId;
        db.doc(`/favours/${favour_id}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let hasRequested = false;
                let requestStatus;
                console.log(request.user.username);

                doc.data().requestors.forEach((requestor) => {
                    if (requestor.username === request.user.username) {
                        hasRequested = true;
                        requestStatus = requestor.isAccepted;
                    }
                });

                if (hasRequested) {
                    return response.json({
                        favour_id: doc.id,
                        title: doc.data().title,
                        body: doc.data().body,
                        urgent: doc.data().urgent,
                        category: doc.data().category,
                        poster: doc.data().poster,
                        timestamp_posted: doc.data().timestamp_posted,
                        timestamp_due: doc.data().timestamp_due,
                        location: doc.data().location,
                        status: doc.data().status,
                        completedBy: doc.data().completedBy,
                        requestStatus: requestStatus
                    });
                }
                else {
                    // users who view their own favour can see their requestors
                    if (request.user.username === doc.data().poster) {
                        return response.json({
                            favour_id: doc.id,
                            title: doc.data().title,
                            body: doc.data().body,
                            urgent: doc.data().urgent,
                            category: doc.data().category,
                            poster: doc.data().poster,
                            timestamp_posted: doc.data().timestamp_posted,
                            timestamp_due: doc.data().timestamp_due,
                            location: doc.data().location,
                            status: doc.data().status,
                            completedBy: doc.data().completedBy,
                            requestors: doc.data().requestors,
                            requestStatus: requestStatus
                        });
                    } else {
                        return response.json({
                            favour_id: doc.id,
                            title: doc.data().title,
                            body: doc.data().body,
                            urgent: doc.data().urgent,
                            category: doc.data().category,
                            poster: doc.data().poster,
                            timestamp_posted: doc.data().timestamp_posted,
                            timestamp_due: doc.data().timestamp_due,
                            location: doc.data().location,
                            status: doc.data().status,
                            completedBy: doc.data().completedBy,
                            requestStatus: requestStatus
                        });
                    }
                }
            }
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
    } else {
        return response.status(400).json({ error: 'No favour_id provided' });
    }
};


exports.postSingleFavour = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({ body: 'Must not be empty' });
    }

    if (request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }

    if ((request.body.category.trim() != "Casual") && (request.body.category.trim() != "Professional")) {
        return response.status(400).json({ category: 'Category must be either Casual or Professional (case-sensitive)'});
    }

    if ((request.body.urgent != true) && (request.body.urgent != false)) {
        return response.status(400).json({ urgent: 'Urgent must be either true or false (boolean)' });
    }

    const newFavour = {
        title: request.body.title,
        body: request.body.body,
        urgent: request.body.urgent,
        category: request.body.category,
        poster: request.user.username,
        timestamp_posted: new Date(),
        timestamp_due: new Date(request.body.timestamp_due),
        location: request.body.location,
        completedBy: null,
        requestors: [],
    }
    db.collection('favours')
    .add(newFavour)
    .then((doc) => {
        const responseFavour = newFavour;
        responseFavour.favour_id = doc.id; // let Firebase handle the favour id
        return response.json(responseFavour);
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: 'Something went wrong' });
    });
};

exports.deleteFavour = (request, response) => {
    const documentToDelete = db.doc(`/favours/${request.params.favour_id}`);
    documentToDelete
    .get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Favour not found' });
        }
        if (doc.data().poster != request.user.username) {
            return response.status(401).json({ error: 'Not authorised to delete favour' })
        }
        return documentToDelete.delete();
    })
    .then(() => {
        response.json({message: 'Delete success' });
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });
};

exports.editFavour = (request, response) => {
    if (request.body.favour_id || request.body.timestamp_posted || request.body.poster || request.body.requestors || request.body.completedBy) {
        response.status(403).json({message : 'Not allowed to edit'});
    }

    let document = db.collection('favours').doc(`${request.params.favour_id}`);
    // Get favour poster and store in a variable called user
    
    document.get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Favour not found' });
        }
        if (doc.data().poster != request.user.username) {
            return response.status(401).json({ error: 'Not authorised to edit favour' })
        }
    });

    document.update(request.body)
    .then(() => {
        response.json({message: 'Update success'})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });
};

// Function that adds a request to a favour in the requests field, containing a JSON with the requestor's username, the timestamp of the request, and the requestor's message
exports.makeRequestToFavour = (request, response) => {
    const newRequest = {
        username: request.user.username,
        isAccepted: -1,
        message: request.body.message,
    }
    let document = db.collection('favours').doc(`${request.params.favour_id}`);
    
    // checks for the existence of the favour, or whether the request is being made to user's own favour
    document.get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Favour not found' });
        }
        if (doc.data().poster == request.user.username) {
            return response.status(401).json({ error: 'You cannot request your own favour' })
        }
    });

    // checks whether the requestor has already requested the favour
    document.get()
    .then((doc) => {
        doc.data().requestors.forEach((requestor) => {
            if (requestor.username == request.user.username) {
                return response.status(401).json({ error: 'You have already requested this favour' })
            }
        });
    });
    // adds the request to the requestors field
    document.update({
        requestors: admin.firestore.FieldValue.arrayUnion(newRequest)
    })
    .then(() => {
        response.json({message: 'Request success'})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });
};


// change the isAccepted field of a request to a new integer

exports.acceptRequest = (request, response) => {
    let document = db.collection('favours').doc(`${request.params.favour_id}`);
    // checks for the existence of the favour, or whether the request is being made to user's own favour
    // checks if the username is valid
    document.get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Favour not found' });
        }
        if (doc.data().poster != request.user.username) {
            return response.status(401).json({ error: 'You are unauthorised to accept requests posted by others' })
        }

        let requestor_found = 0;
        doc.data().requestors.forEach((requestor) => {
            if (requestor.username === request.body.requestor_username) {
                requestor_found = 1
            }
        })
        if (requestor_found == 0) {
            return response.status(404).json({ error: 'Requestor not found' });
        }
    });


    // Iterate through the requestors array, and change the isAccepted field of the request where the requestor's username matches the parameter username
    document.get()
    .then((doc) => {
        doc.data().requestors.forEach((requestor) => {
            if (requestor.username === request.body.requestor_username) {
                requestorToAccept = {...requestor, isAccepted: 1}
                document.update({
                    requestors: admin.firestore.FieldValue.arrayRemove(requestor)
                });
                document.update({
                    requestors: admin.firestore.FieldValue.arrayUnion(requestorToAccept)
                });
            }
            else {
                requestorToAccept = {...requestor, isAccepted: 0}
                document.update({
                    requestors: admin.firestore.FieldValue.arrayRemove(requestor)
                });
                document.update({
                    requestors: admin.firestore.FieldValue.arrayUnion(requestorToAccept)
                });
            }
        });
    })
    .then(() => {
            response.json({message: 'Request accepted'})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });
}

exports.rejectRequest = (request, response) => {
    let document = db.collection('favours').doc(`${request.params.favour_id}`);
    // checks for the existence of the favour, or whether the request is being made to user's own favour
    document.get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Favour not found' });
        }
        if (doc.data().poster != request.user.username) {
            return response.status(401).json({ error: 'You are unauthorised to reject requests posted by others' })
        }

        let requestor_found = 0;
        doc.data().requestors.forEach((requestor) => {
            if (requestor.username === request.body.requestor_username) {
                requestor_found = 1
            }
        })
        if (requestor_found == 0) {
            return response.status(404).json({ error: 'Requestor not found' });
        }
    });

    document.get()
    .then((doc) => {
        doc.data().requestors.forEach((requestor) => {
            if (requestor.username === request.body.requestor_username) {
                requestorToReject = {...requestor, isAccepted: 0}
                document.update({
                    requestors: admin.firestore.FieldValue.arrayRemove(requestor)
                });
                document.update({
                    requestors: admin.firestore.FieldValue.arrayUnion(requestorToReject)
                });
            }
        });
    })
    .then(() => {
        response.json({message: 'Request rejected'})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });
}


// Set the completedBy field of a favour to the username of the person who completed it in the request body
exports.setCompletedBy = (request, response) => {
    let document = db.collection('favours').doc(`${request.params.favour_id}`);
    // checks for the existence of the favour, or whether the request is being made to user's own favour
    document.get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({ error: 'Favour not found' });
        }
        if (doc.data().poster != request.user.username) {
            return response.status(401).json({ error: 'You are unauthorised to set favours posted by others as completed' })
        }
        if (doc.data().completedBy != null) {
            return response.status(401).json({ error: 'This favour has already been completed' })
        }
    });

    // if the username is invalid,  username

    // store a document reference to the users database
    let userRef = db.collection('users').doc(`${request.body.completedBy}`);
    let category;
    // get category of the favour matching the favour_id and store into a variable called category
    document.get()
    .then((doc) => {
        category = doc.data().category;
        userRef.update({
            favoursCompleted: admin.firestore.FieldValue.arrayUnion({
                date_completion: new Date(),
                favour_id: request.params.favour_id,
                type: category
            })
        })
    })
    .then(() => {
        response.json({message: 'Favour completed'})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });

    // Set the completedBy field of the favour to the username of the person who completed it
    document.update({
        completedBy: request.body.completedBy
        
    })
    .then(() => {
        response.json({message: 'Favour completed'})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    });
}

// Get all non-expired favours posted by user
// posted by user, not completed, not expired
exports.getAllNonExpiredFavours = (request, response) => {
    db.collection('favours')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            // check username and timestamp_due and is not completed yet
            if (request.params.username == doc.data().poster && 
                new Date() < doc.data().timestamp_due.toDate() && doc.data().completedBy == null) {
                favours.push({
                    favour_id: doc.id,
                    title: doc.data().title,
                    body: doc.data().body,
                    urgent: doc.data().urgent,
                    category: doc.data().category,
                    poster: doc.data().poster,
                    timestamp_posted: doc.data().timestamp_posted.toDate(),
                    timestamp_due: doc.data().timestamp_due.toDate().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
                    location: doc.data().location,
                    requestors: doc.data().requestors,
                    status: doc.data().status,
                    completedBy: doc.data().completedBy,
                });
            }
        });
        favours.sort((a, b) => { return b.timestamp_posted - a.timestamp_posted; });
        for (let i = 0; i < favours.length; i++) {
            favours[i].timestamp_posted = favours[i].timestamp_posted.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
        }

        if (favours.length == 0) {
            return response.json("This user does not have any non-expired favours")
        } else {
            return response.json({
                message: "Non-expired favours retrieved successfully",
                favours: favours
            });
        }

    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
};

// Get all past (completed/expired) favours posted by user
// posted by user, expired or completed
exports.getAllPastFavours = (request, response) => {
    db.collection('favours')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            // check username and timestamp_due
            if (request.params.username == doc.data().poster && 
                (new Date() > doc.data().timestamp_due.toDate() || doc.data().completedBy != null)) {
                favours.push({
                    favour_id: doc.id,
                    title: doc.data().title,
                    body: doc.data().body,
                    urgent: doc.data().urgent,
                    category: doc.data().category,
                    poster: doc.data().poster,
                    timestamp_posted: doc.data().timestamp_posted.toDate(),
                    timestamp_due: doc.data().timestamp_due.toDate().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
                    location: doc.data().location,
                    requestors: doc.data().requestors,
                    status: doc.data().status,
                    completedBy: doc.data().completedBy,
                });
            }
        });
        favours.sort((a, b) => { return b.timestamp_posted - a.timestamp_posted; });
        for (let i = 0; i < favours.length; i++) {
            favours[i].timestamp_posted = favours[i].timestamp_posted.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
        }

        if (favours.length == 0) {
            return response.json("This user does not have any past favours")
        } else {
            return response.json({
                message: "Past favours retrieved successfully",
                favours: favours
            }); 
        }
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
};

// All in progress favours that the user is doing
// posted by others, accepeted by user, not completed, not expired
exports.getAllInProgressFavours = (request, response) => {
    db.collection('favours')
    .get()
    .then((data) => {
        let favours = [];
        data.forEach((doc) => {
            // favour is not yet completed
            if (doc.data().completedBy == null) {
                doc.data().requestors.forEach((requestor) => {
                    // user is accepted as a requestor
                    if (requestor.isAccepted == 1 && requestor.username == request.params.username
                        && new Date() < doc.data().timestamp_due.toDate() && doc.data().completedBy == null) {
                        favours.push({
                            favour_id: doc.id,
                            title: doc.data().title,
                            body: doc.data().body,
                            urgent: doc.data().urgent,
                            category: doc.data().category,
                            poster: doc.data().poster,
                            timestamp_posted: doc.data().timestamp_posted.toDate(),
                            timestamp_due: doc.data().timestamp_due.toDate().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
                            location: doc.data().location,
                            requestors: doc.data().requestors,
                            status: doc.data().status,
                            completedBy: doc.data().completedBy,
                        });
                    }
                })
            }
        });
        favours.sort((a, b) => { return b.timestamp_posted - a.timestamp_posted; });
        for (let i = 0; i < favours.length; i++) {
            favours[i].timestamp_posted = favours[i].timestamp_posted.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
        }

        if (favours.length == 0) {
            return response.json("This user does not have any in-progress favours")
        } else {
            return response.json({
                message: "In-progress favours retrieved successfully",
                favours: favours
            }); 
        }
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
    }); 
};

// All favours that the user has fulfilled for others
// posted by others, completed by user
exports.getAllFavoursCompletedByUser = (request, response) => {
	db
		.collection('favours')
		.get()
		.then((data) => {
            let favours = [];
            data.forEach((doc) => {
                // check if favour is completed by user
                if (doc.data().completedBy == request.params.username) {
                    favours.push({
                        favour_id: doc.id,
                        title: doc.data().title,
                        body: doc.data().body,
                        urgent: doc.data().urgent,
                        category: doc.data().category,
                        poster: doc.data().poster,
                        timestamp_posted: doc.data().timestamp_posted.toDate(),
                        timestamp_due: doc.data().timestamp_due.toDate().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
                        location: doc.data().location,
                        requestors: doc.data().requestors,
                        status: doc.data().status,
                        completedBy: doc.data().completedBy,
                    })
                }
            })
            favours.sort((a, b) => { return b.timestamp_posted - a.timestamp_posted; });
            for (let i = 0; i < favours.length; i++) {
                favours[i].timestamp_posted = favours[i].timestamp_posted.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
            }

            if (favours.length == 0) {
                return response.json("This user has not completed any favours")
            } else {
                return response.json({
                    message: "Retrieved favours completed by user successfully",
                    favours: favours
                })
            }
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({ error: error.code });
		});
}


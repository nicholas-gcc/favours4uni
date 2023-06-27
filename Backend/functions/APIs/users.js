const { admin, db } = require('../util/admin');
const config = require('../util/config');

require("firebase/compat/auth");
require("firebase/compat/firestore");
const firebase = require('firebase/compat/app');


firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require('../util/validators');

// Login
exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const { valid, errors } = validateLoginData(user);
	if (!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((error) => {
            console.error(error);
            return response.status(403).json({ general: 'wrong credentials, please try again'});
        })
};

// Sign Up 
exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
		    password: request.body.password,
		    username: request.body.username,
        telegramHandle: request.body.telegramHandle,
        bio: request.body.bio,
        isAdmin: false
    };

    const { valid, errors } = validateSignUpData(newUser);

	if (!valid) return response.status(400).json(errors);

    let token, userId;
    db
        .doc(`/users/${newUser.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({ username: 'this username is already taken' });
            } else {
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(
                            newUser.email, 
                            newUser.password
                    );
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idtoken) => {
            token = idtoken;
            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                phoneNumber: newUser.phoneNumber,
                telegram: newUser.telegramHandle,
                email: newUser.email,
                bio: newUser.bio,
                createdAt: new Date().toISOString(),
                userId,
                favoursCompleted: []
            };
            return db
                    .doc(`/users/${newUser.username}`)
                    .set(userCredentials);
        })
        .then(()=>{
            return response.status(201).json({ token });
        })
        .catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return response.status(400).json({ email: 'Email already in use' });
			} else {
				return response.status(500).json({ general: 'Something went wrong, please try again' });
			}
		});
}

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
    .then(() => {
        return
    })
    .catch((error) => {
        return
    })
}

// Upload profile picture
exports.uploadProfilePhoto = (request, response) => {
    const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');
	const busboy = new BusBoy({ headers: request.headers });

	let imageFileName;
	let imageToBeUploaded = {};

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
			return response.status(400).json({ error: 'Wrong file type submited' });
		}
		const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${request.user.username}.${imageExtension}`;
		const filePath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = { filePath, mimetype };
		file.pipe(fs.createWriteStream(filePath));
    });
    deleteImage(imageFileName);
	busboy.on('finish', () => {
		admin
			.storage()
			.bucket()
			.upload(imageToBeUploaded.filePath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: imageToBeUploaded.mimetype
					}
				}
			})
			.then(() => {
				const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
				return db.doc(`/users/${request.user.username}`).update({
					imageUrl
				});
			})
			.then(() => {
				return response.json({ message: 'Image uploaded successfully' });
			})
			.catch((error) => {
				console.error(error);
				return response.status(500).json({ error: error.code });
			});
	});
	busboy.end(request.rawBody);
};

// Get User Details
exports.getUserDetails = (request, response) => {
    let userData = {};
	db
		.doc(`/users/${request.user.username}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
                userData.userCredentials = doc.data();
                return response.json(userData);
			}	
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({ error: error.code });
		});
}

// Update User Details
exports.updateUserDetails = (request, response) => {
    let document = db.collection('users').doc(`${request.user.username}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((error) => {
        console.error(error);
        return response.status(500).json({ 
            message: "Cannot Update the value"
        });
    });
}

exports.getMostCasualFavoursCompleted = (request, response) => {
    db.collection('users')
        .get()
        .then((data) => {
            let casualFavoursCount = [];
            data.forEach((doc) => {
                let counter = 0;
                for (let i = 0; i < doc.data().favoursCompleted.length; i++) {
                    if ((doc.data().favoursCompleted)[i].type == 'Casual') {
                        counter++;
                    }
                }
                casualFavoursCount.push([counter, doc.data().username, doc.data().imageUrl]);
            })
            topFour = casualFavoursCount.sort().reverse().slice(0, 4);
            return response.json(topFour);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        }); 
};

exports.getMostProfessionalFavoursCompleted = (request, response) => {
    db.collection('users')
        .get()
        .then((data) => {
            let professionalFavoursCount = [];
            data.forEach((doc) => {
                let counter = 0;
                for (let i = 0; i < doc.data().favoursCompleted.length; i++) {
                    if ((doc.data().favoursCompleted)[i].type == 'Professional') {
                        counter++;
                    }
                }
                professionalFavoursCount.push([counter, doc.data().username, doc.data().imageUrl]);
            })
            topFour = professionalFavoursCount.sort().reverse().slice(0, 4);
            return response.json(topFour);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        }); 
};

exports.getMostCasualFavoursCompletedByMonth = (request, response) => {
    db.collection('users')
        .get()
        .then((data) => {
            const month = new Date().getMonth();
            let casualFavoursCount = [];
            data.forEach((doc) => {
                let counter = 0;
                for (let i = 0; i < doc.data().favoursCompleted.length; i++) {
                    const favour = (doc.data().favoursCompleted)[i];
                    if ((favour.date_completion.toDate().getMonth() == month) && (favour.type == 'Casual')) {
                        counter++;
                    }
                }
                casualFavoursCount.push([counter, doc.data().username, doc.data().imageUrl]);
            })
            topFour = casualFavoursCount.sort().reverse().slice(0, 4);
            return response.json(topFour);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        }); 
};

exports.getMostProfessionalFavoursCompletedByMonth = (request, response) => {
    db.collection('users')
        .get()
        .then((data) => {
            const month = new Date().getMonth();
            let professionalFavoursCount = [];
            data.forEach((doc) => {
                let counter = 0;
                for (let i = 0; i < doc.data().favoursCompleted.length; i++) {
                    const favour = (doc.data().favoursCompleted)[i];
                    if ((favour.date_completion.toDate().getMonth() == month) && (favour.type == 'Professional')) {
                        counter++;
                    }
                }
                professionalFavoursCount.push([counter, doc.data().username, doc.data().imageUrl]);
            })
            topFour = professionalFavoursCount.sort().reverse().slice(0, 4);
            return response.json(topFour);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        }); 
};

// create an async function to get image url of a user
const getImageUrl = async (username) => {
    const user = await db.doc(`/users/${username}`).get();
    if (user.exists) {
        return user.data().imageUrl;
    }
    return null;
}

// Get Image Url
exports.getImageUrl = (request, response) => {
	db
		.doc(`/users/${request.params.username}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
                return response.status(404).json("This user does not exist")
			} else {
                return response.json({
                    message: "Image Url retrieved successfully",
                    imageUrl: doc.data().imageUrl
                })
            }	
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({ error: error.code });
		});
}


// Get User Details for Favours Completed
exports.getAnotherUserDetails = (request, response) => {
	db
		.doc(`/users/${request.params.username}`)
		.get()
		.then((doc) => {
            if (!doc.exists) {
                return response.status(404).json("This user does not exist")
            } else {
                let favours = [];
                doc.data().favoursCompleted.forEach((favour) => {
                    favours.push({
                        date_completion: favour.date_completion.toDate(),
                        favour_id: favour.favour_id,
                        type: favour.type
                    })
                })
                favours.sort((a, b) => { return b.date_completion - a.date_completion; });
                for (let i = 0; i < favours.length; i++) {
                    favours[i].date_completion = favours[i].date_completion.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                }
                
                return response.json({
                    messages: "Retrieved another user's details successfully",
                    bio: doc.data().bio,
                    email: doc.data().email,
                    telegram: doc.data().telegram,
                    username: doc.data().username,
                    imageUrl: doc.data().imageUrl,
                    favoursCompleted: favours
                });
            }	
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({ error: error.code });
		});
}

exports.getFavoursCompletedByUser = (request, response) => {
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
                        category: doc.data().category,
                        location: doc.data().location,
                    })
                }
            })

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
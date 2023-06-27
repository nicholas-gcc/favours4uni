const  { admin, db } = require('../util/admin');
const firebase = require('firebase/compat/app');
require("firebase/compat/firestore");

// Send message to a chat and returns all messages in the chat
exports.sendMessage = (request, response) => {
    let messages = [];
    const message = {
        message: request.body.message,
        time: new Date(),
        sender: request.user.username
    };
    const chatId = request.params.chatId;
    db
        .doc(`/chats/${chatId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Chat not found' })
            } else {
                db.doc(`/chats/${chatId}`).update({
                    messages: admin.firestore.FieldValue.arrayUnion(message),
                    most_recent_activity: message.time
                });
                db
                .doc(`/chats/${chatId}`)
                .get()
                .then((doc) => {
                    doc.data().messages.forEach((message) => {
                        messages.push({
                            sender: message.sender,
                            message: message.message,
                            time_sent: message.time.toDate()
                        })
                    });
                    messages.sort((a, b) => { return b.time_sent - a.time_sent; });
                    for (let i = 0; i < messages.length; i++) {
                        messages[i].time_sent = messages[i].time_sent.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                    }
                    return response.json({ 
                        message: 'Message sent successfully and most recent activity updated',
                        messages: messages
                    });
                })
            }

        })
        .catch((error) => {
            return response.status(500).json({ error: error.code });
        });
}

// Get all messages between two users, create a new chat if it doesn't exist
exports.postSingleChat = (request, response) => {
    const user1 = request.user.username.trim();
    const user2 = request.body.receiver.trim();

    // user2 (receiver) has to be a valid username
    let is_valid_receiver = false;
    db.collection('users')
    .get()
    .then((data) => {
        data.forEach((doc) => {
            if (doc.id == user2) {
                is_valid_receiver = true;
            }
        })
        if (!is_valid_receiver || (user2 === '')) {
            return response.status(400).json("Invalid receiver username")
        }
    }) 

    // create custom chat ID
    const chatId = user1 < user2 ? user1 + "-" + user2 : user2 + "-" + user1;
    let messages = [];
    db.doc(`/chats/${chatId}`)
    .get()
    .then((doc) => {
        if (doc.exists) {
            // get chat
            doc.data().messages.forEach((message) => {
                messages.push({
                    sender: message.sender,
                    message: message.message,
                    time_sent: message.time.toDate(),
                })
            });
            // sort messages according to latest time sent
            messages.sort((a, b) => { return b.time_sent - a.time_sent; });
            for (let i = 0; i < messages.length; i++) {
                messages[i].time_sent = messages[i].time_sent.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
            }
            return response.json({
                message: "Chat retrieved successfully",
                chatId: chatId,
                body: {
                    parties: doc.data().parties,
                    messages: messages,
                }
            });
        } else {
            // create chat if receiver is a valid username
            let is_valid_receiver = false;
            db.collection('users')
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    if (doc.id == user2) {
                        is_valid_receiver = true;
                    }
                })
                if (!is_valid_receiver || (user2 === '')) {
                    return response.status(400).json("Invalid receiver username")
                }
                const newChat = {
                    parties: [user1, user2],
                    most_recent_activity: null,
                    messages: []
                }
                db.collection('chats')
                .doc(chatId)
                .set(newChat)
                .then(() => {
                    return response.json({
                        message: "New chat created!",
                        chatId: chatId,
                        body: newChat,
                    });
                })
                .catch((err) => {
                    return response.status(500).json({ error: err.code });
                });
            })  
        }
    })
    .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
    });
}


// Get all chats of a user
exports.getAllChats = (request, response) => {
    let chats = [];
    db
        .collection('chats')
        .where('parties', 'array-contains', request.params.username)
        .get()
        .then((data) => {
            if (!data) {
                return response.json("This user does not have any chats")
            }
            data.forEach((doc) => {

                if (doc.data().most_recent_activity != null) {
                    let receiver;
                    let receiver_imageUrl;
                    // get imageUrl of receiver
                    doc.data().parties.forEach((party) => {
                        if (party != request.params.username) {
                            receiver = party;
                        }
                    })

                    chats.push({
                        chatId: doc.id,
                        most_recent_activity: doc.data().most_recent_activity.toDate(),
                        receiver_imageUrl: receiver_imageUrl,
                        parties: doc.data().parties,
                        messages: doc.data().messages
                    });
                }
            });
            chats.sort((a, b) => { return b.most_recent_activity - a.most_recent_activity });

            // time formatting
            for (let i = 0; i < chats.length; i++) {
                chats[i].most_recent_activity = chats[i].most_recent_activity.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                
                // messages returns in order of latest time sent
                chats[i].messages.sort((a, b) => { return b.time - a.time; });
                for (let j = 0; j < chats[i].messages.length; j++) {
                    chats[i].messages[j].time = chats[i].messages[j].time.toDate().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                }
            }
            if (chats.length == 0) {
                return response.json("This user does not have any chats")
            } else {
                return response.json({
                    message: 'All chats retrieved successfully!',
                    chats: chats
                });
            }
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ error: error.code });
        });
}
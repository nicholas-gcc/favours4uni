const functions = require("firebase-functions");
const app = require('express')();
const auth = require('./util/auth');
const cors = require("cors")({
    origin: "*"
});
app.use("*", cors);

const {
    getAllFavours,
    getAllFavoursSortedByDue,
    getSingleFavour,
    postSingleFavour,
    deleteFavour,
    editFavour,
    getCasualFavours,
    getCasualFavoursSortedByDue,
    getProfessionalFavours,
    getProfessionalFavoursSortedByDue,
    makeRequestToFavour,
    acceptRequest,
    rejectRequest,
    setCompletedBy,
    getAllNonExpiredFavours,
    getAllPastFavours,
    getAllInProgressFavours,
    getAllFavoursCompletedByUser
} = require('./APIs/favours')

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetails,
    updateUserDetails,
    getMostCasualFavoursCompleted,
    getMostProfessionalFavoursCompleted,
    getMostCasualFavoursCompletedByMonth,
    getMostProfessionalFavoursCompletedByMonth,
    getImageUrl,
    getAnotherUserDetails,
    getFavoursCompletedByUser
} = require('./APIs/users')

const {
    postSingleChat,
    sendMessage,
    getAllChats
} = require('./APIs/chats')

// Favours
app.get('/favours', getAllFavours);
app.get('/favours/sort/due', getAllFavoursSortedByDue);
app.get('/favours/get/:favourId', auth, getSingleFavour);
app.post('/favour', auth, postSingleFavour);
app.delete('/favour/:favour_id', auth, deleteFavour);
app.put('/favour/:favour_id', auth, editFavour);
app.put('/request/:favour_id', auth, makeRequestToFavour);
app.put('/accept_request/:favour_id', auth, acceptRequest);
app.put('/reject_request/:favour_id', auth, rejectRequest);
app.put('/completed/:favour_id', auth, setCompletedBy);
app.get('/favours/casual', getCasualFavours);
app.get('/favours/casual/sort_due', getCasualFavoursSortedByDue);
app.get('/favours/professional', getProfessionalFavours);
app.get('/favours/professional/sort_due', getProfessionalFavoursSortedByDue);
app.get('/favours/nonExpired/:username', auth, getAllNonExpiredFavours);
app.get('/favours/past/:username', auth, getAllPastFavours);
app.get('/favours/inProgress/:username', auth, getAllInProgressFavours);
app.get('/favours/completed/:username', auth, getAllFavoursCompletedByUser);

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetails);
app.post('/user', auth, updateUserDetails);
app.get('/user/topFourCasual', getMostCasualFavoursCompleted);
app.get('/user/topFourProfessional', getMostProfessionalFavoursCompleted);
app.get('/user/topFourCasual/monthly', getMostCasualFavoursCompletedByMonth);
app.get('/user/topFourProfessional/monthly', getMostProfessionalFavoursCompletedByMonth);
app.get('/user/imageUrl/:username', getImageUrl);
app.get('/user/:username', auth, getAnotherUserDetails);
app.get('/user/favoursCompleted/:username', auth, getFavoursCompletedByUser);


// Chats
app.post('/chats', auth, postSingleChat);
app.put('/chats/:chatId', auth, sendMessage);
app.get('/chats/:username', auth, getAllChats);

exports.api = functions.https.onRequest(app);
import { Injectable } from '@angular/core';
import { AppService } from './app.service';


@Injectable()
export class ServicesService extends AppService {
    // 1.1 Login
    login() {
        return `/login`;
    }

    // 1.2 Sign Up
    signup() {
        return `/signup`;
    }

    // 1.3 Upload Profile Photo
    uploadProfilePhoto() {
        return `/user/image`;
    }

    // 1.4 Get User Details
    // 1.5 Update User Details
    getUserDetails() {
        return `/user`;
    }

    updateUserDetails() {
        return `/user`;
    }

    // 1.6 Get Top Four Casual
    getTopFourCasual() {
        return `/user/topFourCasual`;
    }

    // 1.7 Get Top Four Professional
    getTopFourProfessional() {
        return `/user/topFourProfessional`;
    }

    // 1.8 Get Top Four Casual (Month)
    getTopFourCasualMonth() {
        return `/user/topFourCasual/monthly`;
    }

    // 1.9 Get Top Four Professional (Month)
    getTopFourProfessionalMonth() {
        return `/user/topFourProfessional/monthly`;
    }

    // 1.10 Get Image Url
    getImageUrl(id:string) {
        return `/user/imageUrl/${id}`;
    }

    // 1.11 Get Another User's Details
    getOtherUserDetails(id:string) {
        return `/user/${id}`;
    }

    // 1.12 Get Favours Completed By User
    getFavoursCompletedByUser(id:string) {
        return `/user/favoursCompleted/${id}`;
    }

    // 2.1 Get All Favours
    getAllFavours() {
        return `/favours`;
    }

    // 2.2 Get All Casual Favours
    getAllCasualFavours() {
        return `/favours/casual`;
    }

    // 2.3 Get All Professional Favours
    getAllProfessionalFavours() {
        return `/favours/professional`;
    }

    // 2.4 Post Single Favour
    postSingleFavour() {
        return `/favour`;
    }

    // 2.5 Delete Favours
    // 2.6 Edit Favour
    deleteFavour(id:string) {
        return `/favour/${id}`;
    }

    // 2.7 Make Request to Favour
    makeRequestToFavour(id:string) {
        return `/request/${id}`;
    }

    // 2.8 Get Single Favour
    getSingleFavour(id:string) {
        return `/favours/get/${id}`;
    }

    // 2.9 Accept Request
    acceptRequest(id:string) {
        return `/accept_request/${id}`
    }

    // 2.10 Reject Request
    rejectRequest(id:string) {
        return `/reject_request/${id}`
    }

    // 2.11 Set Completed By
    setCompletedBy(id:string) {
        return `/completed/${id}`
    }

    // 2.12 Get all non expired Favours
    getAllNonExpiredFavours(username:string) {
        return `/favours/nonExpired/${username}`;
    }

    // 2.13 Get all past Favours
    getAllPastFavours(username:string) {
        return `/favours/past/${username}`;
    }

    // 2.14 Get all in progress Favours
    getAllInProgressFavours(username:string) {
        return `/favours/inProgress/${username}`;
    }

    // 2.15 Get all completed Favours
    getAllFavoursCompletedByUser(username:string) {
        return `/favours/completed/${username}`;
    }

    // 2.16 Get all Casual Favours (Sort by Deadline)
    getAllCasualFavoursSort() {
        return `/favours/casual/sort_due`;
    }

    // 2.17 Get all Professional Favours (Sort by Deadline)
    getAllProfessionalFavoursSort() {
        return `/favours/professional/sort_due`;
    }


    // 3.1 Post Single Chat
    postSingleChat() {
        return `/chats`;
    }

    // 3.2 Send Message
    sendMessage(id:string) {
        return `/chats/${id}`;
    }

    // 3.3 Get all Chat
    getAllChat(id:string) {
        return `/chats/${id}`;
    }
}
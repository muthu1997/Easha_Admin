import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API} from "../constants/config";
import * as STRINGS from "../constants/strings";
import { err } from 'react-native-svg/lib/typescript/xml';

const header1 = {
    'Content-Type': 'application/json',
    "Accept": "application/json"
} 
export async function postMethod(url, body) {
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .post(`${API}${url}`, body, {headers: header1})
            .then((res) => {
                if(res.data.success) {
                    return resolve(res.data);
                }else {
                    return reject(-1)
                }
            })
            .catch((error) => {console.log("err: ",error.response);return reject(error)});
    })
}

export async function getMethod(url) {
    console.log(url)
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .get(`${API}${url}`, {headers:  header1})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((error) => {
                // console.log("Error: ",error.response.data)
                return reject(-1)
            });
    })
}

export async function deleteMethod(url, callback) {
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .delete(`${API}${url}`, {headers:  header1})
            .then((res) => {
                return resolve(res);
            })
            .catch((error) => {console.log(error.response);return reject(-1)});
    })
}

export async function putMethod(url, body) {
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .put(`${API}${url}`, body, {headers:  header1})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((error) => {return reject(error.response)});
    })
}

export async function uploadImage(localImage, name, callback) {
    return new Promise(async(resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "multipart/form-data");
        var formdata = new FormData();
        formdata.append("file", { uri: localImage, name: `${name}.jpg`, type: 'image/jpg' });
        formdata.append("upload_preset", "nukwtgp8");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        await fetch("https://api.cloudinary.com/v1_1/easha-arts/image/upload", requestOptions)
            .then(response => response.json())
            .then(result => {
                return resolve(result.url);
            })
            .catch(error => {
                console.log(error)
                return reject(-1)
            });
    })
}

export const sendFirebaseNotification = async (message, token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "key=AAAAQSdTRPE:APA91bEjIUQi_TuU-823TMlY038XlN5Y6bEGvD1Wf8o8elCAXCtXHd1RKYmmEdv_R3w7aum1k2VowRhn-xRYmrsA660mw1IpO_mU7b53oQsNKAvydtHOgEh1KpbEag_ljz8mx-VZMeGw");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "notification": {
            "title": "Easha Arts",
            "body": message,
        },
        "data": {

        },
        "to": token
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
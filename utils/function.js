import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API} from "../constants/config";
import * as STRINGS from "../constants/strings";

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
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .get(`${API}${url}`, {headers:  header1})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((error) => {return reject(-1)});
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
            .catch((error) => {return reject(-1)});
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
    myHeaders.append("Authorization", "key=AAAAIKn5mgg:APA91bFLt3pE2GaHcMNPzBKPddQtcfPaZcuiUHLsIgK63f4jXFKJpQmj5RBUC_ho7jLGg00EkcHyrdjCBd6DG0D-oYgyBn3WcyPAyxkb13Qai8HST2DrUr-Of4vKwXbWd7XhOIVDI3i4");
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
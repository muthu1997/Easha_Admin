import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {API} from "../constants/config";

export async function postMethod(url, body) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        }
        return await axios
            .post(`${API}${url}`, body, headers)
            .then((res) => {
                if(res.data.success) {
                    return resolve(res.data);
                }else {
                    return reject(-1)
                }
            })
            .catch((error) => {console.log("err: ",error.response.data);return reject(-1)});
    })
}

export function getMethod(url) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            'Content-Type': "application/json"
        }
        return await axios
            .get(`${API}${url}`, headers)
            .then((res) => {
                return resolve(res.data);
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
                return reject(-1)
            });
    })
}

export function deleteMethod(url, callback) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            'Content-Type': "application/json"
        }
        return await axios
            .delete(`${API}${url}`, headers)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => reject(-1));
    })
}

export async function putMethod(url, body) {
    return new Promise(async (resolve, reject) => {
        const headers = {
            'Content-Type': "application/json"
        }
        return await axios
            .put(`${API}${url}`, body, headers)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => reject(-1));
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
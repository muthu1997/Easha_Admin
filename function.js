import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

export async function postMethod(url, body, callback) {
    console.log("body: ", body)
    const headers = {
        'Content-Type': 'application/json'
    }
    return await axios
        .post(`http://eshabackend.herokuapp.com/v1/${url}`, body, headers)
        .then((res) => {
            console.log("res: ", res)
            callback(res);
        })
        .catch((error) => callback("error"));
}

export async function postBanner(body, imgId, callback) {
    console.log(`https://kuvagambackend.herokuapp.com/api/v1/common/slider/${imgId}`)
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    return await axios
        .put(`https://kuvagambackend.herokuapp.com/api/v1/common/slider/${imgId}`, body, headers)
        .then((res) => {
            console.log("res: ", res)
            callback(res);
        })
        .catch((error) => console.log(error));
}

export function getMethod(url, callback) {
    RNFetchBlob.config({
        trusty: true
    })
        .fetch('GET', `http://eshabackend.herokuapp.com/v1/${url}`, {
            Accept: 'application/json',
            'Content-Type': "application/json"
        }
        )
        .then((response) => response.json())
        .then(async (responseJson) => {
            callback(responseJson);
        }).catch(error => {
            console.log(error);
            callback("error");
        })
}

export function deleteMethod(url, callback) {
    RNFetchBlob.config({
        trusty: true
    })
        .fetch("DELETE", `http://eshabackend.herokuapp.com/v1/${url}`, {
            Accept: 'application/json',
            'Content-Type': "application/json"
        }
        )
        .then((response) => response.json())
        .then(async (responseJson) => {
            callback(responseJson);
        });
}

export async function putMethod(url, body, callback) {
    RNFetchBlob.config({
        trusty: true
    })
        .fetch('PUT', `http://eshabackend.herokuapp.com/v1/${url}`, {
            Accept: 'application/json',
            'Content-Type': "application/json"
        },
            JSON.stringify(body)
        )
        .then((response) => response.json())
        .then(async (responseJson) => {
            callback(responseJson);
        }).catch(err => callback("error"))
}

export async function uploadImage(localImage, name, callback) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "multipart/form-data");

    var formdata = new FormData();
    formdata.append("file", {uri: localImage, name: `${name}.jpg`,type: 'image/jpg'});
    formdata.append("upload_preset", "nukwtgp8");
    console.log(formdata)
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    await fetch("https://api.cloudinary.com/v1_1/easha-arts/image/upload", requestOptions)
        .then(response => response.json())
        .then(result => {
                callback(result.url);
            console.log(result)
            console.log(result.url)
        })
        .catch(error => {console.log(error)
            callback("error")});
}
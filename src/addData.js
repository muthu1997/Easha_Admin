/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    TouchableOpacity,
    Dimensions,
    Image,
    View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Button from '../component/button';
import Input from '../component/inputBox';
import MultiBtn from '../component/groupBtn';
import { postMethod, getMethod } from '../function';
const FormData = require('form-data');

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'list',
            listData: [],
            listType: 'news',
            title: '',
            description: '',
            date: '',
            type: '',
            designation: '',
            name: '',
            mobile: '',
            url: '',
            image: '',
            localimage: '',
            imageData: ''
        }
        this.getMainData();
        global.name = 'value'
    }

    setDateFunction = (data) => {
        let result = data.length == 2 ? data + '-' : data.length == 5 ? data + '-' : data;
        this.setState({ date: result })
    }

    getMainData = async () => {
        await getMethod(this.state.listType, res => {
            this.setState({ listData: res.result });
        })
    }

    imageHandler = () => {
        let mediaType = "photo";
        const photooptions = {
            title: "Attach Files",
            mediaType: mediaType,
            takePhotoButtonTitle: "Take a Photo",
            maxWidth: 640,
            maxHeight: 256,
            noData: true,
            allowsEditing: true,
        };
        let options = photooptions;
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log(response.didCancel)
            } else if (response.error) {
                console.log(response.error)
            } else {
                console.log(response.assets[0].uri)
                RNFetchBlob.fs.stat(response.assets[0].uri)
                    .then(async (stats) => {
                        if ((stats.size / 1024 / 1024) > 1) {
                            alert("Photo not allowed Greater than 1 MB");
                        } else {
                            console.log(response)
                            this.setState({ image: response.assets[0].uri, imageData: response.assets[0] });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
        });
    };

    setData = async () => {
        var data = new FormData();
        data.append('name', this.state.name);
        data.append('title', this.state.title);
        data.append('mobile', this.state.mobile);
        data.append('description', this.state.description);
        data.append('designation', this.state.designation);
        data.append('date', this.state.date);
        data.append('type', this.state.type);
        if (this.state.imageData != '') {
            data.append(
                'mainimage',
                {
                    uri: this.state.image,
                    name: this.state.imageData.fileName,
                    type: this.state.imageData.type
                }

            );
        }
        await postMethod(data, res => {
            alert('Data added successfully..');
            this.setState({
                title: '',
                description: '',
                date: '',
                type: '',
                designation: '',
                name: '',
                mobile: '',
                url: '',
                image: '',
                localimage: '',
                imageData: ''
            })
        })
    }

    render = () => {
        return (
            <View style={{ flex: 1, width: Dimensions.get('screen').width, alignItems: 'center', marginTop: 5 }}>
                <TouchableOpacity onPress={() => this.imageHandler()} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {this.state.image != '' ? (
                        <Image
                            resizeMode='contain'
                            style={{ width: 100, height: 100, borderRadius: 10 }}
                            source={{ uri: this.state.image }} />) :
                        <Image
                            resizeMode='contain'
                            style={{ width: 100, height: 100, borderRadius: 10 }}
                            source={require('../assets/images/empty.png')} />
                    }
                </TouchableOpacity>
                <Input
                    placeholder="Title"
                    onChangeText={data => this.setState({ title: data })}
                    onBlur={() => this.description.focus()}
                    returnKeyType="next"
                    value={this.state.title}
                    refs={input => this.title = input} />
                <Input
                    placeholder="Description..."
                    onChangeText={data => this.setState({ description: data })}
                    onBlur={() => this.date.focus()}
                    style={{ height: 100 }}
                    multiline={true}
                    returnKeyType="next"
                    value={this.state.description}
                    refs={input => this.description = input} />
                <Input
                    placeholder="Date (DD-MM-YYYY)"
                    onChangeText={data => this.setDateFunction(data)}
                    value={this.state.date}
                    keyboardType="numeric"
                    returnKeyType="next"
                    value={this.state.date}
                    refs={input => this.date = input} />
                <View style={{ width: '80%' }}>
                    <MultiBtn
                        onChangeText={data => this.setState({ type: data })}
                        mainData={[{ title: 'NEWS', value: 'news' },
                        { title: 'FUNCTIONS', value: 'function' },
                        { title: 'E-SERVICE', value: 'eservice' },
                        { title: 'CONTACT', value: 'contact' },
                        { title: 'DEATH', value: 'death' },
                        { title: 'HISTORY', value: 'history' },
                        { title: 'DOCUMENTS', value: 'documetn' },
                        { title: 'GALLERY', value: 'gallery' },
                        { title: 'JOB', value: 'job' }]} />
                </View>
                <Input
                    placeholder="Designation"
                    onChangeText={data => this.setState({ designation: data })}
                    onBlur={() => this.name.focus()}
                    returnKeyType="next"
                    value={this.state.designation}
                    refs={input => this.designation = input} />
                <Input
                    placeholder="Name"
                    onChangeText={data => this.setState({ name: data })}
                    onBlur={() => this.mobile.focus()}
                    returnKeyType="next"
                    value={this.state.name}
                    refs={input => this.name = input} />
                <Input
                    placeholder="Mobile No."
                    onChangeText={data => this.setState({ mobile: data })}
                    onBlur={() => this.url.focus()}
                    returnKeyType="next"
                    keyboardType="numeric"
                    value={this.state.mobile}
                    refs={input => this.mobile = input} />
                <Input
                    placeholder="URL"
                    value={this.state.url}
                    onChangeText={data => this.setState({ url: data })}
                    returnKeyType="next"
                    refs={input => this.url = input} />
                <Button title="Save" onPress={() => this.setData()} />
            </View>
        )
    }

}
export default App;

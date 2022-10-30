/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    Dimensions,
    View,
    FlatList,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import { postBanner, getMethod } from '../function';
import Button from '../component/button';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imageList: [],
            image: '',
            imageData: '',
            loader: true
        }
        this.getMainData();
    }

    getMainData = async () => {
        await getMethod(`slideimage`, res => {
            this.setState({ imageList: res.result, loader: false });
        })
    }

    imageHandler = (id) => {
        let mediaType = "photo";
        const photooptions = {
            title: "Attach Files",
            mediaType: mediaType,
            takePhotoButtonTitle: "Take a Photo",
            maxWidth: 720,
            maxHeight: 420,
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
                            this.setState({ image: response.assets[0].uri, imageData: response.assets[0], loader: true }, function () {
                                this.setData(id);
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
        });
    };

    setData = async (id) => {
        var data = new FormData();
        if (this.state.image != '') {
            data.append(
                'mainimage',
                {
                    uri: this.state.image,
                    name: this.state.imageData.fileName,
                    type: this.state.imageData.type
                }

            );
            await postBanner(data, id, res => {
                alert('Data added successfully..');
                this.getMainData();
            })
        }else {
            this.setState({loader: false})
        }
    }

    imageRenderFunction = (item) => {
        return (
            <View style={{ width: Dimensions.get('screen').width / 1.2, height: 150, marginVertical: 5 }}>
                <ImageBackground resizeMode="stretch" source={{ uri: item.image }} style={{ width: '100%', height: '100%' }}>
                    <Button title="⏏" onPress={() => this.imageHandler(item._id)} style={{ width: 35, height: 35, position: 'absolute', right: 5, top: 5 }} />
                </ImageBackground>
            </View>
        )
    }

    render = () => {
        return (
            <View style={{ flex: 1, width: Dimensions.get('screen').width, alignItems: 'center', marginTop: 5 }}>
                {this.state.loader ? 
                <ActivityIndicator color = "#FFFF" /> : 
                <FlatList
                    data={this.state.imageList}
                    renderItem={({ item }) => this.imageRenderFunction(item)
                    } /> }
            </View>
        )
    }

}
export default App;

import NetInfo from "@react-native-community/netinfo";

export function isInternetConnection(props) {
    return new Promise((resolve, reject) => {
        NetInfo.fetch().then(async(state) => {
            if(state.isConnected) {
                return resolve(true);
            }else {
                props.navigation.navigate("InternetFail");
                return resolve(false);
            }
        }).catch(err => {
            return resolve(false);
        })
    })
}
import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet, ToastAndroid, Act } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useSelector, useDispatch } from 'react-redux';
import * as STRINGS from "../../../constants/strings";
import { getMethod, postMethod } from "../../../utils/function";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { getConversationsByUser, sendNotificationToSeller } from "../../../redux/actions";
import Loader from "../../../component/loader";

export default function ChatScreen(props) {
    const customer = props.route.params.customer;
    const selfUser = useSelector(state => state.selfUser);
    const conversations = useSelector(state => state.conversations);
    const toUser = customer._id;
    const shopList = useSelector(state => state.shopList)
    const messages = conversations[toUser] ? conversations[toUser].messages : [];
    const localUser = useSelector(state => state.profile);
    const [loading, setLoading] = useState(true);
    const [getConversationData, setConversationData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: "server/join", data: {name: localUser.name, _id: localUser._id} })
    setTimeout(() => {
      getUserChatMessages();
    },1500)
    }, [])
    function getUserChatMessages() {
        return dispatch(getConversationsByUser(localUser._id, toUser))
            .then(response => {
                if (response.length > 0) {
                    setLoading(false);
                    return setConversationData(response);
                } else {
                    return registerForChat();
                }
            }).catch(error => {
                return console.log(error);
            })
    }
    function registerForChat() {
        let body = {
            from_user: toUser,
            to_user: localUser._id,
            message: [],
            status: "ACTIVE"
        }
        return postMethod(`chatlist/new`, body).then(response => {
            getUserChatMessages();
        }).catch(error => {
            console.log(url + " = " + JSON.stringify(error))
            ToastAndroid.show("Unable to create user chat environment. Please go back and try again.")
        })
    }
    function sendMessage(messages) {
        messages[0].user.name = customer.name
        dispatch({
          type: "private_message",
          data: { message: messages[0], conversationId: toUser, chatId: getConversationData[0]._id }
        });
        dispatch({
          type: "server/private_message",
          data: { message: messages[0], conversationId: toUser, chatId: getConversationData[0]._id }
        });
        let messageSentUsers = global.messageSentUsers;
        if(messageSentUsers.filter(x => x === toUser).length === 0){
          dispatch(sendNotificationToSeller(toUser, "You have new message from your customer. Go to the order list screen to find the message.")).then(res => {
            console.log(res)
          })
          messageSentUsers.push(toUser);
          global.messageSentUsers = messageSentUsers;
        }
      }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <View style={styles.container}>
            <Header
                title="Customer"
                back
                onBackPress={() => props.navigation.goBack()}
            />
            <GiftedChat
                renderUsernameOnMessage
                messages={messages}
                onSend={messages => {
                    sendMessage(messages)
                  }}
                user={{
                    _id: selfUser.userId
                }}
                renderBubble={props => {
                    return (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: COLOUR.WHITE,
                                },
                                right: {
                                    backgroundColor: COLOUR.PRIMARY,
                                },
                            }}
                        />
                    );
                }}
                renderAvatar={null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})
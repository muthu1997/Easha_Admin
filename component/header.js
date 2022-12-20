import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import { profile, filter } from "../constants/icons";
const { width, height } = Dimensions;

const Header = props => {
  return (
    <View style={[styles.headerContainer, props.style]}>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, width: width }}>
        {/* header with back button and title */}
        {props.back || props.title ?
          <View style={styles.backTitleContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              {props.back ? <TouchableOpacity onPress={() => props.onBackPress()} ><MIcon name="arrow-left" color={COLOUR.WHITE} size={25} /></TouchableOpacity> : null}
              {props.title ?
                <Text title={props.title} type="title" style={{ fontSize: 18, color: COLOUR.WHITE, marginLeft: 10 }} /> : null}
              {props.rightIcon ? <TouchableOpacity onPress={() => props.onRightButtonPress()} style={{ alignItems: "center", justifyContent: "center", padding: 5, alignSelf: "flex-end", position: "absolute", right: 10 }}>
                <MIcon name={props.rightIcon} color={COLOUR.WHITE} size={25} />
              </TouchableOpacity> : null}
            </View>
          </View> : null}

        {props.name ? <View style={{ width: "100%", paddingVertical: 20, justifyContent: "center" }}>
          <View>
            <Text title="Handcrafts" type="title" style={{ fontSize: 20, color: COLOUR.WHITE }} />
          </View>
        </View> : null}
        {props.bell ?
          <TouchableOpacity activeOpacity={0.8}>
            <Icon name="bell" color={COLOUR.WHITE} size={25} />
          </TouchableOpacity> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOUR.PRIMARY
  },
  searchButton: {
    height: 50,
    backgroundColor: COLOUR.WHITE,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 10
  },
  filterButton: {
    width: "15%",
    height: 50,
    backgroundColor: COLOUR.WHITE,
    alignItems: 'center',
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10
  },
  profIconContainer: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: COLOUR.WHITE
  },
  profileimg: {
    width: "100%",
    height: "100%"
  },
  filterImage: {
    width: "60%",
    height: "60%"
  },
  backTitleContainer: {
    width: "100%",
    height: 65,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  searchContainer: {
    width: "100%",
    height: 75,
    backgroundColor: "red"
  }
});

export default Header;
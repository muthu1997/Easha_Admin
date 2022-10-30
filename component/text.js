import * as React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';

const DefaultText = props => {
  return (
      <Text onPress={() => props.onViewAll ? props.onViewAll() : null} numberOfLines = {props.lines} {...props} style={[props.type=== 'label' ? styles.label :props.type=== 'paragraph' ? styles.para :props.type=== 'hint' ? styles.hint :props.type=== 'heading' ? styles.heading: styles.title, props.style]}>
        {props.title}
      </Text>
  );
} 
 
const styles = StyleSheet.create({
  label: {
    fontWeight: '500',
    fontSize: 16,
    padding:2
  },
  para: {
    fontWeight: '500',
    fontSize: 14,
    padding:2
  },
  hint: {
    fontWeight: '500',
    fontSize: 10,
    padding:2
  },
  heading: {
    fontWeight: '700',
    fontSize: 18,
    padding:2
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    padding:2
  }
});

export default DefaultText;
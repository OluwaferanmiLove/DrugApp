import React from 'react';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../constants/colors';
import { hp, wp } from '../util/dimension';
import { generateColor } from '../util/randomColor';
import ImageView from './ImageView';
import Ionicons from '@expo/vector-icons/Ionicons';

function NotificationCard({ onPress, name, time, description }) {
  return (
    <TouchableOpacity onPress={onPress} style={{marginTop: hp(20)}}>
      <View style={styles.userListContainer}>
        <View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.iconContainer}>
          {/* <Ionicons name={'ios-arrow-forward'} size={wp(20)} color={colors.primary} /> */}
          <Text style={[styles.name, {fontSize: wp(16)}]}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  userListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(17),
    paddingHorizontal: hp(17),
    borderRadius: wp(8),
    borderWidth: wp(1),
    borderColor: '#eee',
    borderBottomWidth: wp(1)
  },
  nameContainer: {
    flex: 1,
    // marginLeft: wp(10),
  },
  name: {
    fontSize: hp(18),
    fontWeight: '600',
    color: colors.primaryLighter,
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    marginTop: hp(3),
    textTransform: 'capitalize',
    fontSize: hp(16),
    color: colors.primaryLighter,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(65),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.primary + '30',
  },
})

export default NotificationCard;
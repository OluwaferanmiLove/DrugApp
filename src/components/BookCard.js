import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../constants/colors';
import { hp, wp } from '../util/dimension';

function BookCard({
  color = colors.primary,
  backgroundColor,
  image,
  marginTop = hp(25),
  title,
  price,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{marginTop, width: wp(160)}}>
      <View style={[styles.actionCard, {backgroundColor: color + '10'}]}>
        <Image
          source={image}
          // source={{uri: image}}
          style={styles.image}
        />
      </View>
      <View>
        <Text style={[styles.title, {color}]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, {color: color + 'aa'}]} numberOfLines={1}>
            N {price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionCard: {
    width: wp(160),
    height: wp(200),
    borderRadius: wp(10),
    justifyContent: 'space-between',
    // borderWidth: wp(1),
    backgroundColor: colors.inputBg + '30',
    // paddingVertical: hp(10),
    // paddingHorizontal: hp(15),
    overflow: 'hidden',
  },
  image: {
    width: wp(160),
    height: wp(200),
  },
  numContainer: {
    fontSize: wp(16),
    fontWeight: '300',
  },
  title: {
    marginTop: hp(14),
    fontSize: wp(16),
    fontWeight: '700',
  },
  valueContainer: {
    marginTop: hp(4),
    // borderRadius: 9999,
    // paddingVertical: hp(6),
    // paddingHorizontal: hp(12),
    // backgroundColor: '#ffffff',
  },
  value: {
    fontSize: wp(14),
    fontWeight: '700',
    color: colors.primaryLighter
  },
  iconContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // position: 'absolute',
    overflow: 'hidden',
  },
})

export default BookCard;
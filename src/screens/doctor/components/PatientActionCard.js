import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { colors } from '../../../constants/colors';
import { hp, wp } from '../../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function PatientActionCard({
  color = colors.primaryLighter,
  marginTop,
  title,
  iconComponent,
  value,
  onPress,
  iconName,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{alignItems: 'center'}}>
      <View source={require('../../../assets/bg.png')} style={[styles.actionCard, { borderColor: color, marginTop }]}>
        <View>
          {/* <Ionicons name={'medical-outline'} size={wp(25)} color={colors.primaryLighter} /> */}
          {iconComponent}
          {/* <MaterialCommunityIcons name={'pill'} size={wp(25)} color={colors.primaryLighter} /> */}
        </View>
        {/* <View style={styles.iconContainer}>
          <Ionicons name={iconName} color={color + '30'} size={wp(90)} />
        </View> */}
      </View>
      <View style={{marginTop: hp(8)}}>
        <Text style={[styles.title, { color: color + 'aa' }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionCard: {
    width: wp(50),
    height: wp(50),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: wp(10),
    // borderWidth: wp(1),
    backgroundColor: colors.primaryLighter + '20',
    // paddingVertical: hp(20),
    // paddingHorizontal: hp(15),
    overflow: 'hidden',
  },
  title: {
    fontSize: wp(14),
    fontWeight: 'bold',
    color: colors.primary
  },
  value: {
    fontSize: wp(37),
    fontWeight: '700',
    color: colors.primaryLighter
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
})

export default PatientActionCard;
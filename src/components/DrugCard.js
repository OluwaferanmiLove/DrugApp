import React, {useContext} from 'react';
import { Platform, StyleSheet, Text, View, Switch } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../constants/colors';
import { hp, wp } from '../util/dimension';
import { generateColor } from '../util/randomColor';
import ImageView from './ImageView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { AppContext } from '../context/AppContext';

function DrugCard({
  marginTop,
  onPress,
  onPressDelete,
  title,
  pill,
  time,
  color,
  width = wp(335)
}) {
  const { state } = useContext(AppContext);

  return (
    // <TouchableOpacity onPress={onPress} style={{ marginTop }}>
      <View style={[styles.actionCardContainer, { backgroundColor: color + 20, width, marginTop }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={'pill'} size={wp(20)} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: wp(15) }}>
          <Text style={[styles.name, { color }]}>{title}</Text>
          <Text style={[styles.name, { color, fontSize: wp(14), marginTop: hp(3) }]}>Take {pill} pills at a time</Text>

          {time.map((item) => (
            <View style={{marginTop: hp(6)}}>
              <Text
                style={[
                  styles.name,
                  {
                    color,
                    fontSize: wp(14),
                    marginTop: hp(3),
                    textTransform: 'capitalize',
                  }
                ]}>
                  {item.period} - {moment(item.time).format('h:mm A')}
              </Text>
            </View>
          ))}
        </View>
        <View>
          {state.user.role === 'admin' && (
            <TouchableOpacity onPress={onPressDelete}>
              <Ionicons name={'trash-outline'} size={wp(25)} color={'#bb0a1e90'} />
            </TouchableOpacity>
          )}
          {state.user.role === 'patient' && (
            <View>
              <Switch />
              {/* <Text>toggle alarm</Text> */}
            </View>
          )}
        </View>
      </View>
    // </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  actionCardContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // width: wp(160),
    paddingVertical: hp(16),
    paddingHorizontal: hp(16),
    borderRadius: wp(8),
    borderWidth: wp(1),
    borderColor: '#eee',
  },
  name: {
    fontSize: hp(18),
    fontWeight: '600',
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    fontSize: hp(16),
    color: colors.primaryLighter,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(35),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.primary + '30',
  },
})

export default DrugCard;
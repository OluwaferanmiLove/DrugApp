import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import Input from '../../components/Input';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import { useToast } from 'react-native-toast-notifications';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import NotificationCard from '../../components/NotificationCard';

function NotificationCenter({ navigation }) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const db = getFirestore();

  const adminsRef = query(collection(db, "users"), where("role", "==", 'doctor'));

  const getScheduledNotifications = async () => {
    let notifi = await Notifications.getAllScheduledNotificationsAsync();
    console.log(notifi);
    setNotifications(notifi);
  }
  // async function schedulePushNotification() {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "New Environment Notification Alert",
  //       body: 'The temprature right now is 30°c, the wind speed is 201° and humidity is 63%, there is is a probability of light rain',
  //       data: { data: 'goes here' },
  //     },
  //     trigger: { seconds: 2 },
  //   });
  // }

  useEffect(() => {
    // schedulePushNotification()
    getScheduledNotifications()
  }, [addAdminModal]);

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Notifications Schedules'} onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        {notifications.map((item, index) => (
          <NotificationCard
            key={item.identifier}
            // image={{ uri: item.image }}
            time={item?.content?.subtitle === 'morning' ?
              '8 am' : item?.content?.subtitle === 'afternoon' ? '3 pm' :
              item?.content?.subtitle === 'evening' && '8 pm'}
            name={item?.content?.title}
            description={item?.content?.body} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: wp(20),
  },
  searchContainer: {
    marginTop: hp(20),
    marginHorizontal: wp(20),
  },
  content: {
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  buttonContainer: {
    // position: 'absolute',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    marginBottom: hp(25),
  },
})

export default NotificationCenter;
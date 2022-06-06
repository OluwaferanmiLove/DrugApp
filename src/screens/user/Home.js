import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { hp, wp } from '../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../../context/AppContext';
import HeaderLite from '../../components/HeaderLite';
import ImageView from '../../components/ImageView';
import BookCard from '../../components/BookCard';
import Input from '../../components/Input';
import { colors } from '../../constants/colors';
import { books } from '../../constants/mockData';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import DrugCard from '../../components/DrugCard';
import * as Notifications from 'expo-notifications';
import { deleteFromStorage } from '../../util/storageUtil';
import { logout } from '../../context/action';

function Home({ navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const [data, setData] = useState([]);

  const db = getFirestore();

  const dbRef = collection(db, 'prescriptions');

  useEffect(() => {
    const q = query(dbRef, where('patient.email', '==', state.user.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      // console.log(data);
      setData(data);
    },
      (error) => {
        console.log(error.message);
      });

    return () => unsubscribe();
  }, []);

  const getNotification = async () => {
    let rrr = await Notifications.getAllScheduledNotificationsAsync();
    console.log(rrr)
    return rrr;
  }

  useEffect(() => {
    // let trig = new Date(1654326000000);

    // const trigger = new Date(Date.now() + 60 * 60 * 1000);
    // trigger.setMinutes(0);
    // trigger.setSeconds(0);

    // console.log(trigger);
    // console.log(trig);

    // const cancel = async () => {
    //   let rrr = await Notifications.cancelAllScheduledNotificationsAsync();
    //   console.log(rrr)
    // }

    // cancel()

    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "Time to take your drug",
    //     body: `Hello, it's time to take your drugs`,
    //     data: { data: 'goes here' },
    //   },
    //   trigger: { ...trig, repeats: true, },
    // })
  }, [data])

  const navigateToBook = (detail) => {
    navigation.navigate('BookDetails', { detail: detail })
  }

  const handleLogOut = () => {
    deleteFromStorage('userData')
      .then(() => {
        dispatch(logout())
      })
  }

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <View style={styles.header}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.name}>Hi, {state.user.firstName} 👋 </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('NotificationCenter')}>
              <Ionicons name={'notifications-outline'} size={wp(23)} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', state.user)} style={{marginLeft: wp(15)}}>
              <Ionicons name={'person-outline'} size={wp(23)} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLogOut()} style={{marginLeft: wp(15)}}>
              <Ionicons name={'log-out-outline'} size={wp(23)} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <View style={{marginTop: hp(10)}}>
        <Input
          placeholder={'Search'}
          iconName={'search'}
          backgroundColor={colors.primary + '09'}
          iconColor={colors.primary}
        />
      </View> */}
      <ScrollView style={{ marginHorizontal: -wp(20) }}>
        <View style={styles.content}>
          {data.map((item, index) => {
            item.time.forEach(data => {
              const schedule = async () => {
                await Notifications.scheduleNotificationAsync({
                  identifier: item.id + data.period,
                  content: {
                    title: `Tme to take your ${item.drugName}`,
                    subtitle: data.period,
                    body: `${item.drugDescription}`,
                    sound: true,
                    color: "#ffffff",
                    data: item,
                  },
                  trigger: {
                    hour: data.period === 'morning' ?
                      8 : data.period === 'afternoon' ? 15 :
                        data.period === 'evening' && 20,
                    minute: 0,
                    repeats: true
                  }
                })
              }

              schedule();
            });

            return (
              <DrugCard
                key={item.id}
                title={item.drugName}
                color={colors.primary}
                pill={item.pills}
                time={item.time}
                onPressDelete={() => handleDelete(item.id)}
                // marginTop={index !== 0 && hp(25)}
                marginTop={hp(25)}
              />
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: wp(20),
  },
  header: {
    marginTop: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: wp(10)
  },
  name: {
    fontSize: wp(30),
    fontWeight: '500',
    color: colors.primary
  },
  description: {
    fontSize: wp(16),
    textTransform: 'capitalize',
    fontWeight: '300',
    color: colors.secondaryDarker
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(35),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.secondaryLighter + '30',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp(20),
    paddingVertical: hp(22),
    borderRadius: wp(10),
    backgroundColor: colors.primary,
  },
  infoTitle: {
    fontSize: wp(16),
    fontWeight: '300',
    color: '#ffffff90',
  },
  infoValue: {
    fontSize: wp(35),
    fontWeight: '700',
    marginTop: hp(10),
    color: '#ffffff'
  },
  sectionTitleContainer: {
    marginTop: hp(25),
  },
  sectionTitle: {
    fontSize: wp(22),
    fontWeight: '700',
    color: colors.primary
  },
  content: {
    // marginTop: hp(25),
    paddingHorizontal: wp(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: hp(20)
  }
})

export default Home;
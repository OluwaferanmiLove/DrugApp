import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'; import AppContextProvider from './src/context/AppContext';
import FoladeBookShop from './src/navigation';
import { initializeApp } from "firebase/app";
import { ToastProvider } from 'react-native-toast-notifications';
import { colors } from './src/constants/colors';
import { hp } from './src/util/dimension';
import * as Notifications from 'expo-notifications';

// async function registerForPushNotificationsAsync() {
//   // let token;
//   // if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // token = (await Notifications.getExpoPushTokenAsync()).data;
//     // console.log(token);
//   // } else {
//   //   alert('Must use physical device for Push Notifications');
//   // }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   // return token;
// }

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyA_KkNkO799IOwwgviP6SU3SGXvBgYwBtQ",
    authDomain: "drugapp-b08a5.firebaseapp.com",
    projectId: "drugapp-b08a5",
    storageBucket: "drugapp-b08a5.appspot.com",
    messagingSenderId: "686048490505",
    appId: "1:686048490505:web:f232950b68a1f8ca95b4d8"
  };

  initializeApp(firebaseConfig);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });

    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener.current);
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  return (
    <AppContextProvider>
      <ToastProvider
        placement="top"
        duration={2500}
        // successColor="green"
        // dangerColor="red"
        // warningColor="orange"
        // normalColor="#6610F2"
        normalColor={colors.primary}
        offsetTop={hp(40)}
        // renderType={{
        //   normal: (toast) => (
        //     <Toast text={toast.message} bgColor="#6610F2" />
        //   ),
        //   danger: (toast) => (
        //     <Toast text={toast.message} bgColor="#F83C33" />
        //   ),
        //   success: (toast) => (
        //     <Toast text={toast.message} bgColor="#45D988" />
        //   ),
        // }}
        swipeEnabled={true}>
        <FoladeBookShop />
      </ToastProvider>
    </AppContextProvider>
  );
}

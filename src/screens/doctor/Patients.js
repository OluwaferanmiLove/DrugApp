// import React, { useContext, useState, useEffect } from 'react';
// import {
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   StatusBar
// } from 'react-native';
// import { hp, wp } from '../../util/dimension';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { AppContext } from '../../context/AppContext';
// import HeaderLite from '../../components/HeaderLite';
// import ImageView from '../../components/ImageView';
// import BookCard from '../../components/BookCard';
// import Input from '../../components/Input';
// import { colors } from '../../constants/colors';
// import { books } from '../../constants/mockData';
// import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';

// function AdminBooks({ navigation }) {
//   const { state } = useContext(AppContext);
//   const [addCategoryModal, setAddCategoryModal] = useState(false);
//   const [data, setData] = useState([]);

//   const db = getFirestore();

//   const dbRef = collection(db, 'books');

//   useEffect(() => {
//     const q = query(dbRef);
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const data = [];
//       querySnapshot.forEach((doc) => {
//           data.push(doc.data());
//       });
//       setData(data);
//     },
//     (error) => {
//       console.log(error.message);
//     });
    
//     return () => unsubscribe();
//   }, []);

//   const navigateToBook = (detail) => {
//     navigation.navigate('BookDetails', {detail: detail})
//   }

//   return (
//     <SafeAreaView style={styles.main}>
//       <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
//       <HeaderLite onPress={() => navigation.goBack()} title={'Books'} />
//       {/* <View style={{marginTop: hp(10)}}>
//         <Input
//           placeholder={'Search'}
//           iconName={'search'}
//           backgroundColor={colors.primary + '09'}
//           iconColor={colors.primary}
//         />
//       </View> */}
//       <ScrollView>
//         <View  style={styles.content}>
//           {data.map((item, index) => (
//             <BookCard
//               key={item.title}
//               title={item.title}
//               image={{uri: item.image}}
//               price={item.price}
//               onPress={() => navigateToBook(item)}
//             />
//           ))}
//         </View>
//       </ScrollView>
//       <View style={styles.fab}>
//         <TouchableOpacity onPress={() => navigation.navigate('AdminAddBook')}>
//           <Ionicons name={'add-circle'} color={colors.primary} size={wp(65)} />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     // marginHorizontal: wp(20),
//   },
//   header: {
//     marginTop: hp(10),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   userInfoContainer: {
//     flex: 1,
//     marginLeft: wp(10)
//   },
//   name: {
//     fontSize: wp(30),
//     fontWeight: '500',
//     color: colors.primary
//   },
//   description: {
//     fontSize: wp(16),
//     textTransform: 'capitalize',
//     fontWeight: '300',
//     color: colors.secondaryDarker
//   },
//   iconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: wp(35),
//     height: wp(35),
//     borderRadius: 7,
//     backgroundColor: colors.secondaryLighter + '30',
//   },
//   infoContainer: {
//     alignItems: 'center',
//     width: '100%',
//     marginTop: hp(20),
//     paddingVertical: hp(22),
//     borderRadius: wp(10),
//     backgroundColor: colors.primary,
//   },
//   infoTitle: {
//     fontSize: wp(16),
//     fontWeight: '300',
//     color: '#ffffff90',
//   },
//   infoValue: {
//     fontSize: wp(35),
//     fontWeight: '700',
//     marginTop: hp(10),
//     color: '#ffffff'
//   },
//   sectionTitleContainer: {
//     marginTop: hp(25),
//   },
//   sectionTitle: {
//     fontSize: wp(22),
//     fontWeight: '700',
//     color: colors.primary
//   },
//   content: {
//     // marginTop: hp(25),
//     paddingHorizontal: wp(20),
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingBottom: hp(20)
//   },
//   fab: {
//     position: 'absolute',
//     bottom: hp(40),
//     right: wp(20),
//   },
// })

// export default AdminBooks;

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import Input from '../../components/Input';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import { users } from '../../constants/mockData';
import Button from '../../components/Button';
import AddAdminModal from './components/AddAdminModal';
import { useToast } from 'react-native-toast-notifications';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import AddPatientModal from './components/AddPatientModal';

function Patients({navigation}) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const db = getFirestore();

  const adminsRef = query(collection(db, "users"), where("role", "==", 'patient'));

  useEffect(() => {
    const getAdmins = async () => {
      let admins = await getDocs(adminsRef);
      let allAdmins = admins.docs.map((item) => {
        return item.data();
      })
      setAdmins(allAdmins);
      console.log(allAdmins);
    }
  
    getAdmins();
  }, [addAdminModal]);

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Patients'} onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        {admins.map((item, index) => (
          <Userlist
            key={item.firstName + item.lastName}
            onPress={() => navigation.navigate('PatientInfo', item)}
            // image={{ uri: item.image }}
            name={item.lastName + ' ' + item.firstName}
            description={item.role} />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button dark title={'Add new patient'} onPress={() => setAddAdminModal(true)} />
      </View>
      <AddPatientModal isVisible={addAdminModal} onPressCancel={() => setAddAdminModal(false)} />
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

export default Patients;
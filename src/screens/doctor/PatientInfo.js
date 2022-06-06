import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import HeaderLite from '../../components/HeaderLite';
import ImageView from '../../components/ImageView';
import ActionCard from '../../components/ActionCard';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import { Paystack } from 'react-native-paystack-webview';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { makeid } from '../../util/util';
import { useToast } from 'react-native-toast-notifications';
import PatientActionCard from './components/PatientActionCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddPrescriptionModal from './components/AddPrescriptionModal';
import DrugCard from '../../components/DrugCard';

function PatientInfo({ navigation, route }) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const { state } = useContext(AppContext);

  const toast = useToast();

  const detail = route.params;

  const paystackWebViewRef = useRef();

  const db = getFirestore();

  const dbRef = collection(db, 'prescriptions');

  useEffect(() => {
    const q = query(dbRef, where('patient.email', '==', detail.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), id: doc.id});
      });
      console.log(data);
      setData(data);
    },
      (error) => {
        console.log(error.message);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      let info = await deleteDoc(doc(db, 'prescriptions', id));
      toast.show('Data removed successfully')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Patient Information'} onPress={() => navigation.goBack()} />
      <ScrollView style={{flex: 1}}>
        <View style={styles.content}>
          <View style={[styles.imageContainer, { width: wp(180), height: wp(180) }]}>
            <Image
              source={{ uri: detail?.image }}
              style={[styles.image, { width: wp(180), height: wp(180) }]}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>{detail?.firstName} {detail?.lastName}</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: wp(20), justifyContent: 'center'}}>
              <View style={styles.roleContainer}>
                <Text style={styles.description}>{detail?.role}</Text>
              </View>
              <View style={styles.roleContainer}>
                <Text style={styles.description}>{detail?.email}</Text>
              </View>
              <View style={styles.roleContainer}>
                <Text style={styles.description}>{detail?.age} years old</Text>
              </View>
              <View style={styles.roleContainer}>
                <Text style={styles.description}>{detail?.phoneNumber}</Text>
              </View>
            </View>
          </View>
          {/* <View style={styles.mainAction}>
            <PatientActionCard
              title={'Prescription'}
              iconComponent={<MaterialCommunityIcons name={'pill'} size={wp(25)} color={colors.primaryLighter} />}
            />
            <PatientActionCard 
              title={'Prescription'}
            />
            <PatientActionCard />
          </View> */}
          <View style={{ flex: 1, width: '100%', marginTop: hp(25) }}>
            <Text style={styles.title}>Prescriptions</Text>
          </View>
          <View>
            {data.map((item, index) => (
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
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button dark title={'Add prescription'} onPress={() => setAddAdminModal(true)} />
      </View>
      <AddPrescriptionModal
        isVisible={addAdminModal}
        onPressCancel={() => setAddAdminModal(false)}
        patientInfo={detail}
      />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size={'small'} color={colors.white} />
        </View>
        )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,

    // marginHorizontal: wp(20),
  },
  imageContainer: {
    // width: wp(55),
    // height: wp(55),
    borderRadius: 89999,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  content: {
    alignItems: 'center',
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  title: {
    marginTop: hp(10),
    fontSize: hp(20),
    fontWeight: '700',
    color: colors.primary,
  },
  roleContainer: {
    marginTop: hp(10),
    marginRight: wp(10),
    backgroundColor: colors.primary + 20,
    marginTop: hp(8),
    paddingVertical: wp(4),
    paddingHorizontal: wp(25),
    borderRadius: wp(9999)
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    fontSize: hp(16),
    color: colors.primary,
  },
  mainAction: {
    width: '100%',
    marginTop: hp(25),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  price: {
    fontSize: hp(25),
    fontWeight: '700',
    color: colors.primary,
  },
  actionContainer: {
    // position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: hp(10),
    marginBottom: hp(25),
  },
  loading: {
    flex: 1,
    position: 'absolute',
    height: hp(812),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000090',
  },
  buttonContainer: {
    // position: 'absolute',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
  },
})

export default PatientInfo;
import React, {useState, useContext} from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { colors } from '../../../constants/colors';
import { hp, wp } from '../../../util/dimension';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { login } from '../../../context/action';
import { useToast } from 'react-native-toast-notifications';
import { getApp, initializeApp } from "firebase/app";
import { makeid } from '../../../util/util';
import { AppContext } from '../../../context/AppContext';

function AddPrescriptionModal({ isVisible, onPressCancel, patientInfo }) {
  const [drugDescription, setDrugDescription] = useState(null);
  const [drugName, setDrugName] = useState(null);
  const [pills, setPills] = useState(null);
  const [password, setPassWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [morning, setMorning] = useState(false);
  const [afternoon, setAfternoon] = useState(false);
  const [evening, setEvening] = useState(false);

  const { state } = useContext(AppContext);
  
  const db = getFirestore();
  const userRef = collection(db, 'users')

  const toast = useToast()

  const handleAddAdmin = async () => {
    // dispatch(login({role: 'student'}))
    try {
      setLoading(true);

      if(drugName === null && pills) {
        toast.show('Please review your input, all field must be filed');
        setLoading(false);
        return;
      }

      if(drugDescription === null) {
        toast.show('Drug description cannot be empty, please enter your drug description');
        setLoading(false);
        return;
      }

      let data = {
        doctor: state.user,
        patient: patientInfo,
        drugName,
        pills,
        drugDescription,
        time: [
          ...(morning ? [{period: 'morning', time: new Date().setHours(8,0,0,0)}] : []),
          ...(afternoon ? [{period: 'afternoon', time: new Date().setHours(15,0,0,0)}] : []),
          ...(evening ? [{period: 'evening', time: new Date().setHours(20,0,0,0)}] : []),
        ]
      }

      console.log(data);

      const dataRef = doc(db, 'prescriptions', makeid(20));

      // set user data in firestore
      let userInfo = await setDoc(dataRef, data);
      toast.show('Prescription added successfull');
      setDrugDescription(null);
      setDrugName(null);
      setMorning(false);
      setPills(null)
      setAfternoon(false);
      setEvening(false);
      setLoading(false);
      onPressCancel();
    } catch (e) {
      toast.show(e.message)
      console.log(e.message)
      setLoading(false)
    }
  }

  const toggleSwitch = (period) => {
    switch (period) {
      case 'morning':
        setMorning(!morning)
        break;
      case 'afternoon':
        setAfternoon(!afternoon)
        break;
      case 'evening':
        setEvening(!evening)
        break;
    
      default:
        break;
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.5}
      swipeDirection={'down'}
      onSwipeComplete={onPressCancel}
      onBackdropPress={onPressCancel}
      animationIn={"slideInUp"}
      style={{
        // width: '100%',
        // bottom: 0,
        margin: 0,
        height: '100%',
        justifyContent: 'flex-end',
        // backgroundColor: colors.mainBg,

      }}>
      <View style={styles.main}>
        <View style={{ marginTop: hp(20), alignItems: 'center', paddingHorizontal: wp(20) }}>
          <View style={{width: wp(120), height: hp(4), backgroundColor: '#eee', borderRadius: 999}} />
        </View>
        <View style={styles.header}>
          <View style={{ marginLeft: wp(15), marginTop: hp(25) }}>
            <Text style={styles.title}>Add new prescription</Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginTop: hp(10) }}>
            {/* <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: 'https://nwsid.net/wp-content/uploads/2015/05/dummy-profile-pic.png' }} style={styles.image} />
                <TouchableOpacity style={{
                  position: 'absolute',
                  backgroundColor: colors.primary + 30,
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: wp(14), color: colors.primary }}> + Add picture</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            <View style={{ marginTop: hp(25) }}>
              {/* <View style={{ marginLeft: wp(20) }}>
                <Text style={styles.title}>Enter admin details</Text>
              </View> */}
              <View style={styles.content}>
                <Input
                  label={'Drug name'}
                  placeholder={'Enter drug name'}
                  onChangeText={(text) => setDrugName(text)}
                  value={drugName}
                  marginTop={hp(15)}
                />
                <Input
                  label={'Number pf pills to take'}
                  placeholder={'Enter number of pills'}
                  marginTop={hp(15)}
                  value={pills}
                  onChangeText={(text) => setPills(text)}
                />
                <Input
                  label={'Description'}
                  placeholder={'Enter description'}
                  marginTop={hp(15)}
                  value={drugDescription}
                  onChangeText={(text) => setDrugDescription(text)}
                />
                <View style={{marginTop: hp(15), width: '100%', paddingHorizontal: wp(20)}}>
                  <Text style={styles.labelText}>Select drug time</Text>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.labelText]}>Morning</Text>
                    <Text>8:00 am</Text>
                    <Switch
                      onValueChange={() => toggleSwitch('morning')}
                      value={morning}/>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.labelText]}>Afternoon</Text>

                    <Text>3:00 pm</Text>
                    <Switch
                      onValueChange={() => toggleSwitch('afternoon')}
                      value={afternoon}/>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.labelText]}>Evening</Text>
                    <Text>8:00 pm</Text>
                    <Switch
                      onValueChange={() => toggleSwitch('evening')}
                      value={evening}/>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.content, { marginTop: hp(35), paddingBottom: hp(30) }]}>
              <Button
                dark
                loading={loading}
                onPress={handleAddAdmin}
                title={'Add Prescription'} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    height: hp(740),
    backgroundColor: '#ffffff',
    borderTopRightRadius: wp(30),
    borderTopLeftRadius: wp(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(375),
  },
  backBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(45),
    width: wp(45),
    borderRadius: 9999,
    backgroundColor: colors.secondary
  },
  title: {
    fontSize: hp(20),
    color: colors.primary,
    fontWeight: '700',
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    fontSize: hp(16),
    color: colors.secondaryDarker,
    marginTop: hp(4)
  },
  content: {
    alignItems: 'center',
    // marginTop: hp(20)
    // marginHorizontal: wp(20),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: wp(130),
    width: wp(130),
    borderRadius: 9999,
    backgroundColor: colors.primary + 20,
  },
  image: {
    height: wp(130),
    width: wp(130),
    borderRadius: 9999,
    resizeMode: 'cover',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(5)
  },
  labelText: {
    fontSize: wp(18),
    fontWeight: 'bold',
    color: '#000000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(15)
  },
})

export default AddPrescriptionModal;
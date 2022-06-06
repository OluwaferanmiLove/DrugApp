import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import HeaderLite from '../../components/HeaderLite';
import ImageView from '../../components/ImageView';
import ActionCard from '../../components/ActionCard';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import { Paystack } from 'react-native-paystack-webview';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { makeid } from '../../util/util';
import { useToast } from 'react-native-toast-notifications';

function BookDetails({ navigation, route }) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { state } = useContext(AppContext);

  const toast = useToast();

  const { detail } = route.params;

  const paystackWebViewRef = useRef();

  const db = getFirestore();

  const onPaymentSuccess = async (res) => {
    try {
      setLoading(true);

      let data = {
        ...state.user,
        ...detail,
        reference: res.data.transactionRef.reference,
        status: res.data.transactionRef.status,
        transaction: res.data.transactionRef.transaction,
        paidAt: new Date(),
      };
      // console.log(data);

      const paymentRef = doc(db, 'payments', makeid(20));

      // set data in firestore
      let Info = await setDoc(paymentRef, data);
      setLoading(false);
      toast.show('Payment successfull');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={detail.title} onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={[styles.imageContainer, { width: '100%', height: hp(450) }]}>
          <Image
            source={{ uri: detail.image }}
            style={[styles.image, { width: '100%', height: hp(450) }]}
          />
        </View>
        <Paystack
          paystackKey="pk_test_b61b0e265f29c5a924ec564a4c029af5722d012f"
          billingEmail={state.user.email}
          amount={detail.price}
          onCancel={(e) => {
            // handle response here
          }}
          onSuccess={onPaymentSuccess}
          ref={paystackWebViewRef}
        />
        <View style={{ marginTop: hp(15), flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{flex: 0.8}}>
            <Text style={styles.title}>{detail.title}</Text>
            <Text style={styles.description}>By {detail.author}</Text>
          </View>
          <Text style={styles.price}>N {detail.price}</Text>
        </View>
        {/* <View style={styles.roleContainer}>
          <Text style={styles.description}>{detail.language}</Text>
        </View> */}
        {state.user.role !== 'admin' && (
          <View style={{ marginTop: hp(25) }}>
            <Button
              title={'Buy now'}
              onPress={() => paystackWebViewRef.current.startTransaction()}
              dark />
          </View>
        )}
      </View>
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
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  content: {
    // alignItems: 'center',
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  title: {
    fontSize: hp(25),
    fontWeight: '700',
    color: colors.primary,
  },
  roleContainer: {
    backgroundColor: colors.primary + 20,
    marginTop: hp(8),
    paddingVertical: wp(4),
    paddingHorizontal: wp(25),
    borderRadius: wp(9999)
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    marginTop: hp(8),
    fontSize: hp(16),
    color: colors.primary,
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
  }
})

export default BookDetails;
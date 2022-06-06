import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import HeaderLite from '../../components/HeaderLite';
import ImageView from '../../components/ImageView';
import ActionCard from '../../components/ActionCard';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import  { Paystack }  from 'react-native-paystack-webview';
import Input from '../../components/Input';
import * as ImagePicker from 'expo-image-picker';
import { makeid } from '../../util/util';
import { useToast } from 'react-native-toast-notifications';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';

function AdminAddBook({ navigation, route }) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [price, setPrice] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const { state } = useContext(AppContext);

  const toast = useToast();
  const db = getFirestore();
  // const storage = getStorage();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      // const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const filename = makeid(64);
      console.log(filename);

      const storage = getStorage();
      const storageRef = ref(storage, `images/${filename}`);

      // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const image = await fetch(uri);
      const imageBlob = await image.blob();

      // 'file' comes from the Blob or File API
      let imageUploadInfo = await uploadBytes(storageRef, imageBlob);

      let imageUrl = await getDownloadURL(imageUploadInfo.ref);
      console.log('File available at', imageUrl);
      // setImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.log(error)
    }
  };

  const handleAddBook = async () => {
    setLoading(true);
    try {

      const dbRefStyles = doc(db, 'books', makeid(20));

      console.log('--------------------- db ref done');
      console.log(image);
      const coverUrl = await uploadImage(image);
      console.log(coverUrl);
      console.log('--------------------- uploadImage done');

      const data = {
        image: coverUrl,
        author,
        title,
        price,
      }

      // set user data in firestore
      let dataInfo = await setDoc(dbRefStyles, data);
      console.log(dataInfo);
      setAuthor(null);
      setTitle(null);
      setPrice(null);
      setImage(null);
      toast.show('Book added successfull');
      navigation.goBack();
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Add Book'} onPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <ImageView
          borderRadius={wp(8)}
          width={'100%'}
          onPressUpload={() => pickImage()}
          image={{ uri: image }}
          height={hp(450)}
        />
          <View style={{ marginTop: hp(15), flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Input
                label={'Title'}
                onChangeText={(value) => setTitle(value)}
                value={title}
                placeholder={'Enter title'}/>
              <Input
                label={'Author'}
                onChangeText={(value) => setAuthor(value)}
                value={author}
                placeholder={'Enter author'}
                marginTop={hp(20)} />
              <Input
                label={'Price'}
                onChangeText={(value) => setPrice(value)}
                value={price}
                keyboardType={'numeric'}
                placeholder={'Enter price'}
                marginTop={hp(20)} />
            </View>
          </View>
          {/* <View style={styles.roleContainer}>
          <Text style={styles.description}>{detail.language}</Text>
        </View> */}
          <View style={{ marginTop: hp(25) }}>
            <Button
              title={'Add book'}
              onPress={handleAddBook}
              loading={loading}
              dark />
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: wp(20),
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
})

export default AdminAddBook;
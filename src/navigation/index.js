import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AdminNav from './AdminNav';
import { createStackNavigator } from '@react-navigation/stack';
import { BookDetails, Home, Login, NotificationCenter, OnBoarding, PatientInfo, PaymentHistory, Profile, Questions, SignUp } from '../screens';
import { AppContext } from '../context/AppContext';
import { colors } from '../constants/colors';
import UserNav from './UserNav';
import AdminList from '../screens/doctor/AdminList';

const MainStack = createStackNavigator()


export default function FoladeBookShop() {
  const {state} = useContext(AppContext);

  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: colors.mainBg
          }
        }}>
          {!state.loggedin ? (
            <>
              <MainStack.Screen component={OnBoarding} name={'OnBoarding'} />
              <MainStack.Screen component={Login} name={'Login'} />
              <MainStack.Screen component={SignUp} name={'SignUp'} />
            </>
          ) : (
            <>
              {state.user.role === 'doctor' && (
              <MainStack.Screen component={AdminNav} name={'AdminNav'} />
              )}
              {state.user.role === 'patient' && (
                <MainStack.Screen component={Home} name={'Home'} />
              )}
                <MainStack.Screen component={Profile} name={'Profile'} />
                <MainStack.Screen component={NotificationCenter} name={'NotificationCenter'} />
                <MainStack.Screen component={AdminList} name={'AdminList'} />
                <MainStack.Screen component={PaymentHistory} name={'PaymentHistory'} />
                <MainStack.Screen component={PatientInfo} name={'PatientInfo'} />
            </>
          )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

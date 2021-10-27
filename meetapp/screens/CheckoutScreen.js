import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import PaymentScreen from '../components/PaymentScreen';
import Button from "../components/Button";
import Toast from 'react-native-root-toast';
import { useSelector, useDispatch } from 'react-redux';
import { API_URL } from '../config';
import { resetToken } from '../actions/chat';
import { useIsFocused } from "@react-navigation/native";

export default function CheckoutScreen(props) {
  const {
    initPaymentSheet,
    presentPaymentSheet,
    confirmPaymentSheetPayment,
  } = useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

    useLayoutEffect(() => {
        if(isFocused){
            props.navigation.setOptions({
                headerTitleStyle: {
                    fontFamily: "OpenSans"
                }
            })
        }
    }, [isFocused])

  const fetchPaymentSheetParams = async () => {
    try {
        const response = await fetch(`${API_URL}/pay/payment-sheet`, {
            method: 'POST',
            body: JSON.stringify({
                userId: auth.id
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { paymentIntent, ephemeralKey, customer } = await response.json();
    
        return {
          paymentIntent,
          ephemeralKey,
          customer,
        };
    } catch (error) {
        console.log("FETCH PAYMENT SHEET PARAMS", error)
    }
  };

  const initialisePaymentSheet = async () => {
    setLoading(true);

    try {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = await fetchPaymentSheetParams();

      const { error, paymentOption } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        customFlow: true,
        merchantDisplayName: 'Example Inc.',
        applePay: true,
        merchantCountryCode: 'US',
        style: 'alwaysDark',
        googlePay: true,
        testEnv: true,
      });

      if (!error) {
        setPaymentSheetEnabled(true);
      }
      if (paymentOption) {
        setPaymentMethod({image: paymentOption.paymentOption.image, label: paymentOption.paymentOption.label});
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const choosePaymentOption = async () => {
    const { error, paymentOption } = await presentPaymentSheet({
      confirmPayment: false,
    });

    if (error) {
      console.log('error', error);
    } else if (paymentOption) {
      setPaymentMethod({
        label: paymentOption.label,
        image: paymentOption.image,
      });
    } else {
      setPaymentMethod(null);
    }
  };

  const onPressBuy = async () => {
    setLoading(true);
    const { error } = await confirmPaymentSheetPayment();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully!');
      await dispatch(resetToken(auth.id, 30));
      Toast.show('30 tokens added successfully', {
        duration: Toast.durations.LONG,
      });
      setPaymentSheetEnabled(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    initialisePaymentSheet();
  }, []);

  return (
    <PaymentScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Ready to checkout!</Text>
        <Text style={styles.subtitle}>Buy 30 tokens for 3$</Text>
        <Button
          variant="primary"
          loading={loading}
          title={
            paymentMethod ? (
              <View style={styles.row}>
                <Image
                  source={{
                    uri: `data:image/png;base64,${paymentMethod.image}`,
                  }}
                  style={styles.image}
                />
                <Text style={styles.text}>{paymentMethod.label}</Text>
              </View>
            ) : (
              'Choose payment method'
            )
          }
          disabled={!paymentSheetEnabled}
          onPress={choosePaymentOption}
        />
      </View>

      <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          disabled={!paymentMethod || !paymentSheetEnabled}
          title="Buy"
          onPress={onPressBuy}
        />
      </View>
    </PaymentScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "white"
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginTop: 20,
  },
  paymentMethodTitle: {
    color: "#0A2540",
    fontWeight: 'bold',
  },
  image: {
    width: 26,
    height: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  title: {
    fontSize: 23,
    fontFamily: "OpenSans",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 17,
    fontFamily: "OpenSans",
    marginTop: 10,
    marginBottom: 40,
    textAlign: "center"
  },
});

import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import BackButton from '@/components/BackButton';
import Typo from '@/components/Typo';
import Input from '@/components/Input';
import * as Icons from 'phosphor-react-native';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';

const Register = () => {

  const emailRef = useRef('');

  const passwordRef = useRef('');

  const nameRef = useRef('');

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert('Sign Up', 'please fill all the fields');
      return;
    }

    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current,
    );

    setIsLoading(false);

    console.log("Register Result: ", res);

    if (!res.success) {
      Alert.alert("Sign Up: ", res.msg);
    }


  };

  return (
    <ScreenWrapper>

      <View style={styles.container}>
        {/* Back Button */}
        <BackButton iconSize={25} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={'800'}>
            Let's
          </Typo>
          <Typo size={30} fontWeight={'800'}>
            Get Started
          </Typo>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typo>
          <Input
            placeholder='Enter Your Name'
            onChangeText={(value) => (nameRef.current = value)}
            icon={
              <Icons.UserIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight='fill' />
            }
          />

          <Input
            placeholder='Enter Your Email'
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight='fill' />
            }
          />

          <Input
            placeholder='Enter Your Password'
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight='fill' />
            }
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={'700'} color={colors.black} size={21}>Sign Up</Typo>
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account ?</Typo>
          <Pressable onPress={() => router.navigate('/(auth)/login')}>
            <Typo size={15} fontWeight={'700'} color={colors.primary}>Login</Typo>
          </Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcometext: {
    fontSize: verticalScale(20),
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotpassword: {
    textAlign: 'right',
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footertext: {
    textAlign: 'center',
    color: colors.text,
    fontSize: verticalScale(15),
  },
})
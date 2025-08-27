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

const Login = () => {

    const emailRef = useRef('');

    const passwordRef = useRef('');

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', 'please fill all the fields');
            return;
        }
        console.log("Email: ", emailRef.current);
        console.log("Password: ", passwordRef.current);
        console.log("Good to go");
    }

    return (
        <ScreenWrapper>

            <View style={styles.container}>
                {/* Back Button */}
                <BackButton iconSize={25} />

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={'800'}>
                        Hey,
                    </Typo>
                    <Typo size={30} fontWeight={'800'}>
                        Welcome Back
                    </Typo>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Login now to track all your expenses
                    </Typo>
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

                    <Typo size={14} color={colors.text} style={{ alignSelf: 'flex-end' }}>Forgot Password ?</Typo>

                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={'700'} color={colors.black} size={21}>Login</Typo>
                    </Button>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Typo size={15}>Don't have an account ?</Typo>
                    <Pressable onPress={() => router.navigate('/(auth)/register')}>
                        <Typo size={15} fontWeight={'700'} color={colors.primary}>Sign Up</Typo>
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Login

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
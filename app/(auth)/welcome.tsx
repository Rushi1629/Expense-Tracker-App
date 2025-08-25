import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Login Button & Image */}

        <View>
          <TouchableOpacity style={styles.loginButton}>
            <Typo fontWeight={"500"}>Sign In</Typo>
          </TouchableOpacity>

          <Animated.Image entering={FadeIn.duration(2000)} source={require("../../assets/images/welcome.png")} style={styles.welcomeImage} resizeMode='contain' />

        </View>

        <View style={styles.footer}>

          <View style={{ alignItems: "center" }}>
            <Typo size={25} fontWeight={"800"}>Always Take Control</Typo>
            <Typo size={25} fontWeight={"800"}>of Your Finances</Typo>
          </View>

          <View style={{ alignItems: "center" }}>
            <Typo size={15} color={colors.textLight}>Finances must be arranged to set a better</Typo>
            <Typo size={15} color={colors.textLight}>lifestyle in future</Typo>
          </View>

          <View style={styles.buttonContainer}>
            {/* Button */}
            <Button>
              <Typo size={15} color={colors.neutral900} fontWeight={"600"}>Get Started</Typo>
            </Button>
          </View>

        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
})
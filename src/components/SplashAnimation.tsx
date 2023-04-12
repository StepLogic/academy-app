import LottieView from "lottie-react-native";
import { View } from "react-native";
import { theme } from "../../assets/theme";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import Images from "@res/images";
import Lottie from "lottie-react-native";
import { ActivityIndicator } from "react-native-paper";

interface SplashAnimationProps {
  setShowSplash?: (value: boolean) => void;
}

export default function SplashAnimation(props: SplashAnimationProps) {
  const { setShowSplash } = props;
  const animationRef = useRef<Lottie>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View
      style={[
        {
          width: 100 * theme.vw,
          height: 100 * theme.vh,
          position: "absolute",
          zIndex: 1000,
          backgroundColor: theme.colors.white,
        },
      ]}
    >
      {show && (
        <View
          style={{
            position: "absolute",
            marginHorizontal: "auto",
            left: 0,
            right: 0,
            bottom: 10 * theme.vh,
            elevation: 10,
          }}
        >
          <ActivityIndicator
            animating={true}
            size={"small"}
            color={theme.colors.secondary}
          />
        </View>
      )}
      <LottieView
        autoPlay
        loop={false}
        onLayout={() => {
          animationRef.current?.play();
        }}
        onAnimationFinish={() => (setShow(true), (typeof setShowSplash === "function" ? setShowSplash(false) : null))}
        style={{
          width: 30 * theme.vh,
          height: 30 * theme.vh,
          marginTop: "auto",
          marginBottom: "auto",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        ref={animationRef}
        source={Images.animation}
      />
      {/* <View
        style={{
          width: "100%",
        }}
      >
        <LottieView
          autoPlay
          // loop={true}
          style={{
            width: 100 * theme.vw,
            height: 100 * theme.vh,
            backgroundColor: theme.colors.white,
          }}
          ref={animationRef}
          source={Images.animation}
        />
      </View> */}
    </View>
  );
}

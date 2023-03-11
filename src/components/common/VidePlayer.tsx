import { AVPlaybackStatus, Audio, Video } from "expo-av";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useEffect, useRef, useState } from "react";
import React from "react";
import Slider from "@react-native-community/slider";
import { VideoProps } from "expo-av";
import { ActivityIndicatorProps, Dimensions } from "react-native";
import { ColorValue } from "react-native";

import { MutableRefObject, ReactNode } from "react";
import { SliderProps } from "@react-native-community/slider";

// https://github.com/typescript-cheatsheets/react/issues/415
type Props = RequiredProps & DefaultProps;

const defaultProps = {
  errorCallback: (error) =>
    console.error(
      `[VideoPlayer] ${error.type} Error - ${error.message}: ${error.obj}`
    ),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  playbackCallback: () => {},
  defaultControlsVisible: false,
  timeVisible: true,
  slider: {
    visible: true,
  },
  textStyle: {
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
  },
  activityIndicator: {
    size: "large",
    color: "#999",
  },
  animation: {
    fadeInDuration: 300,
    fadeOutDuration: 300,
  },
  style: {
    width: Platform.OS === "web" ? "100%" : Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    videoBackgroundColor: "#000",
    controlsBackgroundColor: "#000",
  },
  icon: {
    size: 48,
    color: "#FFF",
    style: {
      padding: 2,
    },
  },
  fullscreen: {
    enterFullscreen: () =>
      // eslint-disable-next-line no-console
      console.log(
        "[VideoPlayer] - missing `enterFullscreen` function in `fullscreen` prop"
      ),
    exitFullscreen: () =>
      // eslint-disable-next-line no-console
      console.log(
        "[VideoPlayer] - missing `exitFullscreen` function in `fullscreen` prop"
      ),
    inFullscreen: false,
    visible: true,
  },
  autoHidePlayer: true,
  header: undefined,
  mute: {
    enterMute: () =>
      // eslint-disable-next-line no-console
      console.log(
        "[VideoPlayer] - missing `enterMute` function in `mute` prop"
      ),
    exitMute: () =>
      // eslint-disable-next-line no-console
      console.log("[VideoPlayer] - missing `exitMute` function in `mute` prop"),
    isMute: false,
    visible: false,
  },
} as DefaultProps;

type RequiredProps = {
  videoProps: VideoProps & {
    ref?: MutableRefObject<Video>;
  };
};

type DefaultProps = {
  errorCallback: (error: ErrorType) => void;
  playbackCallback: (status: AVPlaybackStatus) => void;
  defaultControlsVisible: boolean;
  timeVisible: boolean;
  textStyle: TextStyle;
  slider: {
    visible?: boolean;
  } & SliderProps;
  activityIndicator: ActivityIndicatorProps;
  animation: {
    fadeInDuration?: number;
    fadeOutDuration?: number;
  };
  header: ReactNode;
  style: {
    width?: number;
    height?: number;
    videoBackgroundColor?: ColorValue;
    controlsBackgroundColor?: ColorValue;
  };
  icon: {
    size?: number;
    color?: ColorValue;
    style?: TextStyle;
    pause?: JSX.Element;
    play?: JSX.Element;
    replay?: JSX.Element;
    loading?: JSX.Element;
    fullscreen?: JSX.Element;
    exitFullscreen?: JSX.Element;
    mute?: JSX.Element;
    exitMute?: JSX.Element;
  };
  fullscreen: {
    enterFullscreen?: () => void;
    exitFullscreen?: () => void;
    inFullscreen?: boolean;
    visible?: boolean;
  };
  autoHidePlayer: boolean;
  mute: {
    enterMute?: () => void;
    exitMute?: () => void;
    isMute?: boolean;
    visible?: boolean;
  };
};

const VideoPlayer = (tempProps: Props) => {
  const props = deepMerge(defaultProps, tempProps) as Props;

  let playbackInstance: Video | null = null;
  let controlsTimer: NodeJS.Timeout | null = null;
  let initialShow = props.defaultControlsVisible;
  const header = props.header;

  const [errorMessage, setErrorMessage] = useState("");
  const controlsOpacity = useRef(
    new Animated.Value(props.defaultControlsVisible ? 1 : 0)
  ).current;
  const [controlsState, setControlsState] = useState(
    props.defaultControlsVisible ? ControlStates.Visible : ControlStates.Hidden
  );
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: props.videoProps.source
      ? PlaybackStates.Loading
      : PlaybackStates.Error,
  });

  // We need to extract ref, because of misstypes in <Slider />
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: sliderRef, ...sliderProps } = props.slider;
  const screenRatio = props.style.width! / props.style.height!;

  let videoHeight = props.style.height;
  let videoWidth = videoHeight! * screenRatio;

  if (videoWidth > props.style.width!) {
    videoWidth = props.style.width!;
    videoHeight = videoWidth / screenRatio;
  }

  useEffect(() => {
    setAudio();

    return () => {
      if (playbackInstance) {
        playbackInstance.setStatusAsync({
          shouldPlay: false,
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!props.videoProps.source) {
      console.error(
        "[VideoPlayer] `Source` is a required in `videoProps`. " +
          "Check https://docs.expo.io/versions/latest/sdk/video/#usage"
      );
      setErrorMessage("`Source` is a required in `videoProps`");
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: PlaybackStates.Error,
      });
    } else {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: PlaybackStates.Playing,
      });
    }
  }, [props.videoProps.source]);

  const hideAnimation = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: props.animation.fadeOutDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setControlsState(ControlStates.Hidden);
      }
    });
  };

  const animationToggle = () => {
    if (controlsState === ControlStates.Hidden) {
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: props.animation.fadeInDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setControlsState(ControlStates.Visible);
        }
      });
    } else if (controlsState === ControlStates.Visible) {
      hideAnimation();
    }

    if (controlsTimer === null && props.autoHidePlayer) {
      controlsTimer = setTimeout(() => {
        if (
          playbackInstanceInfo.state === PlaybackStates.Playing &&
          controlsState === ControlStates.Hidden
        ) {
          hideAnimation();
        }
        if (controlsTimer) {
          clearTimeout(controlsTimer);
        }
        controlsTimer = null;
      }, 2000);
    }
  };

  // Set audio mode to play even in silent mode (like the YouTube app)
  const setAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    } catch (e) {
      props.errorCallback({
        type: ErrorSeverity.NonFatal,
        message: "Audio.setAudioModeAsync",
        obj: e as Record<string, unknown>,
      });
    }
  };

  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    props.playbackCallback(status);

    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state:
          status.positionMillis === status.durationMillis
            ? PlaybackStates.Ended
            : status.isBuffering
            ? PlaybackStates.Buffering
            : status.shouldPlay
            ? PlaybackStates.Playing
            : PlaybackStates.Paused,
      });
      if (
        (status.didJustFinish && controlsState === ControlStates.Hidden) ||
        (status.isBuffering &&
          controlsState === ControlStates.Hidden &&
          initialShow)
      ) {
        animationToggle();
        initialShow = false;
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        setErrorMessage(errorMsg);
        props.errorCallback({
          type: ErrorSeverity.Fatal,
          message: errorMsg,
          obj: {},
        });
      }
    }
  };

  const togglePlay = async () => {
    if (controlsState === ControlStates.Hidden) {
      return;
    }
    const shouldPlay = playbackInstanceInfo.state !== PlaybackStates.Playing;
    if (playbackInstance !== null) {
      await playbackInstance.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === PlaybackStates.Ended && {
          positionMillis: 0,
        }),
      });
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state:
          playbackInstanceInfo.state === PlaybackStates.Playing
            ? PlaybackStates.Paused
            : PlaybackStates.Playing,
      });
      if (shouldPlay) {
        animationToggle();
      }
    }
  };

  if (playbackInstanceInfo.state === PlaybackStates.Error) {
    return (
      <View
        style={{
          backgroundColor: props.style.videoBackgroundColor,
          width: videoWidth,
          height: videoHeight,
        }}
      >
        <ErrorMessage style={props.textStyle} message={errorMessage} />
      </View>
    );
  }

  if (playbackInstanceInfo.state === PlaybackStates.Loading) {
    return (
      <View
        style={{
          backgroundColor: props.style.controlsBackgroundColor,
          width: videoWidth,
          height: videoHeight,
          justifyContent: "center",
        }}
      >
        {props.icon.loading || (
          <ActivityIndicator {...props.activityIndicator} />
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: props.style.videoBackgroundColor,
        width: videoWidth,
        height: videoHeight,
        maxWidth: "100%",
      }}
    >
      <Video
        style={styles.videoWrapper}
        {...props.videoProps}
        ref={(component) => {
          playbackInstance = component;
          if (props.videoProps.ref) {
            props.videoProps.ref.current = component as Video;
          }
        }}
        onPlaybackStatusUpdate={updatePlaybackCallback}
      />

      <Animated.View
        pointerEvents={
          controlsState === ControlStates.Visible ? "auto" : "none"
        }
        style={[
          styles.topInfoWrapper,
          {
            opacity: controlsOpacity,
          },
        ]}
      >
        {header}
      </Animated.View>

      <TouchableWithoutFeedback onPress={animationToggle}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: controlsOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: props.style.controlsBackgroundColor,
              opacity: 0.5,
            }}
          />
          <View
            pointerEvents={
              controlsState === ControlStates.Visible ? "auto" : "none"
            }
          >
            <View style={styles.iconWrapper}>
              <TouchableButton onPress={togglePlay}>
                <View>
                  {playbackInstanceInfo.state === PlaybackStates.Buffering &&
                    (props.icon.loading || (
                      <ActivityIndicator {...props.activityIndicator} />
                    ))}
                  {playbackInstanceInfo.state === PlaybackStates.Playing &&
                    props.icon.pause}
                  {playbackInstanceInfo.state === PlaybackStates.Paused &&
                    props.icon.play}
                  {playbackInstanceInfo.state === PlaybackStates.Ended &&
                    props.icon.replay}
                  {((playbackInstanceInfo.state === PlaybackStates.Ended &&
                    !props.icon.replay) ||
                    (playbackInstanceInfo.state === PlaybackStates.Playing &&
                      !props.icon.pause) ||
                    (playbackInstanceInfo.state === PlaybackStates.Paused &&
                      !props.icon.pause)) && (
                    <MaterialIcons
                      name={
                        playbackInstanceInfo.state === PlaybackStates.Playing
                          ? "pause"
                          : playbackInstanceInfo.state === PlaybackStates.Paused
                          ? "play-arrow"
                          : "replay"
                      }
                      style={props.icon.style}
                      size={props.icon.size}
                      color={props.icon.color}
                    />
                  )}
                </View>
              </TouchableButton>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        pointerEvents={
          controlsState === ControlStates.Visible ? "auto" : "none"
        }
        style={[
          styles.bottomInfoWrapper,
          {
            opacity: controlsOpacity,
          },
        ]}
      >
        {props.timeVisible && (
          <Text style={[props.textStyle, styles.timeLeft]}>
            {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.position)}
          </Text>
        )}
        {props.slider.visible && (
          <Slider
            {...sliderProps}
            style={[styles.slider, props.slider.style]}
            value={
              playbackInstanceInfo.duration
                ? playbackInstanceInfo.position / playbackInstanceInfo.duration
                : 0
            }
            onSlidingStart={() => {
              if (playbackInstanceInfo.state === PlaybackStates.Playing) {
                togglePlay();
                setPlaybackInstanceInfo({
                  ...playbackInstanceInfo,
                  state: PlaybackStates.Paused,
                });
              }
            }}
            onSlidingComplete={async (e) => {
              const position = e * playbackInstanceInfo.duration;
              if (playbackInstance) {
                await playbackInstance.setStatusAsync({
                  positionMillis: position,
                  shouldPlay: true,
                });
              }
              setPlaybackInstanceInfo({
                ...playbackInstanceInfo,
                position,
              });
            }}
          />
        )}
        {props.timeVisible && (
          <Text style={[props.textStyle, styles.timeRight]}>
            {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
          </Text>
        )}
        {props.mute.visible && (
          <TouchableButton
            onPress={() =>
              props.mute.isMute
                ? props.mute.exitMute?.()
                : props.mute.enterMute?.()
            }
          >
            <View>
              {props.icon.mute}
              {props.icon.exitMute}
              {((!props.icon.mute && props.mute.isMute) ||
                (!props.icon.exitMute && !props.mute.isMute)) && (
                <MaterialIcons
                  name={props.mute.isMute ? "volume-up" : "volume-off"}
                  style={props.icon.style}
                  size={props.icon.size! / 2}
                  color={props.icon.color}
                />
              )}
            </View>
          </TouchableButton>
        )}
        {props.fullscreen.visible && (
          <TouchableButton
            onPress={() =>
              props.fullscreen.inFullscreen
                ? props.fullscreen.exitFullscreen!()
                : props.fullscreen.enterFullscreen!()
            }
          >
            <View>
              {!props.fullscreen.inFullscreen && props.icon.fullscreen}
              {props.fullscreen.inFullscreen && props.icon.exitFullscreen}
              {((!props.icon.fullscreen && !props.fullscreen.inFullscreen) ||
                (!props.icon.exitFullscreen &&
                  props.fullscreen.inFullscreen)) && (
                <MaterialIcons
                  name={
                    props.fullscreen.inFullscreen
                      ? "fullscreen-exit"
                      : "fullscreen"
                  }
                  style={props.icon.style}
                  size={props.icon.size! / 2}
                  color={props.icon.color}
                />
              )}
            </View>
          </TouchableButton>
        )}
      </Animated.View>
    </View>
  );
};

VideoPlayer.defaultProps = defaultProps;

export default VideoPlayer;

import {
  Platform,
  TextStyle,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
export const ErrorMessage = ({
  message,
  style,
}: {
  message: string;
  style: TextStyle;
}) => (
  <View style={styles.errorWrapper}>
    <Text style={style}>{message}</Text>
  </View>
);

export const getMinutesSecondsFromMilliseconds = (ms: number) => {
  const totalSeconds = ms / 1000;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, "0") + ":" + seconds.padStart(2, "0");
};

type ButtonProps = (TouchableNativeFeedbackProps | TouchableOpacityProps) & {
  children: React.ReactNode;
};
export const TouchableButton = (props: ButtonProps) =>
  Platform.OS === "android" ? (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("white", true)}
      {...props}
    />
  ) : (
    <TouchableOpacity {...props} />
  );

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3585151
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepMerge = (
  target: { [x: string]: any },
  source: { [x: string]: any }
) => {
  const result = { ...target, ...source };
  const keys = Object.keys(result);

  for (const key of keys) {
    const tprop = target[key];
    const sprop = source[key];
    if (typeof tprop === "object" && typeof sprop === "object") {
      result[key] = deepMerge(tprop, sprop);
    }
  }

  return result;
};
const styles = StyleSheet.create({
  errorWrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  videoWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  iconWrapper: {
    borderRadius: 100,
    overflow: "hidden",
    padding: 10,
  },
  bottomInfoWrapper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    bottom: 0,
    left: 0,
    right: 0,
  },
  topInfoWrapper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  timeLeft: { backgroundColor: "transparent", marginLeft: 5 },
  timeRight: { backgroundColor: "transparent", marginRight: 5 },
  slider: { flex: 1, paddingHorizontal: 10 },
});

export enum ControlStates {
  Visible = "Visible",
  Hidden = "Hidden",
}

export enum PlaybackStates {
  Loading = "Loading",
  Playing = "Playing",
  Paused = "Paused",
  Buffering = "Buffering",
  Error = "Error",
  Ended = "Ended",
}

export enum ErrorSeverity {
  Fatal = "Fatal",
  NonFatal = "NonFatal",
}

export type ErrorType = {
  type: ErrorSeverity;
  message: string;
  obj: Record<string, unknown>;
};

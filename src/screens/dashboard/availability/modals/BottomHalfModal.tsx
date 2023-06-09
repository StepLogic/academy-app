import React from "react";
import { StyleSheet } from "react-native";
// @ts-ignore
import Modal from "react-native-modal";
import ModalBaseScene from "./ModalBaseScene";
import Typography from "@components/common/Typography";

class BottomHalfModal extends ModalBaseScene {
  renderModal(): React.ReactElement<any> {
    return (
      <Modal
        testID={"modal"}
        isVisible={this.isVisible()}
        onSwipeComplete={this.close}
        swipeDirection={["up", "left", "right", "down"]}
        style={styles.view}
      >
        <Typography>Hello</Typography>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

export default BottomHalfModal;

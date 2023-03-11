import React, { Component, ErrorInfo, ReactNode } from "react";
import { View } from "react-native";
import tw from "twrnc";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorInfo: "h",
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorInfo: _.name };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    return (
      <View style={tw`flex-1 relative`}>
        {this.props.children}
        {/* {this.state.hasError && (
          <Toast style={[tw`absolute top-1  right-2`, { elevation: 20 }]}>
            {this.state.errorInfo}
          </Toast>
        )} */}
      </View>
    );
  }
}

export default ErrorBoundary;

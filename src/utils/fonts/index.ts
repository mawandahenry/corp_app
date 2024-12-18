import { Text, TextInput } from 'react-native';

export const setGlobalFont = (fontName: string) => {
  // Override the default font globally for Text and TextInput components
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = {
    ...(Text.defaultProps.style || {}),
    fontFamily: fontName,
  };

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = {
    ...(TextInput.defaultProps.style || {}),
    fontFamily: fontName,
  };
};

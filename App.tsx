import { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import RichTextInput from './src/RichTextInput';
import Toolbar from './src/Toolbar';
import RichTextInputV2 from './src/RichTextInputV2';

export default function App() {
  const richTextInputRef = useRef(null);

  return (
    <View style={styles.container}>
      {/* <RichTextInput ref={richTextInputRef}/> */}
      <RichTextInputV2/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 120
  },
});

import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, Button } from 'react-native';

import Toolbar from './src/Toolbar';
import RichTextInput from './src/RichTextInput';

export default function App() {
  const richTextInputRef = useRef(null);

  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <RichTextInput ref={richTextInputRef}/>
      <Toolbar richTextInputRef={richTextInputRef} />
      {/* <TextInput
        value={value}
        onChangeText={setValue}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 16
        }}
      />
      <Button
        title="Set value"
        onPress={() => richTextInputRef.current.setValue(value)}
      /> */}
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

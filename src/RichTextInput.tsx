import { useState, useImperativeHandle, useRef } from "react";
import { TextInput, Text, StyleSheet, View } from "react-native";

const exampleText = "Hello *bold* *italic* lineThrough *underline* world!";

const StylesMap = {
    bold: (children) => <Text style={styles.bold}>{children}</Text>,
    italic: (children) => <Text style={styles.italic}>{children}</Text>,
    lineThrough: (children) => <Text style={styles.lineThrough}>{children}</Text>,
    underline: (children) => <Text style={styles.underline}>{children}</Text>,
}

function parseAsterisks(str) {
  const parts = str.split('*'); // ["This is a ", "test string", ""]
  
  return parts.map((part, i) => {
    // Even indexes = normal text
    if (i % 2 === 0) {
      return <Text key={`text-${i}`}>{part}</Text>;
    }

    // Odd indexes = highlighted text
    return (
      <Text key={`bold-${i}`} style={{ fontWeight: 'bold' }}>
        {part}
      </Text>
    );
  });
}

export default function RichTextInput({
    ref
}) {
    const inputRef = useRef<TextInput>(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const valueRef = useRef('');

    const [children, setChildren] = useState(exampleText);

    useImperativeHandle(ref, () => ({
        setValue(value: string) {
            valueRef.current = value;
            setChildren(value);
        },
        toggleBold() {
            console.log("Toggle bold text");
        },
        toggleItalic() {
            console.log("Toggle italic text");
        }
    }), []);

    const handleSelectionChange = ({ nativeEvent }) => {
        selectionRef.current = nativeEvent.selection;
    }

    const handleOnChangeText = (text: string) => {
        setChildren(parseAsterisks(text));
    }

    return (
       <View style={{ position: "relative" }}>
            <TextInput
                multiline={true}
                ref={inputRef}
                style={styles.textInput}
                placeholder="Rich text input"
                onSelectionChange={handleSelectionChange}
                onChangeText={handleOnChangeText}
            >
                {children}
            </TextInput>
       </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: 20,
        width: "100%",
        paddingHorizontal: 16
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: "italic"
    },
    lineThrough: {
        textDecorationLine: "line-through"
    },
    underline: {
        textDecorationLine: "underline",
    }
});
import { useState, useImperativeHandle, useRef } from "react";
import { TextInput, Text, StyleSheet, View, Linking } from "react-native";

const exampleText = "Hello *bold* _italic_ lineThrough *underline* world!";

const StylesMap = {
    bold: (children) => <Text style={styles.bold}>{children}</Text>,
    italic: (children) => <Text style={styles.italic}>{children}</Text>,
    lineThrough: (children) => <Text style={styles.lineThrough}>{children}</Text>,
    underline: (children) => <Text style={styles.underline}>{children}</Text>,
}

function tokenize(str) {
  const patterns = [
    { type: "bold",       regex: /\*(.+?)\*/gs },
    { type: "italic",     regex: /_(.+?)_/gs },
    { type: "strike",     regex: /~(.+?)~/gs },
    { type: "link",       regex: /\[([^\]]+?)\]\(([^)]+?)\)/gs },
    { type: "color",      regex: /color:([a-zA-Z0-9#]+)\{([^}]+)\}/gs },
  ];

  let tokens = [];
  let lastIndex = 0;

  // Master regex combining all the above
  const master = new RegExp(
    patterns.map(p => p.regex.source).join("|"),
    "gs"
  );

  let match;
  while ((match = master.exec(str)) !== null) {
    // Push raw text before matched token
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: str.slice(lastIndex, match.index) });
    }

    const [
      full,
      boldText,
      italicText,
      strikeText,
      linkText,
      linkHref,
      colorValue,
      colorText,
    ] = match;

    if (boldText !== undefined) {
      tokens.push({ type: "bold", value: boldText });
    } else if (italicText !== undefined) {
      tokens.push({ type: "italic", value: italicText });
    } else if (strikeText !== undefined) {
      tokens.push({ type: "strike", value: strikeText });
    } else if (linkText !== undefined) {
      tokens.push({ type: "link", text: linkText, href: linkHref });
    } else if (colorValue !== undefined) {
      tokens.push({ type: "color", value: colorText, color: colorValue });
    }

    lastIndex = master.lastIndex;
  }

  // remaining text
  if (lastIndex < str.length) {
    tokens.push({ type: "text", value: str.slice(lastIndex) });
  }

  return tokens;
}

/* ------------------------------------------
   2) RENDERER: converts tokens → <Text/>
------------------------------------------- */

function renderTokens(tokens) {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "text":
        return <Text key={`t-${i}`}>{token.value}</Text>;

      case "bold":
        return (
          <Text key={`b-${i}`} style={{ fontWeight: "bold" }}>
            {token.value}
          </Text>
        );

      case "italic":
        return (
          <Text key={`i-${i}`} style={{ fontStyle: "italic" }}>
            {token.value}
          </Text>
        );

      case "strike":
        return (
          <Text key={`s-${i}`} style={{ textDecorationLine: "line-through" }}>
            {token.value}
          </Text>
        );

      case "color":
        return (
          <Text key={`c-${i}`} style={{ color: token.color }}>
            {token.value}
          </Text>
        );

      case "link":
        return (
          <Text
            key={`l-${i}`}
            style={{ textDecorationLine: "underline" }}
            onPress={() => Linking.openURL(token.href)}
          >
            {token.text}
          </Text>
        );

      default:
        return null;
    }
  });
}

export function parseRichText(input) {
  const tokens = tokenize(input);
  return renderTokens(tokens);
}

export default function RichTextInput({
    ref
}) {
    const inputRef = useRef<TextInput>(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const valueRef = useRef('');

    const [raw, setRaw] = useState("");

    useImperativeHandle(ref, () => ({
        setValue(value: string) {
            valueRef.current = value;
            setRaw(value);
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
        valueRef.current = valueRef.current;

        setRaw(text);
        /** Know issue: after parsing symbols are removed so they are not actually saved because they where parsed.
         * That produces that when typing again the text that was parsed has no symbols so 
         * it is not parsed again, causing the styles to disappear.
         * Must find a way to diff between the generated array with the new one to not remove previous styles. */
        
        /** Maybe a fix could be to loop over the TextInput content since it's already parsed
         * and generate a rich text string with the corresponding symbols in the place of the text views.
         */
        console.log(parseRichText(text));
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
                {parseRichText(raw)}
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
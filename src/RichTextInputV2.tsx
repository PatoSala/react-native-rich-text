import { useState, useImperativeHandle, useRef, useEffect } from "react";
import { TextInput, Text, StyleSheet, View, Linking } from "react-native";

const exampleText = "Hello *bold* _italic_ lineThrough *underline* world!";

interface Token {
    type: string;
    text: string;
}

interface Diff {
    start: number;
    removed: string;
    added: string;
}

function insertAt(str, index, substring) {
  // Clamp index into valid boundaries
  const i = Math.max(0, Math.min(index, str.length));
  return str.slice(0, i) + substring + str.slice(i);
}

// Returns string modifications
function diffStrings(prev, next) : Diff {
  let start = 0;

  while (start < prev.length && start < next.length && prev[start] === next[start]) {
    start++;
  }

  let endPrev = prev.length - 1;
  let endNext = next.length - 1;

  while (endPrev >= start && endNext >= start && prev[endPrev] === next[endNext]) {
    endPrev--;
    endNext--;
  }

  return {
    start,
    removed: prev.slice(start, endPrev + 1),
    added: next.slice(start, endNext + 1),
  };
}

const tokenize = () => {}

const updateTokens = (tokens: Token[], diff: Diff) => {
    let untokenizedString = ""
    // First: find corresponding token
    for (const token of tokens) {
        untokenizedString += token.text; // Concat all prev tokens text to find updated token.
        
        if (diff.start <= untokenizedString.length) {
            if (diff.removed.length > 0) {
                token.text = token.text.replace(diff.removed, "");
            }

            if (diff.added.length > 0) {
                token.text = insertAt(token.text, diff.start, diff.added);
            }
        }
    }

    return tokens;

}

export default function RichTextInputV2() {
    const inputRef = useRef<TextInput>(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const [rawText, setRawText] = useState("");
    const [tokens, setTokens] = useState([
        {
            type: "text",
            text: ""
        }
    ]);
    console.log("TOKENS", tokens);
    const [children, setChildren] = useState([]);
    const prevTextRef = useRef("");

    const handleSelectionChange = ({ nativeEvent }) => {
        selectionRef.current = nativeEvent.selection;
    }

    const handleOnChangeText = (nextText: string) => {
        const diff = diffStrings(prevTextRef.current, nextText);
        console.log(diff);

        const updatedTokens = updateTokens(tokens, diff);
        console.log(updatedTokens);
        setTokens([...updatedTokens]);

        prevTextRef.current = nextText;
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
                {tokens.map((token, i) => {
                    return (
                        <Text key={i} style={{ backgroundColor: "red" }}>{token.text}</Text>
                    )
                })}
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
    text: {
        color: "black"
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
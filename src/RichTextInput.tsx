import { useState, useImperativeHandle, useRef } from "react";
import { TextInput, Text, StyleSheet } from "react-native";

function debugElements(nodes, indent = 0) {
  const pad = ' '.repeat(indent);

  if (typeof nodes === 'string' || typeof nodes === 'number') {
    return pad + JSON.stringify(nodes);
  }

  if (Array.isArray(nodes)) {
    return (
      pad + '[\n' +
      nodes.map(n => debugElements(n, indent + 2)).join(',\n') +
      '\n' + pad + ']'
    );
  }

  if (nodes && typeof nodes === 'object') {
    const type = typeof nodes.type === 'string'
      ? nodes.type
      : nodes.type?.name || 'Anonymous';

    return (
      pad + `${type}(\n` +
      debugElements(nodes.props?.children, indent + 2) +
      '\n' + pad + ')'
    );
  }

  return pad + String(nodes);
}


export function parseStyledText(value, appliedStyles = []) {
  if (!value) return value;

  // Build list of ranges to style
  let ranges = [];

  appliedStyles.forEach((item, index) => {
    const { text, style } = item;
    if (!text) return;

    let searchIndex = 0;
    while (true) {
      const foundIndex = value.indexOf(text, searchIndex);
      if (foundIndex === -1) break;

      ranges.push({
        start: foundIndex,
        end: foundIndex + text.length,
        style,
        key: `${style}-${foundIndex}-${index}`,
      });

      searchIndex = foundIndex + text.length;
    }
  });

  // No matches → return plain string
  if (ranges.length === 0) return value;

  // Sort by start index
  ranges.sort((a, b) => a.start - b.start);

  let output = [];
  let cursor = 0;

  for (let r of ranges) {
    // Push text before match
    if (cursor < r.start) {
      output.push(value.slice(cursor, r.start));
    }

    const matchText = value.slice(r.start, r.end);

    // Apply style
    output.push(
      <Text key={r.key} style={mapStyle(r.style)}>
        {matchText}
      </Text>
    );

    cursor = r.end;
  }

  // Push remaining text
  if (cursor < value.length) {
    output.push(value.slice(cursor));
  }

  return output;
}

function mapStyle(styleName) {
  switch (styleName) {
    case "bold":
      return { fontWeight: "bold" };
    case "italic":
      return { fontStyle: "italic" };
    case "underline":
      return { textDecorationLine: "underline" };
    default:
      return {};
  }
}

const StylesMap = {
    bold: (children) => <Text style={styles.bold}>{children}</Text>,
    italic: (children) => <Text style={styles.italic}>{children}</Text>,
    lineThrough: (children) => <Text style={styles.lineThrough}>{children}</Text>,
    underline: (children) => <Text style={styles.underline}>{children}</Text>,
}

export default function RichTextInput({
    ref
}) {
    const inputRef = useRef<TextInput>(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const valueRef = useRef('');

    const [appliedStyles, setAppliedStyles] = useState([]);
    console.log(appliedStyles);
    // Formatted
    const [children, setChildren] = useState("");

    useImperativeHandle(ref, () => ({
        setValue(value: string) {
            valueRef.current = value;
            setChildren(value);
            setAppliedStyles([]);
        },
        toggleBold() {
            const selection = selectionRef.current;
            const value = valueRef.current;
            
            const startString = value.slice(0, selection.start);
            const selectedString = value.slice(selection.start, selection.end);
            const endString = value.slice(selection.end);

            setAppliedStyles(prevState => {
                return [
                    ...prevState,
                    {
                        text: selectedString,
                        style: "bold"
                    }
                ]
            })
        },
        toggleItalic() {
            const selection = selectionRef.current;
            const value = valueRef.current;
            
            const startString = value.slice(0, selection.start);
            const selectedString = value.slice(selection.start, selection.end);
            const endString = value.slice(selection.end);

            setAppliedStyles(prevState => {
                return [
                    ...prevState,
                    {
                        text: selectedString,
                        style: "italic"
                    }
                ]
            })
        }
    }), []);

    const handleSelectionChange = ({ nativeEvent }) => {
        selectionRef.current = nativeEvent.selection;
    }

    const handleOnChangeText = (text: string) => {
        valueRef.current = text;
        setChildren(text);
    }

    return (
        <TextInput
            multiline={true}
            ref={inputRef}
            style={styles.textInput}
            placeholder="Rich text input"
            onSelectionChange={handleSelectionChange}
            onChangeText={handleOnChangeText}
        >
            {parseStyledText(children, appliedStyles)}
        </TextInput>
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
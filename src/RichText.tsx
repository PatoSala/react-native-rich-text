import { useImperativeHandle, useRef } from "react";
import { Text } from "react-native";

/** This component will only recieve a string with rich text symbols 
 * and will render the text with the corresponding styles.
 */

const symbols = ["*"];

export function RichText({ ref, string }) {
    const textRef = useRef(null);
    const sliced = string.split("*");

    console.log(sliced);
    useImperativeHandle(ref, () => ({
        format(string) {
            textRef.current?.setNativeProps({ text: string });
            textRef.current?.setNativeProps({ text: string });
        }
    }), []);

    return (
        <Text ref={textRef}>
            {string}
        </Text>
    )
}
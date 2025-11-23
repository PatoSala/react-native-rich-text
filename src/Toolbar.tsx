import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Toolbar({
    richTextInputRef
}) {

    const handleBold = () => {
        richTextInputRef.current.toggleBold();
    }

    const handleItalic = () => {
        richTextInputRef.current.toggleItalic();
    }

    const handleClear = () => {
        richTextInputRef.current.setValue('');
    }

    return (
        <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolbarButton} onPress={handleBold}>
                <Text>Bold</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolbarButton} onPress={handleItalic}>
                <Text>Italic</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolbarButton} onPress={handleClear}>
                <Text>Clear</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        width: "100%",
        height: 50,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        marginTop: 16
    },
    toolbarButton: {
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
});
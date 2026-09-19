import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TopBar = () => {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.text}>TopBar</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#282727",
        paddingBottom: 12,
        paddingHorizontal: 16,
        justifyContent: "flex-end",
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
})

export default TopBar

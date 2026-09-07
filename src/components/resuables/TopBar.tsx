import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Text>TopBar</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#282727"
    }
})

export default TopBar
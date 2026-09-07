import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { convertTabPropsToOptions } from 'expo-router/build/native-tabs/NativeTabTrigger'
import TopBar from '@/components/resuables/TopBar'

interface Types {
    containTopBar: boolean
}

const HEIGHT = (20/100) * window.innerHeight

const TopBarContext = ({containTopBar}: Types) => {
  return (
    <SafeAreaView style={styles.container}>
        {containTopBar && <TopBar />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        height: HEIGHT
    }
})

export default TopBarContext
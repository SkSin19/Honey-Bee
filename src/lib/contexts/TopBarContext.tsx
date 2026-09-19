import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import TopBar from '@/components/resuables/TopBar'

interface Types {
    containTopBar: boolean
}

const TopBarContext = ({ containTopBar, children }: PropsWithChildren<Types>) => {
  return (
    <View style={styles.container}>
        {containTopBar && <TopBar />}
        <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
})

export default TopBarContext

import React from 'react'
import { View } from 'react-native'
import * as Progress from 'react-native-progress'

export function LoadingScreen() {
    return (
        <View className="flex-1 bg-neutral-900 items-center justify-center">
            <Progress.CircleSnail size={60} color="#EAB308" thickness={4} />
        </View>
    )
}

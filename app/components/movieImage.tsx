import { Image as ExpoImage } from 'expo-image'
import React, { useState } from 'react'
import { View } from 'react-native'

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4'

export default function MovieImage(props: any) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <View
        style={props.style}
        className={`bg-neutral-700 items-center justify-center ${props.className ?? ''}`}
      >
        <View className="w-12 h-12 rounded-full bg-neutral-600" />
      </View>
    )
  }

  return (
    <ExpoImage
      source={props.source}
      style={props.style}
      className={props.className}
      placeholder={blurhash}
      placeholderContentFit="cover"
      contentFit="cover"
      transition={300}
      cachePolicy="memory-disk"
      onError={() => setFailed(true)}
    />
  )
}

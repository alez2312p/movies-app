import { posterW500 } from '@/api/moviedb'
import { useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import MovieImage from './movieImage'

const { width, height } = Dimensions.get('window')

export default function MovieList({
  title,
  data,
  hideSeeAll,
  onSeeAll,
}: {
  title: string
  data: any[]
  hideSeeAll?: boolean
  onSeeAll?: () => void
}) {
  const router = useRouter()

  return (
    <View className="mb-8 space-y-4">
      <View className="flex-row justify-between items-center mx-4">
        <Text className="text-white text-xl">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text className="text-yellow-500">See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() =>
                router.push({
                  pathname: '/movie/[id]',
                  params: {
                    id: String(item.id ?? 1),
                    movie: JSON.stringify(item),
                  },
                })
              }
            >
              <View className="space-y-1 mr-4">
                <MovieImage
                  source={{
                    uri: item.poster_path
                      ? `${posterW500}${item.poster_path}`
                      : undefined,
                  }}
                  className="rounded-3xl"
                  style={{ width: width * 0.33, height: height * 0.2 }}
                  resizeMode="cover"
                />
                <Text className="text-neutral-300 ml-1">
                  {item.title?.length > 14
                    ? item.title.substring(0, 14) + '...'
                    : item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </ScrollView>
    </View>
  )
}

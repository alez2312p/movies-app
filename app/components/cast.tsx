import { posterW185 } from '@/api/moviedb'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MovieImage from './movieImage'

export default function Cast({ cast }: { cast: any[] }) {
  const router = useRouter()

  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Top cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast.map((actor, index) => (
          <TouchableOpacity
            key={index}
            className="mr-4 items-center"
            onPress={() =>
              router.push({
                pathname: '/person/[id]',
                params: {
                  id: String(actor.id ?? index),
                  person: JSON.stringify(actor),
                },
              })
            }
          >
            <View className="overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500">
              <MovieImage
                source={{
                  uri: actor.profile_path
                    ? `${posterW185}${actor.profile_path}`
                    : undefined,
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text
              className="text-white text-xs mt-1 text-center"
              style={{ maxWidth: 80 }}
            >
              {actor.name?.length > 10
                ? actor.name.slice(0, 10) + '...'
                : actor.name}
            </Text>
            <Text
              className="text-neutral-400 text-xs mt-1 text-center"
              style={{ maxWidth: 80 }}
            >
              {actor.character?.length > 10
                ? actor.character.slice(0, 10) + '...'
                : actor.character}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

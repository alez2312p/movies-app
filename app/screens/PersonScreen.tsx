import { fetchPersonDetails, fetchPersonMovieCredits, posterW500 } from '@/api/moviedb'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MovieImage from '../components/movieImage'
import MovieList from '../components/movieList'

const { width, height } = Dimensions.get('window')
const ios = Platform.OS === 'ios'
const verticalMargin = ios ? '' : 'my-3'

export default function PersonScreen({ person }: { person: any }) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const [personDetails, setPersonDetails] = useState<any>(person)
  const [personMovies, setPersonMovies] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const id = person?.id ?? 0
    setError(false)

    const [details, credits] = await Promise.all([
      fetchPersonDetails(id),
      fetchPersonMovieCredits(id),
    ])

    if (!details || Object.keys(details).length === 0) {
      setError(true)
      setLoading(false)
      setRefreshing(false)
      return
    }

    if (details) setPersonDetails(details)
    if (credits?.cast) setPersonMovies(credits.cast)

    setLoading(false)
    setRefreshing(false)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  const genderLabel = (g: number) => {
    switch (g) {
      case 1:
        return 'Female'
      case 2:
        return 'Male'
      default:
        return 'Other'
    }
  }

  if (loading && !refreshing)
    return (
      <View className="flex-1 bg-neutral-900">
        <View className="flex-row justify-center mt-20">
          <View className="bg-neutral-800 rounded-full h-72 w-72" />
        </View>
        <View className="items-center mt-6 space-y-4 mx-4">
          <View className="bg-neutral-800 rounded-full h-7 w-48" />
          <View className="bg-neutral-800 rounded-lg h-24 w-full" />
        </View>
      </View>
    )

  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EAB308" />
      }
    >
      <View
        className={
          'flex-row justify-between items-center px-4' + verticalMargin
        }
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: '#EAB308' }}
          className="rounded-xl p-1"
        >
          <ChevronLeftIcon size={28} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFavourite(!isFavourite)}
          className="rounded-xl p-1"
        >
          {isFavourite ? (
            <HeartIcon size={28} color="red" />
          ) : (
            <HeartIcon size={28} strokeWidth={2.5} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View>
        <View
          className="flex-row justify-center"
          style={{
            shadowColor: 'gray',
            shadowRadius: 40,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1,
          }}
        >
          <View className="overflow-hidden rounded-full h-72 w-72 items-center border-2 border-neutral-500">
            <MovieImage
              source={{
                uri: personDetails?.profile_path
                  ? `${posterW500}${personDetails.profile_path}`
                  : undefined,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="items-center mt-6">
          <Text className="text-white text-3xl font-bold">
            {personDetails?.name}
          </Text>
          {personDetails?.place_of_birth && (
            <Text className="text-neutral-500 text-base text-center">
              {personDetails.place_of_birth}
            </Text>
          )}
        </View>

        {/* Error retry */}
        {error && (
          <View className="items-center mx-6 my-4">
            <Text className="text-neutral-400 text-base mb-3">
              Could not load person
            </Text>
            <TouchableOpacity
              onPress={fetchData}
              className="bg-yellow-500 rounded-full px-6 py-2"
            >
              <Text className="text-black font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-white font-semibold">Gender</Text>
            <Text className="text-neutral-300 text-sm">
              {genderLabel(personDetails?.gender ?? 0)}
            </Text>
          </View>
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-white font-semibold">Birthday</Text>
            <Text className="text-neutral-300 text-sm">
              {personDetails?.birthday ?? 'N/A'}
            </Text>
          </View>
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-white font-semibold">Known For</Text>
            <Text className="text-neutral-300 text-sm">
              {personDetails?.known_for_department ?? 'N/A'}
            </Text>
          </View>
          <View className="px-2 items-center">
            <Text className="text-white font-semibold">Popularity</Text>
            <Text className="text-neutral-300 text-sm">
              {personDetails?.popularity?.toFixed(1) ?? 'N/A'}
            </Text>
          </View>
        </View>
        {personDetails?.biography && (
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Biography</Text>
            <Text className="text-neutral-400 tracking-wide leading-6">
              {personDetails.biography}
            </Text>
          </View>
        )}
        {/* Movies */}
        {personMovies.length > 0 && (
          <MovieList title="Movies" hideSeeAll={true} data={personMovies} />
        )}
      </View>
    </ScrollView>
  )
}

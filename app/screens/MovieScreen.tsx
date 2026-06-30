import { getFavorites, toggleFavorite } from '@/api/favorites'
import {
  backdropW780,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieVideos,
  fetchSimilarMovies,
  posterW500,
} from '@/api/moviedb'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Cast from '../components/cast'
import MovieImage from '../components/movieImage'
import MovieList from '../components/movieList'

const { width, height } = Dimensions.get('window')

export default function MovieScreen({ movie }: { movie: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const [movieDetails, setMovieDetails] = useState<any>(movie)
  const [cast, setCast] = useState<any[]>([])
  const [similarMovies, setSimilarMovies] = useState<any[]>([])
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    fetchData()
    checkFavorite()
  }, [])

  const checkFavorite = async () => {
    const id = movie?.id
    if (!id) return
    const favs = await getFavorites()
    setIsFavourite(favs.includes(id))
  }

  const fetchData = async () => {
    const id = movie?.id ?? 0
    setError(false)
    setLoading(true)

    const [details, credits, similar, videos] = await Promise.all([
      fetchMovieDetails(id),
      fetchMovieCredits(id),
      fetchSimilarMovies(id),
      fetchMovieVideos(id),
    ])

    if (!details || Object.keys(details).length === 0) {
      setError(true)
      setLoading(false)
      setRefreshing(false)
      return
    }

    if (details) setMovieDetails(details)
    if (credits?.cast) setCast(credits.cast)
    if (similar?.results) setSimilarMovies(similar.results)

    if (videos?.results) {
      const trailer = videos.results.find(
        (v: any) => v.type === 'Trailer' && v.site === 'YouTube',
      )
      if (trailer) setTrailerKey(trailer.key)
    }

    setLoading(false)
    setRefreshing(false)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  const handleFavourite = async () => {
    const id = movie?.id
    if (!id) return
    const nowFav = await toggleFavorite(id)
    setIsFavourite(nowFav)
  }

  const voteAvg = movieDetails?.vote_average
  const voteColor =
    voteAvg >= 7 ? '#22c55e' : voteAvg >= 5 ? '#eab308' : '#ef4444'

  if (loading && !refreshing)
    return (
      <View className="flex-1 bg-neutral-900">
        <View style={{ height: height * 0.55 }}>
          <View className="bg-neutral-800 w-full h-full" />
        </View>
        <View className="px-6 mt-6 space-y-4">
          <View className="bg-neutral-800 rounded-full h-7 w-56 mx-auto" />
          <View className="flex-row justify-center space-x-3">
            <View className="bg-neutral-800 rounded-full h-5 w-16" />
            <View className="bg-neutral-800 rounded-full h-5 w-20" />
          </View>
          <View className="flex-row justify-center flex-wrap mx-4 space-x-2">
            <View className="bg-neutral-800 rounded-full h-7 w-20" />
            <View className="bg-neutral-800 rounded-full h-7 w-24" />
            <View className="bg-neutral-800 rounded-full h-7 w-16" />
          </View>
          <View className="bg-neutral-800 rounded-lg h-24 w-full" />
          <View className="bg-neutral-800 rounded-full h-5 w-24" />
          <View className="flex-row space-x-4">
            <View className="bg-neutral-800 rounded-full h-20 w-20" />
            <View className="bg-neutral-800 rounded-full h-20 w-20" />
            <View className="bg-neutral-800 rounded-full h-20 w-20" />
          </View>
        </View>
      </View>
    )

  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#EAB308"
        />
      }
    >
      {/* Header Image */}
      <View className="w-full relative" style={{ height: height * 0.55 }}>
        <MovieImage
          source={{
            uri: movieDetails?.backdrop_path
              ? `${backdropW780}${movieDetails.backdrop_path}`
              : movieDetails?.poster_path
                ? `${posterW500}${movieDetails.poster_path}`
                : undefined,
          }}
          className="absolute top-0 left-0 w-full h-full"
          style={{ width, height: height * 0.55 }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
          style={{
            width,
            height: height * 0.4,
            position: 'absolute',
            bottom: 0,
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View
          className="absolute top-0 left-0 right-0 z-20 flex-row justify-between items-center px-4"
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
            onPress={handleFavourite}
            className="rounded-xl p-1"
          >
            {isFavourite ? (
              <HeartIcon size={28} color="red" />
            ) : (
              <HeartIcon size={28} strokeWidth={2.5} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Movie Details */}
      <View style={{ marginTop: -(height * 0.09) }}>
        {/* Title & Rating */}
        <View className="items-center mb-4">
          <Text className="text-white text-center text-3xl font-bold tracking-wider">
            {movieDetails?.title}
          </Text>
          {voteAvg != null && (
            <View className="flex-row items-center mt-2 space-x-1">
              <View
                className="rounded-full px-3 py-0.5"
                style={{ backgroundColor: voteColor + '30' }}
              >
                <Text style={{ color: voteColor }} className="font-bold text-sm">
                  ★ {voteAvg.toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Status, release, runtime */}
        <View className="flex-row justify-center items-center space-x-3 mb-5">
          {movieDetails?.release_date && (
            <View className="bg-neutral-700 rounded-full px-3 py-1">
              <Text className="text-neutral-300 text-sm font-medium">
                {movieDetails.release_date.split('-')[0]}
              </Text>
            </View>
          )}
          {movieDetails?.runtime && (
            <View className="bg-neutral-700 rounded-full px-3 py-1">
              <Text className="text-neutral-300 text-sm font-medium">
                {Math.floor(movieDetails.runtime / 60)}h{' '}
                {movieDetails.runtime % 60}m
              </Text>
            </View>
          )}
        </View>

        {/* Genres */}
        {movieDetails?.genres?.length > 0 && (
          <View className="flex-row justify-center flex-wrap mx-4 mb-5">
            {movieDetails.genres.map((genre: any) => (
              <View
                key={genre.id}
                className="bg-yellow-500/20 border border-yellow-500/40 rounded-full px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-yellow-400 text-sm font-semibold">
                  {genre.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Trailer Button */}
        {trailerKey && (
          <View className="items-center mb-5">
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)
              }
              className="bg-red-600 rounded-full px-6 py-2 flex-row items-center space-x-2"
            >
              <Text className="text-white font-semibold text-base">
                ▶ Watch Trailer
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Divider */}
        <View className="h-px bg-neutral-700 mx-6 mb-5" />

        {/* Error retry */}
        {error && (
          <View className="items-center mx-6 mb-5">
            <Text className="text-neutral-400 text-base mb-3">
              Something went wrong
            </Text>
            <TouchableOpacity
              onPress={fetchData}
              className="bg-yellow-500 rounded-full px-6 py-2"
            >
              <Text className="text-black font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Description */}
        <Text className="text-neutral-400 text-base leading-6 px-6 mb-5">
          {movieDetails?.overview}
        </Text>

        {/* Divider */}
        {cast.length > 0 && <View className="h-px bg-neutral-700 mx-6 mb-5" />}

        {/* Cast */}
        {cast.length > 0 && <Cast cast={cast} />}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MovieList
            title="Similar Movies"
            hideSeeAll={true}
            data={similarMovies}
          />
        )}
      </View>
    </ScrollView>
  )
}

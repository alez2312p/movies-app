import {
    fetchTopRatedMovies,
    fetchTrendingMovies,
    fetchUpcomingMovies,
    posterW500,
} from '@/api/moviedb'
import { Image as ExpoImage } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline"
import { SafeAreaView } from 'react-native-safe-area-context'
import MovieList from '../components/movieList'
import TrendingMovies from '../components/trendingMovies'

const ios = Platform.OS === 'ios'

export default function HomeScreen() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(false)
    const [trendingMovies, setTrendingMovies] = useState([])
    const [upcomingMovies, setUpcomingMovies] = useState([])
    const [topRated, setTopRated] = useState([])

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async () => {
        setError(false)
        const trending = await fetchTrendingMovies()
        const upcoming = await fetchUpcomingMovies()
        const topRated = await fetchTopRatedMovies()

        if (!trending?.results && !upcoming?.results && !topRated?.results) {
            setError(true)
            setLoading(false)
            setRefreshing(false)
            return
        }

        if (trending?.results) setTrendingMovies(trending.results)
        if (upcoming?.results) setUpcomingMovies(upcoming.results)
        if (topRated?.results) setTopRated(topRated.results)

        const allPosters = [
            ...(trending?.results ?? []),
            ...(upcoming?.results ?? []),
            ...(topRated?.results ?? []),
        ]
            .map((m: any) => (m.poster_path ? `${posterW500}${m.poster_path}` : null))
            .filter(Boolean) as string[]

        ExpoImage.prefetch(allPosters)

        setLoading(false)
        setRefreshing(false)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchMovies()
    }, [])

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-neutral-800">
                <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
                    <View className='flex-row justify-between items-center mx-4'>
                        <Bars3CenterLeftIcon size={30} strokeWidth={2} color="#fff" />
                        <Text className='text-3xl font-bold text-white'><Text style={{ color: "#EAB308" }}>M</Text>ovies</Text>
                        <MagnifyingGlassIcon size={30} strokeWidth={2} color="#fff" />
                    </View>
                </SafeAreaView>
                <ScrollView className="flex-1 px-4 space-y-6">
                    <View>
                        <View className="bg-neutral-700 rounded-full h-6 w-24 mb-5" />
                        <View className="flex-row space-x-3">
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 280, height: 420 }} />
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 280, height: 420 }} />
                        </View>
                    </View>
                    <View>
                        <View className="bg-neutral-700 rounded-full h-6 w-32 mb-5" />
                        <View className="flex-row space-x-3">
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 130, height: 195 }} />
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 130, height: 195 }} />
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 130, height: 195 }} />
                        </View>
                    </View>
                    <View>
                        <View className="bg-neutral-700 rounded-full h-6 w-32 mb-5" />
                        <View className="flex-row space-x-3">
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 130, height: 195 }} />
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 130, height: 195 }} />
                            <View className="bg-neutral-700 rounded-3xl" style={{ width: 130, height: 195 }} />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    return (
        <View className='flex-1 bg-neutral-800'>
            <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
                <StatusBar style="light" />
                <View className='flex-row justify-between items-center mx-4'>
                    <Bars3CenterLeftIcon size={30} strokeWidth={2} color="#fff" />
                    <Text className='text-3xl font-bold text-white'><Text style={{ color: "#EAB308" }}>M</Text>ovies</Text>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/search' })}>
                        <MagnifyingGlassIcon size={30} strokeWidth={2} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EAB308" />
                }
            >
                {error && (
                    <View className="items-center mx-6 my-4">
                        <Text className="text-neutral-400 text-base mb-3">Could not load movies</Text>
                        <TouchableOpacity onPress={() => { setLoading(true); fetchMovies() }} className="bg-yellow-500 rounded-full px-6 py-2">
                            <Text className="text-black font-semibold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TrendingMovies data={trendingMovies} />
                <MovieList title="Upcoming" data={upcomingMovies} onSeeAll={() => router.push({ pathname: '/search', params: { q: 'upcoming' } })} />
                <MovieList title="Top Rated" data={topRated} onSeeAll={() => router.push({ pathname: '/search', params: { q: 'top_rated' } })} />
            </ScrollView>
        </View>
    )
}

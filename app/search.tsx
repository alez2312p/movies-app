import { fetchSearchMovies, posterW500 } from '@/api/moviedb'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MovieImage from './components/movieImage'

const { width } = Dimensions.get('window')

export default function SearchScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const queryRef = useRef(query)

    useEffect(() => {
        queryRef.current = query
    }, [query])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setPage(1)
            setHasMore(true)
            setLoading(false)
            return
        }

        if (timerRef.current) clearTimeout(timerRef.current)
        setLoading(true)
        setPage(1)

        timerRef.current = setTimeout(async () => {
            const data = await fetchSearchMovies(query.trim())
            if (data?.results) setResults(data.results)
            if (data?.total_pages) setHasMore(data.total_pages > 1)
            setLoading(false)
        }, 500)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [query])

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || !query.trim()) return
        setLoadingMore(true)

        const nextPage = page + 1
        const data = await fetchSearchMovies(queryRef.current.trim(), nextPage)

        if (data?.results) {
            setResults((prev) => [...prev, ...data.results])
            setPage(nextPage)
            if (data.total_pages && nextPage >= data.total_pages) setHasMore(false)
        }

        setLoadingMore(false)
    }, [page, hasMore, loadingMore])

    return (
        <View className="flex-1 bg-neutral-900" style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center mx-4 mb-4">
                <TextInput
                    className="flex-1 bg-neutral-800 text-white rounded-full text-base pl-6 pr-5 py-3"
                    placeholder="Search movies..."
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                />
                <TouchableOpacity onPress={() => router.back()} className="ml-3">
                    <XMarkIcon size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading && (
                <ActivityIndicator size="large" color="#EAB308" className="mt-10" />
            )}

            <FlatList
                data={results}
                keyExtractor={(item, i) => String(item.id ?? i)}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/movie/[id]',
                                params: {
                                    id: String(item.id),
                                    movie: JSON.stringify(item),
                                },
                            })
                        }
                        className="mb-4"
                    >
                        <MovieImage
                            source={{
                                uri: item.poster_path
                                    ? `${posterW500}${item.poster_path}`
                                    : undefined,
                            }}
                            className="rounded-2xl"
                            style={{
                                width: (width - 48) / 2,
                                height: ((width - 48) / 2) * 1.5,
                            }}
                            resizeMode="cover"
                        />
                        <Text className="text-white text-sm mt-1">{item.title}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    loading
                        ? null
                        : () => (
                            <Text className="text-neutral-500 text-center mt-20 text-base">
                                {query ? 'No movies found' : 'Type to search movies...'}
                            </Text>
                        )
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator color="#EAB308" className="my-4" />
                    ) : null
                }
            />
        </View>
    )
}

import { useLocalSearchParams } from 'expo-router'
import MovieScreen from '../screens/MovieScreen'

export default function MovieRoute() {
    const params = useLocalSearchParams()
    const movie = params.movie ? JSON.parse(params.movie as string) : null

    return <MovieScreen movie={movie} />
}

import { posterW500 } from '@/api/moviedb'
import { useRouter } from 'expo-router'
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native'
import MovieImage from './movieImage'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.72
const ITEM_SPACING = 16

export default function TrendingMovies({ data }: { data: any[] }) {
  const router = useRouter()

  return (
    <View className="mb-8">
      <Text className="text-white text-xl mx-4 mb-5">Trending</Text>
      <FlatList
        data={data}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - ITEM_WIDTH) / 2 }}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            onPress={() =>
              router.push({
                pathname: '/movie/[id]',
                params: {
                  id: String(item.id ?? 1),
                  movie: JSON.stringify(item),
                },
              })
            }
          />
        )}
      />
    </View>
  )
}

const MovieCard = ({
  item,
  onPress,
}: {
  item: any
  onPress: () => void
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: ITEM_WIDTH, marginHorizontal: ITEM_SPACING / 2 }}
    >
      <View
        className="w-full rounded-3xl overflow-hidden"
        style={{ height: ITEM_WIDTH * 1.5 }}
      >
        <MovieImage
          source={{
            uri: item.poster_path
              ? `${posterW500}${item.poster_path}`
              : undefined,
          }}
          className="w-full h-full rounded-3xl"
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  )
}

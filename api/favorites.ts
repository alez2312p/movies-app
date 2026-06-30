import AsyncStorage from '@react-native-async-storage/async-storage'

const FAVORITES_KEY = '@movies_favorites'

export const getFavorites = async (): Promise<number[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const toggleFavorite = async (movieId: number): Promise<boolean> => {
  const favorites = await getFavorites()
  const index = favorites.indexOf(movieId)
  if (index >= 0) {
    favorites.splice(index, 1)
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    return false
  } else {
    favorites.push(movieId)
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    return true
  }
}

export const isFavorite = async (movieId: number): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.includes(movieId)
}

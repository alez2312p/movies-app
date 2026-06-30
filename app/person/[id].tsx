import { useLocalSearchParams } from 'expo-router'
import PersonScreen from '../screens/PersonScreen'

export default function PersonRoute() {
    const params = useLocalSearchParams()
    const person = params.person ? JSON.parse(params.person as string) : null

    return <PersonScreen person={person} />
}

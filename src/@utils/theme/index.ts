import { fetchData } from '../fetch'

const apiUrl = 'https://www.thecolorapi.com/id?hex=24B1E0'

export async function getBackgroundColor(): Promise<string> {
  const data = await fetchData(apiUrl)
  return data
}

import { getLibraries } from '@/utils/fetchTautulli'
import getSettings from '@/utils/getSettings'
import { Suspense } from 'react'
import Home from './_components/Home'

export default async function HomePage() {
  const settings = getSettings()
  const libraries = await getLibraries()

  return (
    <Suspense>
      <Home settings={settings} libraries={libraries} />
    </Suspense>
  )
}

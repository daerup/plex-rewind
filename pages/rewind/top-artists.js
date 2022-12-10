import CardTop from '../../components/CardTop/CardTop'
import fetchTautulli from '../../utils/fetchTautulli'

function MostPlayedArtists({ artists, totalDuration }) {
  return (
    <>
      {/* TODO: Globalise */}
      <h1 className="mb-4 text-xl font-bold uppercase sm:text-2xl">
        Dashboard
      </h1>

      <CardTop
        statTitle="Most played"
        statCategory="artists"
        page="3 / 4"
        items={artists}
        period="Last 30 days"
        prevCard="/rewind/top-movies"
        nextCard="/rewind/top-users"
        className="bg-gradient-to-br from-teal-700 via-indigo-700 to-purple-800"
        totalDuration={totalDuration}
      />
    </>
  )
}

export async function getStaticProps() {
  const artists = await fetchTautulli('get_home_stats', {
    stat_id: 'top_music',
    stats_count: 5,
    stats_type: 'duration',
  })
  const totalDuration = await fetchTautulli('get_history', {
    media_type: 'track',
    length: 0,
  })

  return {
    props: {
      artists: artists.response.data,
      totalDuration: totalDuration.response.data.total_duration,
    },
  }
}

export default MostPlayedArtists

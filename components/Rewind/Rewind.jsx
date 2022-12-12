import { useState } from 'react'
import CardHeading from '../CardHeading/CardHeading'
import CardTop from '../CardTop/CardTop'
import RewindTitle from '../RewindTitle/RewindTitle'

function Rewind({ rewind, returnHome }) {
  console.log(rewind)
  const [showTotals, setShowTotals] = useState(true)
  const [showTv, setShowTv] = useState(false)
  const [showMovies, setShowMovies] = useState(false)
  const [showMusic, setShowMusic] = useState(false)

  return (
    <>
      <RewindTitle returnHome={returnHome} />

      {showTv ? (
        <CardTop
          statTitle="Watch time"
          statCategory="TV Shows"
          page="2 / 4"
          prevCard={() => {
            setShowTv(false)
            setShowTotals(true)
          }}
          nextCard={() => {
            setShowTv(false)
            setShowMovies(true)
          }}
          className="bg-gradient-to-br from-teal-700 via-indigo-700 to-purple-800"
          subtitle="Rauno T"
        >
          <div className="flex flex-col justify-center flex-1 pb-12">
            <CardHeading>
              <span className="text-teal-300">TV Shows</span> took up{' '}
              <span className="inline-block text-3xl font-semibold text-black">
                {rewind.tv.duration}
              </span>{' '}
              of that time.
            </CardHeading>
          </div>
        </CardTop>
      ) : showMovies ? (
        <CardTop
          statTitle="Watch time"
          statCategory="Movies"
          page="3 / 4"
          prevCard={() => {
            setShowMovies(false)
            setShowTv(true)
          }}
          nextCard={() => {
            setShowMovies(false)
            setShowMusic(true)
          }}
          className="bg-gradient-to-br from-teal-700 via-indigo-700 to-purple-800"
          subtitle="Rauno T"
        >
          <div className="flex flex-col justify-center flex-1 pb-12">
            <CardHeading>
              <span className="inline-block text-3xl font-semibold text-black">
                {rewind.movies.duration}
              </span>{' '}
              of your time was spent watching{' '}
              <span className="text-teal-300">Movies</span> on{' '}
              <span className="text-yellow-500">Plex</span> this year.
            </CardHeading>
          </div>
        </CardTop>
      ) : showMusic ? (
        <CardTop
          statTitle="Listen time"
          statCategory="Music"
          page="4 / 4"
          prevCard={() => {
            setShowMusic(false)
            setShowMovies(true)
          }}
          className="bg-gradient-to-br from-teal-700 via-indigo-700 to-purple-800"
          subtitle="Rauno T"
        >
          <div className="flex flex-col justify-center flex-1 pb-12">
            <CardHeading>
              And to top it all off, you listened to{' '}
              <span className="inline-block text-3xl font-semibold text-black">
                {rewind.music.duration}
              </span>{' '}
              of <span className="text-teal-300">Music</span> on{' '}
              <span className="text-yellow-500">Plex</span>.
            </CardHeading>
          </div>
        </CardTop>
      ) : (
        <CardTop
          statTitle="Watch time"
          statCategory="Total"
          page="1 / 4"
          nextCard={() => {
            setShowTotals(false)
            setShowTv(true)
          }}
          className="bg-gradient-to-br from-teal-700 via-indigo-700 to-purple-800"
          subtitle="Rauno T"
        >
          <div className="flex flex-col justify-center flex-1 pb-12">
            <CardHeading>
              You&apos;ve spent a <span className="text-teal-300">total</span>{' '}
              of{' '}
              <span className="inline-block text-3xl font-semibold text-black">
                {rewind.totals.duration}
              </span>{' '}
              on <span className="text-yellow-500">Plex</span> this year!
            </CardHeading>
          </div>
        </CardTop>
      )}
    </>
  )
}

export default Rewind
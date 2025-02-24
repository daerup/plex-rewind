import { authOptions } from '@/lib/auth'
import { DashboardSearchParams } from '@/types/dashboard'
import { Settings } from '@/types/settings'
import { TautulliItem, TautulliUser } from '@/types/tautulli'
import {
  fetchOverseerrStats,
  fetchOverseerrUserId,
} from '@/utils/fetchOverseerr'
import fetchTautulli, { getLibrariesByType } from '@/utils/fetchTautulli'
import { secondsToTime, timeToSeconds } from '@/utils/formatting'
import getPeriod from '@/utils/getPeriod'
import getSettings from '@/utils/getSettings'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Dashboard from '../_components/Dashboard'
import DashboardLoader from '../_components/DashboardLoader'

export const metadata: Metadata = {
  title: 'Users',
}

type UserRequestCounts =
  | {
      requests: number
    }
  | undefined

async function getUsers(
  period: number,
  requestsPeriod: string,
  periodString: string,
) {
  const usersRes = await fetchTautulli<TautulliItem>('get_home_stats', {
    stat_id: 'top_users',
    stats_count: 6,
    stats_type: 'duration',
    time_range: period,
  })
  const users = usersRes?.response?.data?.rows

  if (!users) {
    return
  }

  const settings = getSettings()
  const [moviesLib, showsLib, audioLib] = await Promise.all([
    getLibrariesByType('movie'),
    getLibrariesByType('show'),
    getLibrariesByType('artist'),
  ])
  const isOverseerrActive =
    settings.connection.overseerrUrl && settings.connection.overseerrApiKey

  let usersRequestsCounts: UserRequestCounts[] = []

  if (isOverseerrActive) {
    const overseerrUserIds = await Promise.all(
      users.map(async (user) => {
        const overseerrId = await fetchOverseerrUserId(String(user.user_id))

        return overseerrId
      }),
    )

    usersRequestsCounts = await Promise.all(
      overseerrUserIds.map(async (overseerrId) => {
        if (overseerrId) {
          const userTotal = await fetchOverseerrStats(
            `user/${overseerrId}/requests`,
            requestsPeriod,
          )

          return {
            requests: userTotal.length,
          }
        }
      }),
    )
  }

  const usersPlaysAndDurations = await Promise.all(
    users.map(async (user) => {
      let moviesPlaysCount = 0
      let showsPlaysCount = 0
      let audioPlaysCount = 0

      for (const movieLib of moviesLib) {
        const userMovies = await fetchTautulli<{ recordsFiltered: number }>(
          'get_history',
          {
            user_id: user.user_id,
            after: periodString,
            section_id: movieLib.section_id,
          },
        )

        moviesPlaysCount += userMovies?.response?.data?.recordsFiltered || 0
      }

      for (const showLib of showsLib) {
        const userShows = await fetchTautulli<{ recordsFiltered: number }>(
          'get_history',
          {
            user_id: user.user_id,
            after: periodString,
            section_id: showLib.section_id,
          },
        )

        showsPlaysCount += userShows?.response?.data?.recordsFiltered || 0
      }

      for (const audioLibItem of audioLib) {
        const userAudio = await fetchTautulli<{ recordsFiltered: number }>(
          'get_history',
          {
            user_id: user.user_id,
            after: periodString,
            section_id: audioLibItem.section_id,
          },
        )

        audioPlaysCount += userAudio?.response?.data?.recordsFiltered || 0
      }

      return {
        movies_plays_count: moviesPlaysCount,
        shows_plays_count: showsPlaysCount,
        audio_plays_count: audioPlaysCount,
      }
    }),
  )

  users.map((user, i) => {
    user.requests = usersRequestsCounts[i]?.requests || 0
    user.movies_plays_count = usersPlaysAndDurations[i].movies_plays_count
    user.shows_plays_count = usersPlaysAndDurations[i].shows_plays_count
    user.audio_plays_count = usersPlaysAndDurations[i].audio_plays_count
  })

  return users
}

async function getTotalDuration(period: string, settings: Settings) {
  if (settings.dashboard.activeTotalStatistics.includes('duration')) {
    const totalDuration = await fetchTautulli<{ total_duration: string }>(
      'get_history',
      {
        after: period,
        length: 0,
      },
    )

    return secondsToTime(
      timeToSeconds(totalDuration?.response?.data?.total_duration || '0'),
    )
  }

  return undefined
}

async function getUsersCount(settings: Settings) {
  if (settings.dashboard.activeTotalStatistics.includes('count')) {
    const usersRes = await fetchTautulli<TautulliUser[]>('get_users')

    let users = usersRes?.response?.data

    if (users) {
      users = users.filter(
        (user) => user.is_active && user.username !== 'Local',
      )
    }

    return users?.length
  }

  return undefined
}

async function getTotalRequests(period: string, settings: Settings) {
  const isOverseerrActive =
    settings.connection.overseerrUrl && settings.connection.overseerrApiKey

  if (
    settings.dashboard.activeTotalStatistics.includes('requests') &&
    isOverseerrActive
  ) {
    const requests = await fetchOverseerrStats('request', period)

    return requests.length.toString()
  }

  return undefined
}

type Props = {
  searchParams: DashboardSearchParams
}

async function DashboardUsersContent({ searchParams }: Props) {
  const settings = getSettings()

  if (!settings.dashboard.isUsersPageActive) {
    return notFound()
  }

  const session = await getServerSession(authOptions)
  const period = getPeriod(searchParams, settings)
  const [usersData, totalDuration, usersCount, totalRequests] =
    await Promise.all([
      getUsers(period.daysAgo, period.date, period.string),
      getTotalDuration(period.string, settings),
      getUsersCount(settings),
      getTotalRequests(period.date, settings),
    ])

  return (
    <Dashboard
      title='Users'
      items={usersData}
      totalDuration={totalDuration}
      totalSize={usersCount}
      type='users'
      settings={settings}
      count={totalRequests}
      isLoggedIn={!!session}
    />
  )
}

export default function DashboardUsersPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<DashboardLoader />} key={searchParams.period}>
      <DashboardUsersContent searchParams={searchParams} />
    </Suspense>
  )
}

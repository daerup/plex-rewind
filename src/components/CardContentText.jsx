'use client'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { animateCardText, fadeIn } from '../utils/motion'

export default function CardContentText({
  children,
  className,
  renderDelay = 0,
  loaderDelay = 0,
  scaleDelay = 5,
  hideAfter = false,
  noScale,
}) {
  const [isComponentShown, setIsComponentShown] = useState(false)
  const [isLoaderShown, setIsLoaderShown] = useState(false)

  useEffect(() => {
    const renderTimer = setTimeout(() => {
      setIsComponentShown(true)
    }, renderDelay * 1000)

    return () => clearTimeout(renderTimer)
  }, [renderDelay])

  useEffect(() => {
    let loaderTimer = setTimeout(() => {
      setIsLoaderShown(true)
    }, loaderDelay * 1000)

    return () => clearTimeout(loaderTimer)
  }, [loaderDelay])

  useEffect(() => {
    let hideTimer = hideAfter

    if (hideTimer) {
      hideTimer = setTimeout(() => {
        setIsComponentShown(false)
        setIsLoaderShown(false)
      }, hideAfter * 1000)
    }
    return () => clearTimeout(hideTimer)
  }, [hideAfter])

  return isComponentShown ? (
    <motion.li
      className={clsx(
        'text-3xl sm:text-4xl italic mb-4 last:mb-0 leading-tight',
        className
      )}
      variants={animateCardText}
      initial='hidden'
      animate={['show', !noScale && 'scaleDown']}
      style={{ originX: 0, originY: '100%' }}
      custom={scaleDelay}
    >
      <p>{children}</p>
    </motion.li>
  ) : isLoaderShown ? (
    <Loader />
  ) : null
}

function Loader() {
  return (
    <motion.div
      className='flex items-center gap-2 w-fit skeleton skeleton--no-animate'
      variants={fadeIn}
      initial='hidden'
      animate='show'
    >
      <span className='w-1 h-1 bg-white rounded-full animate-pulse'></span>
      <span className='w-1 h-1 bg-white rounded-full animate-pulse animation-delay-200'></span>
      <span className='w-1 h-1 bg-white rounded-full animate-pulse animation-delay-400'></span>
    </motion.div>
  )
}
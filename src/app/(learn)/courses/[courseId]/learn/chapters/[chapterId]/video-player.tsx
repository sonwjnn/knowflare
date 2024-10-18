import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import BaseReactPlayer from 'react-player/base'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface VideoPlayerProps {
  width?: string
  height?: string
  url: string
  onProgressUpdate?: (data: any) => void
  progressData?: any
}

function VideoPlayer({
  width = '100%',
  height = '100%',
  url,
  onProgressUpdate,
  progressData,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.5)
  const [muted, setMuted] = useState<boolean>(false)
  const [played, setPlayed] = useState<number>(0)
  const [seeking, setSeeking] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(true)

  const playerRef = useRef<BaseReactPlayer<typeof ReactPlayer>>(null)
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handlePlayAndPause = () => {
    setPlaying(!playing)
  }

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      console.log(state.played)
      setPlayed(state.played)
    }
  }

  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5)
    }
  }

  const handleForward = () => {
    if (playerRef.current) {
      playerRef.current?.seekTo(playerRef.current?.getCurrentTime() + 5)
    }
  }

  const handleToggleMute = () => {
    setMuted(!muted)
  }

  const handleSeekChange = (newValue: number[]) => {
    setPlayed(newValue[0])
    setSeeking(true)
  }

  const handleSeekMouseUp = () => {
    setSeeking(false)
    console.log(played)

    playerRef.current?.seekTo(played)
  }

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0])
  }

  const pad = (string: number) => {
    return ('0' + string).slice(-2)
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`
    }

    return `${mm}:${ss}`
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [isFullScreen])

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeoutRef.current!)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [])

  useEffect(() => {
    if (played === 1) {
      if (onProgressUpdate) {
        onProgressUpdate({
          ...progressData,
          progressValue: played,
        })
      }
    }
  }, [played])

  return (
    <div
      ref={playerContainerRef}
      className={`relative overflow-hidden rounded-lg bg-gray-900 shadow-2xl transition-all duration-300 ease-in-out ${isFullScreen ? 'h-screen w-screen' : ''} `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute left-0 top-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={value => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="mb-4 w-full"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white"
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white"
                variant="ghost"
                size="icon"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white"
                variant="ghost"
                size="icon"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={value => handleVolumeChange([value[0] / 100])}
                className="w-24"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(1 * (playerRef.current?.getDuration() || 0))}/{' '}
                {formatTime(playerRef.current?.getDuration() || 0)}
              </div>
              <Button
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer

import { useState, useEffect, useRef } from 'react'
import { playNeteaseSong, playOtherPlatformSong } from '@/api/music'
import { useDispatch, useSelector } from 'react-redux'
import style from './css/3x1.module.scss'
import iconMusic from '../icon/music.svg'
import iconPre from '../icon/pre.svg'
import iconPlay from '../icon/play.svg'
import iconPause from '../icon/pause.svg'
import iconNext from '../icon/next.svg'
import iconList from '../icon/list.svg'
import { IStoreModule } from '@/store/type'
import { IMusicType } from '@/type/music'
import { actionType } from '@/store/modules/music'

const MusicRenderer = () => {
    const musicList = useSelector((state: IStoreModule) => state.music.list)
    const musicRef = useRef<HTMLMediaElement>(null)
    const [url, setUrl] = useState('')
    const [isPlay, setIsPlay] = useState(false)
    const [playBtnIcon, setPlayBtnIcon] = useState(iconPlay)
    const [process, setProcess] = useState(0)
    const currentSong = useSelector((state: IStoreModule) => state.music.currentSong)
    const dispatcher = useDispatch()

    useEffect(() => {
        // preload
        setIsPlay(false)
        setProcess(0)
        if (currentSong.url) {
            setUrl(currentSong.url)
            setIsPlay(true)
        } else {
            // 根据type获取歌曲url
            if (currentSong.type == IMusicType.NETEASE) {
                playNeteaseSong(currentSong.id as string).then(({ data }) => {
                    const list = data.data
                    setUrl(list[0].url)
                })
            } else if (currentSong.type == IMusicType.KUGOU) {
                playOtherPlatformSong('kugou', currentSong.id as string).then(res => {
                    console.log(res)
                })
            }
        }
    }, [currentSong])

    const handleMusicEnd = () => {
        // determine which song to play next by play mode
        setIsPlay(false)
        setProcess(0)
    }

    useEffect(() => {
        if (isPlay) {
            setPlayBtnIcon(iconPause)
        } else {
            setPlayBtnIcon(iconPlay)
        }
    }, [isPlay])

    const handlePlay = () => {
        setProcess(0)
        if (!isPlay) {
            setIsPlay(true)
            musicRef.current?.play()
        } else {
            setIsPlay(false)
            musicRef.current?.pause()
        }
    }

    const handleUpdateProgress = () => {
        const currentTime: number = musicRef.current?.currentTime || 0
        const duration: number = musicRef.current?.duration || 0
        setProcess((currentTime / duration) * 100)
    }

    const handlePre = () => {
        const index = musicList.findIndex(m => m.id == currentSong.id)
        let preIndex = index - 1
        if (preIndex < 0) {
            preIndex = musicList.length - 1
        }
        dispatcher({ type: actionType.SET_CURRENT, payload: musicList[preIndex] })
    }

    const handleNext = () => {
        const index = musicList.findIndex(m => m.id == currentSong.id)
        let nextIndex = (index + 1) % (musicList.length - 1)
        dispatcher({ type: actionType.SET_CURRENT, payload: musicList[nextIndex] })
    }

    return (
        <>
            <div className='hidden-audio'>
                <audio
                    ref={musicRef}
                    src={url}
                    onTimeUpdate={handleUpdateProgress}
                    onEnded={() => handleMusicEnd()}
                    style={{ display: 'none' }}
                    controls
                ></audio>
            </div>
            <div className={style['music-panel']}>
                <div className={style.cover}>
                    <img src={currentSong.cover} width={'50px'} alt='' />
                </div>
                <div className={style.control}>
                    <div className={style.title}>
                        <img src={iconMusic} />
                        <span>{currentSong.title}</span>
                    </div>
                    <div className={style.process}>
                        <div className={style['process-bg']}></div>
                        <div
                            className={style['process-front']}
                            style={{ width: process + '%' }}
                        ></div>
                    </div>
                    <div className={style.btns}>
                        <img
                            src={iconPre}
                            height={'22px'}
                            style={{ marginLeft: '20px' }}
                            onClick={handlePre}
                        />
                        <img
                            src={playBtnIcon}
                            height={'30px'}
                            style={{ margin: '5px 20px' }}
                            onClick={handlePlay}
                            alt=''
                        />
                        <img src={iconNext} height={'22px'} alt='' onClick={handleNext} />
                        <img src={iconList} height={'24px'} style={{ marginLeft: '30px' }} alt='' />
                    </div>
                </div>
            </div>
        </>
    )
}
export default MusicRenderer

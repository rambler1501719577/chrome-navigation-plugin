import React, { useState } from 'react'
import { Input, Button, message } from 'antd'
import { searchFromNetease, search } from '@/api/music'
import { useDispatch, useSelector } from 'react-redux'
import { actionType } from '@/store/modules/music'
import { IMusic, IMusicType } from '@/type/music'
import qqIcon from '../icon/qq.png'
import kugouIcon from '../icon/kugou.png'
import neteaseIcon from '../icon/netease.png'
import style from './search.module.scss'
import { IStoreModule } from '@/store/type'

const MusicSearch: React.FC = () => {
    const list = useSelector((state: IStoreModule) => state.music.list)
    const key = 'loading-key'
    const dispatcher = useDispatch()
    const [keyword, setKeyword] = useState('')
    const [searchList, setSearchList] = useState<Array<IMusic>>([])
    const handleKeydown = (e: any) => {
        if (e.keyCode == 13) {
            searchFromNetease(keyword).then((res: any) => {
                setSearchList(res.data.result.songs)
            })
            searchInDifferentEngines()
        }
    }
    /**
     * search songs in qq、netease、kugou
     * @returns
     */
    const searchInDifferentEngines = () => {
        const neteaseSearch = searchFromNetease(keyword)
        const qqSearch = search(keyword, 'qq')
        const kugouSearch = search(keyword, 'kugou')
        message.loading({ content: '搜索中...', key })
        return Promise.all([neteaseSearch, qqSearch, kugouSearch]).then((res: Array<any>) => {
            message.success({ content: '搜索成功!', key, duration: 2 })
            const list: Array<IMusic> = []
            const neteaseSearchResult = res[0]
            const qqSearchResult = res[1]
            const kugouSearchResult = res[2]
            // netease
            if (neteaseSearchResult.data.result.songs) {
                neteaseSearchResult.data.result.songs.forEach((m: any) => {
                    list.push({
                        id: m.id,
                        title: m.name,
                        author: m.ar.map((a: any) => a.name),
                        cover: m.al.picUrl,
                        url: '', // 懒加载, 在播放时加载url
                        duration: m.dt,
                        type: IMusicType.NETEASE
                    })
                })
            }
            // qq
            if (qqSearchResult) {
                // todo
            }
            // kugou
            if (kugouSearchResult && kugouSearchResult.data.data) {
                kugouSearchResult.data.data.forEach((m: any) => {
                    list.push({
                        id: m.songid,
                        title: m.title,
                        author: [m.author],
                        cover: m.pic,
                        url: m.url,
                        duration: 0,
                        type: IMusicType.KUGOU
                    })
                })
            }
            setSearchList(list)
        })
    }
    const handlePlay = (item: any, e: any) => {
        e.stopPropagation()
        dispatcher({
            type: actionType.SET_CURRENT,
            payload: item
        })
        message.success({ content: '已添加当前播放!', key, duration: 2 })
    }
    const typeIcon = (type: string) => {
        if (type == IMusicType.KUGOU) {
            return kugouIcon
        } else if (type == IMusicType.QQ) {
            return qqIcon
        } else {
            return neteaseIcon
        }
    }
    // add to music list
    const handleAdd = (item: IMusic, e: any) => {
        e.stopPropagation()
        const index = list.findIndex(m => m.id == item.id)
        if (index !== -1) {
            return message.error('当前歌曲已存在')
        }
        dispatcher({
            type: actionType.ADD_MUSIC,
            payload: item
        })
        message.success({ content: '已添加到列表!', key, duration: 2 })
    }
    return (
        <>
            <div className={style['music-search-container']}>
                <div className={style['search-input']}>
                    <Input
                        placeholder='search...'
                        onChange={e => {
                            setKeyword(e.target.value)
                        }}
                        onKeyDown={handleKeydown}
                    />
                </div>
                <div className={style['search-result']}>
                    <div className={style.header}>
                        <p>歌曲名</p>
                        <p>作者</p>
                        <p>所属平台</p>
                        <p>操作</p>
                    </div>

                    {searchList.length > 0 && (
                        <div className={style.content}>
                            <ul>
                                {searchList.map((item: any) => (
                                    <li key={item.id}>
                                        <p>{item.title}</p>
                                        <p>
                                            {item.author.map((e: any, index: number) => (
                                                <span key={index}>{e}</span>
                                            ))}
                                        </p>
                                        <p>
                                            <img src={typeIcon(item.type)} height={'25px'} />
                                        </p>
                                        <p>
                                            <Button type='link' onClick={e => handlePlay(item, e)}>
                                                播放
                                            </Button>
                                            <Button type='link' onClick={e => handleAdd(item, e)}>
                                                添加
                                            </Button>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {searchList.length == 0 && <div className={style.empty}>Empty</div>}
                </div>
            </div>
        </>
    )
}
export default MusicSearch

import React from 'react'
import { useEffect } from 'react'
import './index.scss'
import api from '../../service/api'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
export default function Rankings() {
    const [rankings,setRankings] = useState([])
    const [myInfo,setMyInfo] = useState({})
    const history = useHistory()
    useEffect(async()=>{
        try{
            const res = await api.get('/rankings').catch(err=>{Promise.reject(err)})
            for(let i = res.data.length - 1;i>=0;i--){
                
                // 从所有排行中匹配
                if(localStorage.getItem('username')===res.data[i].username){
                    console.log(res.data[i])
                    setMyInfo({...res.data[i],rank:i+1})
                    break
                }
                else{
                    // 未进行游戏时
                    setMyInfo({rank:'暂无',username:localStorage.getItem('username')})
                }
            }
            // 判空处理
            if(res.data.length===0){
                setMyInfo({rank:'暂无',username:localStorage.getItem('username')})
            }
            setRankings(res.data)
            console.log(res)
        }
        catch(err){
            console.error(err)
        }
        
    },[])
    return (
        <div>
            <div className="rankings-background">
            <div className="back-icon" onClick={()=>{history.goBack()}}><img src="https://s1.ax1x.com/2022/03/26/qdv2Ix.png" alt="err"/></div>
                <div className="rankings-title">排行榜</div>
                <div className="rankings">
                    <div className="rankings-content">
                        {
                            rankings[0]?
                            <div className="rankings-content-item">
                                <div className='rankings-content-item-info'>
                                    <img src="https://s1.ax1x.com/2022/03/23/q38DpR.png" alt="err" className='rankings-content-item-mark'/>
                                    <span className="rankings-content-item-username">{rankings[0].username}</span>
                                </div>
                                <span className="rankings-content-item-score">{rankings[0].score}</span>
                            </div>
                            :
                            <></>
                        }
                        {
                            rankings[1]?
                            <div className="rankings-content-item">
                                <div className='rankings-content-item-info'>
                                    <img src="https://s1.ax1x.com/2022/03/23/q31XqS.png" alt="err" className='rankings-content-item-mark'/>
                                    <span className="rankings-content-item-username">{rankings[1].username}</span>
                                </div>
                                <span className="rankings-content-item-score">{rankings[1].score}</span>
                            </div>
                            :
                            <></>
                        }
                        {
                            rankings[2]?
                            <div className="rankings-content-item">
                                <div className='rankings-content-item-info'>
                                    <img src="https://s1.ax1x.com/2022/03/23/q3GRK0.png" alt="err" className='rankings-content-item-mark'/>
                                    <span className="rankings-content-item-username">{rankings[2].username}</span>
                                </div>
                                <span className="rankings-content-item-score">{rankings[2].score}</span>
                            </div>
                            :
                            <></>
                        }
                        {
                            rankings.map((item,index)=>{
                                if(index>2){
                                    return(
                                        <div className="rankings-content-item" key={index}>
                                            <div className='rankings-content-item-info'>
                                                <span className="rankings-content-item-num">{index + 1}</span>
                                                <span className="rankings-content-item-username">{item.username}</span>
                                            </div>
                                            <span className="rankings-content-item-score">{item.score}</span>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className="rankings-content-mine-outer">
                        <div className="rankings-content-mine">
                            <span className="rankings-content-myrank">我的排名:{myInfo.rank}</span>
                            <span className="rankings-content-myscore">{myInfo.score}</span>
                        </div>
                    </div>
                </div>
                <div className="rankings-maincharacter"><div className="animation-container"><img src="https://s1.ax1x.com/2022/03/13/bqdkK1.gif" className='rankings-maincharacter-content'></img></div></div>
                <div className="rankings-road"></div>
            </div>
        </div>
    )
}

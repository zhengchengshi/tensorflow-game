import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
// import Login from '../../components/login'
import './index.scss'
export default function Start() {
    const history = useHistory()
    const [controlContinue,setControlContinue] = useState(false);
    useEffect(()=>{
        if((Date.parse(new Date())-localStorage.getItem('timestamp'))/1000<60 * 60&&localStorage.getItem('token')){
            setControlContinue(true)
        }
        else{
            localStorage.clear()
        }
        // if(localStorage.getItem('token')){
        //     setControlContinue(true)
        // }
    },[])
    const navigate = (info)=>{
        return(()=>{
            switch (info){
                case 'login':
                    history.push('/login')
                    break
                case 'register':
                    history.push('/register')
                    break
                case 'start':
                    history.push('/gesture-config')
                    break
                case 'rank':
                    history.push('/rankings')
                    break
                case 'quit':
                    localStorage.clear()
                    setControlContinue(false)
                    break
            }
        })
    }
    return (
        <div>
            <div className="start-background">
                {
                    controlContinue?
                    <div className="start-btns">
                        <div className="start-btn" onClick={navigate('start')}>开始</div>
                        <div className="start-btn" onClick={navigate('rank')}>排行</div>
                        <div className="start-btn" onClick={navigate('quit')}>退出</div>
                    </div>
                    :
                    <div className="start-btns">
                        <div className="start-btn" onClick={navigate('login')}>登录</div>
                        <div className="start-btn" onClick={navigate('register')}>注册</div>
                    </div>
                }
                <div className="start-maincharacter"><div className="animation-container"><img src="https://s1.ax1x.com/2022/03/23/q3mHmj.gif" className='start-maincharacter-content'></img></div></div>
                <div className="start-road"></div>
            </div>
        </div>
    )
}

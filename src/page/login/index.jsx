import React from 'react'
import { useRef } from 'react';
import { useState } from 'react'
import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import swal from 'sweetalert';
import api from '../../service/api';
import captureErrFn from '../../utils/captureErrFn';
import './index.scss'
export default function Login() {
    const location = useLocation()
    const history = useHistory()
    const [btnInfo,setBtnInfo] = useState()
    const usernameIpt = useRef()
    const passwordIpt = useRef()

    useEffect(()=>{
        switch (location.pathname) {
            case '/login':
                setBtnInfo('登录')
                // localStorage.setItem('token','afa615sefsd')
                break;
            
            case '/register':
                setBtnInfo('注册')
                // localStorage.setItem('token','afa615sefsd')
                break;
            default:
                break;
        }
    },[])
    const login = async ()=>{
        // 用于判断是否登录成功，成功则返回起始页面
        let success = false
        // 默认成功的提示
        const alertInfo = {
            title: location.pathname==='/login'?"登录成功!":"注册成功",
            text: location.pathname==='/login'?"请开始游戏":"请重新登录",
            icon: "success",
            buttons: false,
        }
        // 受控组件
        const username = usernameIpt.current.value;
        const password = passwordIpt.current.value;
        
        try{
            if(username.length===0||password.length===0){
                throw {data:'别名和密码不能为空'}
            }
            const res = await api.post(`${location.pathname}`,{username,password}).catch(err=>Promise.reject(err));
            // login成功时存入token等信息
            if(location.pathname==='/login') {
                localStorage.setItem('token',res.data.token)
                localStorage.setItem('username',username)
                localStorage.setItem('timestamp',Date.parse(new Date()))
            }
            else{
                // 注册后清空token
                localStorage.clear()
            }
            success = true
        }
        catch(err){
            alertInfo.title = `${btnInfo}失败`
            alertInfo.text = err.data
            alertInfo.icon = 'error'
            alertInfo.buttons = false
        }
        swal(alertInfo)
        setTimeout(()=>{
            swal.close();
            if(success) history.replace('/start');
        },2000)
    }
    return (
        <>
            <div className="start-background">
                <div className="back-icon" onClick={()=>{history.goBack()}}><img src="https://s1.ax1x.com/2022/03/26/qdv2Ix.png" alt="err"/></div>
                <div className="login-outer">
                    {/* <span>登录</span> */}
                    <div className="login-panel">
                        <div className="login-username">
                            <span>别名:</span>
                            <input type="text" ref={usernameIpt}/>
                        </div>
                        <div className="login-password">
                            <span>密码:</span>
                            <input type="text" ref={passwordIpt}/>
                        </div>
                        {/* <input type="text" /> */}
                        <div className="login-submit" onClick={login}>
                            {btnInfo}
                        </div>
                    </div>
                </div>
                <div className="start-maincharacter"><div className="animation-container"><img src="https://s1.ax1x.com/2022/03/23/q3mHmj.gif" className='start-maincharacter-content'></img></div></div>
                <div className="start-road"></div>
            </div>
        </>
    )
}

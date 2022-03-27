import React, { useEffect, useRef, useState } from 'react'
// import DeepLearningVideo from '../../components/algorithm'

import './index.scss'
import Typed from 'typed.js';
import { lazy,Suspense } from 'react';

import { useHistory } from 'react-router-dom';
let controlContinue = 0
// 动态import
const DeepLearningVideo = lazy(() => {
    return new Promise((resolve, reject) => {
        import('../../components/algorithmCamera').then(AsyncComponent => {
            resolve(AsyncComponent);
        });
    });
});
export default function GestureConfig() {
    // const [valve,setValve] = useState(false)  //防止在打字未完成时修改打字状态
    const [controlHint,setControlHint] = useState(false)  //控制提示字符（点击继续...）显示
    const [globalType,setGlobalType] = useState()
    const [controlCameraPresent,setControlCameraPresent] = useState('hidden')  //2、4、6帧为动作录入帧
    const [controlTextPresent,setControlTextPresent] = useState('gestureconfig-notice-content')
    const [preventTouch,setPreventTouch] = useState('preventTouch')
    const [mainCharacterGesture,setMainCharacterGesture] = useState("https://s1.ax1x.com/2022/03/19/qE1Dh9.gif")
    const [characterGesture,setCharacterGesture] = useState({rotate:null,jump:null})
    const [flag,setFlag] = useState()
    const history = useHistory()
    // 点击屏幕，打字继续
    const typedContinue = ()=>{
        console.log(controlContinue)
        setControlHint(false)
        // 加入定时器的目的在于防止点击过快产生的bug
        // 非姿态录入帧，点击后需要禁止点击，等到打字完毕后解开限制
        if(controlContinue!==2&&controlContinue!==4&&controlContinue!==6&&controlContinue!==8){
            // setValve(false)
            // valve = false
            // 点击屏幕后阻止触屏
            setPreventTouch('preventTouch')
            
            globalType.start()

        }
        // if(valve===true){
        else if(controlContinue === 2||controlContinue === 4||controlContinue === 6||controlContinue === 8){
            setControlCameraPresent('')
            setControlTextPresent('hidden')
            switch(controlContinue){
                case 2:
                    setMainCharacterGesture('https://s1.ax1x.com/2022/03/20/qeoxyD.gif')
                    break;
                case 4:
                    setMainCharacterGesture("https://s1.ax1x.com/2022/03/19/qE1Dh9.gif")
                    setCharacterGesture({rotate:'characterRotate 2.6s infinite',jump:'jump 2.6s infinite'})
                    break;

                case 6:
                    setCharacterGesture({rotate:null,jump:null})
                    break;
                case 8:
                    history.replace('/game')
                    break
            }
        }
    // }
        
    }
    useEffect(()=>{
        const options = {
            strings: [
                "欢迎来到tensorflow-game世界的大门，旅行者。在这里你将通过录入动作来操控人物攻击和躲避障碍。",
                "下面我们试着录入第一个动作，攻击！",
                "漂亮！攻击姿态已存入训练模型。接着我们录入跳跃姿态。",
                "好极了伙计！最后一步，让我们录入行走姿态。（建议遮住摄像头以提高识别率）",
                "nice，所有动作均已录入，请点击屏幕任意位置，开始冒险吧！"
            ],
            typeSpeed: 40,
            cursorChar: '',
            fadeOut:true,
            onStringTyped:(arrayPos,self)=>{
                // 打字完毕后暂停打字
                typed.stop()
                // 接触点击限制 允许点击交互
                const timer = setTimeout(()=>{
                    setPreventTouch('')
                    clearTimeout(timer)
                },600)
                // 修改提示字符（触屏继续...）
                // 如果不是录入动作的帧，则在打印完毕后提示'触屏继续'
                if(controlContinue!==2||controlContinue!==4||controlContinue!==6){
                    setControlHint(true)
                }
                // else{
                //     switch (controlContinue){
                //         case 2:
                //             console.log(666)
                //     }
                // }
                // 每次打印完毕都让帧数++
                controlContinue = controlContinue+1
            },
            onComplete:(self)=>{

            },
            onBegin:(self)=>{
            },
            onStop:(self)=>{
            }
        }
        const typed = new Typed(document.querySelector('.gestureconfig-notice-content'),options);
        // 存储全局typed实例
        setGlobalType(typed)
        // typed.pause.status = false
    },[])
    const hasCaptured = ()=>{
        setControlCameraPresent('hidden')
        setControlTextPresent('')
        // 强制执行 globalType.start()
        setFlag([...[]])
        console.log('hasCaptured')
        // 这里+1不能少，，用于匹配点击屏幕继续的条件
        controlContinue = controlContinue+1

    }
    useEffect(()=>{
        if(globalType){
            console.log('start')
            globalType.start()
        }
    },[flag])
    return (
        <div className={preventTouch}>
            <div className="gestureconfig-outer" onClick={typedContinue}>
                <div className="gestureconfig-background"></div>
                <div className="gestureconfig-notice">
                    <span className={controlTextPresent}></span>
                    <div className={controlCameraPresent}>
                        <Suspense  fallback={<h1>加载中</h1>}>
                            <DeepLearningVideo hasCaptured = {hasCaptured} ></DeepLearningVideo>
                        </Suspense>
                    </div>
                    {/* <video autoPlay playsInline muted id="webcam" width="224" height="224"></video> */}
                </div>
                
                {
                    controlHint?<div className="gestureconfig-hint">触碰屏幕任意位置继续</div>:<></>
                }
                <div className="gestureconfig-maincharacter"><div className="animation-container" style={{animation:`${characterGesture.jump}`}}><img src={mainCharacterGesture} className='gestureconfig-maincharacter-content' style={{animation:`${characterGesture.rotate}`}}></img></div></div>
                <div className="gestureconfig-road"></div>
            </div>
        </div>
    )
}

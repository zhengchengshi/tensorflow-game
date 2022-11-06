import React, { useEffect, useState } from 'react'
import hitTestRectangle from '../../utils/hitTestRectangle';
import keyboard from '../../utils/controlKeyboard';
import debounce from '../../utils/debouce';
import {backgroundPlay} from '../../utils/play'
import throttle from '../../utils/throttle';
import randomNum from '../../utils/randomNum';
import Bump from 'bump.js'
import * as PIXI from "pixi.js";
import { sound } from '@pixi/sound';
import api from '../../service/api'
import { useHistory } from 'react-router-dom';
import {storageClearCaptureTimer} from '../../page/game/clearCaptureTimer'
import { useDispatch } from 'react-redux';
// import keyboard from '../../utils/controlKeyboard'
    
let valve = 1,
controlMonsterSound = true,
globalValve = 0,
condition = true;
export default function UiLayer() {
    const history = useHistory()
    const dispatch = useDispatch()
    useEffect(()=>{
        //加载音效
        sound.add('attackSound', 'https://file.zhengchengshi.cn/tensorflow-game-source/attack.mp3');
        sound.add('monsterSound', 'https://file.zhengchengshi.cn/tensorflow-game-source/monsterSound.mp3');
        sound.add('jumpSound', 'https://file.zhengchengshi.cn/tensorflow-game-source/jumpSound.mp3');
        sound.add('gameoverSound', 'https://file.zhengchengshi.cn/tensorflow-game-source/gameoverSound.mp3');
        sound.add('getCoinSound', 'https://file.zhengchengshi.cn/tensorflow-game-source/getCoin.mp3');
    
        
        // sounds.load([
        //     "sounds/shoot.wav", 
        //     "sounds/music.wav",
        //     "sounds/bounce.mp3"
        // ]);
        
        // //设置加载音效文件的回调函数
        // //每次加载一个文件，就像PIXI.js加载资源文件一样
        // sounds.onProgress = function (progress, res) {
        //     console.log('Total ' + progress + ' file(s) loaded.');
        //     console.log('File ' + res.url + ' just finished loading.');
        // };
        
        //音效何时运行
        // sounds.whenLoaded = setup;
        
        const b = new Bump(PIXI);
        
        // 建立连接测试
        let type = "WebGL"
        if(!PIXI.utils.isWebGLSupported()){
            type = "canvas"
        }
        PIXI.utils.sayHello(type)
    
        // 创建PIXI应用
        let app = new PIXI.Application({
            width: 375, 
            height: 256,
            antialias: true,
            transparent: false,
            resolution: 1,
            // autoStart:false
        });
        // 基础设置
        app.renderer.view.style.position = "absolute";
        app.renderer.view.style.display = "block";
        app.renderer.autoResize = true;
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.renderer.backgroundColor = 0xFFFFFF;
        
        // 创建游戏角色
        const character = [
            {name:"mainBackground", url:"https://file.zhengchengshi.cn/tensorflow-game-source/game-background.jpg"},
            {name:"road", url:"https://file.zhengchengshi.cn/tensorflow-game-source/ground.png"},
            {name:"coin",url:"https://file.zhengchengshi.cn/tensorflow-game-source/coin.png"}
        ];
        
        // 游戏角色上场
        let state,
        mainBackgroundState,
        cat,piggy,
        mainCharacter,
        mainCharacterState,
        mainBackground,
        road,
        road2,
        roadState,
        attackAttitude,
        flag,
        actionState = 'walking',
        dinosaur,
        dinosaurState,
        defeatAttitude,
        gameState = 'playing',
        initCollisionFlag = false,
        currentScore = 0,
        coin,
        coinState,
        gameoverText = '',
        controlJumpSound = true,
        coinMoveFnDebouce = true,
        controlDinosaurCollistion = true,
        controlInterval = 0
        
        // let tilingSprite = new PIXI.extras.TilingSprite(texture, width, height);
        
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 50,
            fill: "white",
            fontWeight:'bold',
        });
        let gameoverNoticeStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 66,
            fill: "white",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });
        let score = new PIXI.Text(`得分:${currentScore}`,style); 
        score.position.set(800,50)
        let gameoverNotice = new PIXI.Text(`${gameoverText}`,gameoverNoticeStyle); 
        gameoverNotice.position.set(370,350)
        
        app.loader.add(character).load(setup)
        function setup() {
            // 此处不设置节流阀会存在严重隐患(使用useEffect已修复问题)
            // 因为add函数会首先调用一次setup函数，但是实际上却只是添加人物的作用
            // 因此需要在setup第二次调用时才真实进行挂载
            // 不然会在视觉上呈现出正确影像，但在音频上经常出现问题，原因在与触碰到了已被覆盖的图层的障碍物
            // if(process.env.NODE_ENV == "development"?globalValve===2:condition){}
            globalValve++
            // 背景相关设置
            mainBackground = new PIXI.TilingSprite(
                app.loader.resources['mainBackground'].texture,window.innerWidth,window.innerHeight
            );
            
            // 背景进入游戏循环
            mainBackgroundState = backgroundPlay
    
            // 路的相关设置，平铺精灵图
            road = new PIXI.Sprite(
                app.loader.resources['road'].texture,window.innerWidth
            );
            road2 = new PIXI.Sprite(
                app.loader.resources['road'].texture,window.innerWidth
            );
            road2.x = road.x + road.width + 150
            road.y = window.innerHeight - road.height
            road2.y = window.innerHeight - road.height
            // 道路进入游戏循环
            roadState = roadPlay
    
            // 主角走路状态
            let alienImages = [
                'https://s3.bmp.ovh/imgs/2022/03/8247ba47badae461.png',
                'https://s3.bmp.ovh/imgs/2022/03/f7133596815c08b1.png',
                'https://s3.bmp.ovh/imgs/2022/03/e28c8c8b9c2a6b62.png',
                'https://s3.bmp.ovh/imgs/2022/03/e818ecc76a2f629c.png',
                'https://s3.bmp.ovh/imgs/2022/03/06938f11475710be.png',
                'https://s3.bmp.ovh/imgs/2022/03/06938f11475710be.png',
            ]
            let textureArray = [];
            for (let i=0; i < alienImages.length; i++)
            {
                let texture = PIXI.Texture.from(alienImages[i]);
                textureArray.push(texture);
            };
            // 主角相关设置，默认为走路姿态
            let animatedSprite = new PIXI.AnimatedSprite(textureArray);
            mainCharacter = animatedSprite;
            mainCharacter.scale.set(1.8,1.8);
            mainCharacter.x = 100;
            mainCharacter.y = window.innerHeight - road.height;
            mainCharacter.vy = 0;
            mainCharacter.vx = 0;
            mainCharacter.vrotation = 0;
            mainCharacter.anchor.set(0.5, 0.5)
            // 设置动画频率并开始播放
            animatedSprite.animationSpeed = parseFloat((30 / 120).toFixed(2));
            animatedSprite.play();
            mainCharacterState = mainCharacterPlay
    
            // 攻击姿态
            let attackAttitudeImages = [
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/1.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/2.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/3.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/4.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/5.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/6.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/7.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/8.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/9.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/10.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/11.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/attack/12.png'

            ]
            let attackAttitudeArray = [];
            for (let i=0; i < attackAttitudeImages.length; i++)
            {
                let texture = PIXI.Texture.from(attackAttitudeImages[i]);
                attackAttitudeArray.push(texture);
            };
            let attackAttitudeSprite = new PIXI.AnimatedSprite(attackAttitudeArray);
    
            // 主角攻击姿态设置
            attackAttitudeSprite.animationSpeed = parseFloat((40 / 120).toFixed(2));
            attackAttitude = attackAttitudeSprite
            attackAttitude.scale.set(1.8,1.8);
            attackAttitude.x = 70;
            attackAttitude.y = window.innerHeight - road.height - 90;
            attackAttitude.visible = false
    
            // 主角失败姿态（卧倒）
            let defeatAttitudeImages = [
                'https://file.zhengchengshi.cn/tensorflow-game-source/defeat/1.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/defeat/2.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/defeat/3.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/defeat/4.png',

            ]
            let defeatAttitudeArray = [];
            
            for (let i=0; i < defeatAttitudeImages.length; i++)
            {
                let texture = PIXI.Texture.from(defeatAttitudeImages[i]);
                defeatAttitudeArray.push(texture);
            };
            let defeatAttitudeSprite = new PIXI.AnimatedSprite(defeatAttitudeArray);
            defeatAttitudeSprite.animationSpeed = parseFloat((40 / 120).toFixed(2));
    
            // 失败姿态相关设置
            defeatAttitude = defeatAttitudeSprite
            defeatAttitude.scale.set(1.9,1.9);
            defeatAttitude.x = 70;
            defeatAttitude.y = window.innerHeight - road.height - defeatAttitude.height -30
            defeatAttitude.visible = false
    
            // 怪兽姿态
            let dinosaurImages = [
                'https://file.zhengchengshi.cn/tensorflow-game-source/monster/1.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/monster/2.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/monster/3.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/monster/4.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/monster/5.png',
                'https://file.zhengchengshi.cn/tensorflow-game-source/monster/6.png',

            ]
            let dinosaurArray = [];
            for (let i=0; i < dinosaurImages.length; i++)
            {
                let texture = PIXI.Texture.from(dinosaurImages[i]);
                dinosaurArray.push(texture);
            };
            let dinosaurSprite = new PIXI.AnimatedSprite(dinosaurArray);
    
            // 怪兽设置
            dinosaur = dinosaurSprite
            dinosaurSprite.animationSpeed = parseFloat((30 / 120).toFixed(2));
            dinosaurSprite.play()
            dinosaur.scale.set(1.8,1.8);
            dinosaur.x = 3300;
            dinosaur.y = window.innerHeight - road.height - 90;
            dinosaurState = dinosaurPlay;
    
            // 金币设置
            coin = new PIXI.Sprite(app.loader.resources["coin"].texture);
            coin.scale.set(2.0,2.0);
            coin.x = randomNum(900,5000);
            coin.y = window.innerHeight - road.height - randomNum(90,150);
            coinState = coinMove
    
            // 角色上舞台
            app.stage.addChild(mainBackground);
            app.stage.addChild(road);
            app.stage.addChild(road2)
            app.stage.addChild(score);
            app.stage.addChild(mainCharacter);
            app.stage.addChild(attackAttitude);
            app.stage.addChild(dinosaur);
            app.stage.addChild(defeatAttitude)
            app.stage.addChild(coin)
            app.stage.addChild(gameoverNotice)
    
            // 所有事件添加进游戏循环
            app.ticker.add(delta => gameLoop(delta));
    
            // 键盘事件绑定
            let attack = keyboard(74);
            let jump = keyboard(75);
    
            // 攻击事件
            attack.press = ()=>{
                if(actionState==='walking'){
                    // 动作状态改变
                    actionState = 'attacking'
                    // 音效播放
                    sound.play('attackSound');
                    // 切换人物形态
                    mainCharacter.visible = false
                    attackAttitude.visible = true
                    attackAttitude.play()
                    // 当且仅执行一次攻击动画，到最后一帧时修改动作姿态，重新进入走路姿态
                    attackAttitude.onFrameChange = (currentFrame)=>{
                        if(currentFrame===attackAttitude.totalFrames - 1){
                            mainCharacter.visible = true
                            attackAttitude.visible = false
                            attackAttitude.stop()
                            actionState = 'walking'
                        }
                    }
                }
            }
    
            // 跳跃事件
            jump.press = ()=>{
                if(actionState==='walking'){
                    actionState = 'jumping'
    
                    flag = 'up'
                    // 控制转速
                    mainCharacter.vrotation = 0.65
                    // 控制上下跳动速度
                    mainCharacter.vy = 20;
                    sound.play('jumpSound')
                }
            }
        }
        // 背景移动
        function backgroundPlay(delta){
            mainBackground.tilePosition.x -= 3;
        }
    
    
        // 硬币移动
        function coinMove(delta){
            coin.x -= 9
            let res = b.hit(mainCharacter,coin)
            if(coin.x<-100){
                coin.x = randomNum(1500,3000)
                coin.y = window.innerHeight - road.height - randomNum(90,300);
            }
            // 防止重复触碰金币，因此设置定时器
            if(res&&coinMoveFnDebouce){
                coinMoveFnDebouce = false
                currentScore++;
                sound.play('getCoinSound')
                score.text = `得分:${currentScore}`
                coin.x = randomNum(1500,3000)
                coin.y = window.innerHeight - road.height - randomNum(90,300);
                setTimeout(()=>{
                    coinMoveFnDebouce = true
                },2000)
            }
        }
        
        // 道路后移
        function roadPlay(delta){
            road.x -= 6;
            road2.x -= 6
            // 前后都没碰到且已经没在跳了，说明掉坑了
            if(!b.hit(mainCharacter,road)&&!b.hit(mainCharacter,road2)&&actionState!=='jumping'){
                // mainCharacterS   tate = mainCharacterDrop
                    // 防止首次两者初始化时导致游戏失败的bug
                    gameState = 'gameover'
                    actionState = 'gameover'
            }
            if(gameState==='gameover'){
    
                mainBackground.tilePosition.x -= 0;
                road.x -= 0;
                road2.x -= 0;
                dinosaur.x += 0;
                coin.x -= 0;
                mainBackgroundState = gameover;
                roadState = gameover
                mainCharacterPlay = gameover
                dinosaurState = gameover
                coinState = gameover
                gameoverNotice.text = `游戏结束`;
                console.log(currentScore);
                // 终止姿态循环监测
                (async()=>{
                    try{
                        const res = await api.post('/rankings/addScore',{score:currentScore}).catch(err=>{Promise.reject(err)})
                        setTimeout(()=>{
                            dispatch(storageClearCaptureTimer(true));
                            history.go(0) 
                            history.replace('/start');
                        },2000)
                        console.log(res)
                    }
                    catch(err){
                        console.error(err)
                    }
                })()
                sound.play('gameoverSound')
                mainCharacter.y += 28
            }
            if(road.x<-1286){
                road.x = window.innerWidth
            }
            if(road2.x<-1286){
                road2.x = window.innerWidth
            }
        }
        // 恐龙被击飞
        function dinosaurDied(){
            dinosaur.y -= 43;
            dinosaur.x += 23;
            if(dinosaur.x>900){
                controlMonsterSound = true
                // 击飞后间隔随机秒数恐龙复位
                dinosaur.x = randomNum(2000,4000)
                dinosaur.y = window.innerHeight - road.height - 90
                dinosaurState = dinosaurPlay;
            }
        }
    
        // 恐龙移动
        function dinosaurPlay(delta){
            // 碰撞检测
            let res = b.hit(dinosaur,mainCharacter)
            if(res&&controlDinosaurCollistion){
                controlDinosaurCollistion = false
                if(actionState==='attacking'){
                    // 恐龙败北
                    currentScore++;
                    score.text = `得分:${currentScore}`
                    if(controlMonsterSound){
                        controlDinosaurCollistion = true
                        controlMonsterSound = false
                        sound.play('monsterSound')
                        setTimeout(()=>{controlMonsterSound = true},2000)
                    }
                    dinosaurState = dinosaurDied;
                    // console.log('success')
                }
                else{
                    // 主角失败
                    controlDinosaurCollistion = false
                    // actionState = 'gameover'
                    mainCharacter.visible = false
                    sound.play('gameoverSound')
                    defeatAttitude.y = window.innerHeight - road.height - 30
                    defeatAttitude.visible = true
                    defeatAttitude.play()
                    // 清空所有游戏状态，角色动作暂停
                    mainBackground.tilePosition.x -= 0;
                    road.x -= 0;
                    road2.x -= 0;
                    dinosaur.x += 0;
                    coin.x -= 0;
                    mainBackgroundState = gameover;
                    roadState = gameover
                    mainCharacterPlay = gameover
                    dinosaurState = gameover
                    coinState = gameover
                    actionState = 'gameover'
                    gameoverNotice.text = `游戏结束`;
                    // 终止姿态循环监测
                    
                    (async()=>{
                        try{
                            const res = await api.post('/rankings/addScore',{score:currentScore}).catch(err=>{Promise.reject(err)})
                            setTimeout(()=>{
                                dispatch(storageClearCaptureTimer(true));
                                // 强制刷新
                                history.go(0) 
                                history.replace('/start');
                            },2000)
                            console.log(res)
                        }
                        catch(err){
                            console.error(err)
                        }
                    })()
                }
            }
            // 如果没碰撞，则必挂一个
            else{
                // 恐龙速度随机
                dinosaur.x -= randomNum(8,12);
                if(dinosaur.x<-100){
                    // 都没碰到，恐龙复位
                    dinosaur.x = randomNum(3500,6000)
                }
            }
            
        }
        // 主角动作（这里的逻辑不符合最佳实践...）
        function mainCharacterPlay(delta){
            mainCharacter.x += mainCharacter.vx
            // 控制跳跃
            if(mainCharacter.y>900&&flag==='up'){
                // 上升
                mainCharacter.y -= mainCharacter.vy
            }
            else{
                if(actionState === 'jumping'){
                    // 下降
                    flag = 'down'
                    mainCharacter.y += mainCharacter.vy
                    if(controlJumpSound){
                        controlJumpSound = false;
                        
                    }
                    if(mainCharacter.y >= window.innerHeight - road.height - 10){
                        actionState = 'walking'
                        controlJumpSound = true;
                        mainCharacter.vrotation = 0
                        mainCharacter.rotation = 0
                        mainCharacter.y = window.innerHeight - road.height
                    }
                }
            }
            mainCharacter.rotation  += mainCharacter.vrotation 
        }
    
        // 游戏失败后所有动作清空
        function gameover(){
            
        }
    
        // 游戏循环，执行事件函数
        function gameLoop(delta){
            mainBackgroundState(delta);
            roadState(delta)
            mainCharacterPlay(delta)
            dinosaurState(delta)
            coinState(delta)
        }
        setTimeout(()=>{
            initCollisionFlag = true
        },3000)
        document.querySelector('#game-container').appendChild(app.view);

    },[])

    // 以防地面和人物初始化时有概率无法接触，导致人物持续下坠，因此设置阀门并在组件挂载3s后执行
    useEffect(()=>{
        
    },[])
    

    
    // 添加canvas至dom
    useEffect(()=>{
    },[])

    return (
        <div id="game-container"></div>
    )
}

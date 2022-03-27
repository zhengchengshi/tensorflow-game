import React, { useEffect,lazy,Suspense, useState } from 'react'
import * as tf from '@tensorflow/tfjs';
import {selectTraingData} from '../../components/algorithmCamera/trainingDataReducer'
import {selectTrainingModel} from '../../components/algorithmCamera/trainingModelReducer'
import { useSelector } from 'react-redux';
import Loading from '../../components/loading'
import { useHistory } from 'react-router-dom';
import { selectClearCaptureTimer } from './clearCaptureTimer'
// import Uilaryer from '../Uilayer'

let hasTrained = false
let webcam = null

HTMLElement.prototype.pressKey = function(code) {
	const evt = document.createEvent("UIEvents");
	evt.keyCode = code;
	evt.initEvent("keydown", true, true);
	this.dispatchEvent(evt);
}


export default function Game() {

    // 获取redux中的训练模型和训练数据
    const trainingData = useSelector(selectTraingData)
    const model = useSelector(selectTrainingModel)
    const history = useHistory()
    const [controlGamePresent,setControlGamePresent] = useState(false)
    let whetherClearTimer = useSelector(selectClearCaptureTimer)
    let timer;
    // 动态渲染游戏
    const Uilaryer = lazy(()=>{
        return new Promise((resolve, reject) => {
            import('../../components/Uilayer').then(AsyncComponent => {
                console.log('加载完毕, 延迟传送');
                if(controlGamePresent){
                    console.log('传送');
                    resolve(AsyncComponent);
                }
                else{
                    reject()
                }
                
            });
        });
    })

    async function getWebcamImage() {
        const img = ( await webcam.capture() ).toFloat();
        const normalized = img.div( 127 ).sub( 1 );
        return normalized;
    }

    async function predictImage() {
        if( !hasTrained ) { return; } // Skip prediction until trained
        const img = await getWebcamImage();
        
        let result = tf.tidy( () => {
            const input = img.reshape( [ 1, 224, 224, 3 ] );
            return model.predict( input );
        });
        img.dispose();
        let prediction = await result.data();
        console.log(prediction)
        result.dispose();
        // Get the index of the highest value in the prediction
        let num = prediction.indexOf( Math.max( ...prediction ) );
        // console.log(index)
        switch (num) {
            case 0:
                document.body.pressKey(74);
                break;
            case 1:
                document.body.pressKey(75);
                break;
            case 2:
                
                break;
            default:
                break;
        }
    }
    
    useEffect(()=>{
        (async function trainModel() {
        console.log('test')

            // hasTrained = false;
            // setText( "Training..." ); 
            // Setup training data
            const labels = [
                "attack",
                "jump",
                "None",
            ];
            
            const imageSamples = [];
            const targetSamples = [];
            for(let i=0;i<trainingData.length;i++){
                let analyzeImage = await trainingData[i].image
                console.log(analyzeImage)
                imageSamples.push( analyzeImage );
                let cat = [];
                for( let c = 0; c < labels.length; c++ ) {
                    cat.push( c === trainingData[i].category ? 1 : 0 );
                }
                targetSamples.push( tf.tensor1d( cat ) );
            }

            if(JSON.stringify(trainingData)==='{}'){
                history.replace('/start')
            }
            else{
                trainingData.forEach( async (sample) => {
                        let analyzeImage = await sample.image
                        console.log(analyzeImage)
                        imageSamples.push( analyzeImage );
                        let temporaryArr = [];
                        for( let c = 0; c < labels.length; c++ ) {
                            temporaryArr.push( c === sample.category ? 1 : 0 );
                        }
                        targetSamples.push( tf.tensor1d( temporaryArr ) );
                        console.log(tf.stack( imageSamples ))
                });
    
                console.log(trainingData)
                
                console.log(imageSamples)
                const xs = tf.stack( imageSamples );
                const ys = tf.stack( targetSamples );
    
    
                // Train the model on new image samples
    
                model.compile( { loss: "meanSquaredError", optimizer: "adam", metrics: [ "acc" ] } );
        
                await model.fit( xs, ys, {
                    epochs: 30,
                    shuffle: true,
                    callbacks: {
                        onEpochEnd: ( epoch, logs ) => {
                            console.log( "Epoch #", epoch, logs );
                        }
                    }
                });
    
                hasTrained = true;
                
                webcam = await tf.data.webcam( document.getElementById( "deepLearningVideo-webcam" ) );
                setControlGamePresent(true)
                document.body.onkeydown = function(e) {
                    // console.log("key pressed, code=" + e.keyCode);
                };
                // Setup prediction every 200 ms
                timer = setInterval( predictImage, 200 );
                
            }
        })()
    },[])
    useEffect(()=>{
        console.log(whetherClearTimer)
        if(whetherClearTimer){
            console.log(whetherClearTimer)
            clearInterval(timer)
        }
    },[whetherClearTimer])
    return (
        <div>
            <video 
                autoPlay 
                playsInline 
                muted 
                width="224" 
                height="224"
                style={{display:'none'}}
                id="deepLearningVideo-webcam" 
            ></video>
            <Suspense fallback={<h1>Loading...</h1>}>
                {
                    controlGamePresent?
                    <Uilaryer></Uilaryer>
                    :
                    <Loading></Loading>
                }
            </Suspense>
            {/* <Uilaryer></Uilaryer> */}
        </div>
    )
}

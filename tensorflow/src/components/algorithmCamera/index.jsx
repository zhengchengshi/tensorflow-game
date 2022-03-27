import React, { useEffect } from 'react'
import * as tf from '@tensorflow/tfjs';
import { storageTrainingData } from './trainingDataReducer'
import { storageTrainingModel } from './trainingModelReducer'
import { useDispatch } from 'react-redux';
import getUserOs from '../../utils/getUserOs'
let currentStep = 0
let webcam = null;
let captureSample = null

let trainingData = [];
const labels = [
    "attack",
    "jump",
    "None",
];

const isIphone = getUserOs()

const mobilenet = "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json";
let video = null
let model = null;
let hasTrained = false;
export default function TfCamera(props) {
    const dispatch = useDispatch()
    useEffect(()=>{
        function setText( text ) {
            // document.getElementById( "status" ).innerText = text;
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
            let id = prediction.indexOf( Math.max( ...prediction ) );
            console.log(id)
            setText( labels[id] );
        }
        async function trainModel() {
            hasTrained = false;
            // setText( "Training..." ); 
            // Setup training data
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
            console.log('hasTrained')
            hasTrained = true;
        }
        function createTransferModel( model ) {
            // Create the truncated base model (remove the "top" layers, classification + bottleneck layers)
            const bottleneck = model.getLayer( "dropout" ); // This is the final layer before the conv_pred pre-trained classification layer
            const baseModel = tf.model({
                inputs: model.inputs,
                outputs: bottleneck.output
            });
            // Freeze the convolutional base
            for( const layer of baseModel.layers ) {
                layer.trainable = false;
            }
            // Add a classification head
            const newHead = tf.sequential();
            newHead.add( tf.layers.flatten( {
                inputShape: baseModel.outputs[ 0 ].shape.slice( 1 )
            } ) );
            newHead.add( tf.layers.dense( { units: 100, activation: 'relu' } ) );
            newHead.add( tf.layers.dense( { units: 100, activation: 'relu' } ) );
            newHead.add( tf.layers.dense( { units: 10, activation: 'relu' } ) );
            newHead.add( tf.layers.dense( {
                units: labels.length,
                kernelInitializer: 'varianceScaling',
                useBias: false,
                activation: 'softmax'
            } ) );
            // Build the new model
            const newOutput = newHead.apply( baseModel.outputs[ 0 ] );
            const newModel = tf.model( { inputs: baseModel.inputs, outputs: newOutput } );
            return newModel;
        }
        async function setupWebcam() {
            return new Promise( ( resolve, reject ) => {
                const webcamElement = document.getElementById( "deepLearningVideo-webcam" );
                const navigatorAny = navigator;
                navigator.getUserMedia = navigator.getUserMedia ||
                navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
                navigatorAny.msGetUserMedia;
                if( navigator.mediaDevices.getUserMedia ) {
                    navigator.mediaDevices.getUserMedia({vidio: true, audio: true})
                        .then(stream => {
                                //将视频流设置为video元素的源
                                webcamElement.srcObject = stream;
                                webcamElement.addEventListener( "loadeddata", resolve, false );

                            })
                            .catch((err)=>{
                                    /* 处理error */
                                    alert(err)
                                    reject()
                                });
                }

                // if( navigator.getUserMedia ) {
                //     // 开启摄像头
                //     navigator.getUserMedia( { video: true },
                //     stream => {
                //         //将视频流设置为video元素的源
                //         webcamElement.srcObject = stream;
                //         webcamElement.addEventListener( "loadeddata", resolve, false );
                //     },
                //     error => {
                //         alert(error)
                //         reject()
                //     });
                // }
                // else {
                //     reject();
                // }
            });
        }
    
        async function getWebcamImage() {
            const img = ( await webcam.capture() ).toFloat();
            const normalized = img.div( 127 ).sub( 1 );
            return normalized;
        }
    
        captureSample = (event)=>{
            event.stopPropagation()
            if(currentStep<labels.length){
                console.log(currentStep)
                props.hasCaptured()
                trainingData.push( {
                    image:  getWebcamImage(),
                    category: currentStep
                });
                setText( "Captured: " + labels[ currentStep ] );
                // video.pause()
                // context.fillRect(0, 0, canvas.width, canvas.height);
                // context.drawImage(video, 0, 0, canvas.width, canvas.height);
                currentStep++
                if(currentStep === labels.length){
                    dispatch(storageTrainingData(trainingData))
                    dispatch(storageTrainingModel(model))
                    // trainModel()
                }
            }
        };
        
        (async () => {
            // Load the model
            model = await tf.loadLayersModel( mobilenet );
            model = createTransferModel( model );
            await setupWebcam();
            webcam = await tf.data.webcam( document.getElementById( "deepLearningVideo-webcam" ) );
            // Setup prediction every 200 ms
            // setInterval( predictImage, 200 );
        })();

    },[])
    


    useEffect(()=>{

        // canvas = document.querySelector('canvas')
        video = document.querySelector('video')
        // context = canvas.getContext('2d');
    },[]);
    return (
        <div>
            <div className="deepLearningVideo-outer">
                <video 
                    autoPlay 
                    playsInline 
                    muted 
                    width="224" 
                    height="224"

                    id="deepLearningVideo-webcam" 
                ></video>

                {/* <canvas
                    width="224" 
                    height="224"
                ></canvas> */}
                <div className="deepLearningVideo-capturebtn" onClick={captureSample}>捕获</div>
                    {/* <button onClick={trainModel}>Train</button> */}
                {/* <div id="buttons">
                    <button></button>
                </div> */}
                {/* <h1 id="status">Loading...</h1> */}
            </div>
        </div>
    );
}

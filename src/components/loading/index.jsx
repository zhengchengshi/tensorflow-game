import React from 'react'
import './index.scss'
export default function Loading() {
    return (
        <div>
            <div className="loading-background">
                <div className='loading-notice'>
                    <span>模型训练中</span>
                    <span style={{fontSize:'23px',marginTop:'13px'}}>(大约需要30~120s)</span>
                    <div className="loading">
                        <div className="pswp__preloader__icn">
                            <div className="pswp__preloader__cut">
                                <div className="pswp__preloader__donut"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="loading-maincharacter"><div className="animation-container"><img src='https://s1.ax1x.com/2022/03/23/q3eBrj.gif' className='loading-maincharacter-content'></img></div></div>
                <div className="loading-road"></div>
            </div>
        </div>
    )
}

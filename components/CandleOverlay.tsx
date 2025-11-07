'use client';
import React, { useState, useEffect } from 'react';
import Section1 from '@/components/Section1';
import Carousel from '@/components/Carousel';

// Section1 と Carousel が表示されるサイト本体
// startAnimation フラグを受け取ります
const SiteContent = ({ startAnimation }: { startAnimation: boolean }) => (
    <main>
        {/* 1. Section1 (アニメーション対象) */}
        <Section1 startAnimation={startAnimation} /> 
        
        {/* 2. SVG (page.tsxから移動) */}
        <svg width="0" height="0" viewBox="0 0 1000 1000">
            <defs>
                <clipPath id="wax-mask-dual">
                    {/* SVG pathの内容はここに記述 */}
                    <path d="M0 50 C 150 0, 250 100, 500 50 C 750 0, 850 100, 1000 100 V1000 C 850 950, 750 1050, 500 1000 C 250 950, 150 1050, 0 950 Z" />
                </clipPath>
            </defs>
        </svg>
        
        {/* 3. カルーセル */}
        <Carousel /> 
    </main>
);


export default function CandleOverlay() {
    // 🚨 修正: 状態変数を定義
    const [isLit, setIsLit] = useState(false);
    const [isSiteVisible, setIsSiteVisible] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false); 

    const handleClick = () => {
        if (isLit) return;
        
        // 1. 蝋燭を点火
        setIsLit(true);
        
        // 2. サイトの表示演出を開始 (CSSで処理)
        // TODO: CSSで円形の演出を実装

        // 3. 演出終了後の処理を遅延実行 (2.5秒後)
       // clip-path のトランジションが 1.5秒なので、
        // 1.5秒 + 0.5秒の余裕 = 2000ms (2秒) 後にサイト本体をロードするのが自然です。
        setTimeout(() => {
            setIsSiteVisible(true); // サイト本体を表示 (オーバーレイをDOMから削除)
            setStartAnimation(true); // Section1 のアニメーション開始をトリガー
        }, 2000); // 🚨 修正: 2.5秒から 2.0秒に変更
    };
    
    // 演出終了後の描画 (サイト本体を表示)
    if (isSiteVisible) {
        // サイト本体を表示し、アニメーション開始フラグを渡します
        return <SiteContent startAnimation={startAnimation} />; 
    }
    
    // 演出中の描画 / 初期画面の描画 (オーバーレイを表示)
    return (
        <div className={`overlay ${isLit ? 'lit' : ''}`} onClick={handleClick}>
            <img 
                src={isLit ? '/png/lit_candle.png' : '/png/unlit_candle.png'} 
                alt="蝋燭"
            />
            {!isLit && <p className="sound-warning">※このサイトでは音が鳴ります</p>}
            
            {/* CSSはglobals.cssに記述することを推奨しますが、今回はそのまま残します */}
           
        </div>
    );
}
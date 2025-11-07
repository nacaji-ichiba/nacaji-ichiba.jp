'use client'; 
// 👆 Next.jsに「これはブラウザ側で動かすコンポーネントだ」と伝えるための魔法の行です。

import { useRef, useEffect } from 'react';

// 元のHTML内のカルーセル部分をコンポーネントとして定義します。
export default function Carousel() {
    // DOM要素を参照するために useRef を使います
    const carouselListRef = useRef<HTMLUListElement>(null);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    
    // JSロジックは、コンポーネントが描画された後に動く useEffect の中に入れます
    useEffect(() => {
        const carouselList = carouselListRef.current;
        const section = sectionRef.current;
        
        if (!carouselList || !section) return;

        // ----------------------------------------------------
        // 🚨 注意: ここから下のコードは、元のJSをReactで動作するように調整したものです。
        // ----------------------------------------------------
        
        // 🌟 1. スライドの複製と挿入 🌟
        // ReactではDOMを直接操作するのは非推奨ですが、ここでは元のJSロジックを再現するために、
        // 初期レンダリング時のみDOM操作を許可します。（通常はJSXで要素を複製します）

        const originalSlides = Array.from(carouselList.querySelectorAll('.slide-inner'));
        const slideCount = originalSlides.length;
        
        // リストの中身を一旦クリア
        carouselList.innerHTML = ''; 

        // 前後に複製して追加 (無限ループのための構造を生成)
        // 1. 後ろに元のスライドを追加
        originalSlides.forEach(slide => {
            const cloneAfter = slide.cloneNode(true) as HTMLLIElement;
            carouselList.appendChild(cloneAfter);
        });
        
        // 2. 中央に元のスライドを追加
        originalSlides.forEach(slide => {
            carouselList.appendChild(slide); // 既存のノードを移動
        });

        // 3. 前に元のスライドを複製して追加
        // (この時点での carouselList の子要素数は 2 * slideCount)
        originalSlides.slice().reverse().forEach(slide => { // 逆順で複製
            const cloneBefore = slide.cloneNode(true) as HTMLLIElement;
            carouselList.insertBefore(cloneBefore, carouselList.firstElementChild);
        });
        
        // 複製後の全スライドリスト (合計 3 * slideCount)
        const allSlides = Array.from(carouselList.querySelectorAll('.slide-inner'));
        // 初期インデックスは、元のスライドブロックの最初のスライド
        let currentIndex = slideCount; 

        // ----------------------------------------------------
        // 🌟 2. 無限ループと背景切り替えロジック 🌟
        // ----------------------------------------------------
        
        const pcBgImages = Array.from({ length: slideCount }, (_, i) => `png/C_sectionback_pc${i + 1}.png`);
        const spBgImages = Array.from({ length: slideCount }, (_, i) => `png/C_sectionback_sp${i + 1}.png`);
        
        const mediaQuery = window.matchMedia('(min-width: 769px)');
        
        let isTransitioning = false;
        const TRANSITION_DURATION = 500;

        const getRealIndex = (index: number) => {
            // slideCount の範囲内 (0〜4) に戻す
            return (index % slideCount + slideCount) % slideCount;
        };
        
        const getBgImageUrl = (index: number) => {
            const realIndex = getRealIndex(index);
            const targetImages = mediaQuery.matches ? pcBgImages : spBgImages;
            return `url('/${targetImages[realIndex]}')`;
        };

        const updateBackgroundImage = (newIndex: number) => {
            const realNewIndex = getRealIndex(newIndex);
            const realCurrentIndex = getRealIndex(currentIndex);

            if (realNewIndex === realCurrentIndex && newIndex !== currentIndex) return;

            if (isTransitioning) return;
            isTransitioning = true;

            const newImageUrl = getBgImageUrl(newIndex);
            
            section.style.setProperty('--next-bg-url', newImageUrl);
            section.style.setProperty('--bg-opacity-1', '0'); 
            section.style.setProperty('--bg-opacity-2', '1');

            setTimeout(() => {
                section.style.setProperty('--current-bg-url', newImageUrl);
                section.style.setProperty('--bg-opacity-1', '1');
                section.style.setProperty('--bg-opacity-2', '0');
                isTransitioning = false;
            }, TRANSITION_DURATION);
        };
        const checkLoop = (targetIndex: number) => {
            let newIndex = targetIndex;
    const totalSlides = allSlides.length;

    // 最後のスライドブロックの端に到達した場合
    if (targetIndex >= totalSlides - slideCount) {
        newIndex = slideCount; // 中央ブロックの先頭 (Index 5)
    }
    // 最初のスライドブロックの端に到達した場合
    else if (targetIndex < slideCount) {
        newIndex = slideCount * 2 - 1; // 中央ブロックの末尾 (Index 9)
    }
    if (newIndex !== targetIndex) {
        // 瞬間移動時には一時的にスムーススクロールを無効化
        carouselList.style.scrollBehavior = 'auto'; 

        // 瞬間移動の実行
        allSlides[newIndex].scrollIntoView({
            inline: 'center'
        });

        // 瞬間移動が完了した後、スクロールを 'smooth' に戻す
        // ブラウザが 'auto' の状態を確実に認識できるようにわずかな遅延を入れる
        setTimeout(() => {
            carouselList.style.scrollBehavior = 'smooth';
        }, 50);

        return newIndex;
    }

    return targetIndex;
};
        const goToSlide = (direction: number) => {
            let targetIndex = currentIndex + direction;

            if (isTransitioning) return;

            updateBackgroundImage(targetIndex);

            allSlides[targetIndex].scrollIntoView({
                behavior: 'smooth',
                inline: 'center'
            });

            currentIndex = targetIndex;

            setTimeout(() => {
                const loopedIndex = checkLoop(currentIndex);
                currentIndex = loopedIndex;
            }, TRANSITION_DURATION + 50);
        };
        
        // ----------------------------------------------------
        // 3. 初期設定とイベントリスナー
        // ----------------------------------------------------
        
        const initialUrl = getBgImageUrl(currentIndex);
        section.style.setProperty('--current-bg-url', initialUrl);
        section.style.setProperty('--next-bg-url', initialUrl);
        
        // 最初の表示位置（中央のオリジナルスライドの先頭）に瞬間移動
        if (allSlides[currentIndex]) {
            carouselList.style.scrollBehavior = 'auto'; 
            allSlides[currentIndex].scrollIntoView({
                inline: 'center'
            });
            setTimeout(() => {
                carouselList.style.scrollBehavior = 'smooth';
            }, 50);
        }

        const handlePrevClick = () => goToSlide(-1);
        const handleNextClick = () => goToSlide(1);

        prevButtonRef.current?.addEventListener('click', handlePrevClick);
        nextButtonRef.current?.addEventListener('click', handleNextClick);  
        
        mediaQuery.addEventListener('change', () => {
            const newUrl = getBgImageUrl(currentIndex);
            section.style.setProperty('--current-bg-url', newUrl);
            section.style.setProperty('--next-bg-url', newUrl);
        });
        
        // クリーンアップ関数
        return () => {
             prevButtonRef.current?.removeEventListener('click', handlePrevClick);
             nextButtonRef.current?.removeEventListener('click', handleNextClick);
        };

    }, []); // ページロード時に一度だけ実行

    return (
        // ユーザーが提供したHTMLのカルーセル部分をJSXで記述します
        <section ref={sectionRef} className="candle-section">
            <div className="carousel-wrapper">
                <button ref={prevButtonRef} className="nav-button prev-button">◀</button>
                <ul ref={carouselListRef} className="slide-item">
                    <li className="slide-inner"> 
                        <div className="slide-text">
                            <h2>アカ</h2>
                            <p>こんにちは。私は真面目で普通なアカと言います。こちらはCandlegirlsの紹介ページになります。右スクロールで、他のメンバーの詳細が見られます。</p>
                        </div>
                        <div className="slide-image">
                            {/* 画像の配置は後で行います */}
                            <img src="/png/aka.png" alt="アカのキャラクター画像" />
                        </div>
                    </li>
                    <li className="slide-inner"> 
                        <div className="slide-text">
                            <h2>ダイダイ</h2>
                            <p>推し活！ごはん！好きなものを好きなだけ、だって人生一度きり！え？！ヤダヤダ干渉してこないで！！</p>
                        </div>
                        <div className="slide-image">
                            <img src="/png/daidai.png" alt="ダイダイのキャラクター画像" />
                        </div>
                    </li>
                    <li className="slide-inner"> {/* 例: 3つ目のスライド */}
                        <div className="slide-text">
                            <h2>マツムシ</h2>
                            <p>自分に厳しく他人に厳しく冷徹に。イライラさせるんじゃありません。大事な思い出？捨てなさい。</p>
                        </div>
                        <div className="slide-image">
                            <img src="/png/matsumushi.png" alt="博士のキャラクター画像" />
                        </div>
                    </li>
                     <li className="slide-inner"> {/* 例: 4つ目のスライド */}
                        <div className="slide-text">
                            <h2>やくし秘奥にあり渾名を磨礪す心</h2>
                            <p>こうやって無心に捏ねくり回していると生を実感できるのだよ。あぁ！このパーツも潰してくれないか？</p>
                        </div>
                        <div className="slide-image">
                            <img src="/png/yakushihiokuniarikonmeiomareisucocoro.png" alt="博士のキャラクター画像" />
                        </div>
                    </li>
                     <li className="slide-inner"> {/* 例: 5つ目のスライド */}
                        <div className="slide-text">
                            <h2>シリー</h2>
                            <p>流石に12本もあったら何本か溶けても問題なさそうだよねぇ。でもまだまだ足りないんだぁ、ごめんね。</p>
                        </div>
                        <div className="slide-image">
                            <img src="/png/silly.png" alt="シリーのキャラクター画像" />
                        </div>
                    </li>
                </ul>
                <button ref={nextButtonRef} className="nav-button next-button">▶</button>
            </div>
        </section>
    );
}
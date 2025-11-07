'use client'; 
import React, { useEffect } from 'react';

// CANDLE GIRLS を一文字ずつ span でラップする関数
const renderTitle = (title: string) => {
  return title.split('').map((char, index) => (
    <span key={index} className="char" style={{ animationDelay: `${index * 0.1}s` }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};

export default function Section1() {
  
  // ページロード時にアニメーションをトリガー
  useEffect(() => {
    // DOM要素は自身のコンポーネントがマウントされると確実にある
    const title = document.querySelector('.animated-title');
    if (title) { 
        title.classList.add('start-animate');
    }

    const ts1 = document.querySelector('.animated-text.ts1');
    if (ts1) { 
        ts1.classList.add('start-animate');
    }

    const ts2 = document.querySelector('.animated-text.ts2-delay');
    if (ts2) { 
        ts2.classList.add('start-animate');
    }
  }, []); // ページロード時に一度だけ実行

  return (
      <section className="section1">
        <div className="titleN">
         <h2 className="animated-title">{renderTitle("CANDLE GIRLS")}</h2>
          <p className="ts animated-text ts1">とは？</p>
        </div>
        <p className="ts2 animated-text ts2-delay">
          尖った熱意に溶かされそうなロウソクの総称。頭の導火線じゃない、心の導火線に火をつけるのだ！
        </p>
      </section>
  );
}
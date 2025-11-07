import Carousel from '@/components/Carousel';

// CANDLE GIRLS を一文字ずつ span でラップする関数
const renderTitle = (title: string) => {
  return title.split('').map((char, index) => (
    <span key={index} className="char" style={{ animationDelay: `${index * 0.1}s` }}>
      {char === ' ' ? '\u00A0' : char} {/* スペースは &nbsp; に変換 */}
    </span>
  ));
};

export default function Home() {

  return (
    <main>
      {/* 1. 上部の静的なコンテンツ */}
      <section className="section1">
        <div className="titleN">
         <h2 className="animated-title">{renderTitle("CANDLE GIRLS")}</h2>
          <p className="ts animated-text ts1">とは？</p>
        </div>
        <p className="ts2 animated-text ts2-delay">
          尖った熱意に溶かされそうなロウソクの総称。頭の導火線じゃない、心の導火線に火をつけるのだ！
        </p>
      </section>

      {/* 2. SVG (これはカルーセル外の要素なので残します) */}
      <svg width="0" height="0" viewBox="0 0 1000 1000">
        <defs>
          <clipPath id="wax-mask-dual">
            {/* pathの内容は省略 */}
            <path d="M0 50 C 150 0, 250 100, 500 50 C 750 0, 850 100, 1000 100 V1000 C 850 950, 750 1050, 500 1000 C 250 950, 150 1050, 0 950 Z" />
          </clipPath>
        </defs>
      </svg>
      
      {/* 3. 🚨 ここが修正点です！カルーセル全体をコンポーネントに置き換えます */}
      <Carousel /> 
      
    </main>
  );
}
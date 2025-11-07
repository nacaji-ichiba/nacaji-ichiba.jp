import Carousel from '@/components/Carousel';
import Section1 from '@/components/Section1';

export default function Home() {

  return (
    <main>
      {/* 1. 上部の静的なコンテンツ */}
      <Section1 />

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
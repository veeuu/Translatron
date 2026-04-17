import React from 'react';
import tryimg from '../images/img1.png';
import img3 from '../images/img3.png';
import img2 from '../images/img2.svg';
import img4 from '../images/img4.png';
import img5 from '../images/img5.png';
import img6 from '../images/img21.png';
export default function Home() {
  return (
    <div className="home">
      <div  className="home1">
  <h1 className="text1">Unlock Seamless Communication with Our Next-Gen Translator</h1><br />
</div>




<div className="home2">
  <div className="text">
    <p>
      In a world where communication knows no boundaries, our revolutionary
      translator bridges the gap effortlessly. Whether you’re sealing a
      business deal, exploring new destinations, or connecting with friends
      worldwide, our translator ensures your words are always understood and
      accurate.
    </p>
  </div>
  <img className="img1" src={tryimg} alt="" />
</div>



<div className="home1">
<img className="img22" src={img6} alt="" />
  <div className="text">
    <p>
    Imagine typing or pasting text and instantly seeing it translated into any language you need. Our state-of-the-art translator handles this with ease, delivering precision and clarity. Need to translate a PDF? No problem. Our tool converts entire documents while preserving the original layout and formatting, making it perfect for professional reports, academic papers, and official documents.
    </p>
  </div>
  
</div>




<div className="home2">
  <div className="text">
  <p>Filling out forms in a different language can be daunting. Our translator simplifies this process by guiding you through each field, translating them for easy comprehension and accurate input. Whether it’s a visa application or an international survey, our tool makes it straightforward and stress-free.</p><br />
  </div>
  <img className="img1" src={img3} alt="" />
</div>


<div className="home1">
<img className="img2" src={img4} alt="" />
  <div className="text">
  <p>Our user-friendly interface ensures that anyone, regardless of technical skill, can navigate and utilize our translator with ease. Backed by advanced algorithms, our translations are not only fast but also incredibly accurate, giving you confidence in every word.</p><br />
  </div>
  
</div>

<div className="home2">
  <div className="text">
  <p>With support for a vast array of languages, you can break down communication barriers effortlessly. Plus, your privacy is our priority. We handle your documents with the highest level of security, ensuring your data remains confidential and protected.</p><br />
  </div>
  <img className="img1" src={img2} alt="" />
</div>


<div className="home1">
<img className="img21" src={img5} alt="" />
  <div className="text">
  <p>Embrace the future of communication. Experience the freedom of being understood and understanding others, no matter the language. Discover the limitless possibilities with our versatile and powerful translation tool.</p><br />
  </div>
  
</div>


</div>
  );
}
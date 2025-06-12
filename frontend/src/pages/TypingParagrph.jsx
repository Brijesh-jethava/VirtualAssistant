import React, { useEffect, useState } from 'react';
import UserContext, { userDataContext } from '../context/UserContext';


const TypingParagraph = ({text}) => {

 

  const fullText = `Hi! I'm ${text} your virtual AI Assistant`;
   const name = text ;
  const [displayedText, setDisplayedText] = useState('');

useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < fullText.length-1) {
      setDisplayedText(prev => prev + fullText[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 50);
  return () => clearInterval(interval);
}, []);

  const nameIndex = fullText.indexOf(name);
  const assistantText = 'virtual AI Assistant';
  const assistantStart = fullText.indexOf(assistantText);

  const beforeName = displayedText.slice(0, nameIndex-1);
  const namePart = displayedText.slice(nameIndex-1, nameIndex + name.length);
  const between = displayedText.slice(nameIndex + name.length-1, assistantStart-1);
  const assistantPart = displayedText.slice(assistantStart-1);

  return (
    // <p className="text-white text-xl text-center w-[80%] mx-auto font-mono">
    //   {displayedText}
    // </p>

    <p className="text-xl text-center w-[90%] mx-auto font-mono">
      <span className="text-white">{beforeName}</span>
      <span className="text-blue-400">{namePart}</span>
      <span className="text-white">{between}</span>
      <span className="text-purple-400">{assistantPart}</span>
    </p>
  );
};

export default TypingParagraph;

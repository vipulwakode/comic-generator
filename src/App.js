import React, { useState } from "react";
import "./App.css";

async function query(data, annotation) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        Accept: "image/png",
        Authorization:
          "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ ...data, annotation }),
    }
  );
  const result = await response.blob();
  return result;
}

const ComicGenerator = () => {
  const [comicPanels, setComicPanels] = useState([]);
  const [textInput, setTextInput] = useState(Array(10).fill(""));

  const handleTextChange = (index, value) => {
    const newText = [...textInput];
    newText[index] = value;
    setTextInput(newText);
  };

  const generateComic = async () => {
    try {
      const images = await Promise.all(
        textInput.map(async (text) => {
          const data = { inputs: text };
          const response = await query(data);
          return URL.createObjectURL(response);
        })
      );

      setComicPanels(images);
    } catch (error) {
      console.error("Error generating comic:", error);
      // Handle error and provide user feedback
    }
  };

  return (
    <div className="full-screen">
      <div className="comic-generator">
        <h1>Comic Generator</h1>
        <div className="comic-form">
          {textInput.map((text, index) => (
            <div key={index} className="panel">
              <textarea
                placeholder={`Panel ${index + 1}`}
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={generateComic}>Generate Comic</button>
        </div>
        <div className="comic-display">
          {comicPanels.map((panel, index) => (
            <div key={index} className="comic-panel">
              <img src={panel} alt={`Panel ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicGenerator;

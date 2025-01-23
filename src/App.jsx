
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'
import * as fabric from 'fabric';






const appURL = "https://api.unsplash.com/search/collections?page=1"
const access_key = "qvjbAWTlsB2iUcwQc92Nv9iQdKIO5PtPBv8r63jV6fo"
function App() {
  const [imageSearch, setImageSearch] = useState("")
  const [image, setImage] = useState("")
  const [canvas, setCanvas] = useState(null)
  const canvasRef = useRef(null)
  

  const searchImages = async () => {
    try {
     if(!imageSearch){
      alert("please enter image name")
     }
      const result = await axios.get(`${appURL}&query=${imageSearch}&client_id=${access_key}`)
      setImage(result.data.results)
      console.log(result.data, "result")
    }
    catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    
    const fabricCanvas = new fabric.Canvas("canvas", {
      width: 400,
      height: 250,
      backgroundColor: "#f5f5f5",
    });
    setCanvas(fabricCanvas);
    return () => {
      fabricCanvas.dispose();
    };
  }, []);


  const addImageOnCanvas = async (imageUrl) => {
    
    if (canvas) {
      try {
        const img = await fabric.Image.fromURL(imageUrl);
        // img.set({ crossOrigin: 'anonymous' });
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        console.log(img.width,"sc")

        img.scale(scale);

        img.set({
          left: (canvasWidth - img.width * scale) / 2,
          top: (canvasHeight - img.height * scale) / 2,
          // width:100,
          // height:100,

          selectable: true,
        });
        canvas.add(img);
        canvas.setActiveObject(img); 
        console.log(canvas,"cn")

        
      } catch (error) {
        console.error("Failed to load the image:", error);
      }
    }
  };




  

  const addText = () => {
    const textt = new fabric.Text('this is my new caption', { 
      left: 100, 
      top: 100,
       fontSize: 20 
      });
    canvas.add(textt);
    
   
  };


  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case 'circle':
        shape = new fabric.Circle({ left: 100, top: 100, radius: 50, fill: 'red',hasControls: true, });
        break;
      case 'rectangle':
        shape = new fabric.Rect({ left: 100, top: 100, width: 100, height: 60, fill: 'blue' });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100, 
          top: 100,   
          width: 100, 
          height: 100, 
          fill: 'green', 
        });
      default:
        break;
    }
    if (shape) {
      canvas.add(shape);
      
    }
  };

  const downloadImage = () => {
    const dataURL = canvas.toDataURL({ format: 'png' });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited.png';
    link.click();
    
  };



  return (
    <>
      <div className='container'>
        <h1>Image  Editor</h1>
        <div className='searchBox' >
          <input
            type="text"
            className='search-input'
            onChange={(e) => setImageSearch(e.target.value)}
            placeholder="Search image"
            value={imageSearch && imageSearch}

          />
          <button
            className='search-button'
            onClick={searchImages}
          >
            Search
          </button>
        </div>

        <div className='image_content'>
          <div className='list' style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "space-between", marginBottom: "20px" }}>
            {image && image.map((image) => (
              <div key={image.id} style={{ width: "200px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                <img
                  src={image.cover_photo.urls.raw}
                  alt={image.title}
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
                />
                <button
                  className='caption'
                  style={{ cursor: "pointer", display: "block", marginTop: "10px", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", width: "100%" }}
                  onClick={(e) => addImageOnCanvas(image.cover_photo.urls.regular)}
                >
                  Add Captions
                </button>
              </div>
            ))}
          </div>
          <div className='canvas'>
            <canvas ref={canvasRef} id="canvas" style={{ border: "1px solid #ccc", marginBottom: "20px", display: "block" }}></canvas>


            <div className="controls">
              <button className='add' onClick={addText}>Add Text</button>
              <button className='add' onClick={() => addShape('circle')}>Add Circle</button>
              <button className='add' onClick={() => addShape('rectangle')}>Add Rectangle</button>
              <button className='add' onClick={() => addShape('triangle')}>Add Triangle</button>
              <button className='add' onClick={downloadImage}>Download Image</button>
            </div>
          </div>

        </div>

      </div>

    </>
  )
}

export default App


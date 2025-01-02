import SSFangTangTi from "./fonts/ShangShouFangTangTi.woff2";
import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";
import arc_characters from "./arc_characters.json";
import pjsk_characters from "./pjsk_characters.json";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";
import Picker from "./components/Picker";
import Info from "./components/Info";
import { preloadFont } from "./utils/preload";

const { ClipboardItem } = window;
const characters = [].concat(arc_characters, pjsk_characters);

function App() {
  const [rand, setRand] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [openCopySnackbar, setOpenCopySnackbar] = useState(false);
  const [character, setCharacter] = useState(5);
  const [text, setText] = useState(characters[character].defaultText.text);
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x,
    y: characters[character].defaultText.y,
  });
  const [fontSize, setFontSize] = useState(characters[character].defaultText.s);
  const [spaceSize] = useState(50);
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [curveAmount, setCurveAmount] = useState(0.15);
  const [loaded, setLoaded] = useState(false);
  const img = new Image();

  // Preload font
  useEffect(() => {
    let controller;
    try {
      controller = new AbortController();
      preloadFont("SSFangTangTi", SSFangTangTi, controller.signal);
    } catch (error) {
      console.error(error);
    } finally {
      return () => {
        controller?.abort();
      };
    }
  }, []);

  // Update text and other states when character changes
  useEffect(() => {
    setText(characters[character].defaultText.text);
    setPosition({
      x: characters[character].defaultText.x,
      y: characters[character].defaultText.y,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(characters[character].defaultText.s);
    setLoaded(false);
  }, [character]);

  img.src = `${process.env.PUBLIC_URL}/img/` + characters[character].img;
  img.onload = () => {
    setLoaded(true);
  };

  const draw = (ctx) => {
    ctx.canvas.width = 296;
    ctx.canvas.height = 256;

    if (loaded && document.fonts.check("12px YurukaStd")) {
      const hRatio = ctx.canvas.width / img.width;
      const vRatio = ctx.canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      const centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
      ctx.font = `${fontSize}px YurukaStd, SSFangTangTi`;
      ctx.miterLimit = 2.5;
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(rotate / 10);
      ctx.textAlign = "center";
      ctx.fillStyle = characters[character].fillColor;
      const lines = text.split("\n");

      if (curve) {
        ctx.save();
        for (let line of lines) {
          const lineAngle = Math.PI * line.length * curveAmount;
          for (let pass = 0; pass < 2; pass++) {
            ctx.save();
            for (let i = 0; i < line.length; i++) {
              ctx.rotate(lineAngle / line.length / 2);
              ctx.save();
              ctx.translate(0, -fontSize * 4);
              if (pass === 0) {
                ctx.strokeStyle = "white";
                ctx.lineWidth = 15;
                ctx.strokeText(line[i], 0, 0);
              } else {
                ctx.strokeStyle = characters[character].strokeColor;
                ctx.lineWidth = 5;
                ctx.strokeText(line[i], 0, 0);
                ctx.fillText(line[i], 0, 0);
              }
              ctx.restore();
            }
            ctx.restore();
          }
          ctx.translate(0, ((spaceSize - 50) / 50 + 1) * fontSize);
        }
        ctx.restore();
      } else {
        for (let pass = 0; pass < 2; pass++) {
          let k = 0;
          for (let i = 0; i < lines.length; i++) {
            if (pass === 0) {
              ctx.strokeStyle = "white";
              ctx.lineWidth = 15;
              ctx.strokeText(lines[i], 0, k);
            } else {
              ctx.strokeStyle = characters[character].strokeColor;
              ctx.lineWidth = 5;
              ctx.strokeText(lines[i], 0, k);
              ctx.fillText(lines[i], 0, k);
            }
            k += ((spaceSize - 50) / 50 + 1) * fontSize;
          }
        }
        ctx.restore();
      }
    }
  };

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${characters[character].name}_arcst.yurisaki.top.png`;
    link.href = canvas.toDataURL();
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setRand(rand + 1);
  };

  function b64toBlob(b64Data, contentType = "image/png", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = Array.from(slice, (char) => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const copy = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
      }),
    ]);
    setOpenCopySnackbar(true);
    setRand(rand + 1);
  };

  return (
    <div className="App">
      <Info open={infoOpen} handleClose={() => setInfoOpen(false)} />
      <div className="container">
        <div className="vertical">
          <div className="canvas">
            <Canvas draw={draw} />
          </div>
          <Slider
            value={curve ? 256 - position.y + fontSize * 3 : 256 - position.y}
            onChange={(e, v) =>
              setPosition({
                ...position,
                y: curve ? 256 + fontSize * 3 - v : 256 - v,
              })
            }
            min={0}
            max={256}
            step={1}
            orientation="vertical"
            track={false}
            color="secondary"
          />
        </div>
        <div className="horizontal">
          <Slider
            className="slider-horizontal"
            value={position.x}
            onChange={(e, v) => setPosition({ ...position, x: v })}
            min={0}
            max={296}
            step={1}
            track={false}
            color="secondary"
          />
          <div className="settings">
            <div>
              <label>
                <nobr>旋转角度: </nobr>
              </label>
              <Slider
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>
                <nobr>字体大小: </nobr>
              </label>
              <Slider
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
                color="secondary"
              />
            </div>
            <div>
              <label>文字弧形 (Beta): </label>
              <Switch
                checked={curve}
                onChange={(e) => setCurve(e.target.checked)}
                color="secondary"
              />
            </div>
            <div>
              <label>
                <nobr>弧形曲度: </nobr>
              </label>
              <Slider
                value={curveAmount}
                onChange={(e, v) => setCurveAmount(v)}
                min={0.05}
                max={0.5}
                step={0.01}
                track={false}
                color="secondary"
              />
            </div>
          </div>
          <div className="text">
            <TextField
              label="文字内容"
              size="small"
              color="secondary"
              value={text}
              multiline={true}
              fullWidth={true}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="picker">
            <Picker setCharacter={setCharacter} />
          </div>
          <div className="buttons">
            <Button color="secondary" onClick={copy}>
              复制
            </Button>
            <Button color="secondary" onClick={download}>
              下载
            </Button>
          </div>
        </div>
        <div className="footer">
          <Button color="secondary" onClick={() => setInfoOpen(true)}>
            关于
          </Button>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openCopySnackbar}
        onClose={() => setOpenCopySnackbar(false)}
        message="图片已复制到剪贴板"
        key="copy"
        autoHideDuration={1500}
      />
    </div>
  );
}

export default App;
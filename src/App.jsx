import { useState, useEffect } from "react";
import SSFangTangTi from "./fonts/ShangShouFangTangTi.woff2";
import "./App.css";
import Canvas from "./components/Canvas";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";
import Picker from "./components/Picker";
import Info from "./components/Info";
import { preloadFont } from "./utils/preload";
import { SketchPicker } from 'react-color'; // 引入颜色选择器组件
import characters from './utils/loadcharacters';

const { ClipboardItem } = window;

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
  const [colorPickerVisible, setColorPickerVisible] = useState(false); // 控制字体颜色选择器显示
  const [strokeColorPickerVisible, setStrokeColorPickerVisible] = useState(false); // 控制描边颜色选择器显示
  const [fontColor, setFontColor] = useState(characters[character].fillColor); // 字体颜色
  const [strokeColor, setStrokeColor] = useState(characters[character].strokeColor); // 描边颜色
  const [memesSwich, setmemesSwich] = useState(false);  // 控制所有设置项的显示/隐藏
  const [memeUrl, setMemeUrl] = useState(''); // 新状态，保存输入的 URL

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
    setFontColor(characters[character].fillColor);  // 更新字体颜色
    setStrokeColor(characters[character].strokeColor); // 更新描边颜色
    setLoaded(false);
  }, [character]);

  const path = window.location.href;
  img.src = `${path}/img/` + characters[character].img;
  img.onload = () => {
    setLoaded(true);
  };

  // 处理字体颜色变化
  const handleFontColorChange = (color) => {
    setFontColor(color.hex); // 更新字体颜色
  };

  // 处理描边颜色变化
  const handleStrokeColorChange = (color) => {
    setStrokeColor(color.hex); // 更新描边颜色
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
      ctx.fillStyle = fontColor; // 使用更新后的字体颜色
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
                ctx.strokeStyle = strokeColor; // 使用更新后的描边颜色
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
              ctx.strokeStyle = strokeColor; // 使用更新后的描边颜色
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
    link.download = `${characters[character].name}.png`;
    link.href = canvas.toDataURL();
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setRand(rand + 1);
  };

  const b64toBlob = (b64Data, contentType = "image/png") => {
    const byteCharacters = atob(b64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArrays], { type: contentType });
  };

  const copy = async () => {
    if (!ClipboardItem) {
      alert('您的浏览器不支持复制图片到剪贴板');
      return;
    }
    const canvas = document.getElementsByTagName("canvas")[0];
    await navigator.clipboard.write([new ClipboardItem({
      "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
    })]);
    setOpenCopySnackbar(true);
    setRand(rand + 1);
  };

  const send_request = async (method,url, inter) => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      console.log("URL不能为空且必须以http://或https://开头！");
      return;
    }

    try {
      const response = await fetch(`${url}/${inter}`, {
        method: `${method}`,
      });
      const data = await response.json();
      console.log(data); // 控制台输出返回的数据
    } catch (error) {
      console.error('请求失败:', error);
    }
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
                <nobr>meme表情制作: </nobr>
              </label>
              <Switch
                checked={memesSwich}
                onChange={() => setmemesSwich(!memesSwich)}
                color="secondary"
              />
            </div>
            {!memesSwich && (
              <>
                <div>
                  <label>
                    <nobr>旋转角度: </nobr>
                  </label>
                  <Slider
                    value={rotate}
                    onChange={(e, v) => setRotate(v)}
                    min={-20}
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
                  <label>文字弧形: </label>
                  <Switch
                    checked={curve}
                    onChange={(e) => setCurve(e.target.checked)}
                    color="secondary"
                  />
                </div>
                {curve && (<div>
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
                </div>)}
                <div style={{ position: 'relative' }}>
              <label>
                <nobr>字体颜色调整: </nobr>
              </label>
              <Switch
                checked={colorPickerVisible}
                onChange={() => setColorPickerVisible(!colorPickerVisible)}
                color="secondary"
              ></Switch>

              {/* 字体颜色选择器 */}
              {colorPickerVisible && (
                <div style={{
                  position: 'absolute',
                  left: '120%',
                  top: -270,
                  zIndex: 10,
                }}>
                  <SketchPicker
                    color={fontColor}
                    onChangeComplete={handleFontColorChange}
                  />
                </div>
              )}
            </div>

            {/* 描边颜色调整 */}
            <div style={{ position: 'relative' }}>
              <label>
                <nobr>描边颜色调整: </nobr>
              </label>
              <Switch
                checked={strokeColorPickerVisible} 
                onChange={() => setStrokeColorPickerVisible(!strokeColorPickerVisible)}
              ></Switch>

              {/* 描边颜色选择器 */}
              {strokeColorPickerVisible && (
                <div style={{
                  position: 'absolute',
                  left: '120%',
                  top: 0,
                  zIndex: 10,
                }}>
                  <SketchPicker
                    color={strokeColor}
                    onChangeComplete={handleStrokeColorChange}
                  />
                </div>
              )}
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
              </>
            )}
            {memesSwich && (
              <>
                <div className="text">
                  <TextField
                    label="Meme服务器URL"
                    size="small"
                    color="secondary"
                    value={memeUrl}
                    multiline={true}
                    fullWidth={true}
                    onChange={(e) => setMemeUrl(e.target.value)}
                  />
                </div>
                <div className="发送请求">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => send_request('GET',memeUrl, 'memes/keys')}
                  >
                    发送请求
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="picker">
            <Picker setCharacter={setCharacter} />
          </div>
          <div className="actions">
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={download}
              className="下载">
              下载
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={copy}
              className="复制"
            >
              复制
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
        autoHideDuration={3000}
        message="已复制到剪贴板"
        onClose={() => setOpenCopySnackbar(false)}
      />
    </div>
  );
}

export default App;
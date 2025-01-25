import {
  ImageList,
  ImageListItem,
  Popover,
  Button,
  TextField,
} from "@mui/material";
import { useState, useMemo } from "react";

export default function Picker({ setCharacter , characters }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "picker" : undefined;

  // 缓存过滤后的图片列表项，避免在每次渲染时重新计算
  const memoizedImageListItems = useMemo(() => {
    const s = search.toLowerCase();
    return characters.map((c, index) => {
      if (
        s === c.id ||
        c.name.toLowerCase().includes(s) ||
        c.character.toLowerCase().includes(s)
      ) {
        // 判断 c.img 是否是完整的 URL
        const imgSrc = c.img.startsWith('http://') || c.img.startsWith('https://')
          ? c.img
          : `/img/${c.img}`;

        return (
          <ImageListItem
            key={index}
            onClick={() => {
              handleClose();
              setCharacter(index);
            }}
            sx={{
              cursor: "pointer",
              "&:hover": {
                opacity: 0.5,
              },
              "&:active": {
                opacity: 0.8,
              },
            }}
          >
            <img
              src={imgSrc}
              srcSet={imgSrc}
              alt={c.name}
              loading="lazy"
            />
          </ImageListItem>
        );
      }
      return null;
    });
  }, [search, setCharacter, characters]);

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        color="secondary"
        onClick={handleClick}
      >
        选择表情
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="modal"
      >
        <div className="picker-search">
          <TextField
            label="搜索角色"
            size="small"
            color="secondary"
            value={search}
            multiline={true}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="image-grid-wrapper">
          <ImageList
            sx={{
              width: window.innerWidth < 600 ? 300 : 500,
              height: 450,
              overflow: "visible",
            }}
            cols={window.innerWidth < 600 ? 3 : 4}
            rowHeight={140}
            className="image-grid"
          >
            {memoizedImageListItems}
          </ImageList>
        </div>
      </Popover>
    </div>
  );
}
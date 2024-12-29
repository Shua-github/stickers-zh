import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function Info({ open, handleClose }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">关于</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h6" component="h3">
              这个工具由以下人员提供支持：
            </Typography>
            <List>
            <ListItem
                button
                onClick={() =>
                  (window.location.href = "https://github.com/Shua-github")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Shua"
                    src="https://avatars.githubusercontent.com/Shua-github"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Shua"
                  secondary="汉化此工具并修改了一些地方"
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href = "https://github.com/Rosemoe")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Rosemoe"
                    src="https://avatars.githubusercontent.com/Rosemoe"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Rosemoe"
                  secondary="为 Arcaea 版本的表情制作工具提供支持"
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://x.com/Xestarrrr")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="贡献者"
                    src="https://pbs.twimg.com/profile_images/1829853648521723905/rnRP3FCZ_400x400.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Xestarrrr"
                  secondary="为 Arcaea 表情图像提供支持"
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://github.com/TheOriginalAyaka")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Ayaka"
                    src="https://avatars.githubusercontent.com/TheOriginalAyaka"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Ayaka"
                  secondary="为原始表情制作工具提供支持"
                />
              </ListItem>
            </List>
            <Typography variant="h6" component="h3">
              你可以在这里找到源代码或贡献：
            </Typography>
            <List>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://github.com/Shua-github/arcaea-stickers-zh")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="GitHub"
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  />
                </ListItemAvatar>
                <ListItemText primary="GitHub" secondary="源代码" />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" autoFocus>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
              谢谢他们和它们：
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
                  secondary="汉化并修改了一些地方"
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href = 
                    "https://github.com/Rosemoe/arcaea-stickers")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Github"
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Arcaea Stickers"
                  secondary="提供了Arcaea表情制作工具和Arcaea表情图像"
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://github.com/TheOriginalAyaka/sekai-stickers")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Github"
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Project Sekai Stickers"
                  secondary="提供了pjsk表情制作工具和pjsk表情图像"
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
                    "https://github.com/Shua-github/stickers-zh")
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

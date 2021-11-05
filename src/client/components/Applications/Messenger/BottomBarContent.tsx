import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import { Avatar, Box, Button, Card, Divider, Hidden, IconButton, TextField, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
        height: 40px !important;
        margin: 0 ${theme.spacing(2)};
        align-self: center;
`
)

const Input = styled('input')({
  display: 'none',
})

function BottomBarContent() {
  const { t }: { t: any } = useTranslation()
  // const { user } = useAuth();

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Hidden mdDown>
        <Avatar alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
        <DividerWrapper orientation="vertical" flexItem />
      </Hidden>
      <Box sx={{ flex: 1, mr: 2 }}>
        <TextField hiddenLabel fullWidth placeholder={t('Write here your message...')} />
      </Box>
      <Tooltip arrow placement="top" title={t('Choose an emoji')}>
        <IconButton color="primary">😀</IconButton>
      </Tooltip>
      <Input accept="image/*" id="messenger-upload-file" type="file" />
      <Tooltip arrow placement="top" title={t('Attach a file')}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="messenger-upload-file">
          <IconButton color="primary" component="span">
            <AttachFileTwoToneIcon />
          </IconButton>
        </label>
      </Tooltip>
      <Hidden mdDown>
        <DividerWrapper orientation="vertical" flexItem />
        <Button startIcon={<SendTwoToneIcon />} variant="contained">
          {t('Send')}
        </Button>
      </Hidden>
    </Card>
  )
}

export default BottomBarContent

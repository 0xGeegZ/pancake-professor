import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Hidden,
  IconButton,
  InputAdornment,
  lighten,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  Slide,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { ChangeEvent, forwardRef, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ReactElement } from 'react'

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

const DialogWrapper = styled(Dialog)(
  () => `
    .MuiDialog-container {
        height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
        max-height: calc(100% - 64px)
    }
`
)

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
)

const DialogTitleWrapper = styled(DialogTitle)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
`
)

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        width: ${theme.spacing(6)};
        height: ${theme.spacing(6)};
`
)

function HeaderSearch() {
  const { t }: { t: any } = useTranslation()

  const [openSearchResults, setOpenSearchResults] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value)

    if (event.target.value) {
      if (!openSearchResults) {
        setOpenSearchResults(true)
      }
    } else {
      setOpenSearchResults(false)
    }
  }

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip arrow title={t('Search')}>
        <IconButtonWrapper color="warning" onClick={handleClickOpen}>
          <SearchTwoToneIcon />
        </IconButtonWrapper>
      </Tooltip>

      <DialogWrapper
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleClose}>
        <DialogTitleWrapper>
          <SearchInputWrapper
            value={searchValue}
            autoFocus
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              ),
            }}
            placeholder={t('Search terms here...')}
            fullWidth
            label={t('Search')}
          />
        </DialogTitleWrapper>
        <Divider />

        {openSearchResults && (
          <DialogContent>
            <Box sx={{ pt: 0, pb: 1 }} display="flex" justifyContent="space-between">
              <Typography variant="body2" component="span">
                {t('Search results for')}{' '}
                <Typography sx={{ fontWeight: 'bold' }} variant="body1" component="span">
                  {searchValue}
                </Typography>
              </Typography>
              <Link href="#" variant="body2" underline="hover">
                {t('Advanced search')}
              </Link>
            </Box>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              <ListItem button>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) => theme.palette.secondary.main,
                      }}>
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link href="#" underline="hover" sx={{ fontWeight: 'bold' }} variant="body2">
                      {t('Dashboard for Healthcare Platform')}
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) => lighten(theme.palette.secondary.main, 0.5),
                    }}>
                    {t('This page contains all the necessary information for managing all hospital staff.')}
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItem>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItem button>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) => theme.palette.secondary.main,
                      }}>
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link href="#" underline="hover" sx={{ fontWeight: 'bold' }} variant="body2">
                      {t('Example Projects Application')}
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) => lighten(theme.palette.secondary.main, 0.5),
                    }}>
                    {t('This is yet another search result pointing to a app page.')}
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItem>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItem button>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) => theme.palette.secondary.main,
                      }}>
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link href="#" underline="hover" sx={{ fontWeight: 'bold' }} variant="body2">
                      {t('Search Results Page')}
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) => lighten(theme.palette.secondary.main, 0.5),
                    }}>
                    {t('Choose if you would like to show or not this typography section here...')}
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItem>
            </List>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button color="primary">{t('View all search results')}</Button>
            </Box>
          </DialogContent>
        )}
      </DialogWrapper>
    </>
  )
}

export default HeaderSearch

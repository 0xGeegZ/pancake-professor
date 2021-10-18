import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { alpha, Box, Card, Container, darken, Divider, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { SidebarContext } from 'src/client/contexts/SidebarContext';

import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import NavigationMenu from './NavigationMenu';
import Notifications from './Notifications';
import Search from './Search';
import Userbox from './Userbox';

const TopBarWrapper = styled(Card)(
  ({ theme }) => `
    color: ${theme.header.textColor};
    background: ${alpha(darken(theme.colors.primary.dark, .2), .95)};
    backdrop-filter: blur(5px);
    margin: ${theme.spacing(0, 0, 4)};
    padding: ${theme.spacing(4, 0, 44)};

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      margin: ${theme.spacing(0, 4, 4)};
      padding: ${theme.spacing(4, 4, 44)};
    }
    display: flex;
    align-items: center;
    border-radius: 0;
    border-bottom-right-radius: 40px;
    border-bottom-left-radius: 40px;
    position: relative;
`
);

const TopBarImage = styled(Box)(
  () => `
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .7;
`
);

const TopBarBg = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.gradients.blue1};
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .3;
    z-index: 5;
`
);

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[10]};
`
);


const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    display: flex;
    width: 48px;
    margin-left: ${theme.spacing(2)};
    border-radius: ${theme.general.borderRadiusLg};
    height: 48px;
    justify-content: center;
    font-size: ${theme.typography.pxToRem(13)};
    padding: 0;
    position: relative;
    color: ${theme.colors.alpha.trueWhite[50]};
    background-color: ${theme.colors.alpha.white[10]};

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(26)};
      color: ${theme.colors.alpha.trueWhite[50]};
    }

    &.Mui-active,
    &:hover {
      background-color: ${alpha(theme.colors.alpha.white[30], .2)};

      .MuiSvgIcon-root {
        color: ${theme.colors.alpha.trueWhite[100]};
      }
    }
`
);

function TopBar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <TopBarWrapper>
      <TopBarBg />
      <TopBarImage sx={{ backgroundImage: 'url("/static/images/placeholders/covers/7.jpg")' }} />
      <TopBarImage sx={{ opacity: '.1', backgroundImage: 'url("/static/images/placeholders/covers/2.jpg")' }} />
      <Container sx={{ zIndex: 6 }} maxWidth="lg">
        <Box mb={{ xs: 2, lg: 4 }} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Logo />
            <Hidden mdDown>
              <Search />
            </Hidden>
          </Box>
          <Box display="flex">
            <Hidden smDown>
              <LanguageSwitcher />
              <Box mx={1}>
                <Notifications />
              </Box>
            </Hidden>
            <Userbox />
            <Hidden mdUp>
              <Tooltip arrow title="Toggle Menu">
                <IconButtonPrimary color="primary" onClick={toggleSidebar}>
                  {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
                </IconButtonPrimary>
              </Tooltip>
            </Hidden>
          </Box>
        </Box>
        <Hidden mdDown>
          <DividerWrapper sx={{ my: 3 }} />
          <Box display="flex" alignItems="center">
            <NavigationMenu />
          </Box>
        </Hidden>
      </Container>
    </TopBarWrapper>
  );
}

export default TopBar;

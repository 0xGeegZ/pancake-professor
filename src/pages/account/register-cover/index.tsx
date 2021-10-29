import {
  Box,
  Card,
  Container,
  Divider,
  Link,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  Hidden,
  IconButton,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import BaseLayout from 'src/client/layouts/BaseLayout'
import RegisterForm from 'src/client/components/Account/RegisterForm'

import { useTranslation } from 'react-i18next'
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone'
import { styled } from '@mui/material/styles'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Logo from 'src/client/components/LogoSign'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'

SwiperCore.use([Navigation, Pagination])

const icons = {
  UiPath: '/static/images/placeholders/logo/uipath.jpg',
  Ea: '/static/images/placeholders/logo/ea.jpg',
  Autodesk: '/static/images/placeholders/logo/autodesk.jpg',
  Adobe: '/static/images/placeholders/logo/adobe.jpg',
}

const Content = styled(Box)(
  () => `
    display: flex;
    height: 100%;
    flex: 1;
`
)

const MainContent = styled(Box)(
  () => `
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    position: relative;
`
)

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.gradients.blue3};
    width: 500px;
`
)

const SidebarContent = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: ${theme.spacing(6)};
`
)

const CardImg = styled(Card)(
  ({ theme }) => `
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 11px solid ${theme.colors.alpha.white[10]};
    transition: ${theme.transitions.create(['border'])};
    width: ${theme.spacing(16)};
    height: ${theme.spacing(16)};
    margin-bottom: ${theme.spacing(3)};
`
)

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
        color: ${theme.colors.alpha.white[50]};
        width: ${theme.spacing(6)};
        height: ${theme.spacing(6)};
        border-radius: 100px;
        transition: ${theme.transitions.create(['background', 'color'])};

        &:hover {
          color: ${theme.colors.alpha.white[100]};
          background: ${theme.colors.alpha.white[10]};
        }
`
)

const LogoWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    left: ${theme.spacing(4)};
    top: ${theme.spacing(4)};
`
)

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[100]};
`
)

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[70]};
`
)

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
      background: ${theme.colors.alpha.white[10]};
`
)

const ListItemTextWrapper = styled(ListItemText)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[70]};
`
)
const ListItemIconWrapper = styled(ListItemIcon)(
  ({ theme }) => `
      color: ${theme.colors.success.main};
      min-width: 32px;
`
)

const SwiperWrapper = styled(Box)(
  ({ theme }) => `
      .swiper-pagination {
        .swiper-pagination-bullet {
          background: ${theme.colors.alpha.white[30]};
          opacity: 1;
          transform: scale(1);

          &.swiper-pagination-bullet-active {
            background: ${theme.colors.alpha.white[100]};
            width: 16px;
            border-radius: 6px;
          }
        }
      }
`
)

function RegisterCover() {
  const { t }: { t: any } = useTranslation()

  return (
    <>
      <Head>
        <title>Register - Cover</title>
      </Head>
      <Content>
        <Hidden mdDown>
          <SidebarWrapper>
            <Scrollbars universal autoHide>
              <SidebarContent>
                <Box mb={2} display="flex" justifyContent="center">
                  <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                    <ChevronLeftTwoToneIcon fontSize="large" />
                  </SwipeIndicator>
                  <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                    <ChevronRightTwoToneIcon fontSize="large" />
                  </SwipeIndicator>
                </Box>
                <TypographyPrimary align="center" variant="h3" sx={{ mb: 4, px: 8 }}>
                  {t('Fortune 500 Companies')}
                </TypographyPrimary>
                <SwiperWrapper>
                  <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop
                    navigation={{
                      nextEl: '.MuiSwipe-right',
                      prevEl: '.MuiSwipe-left',
                    }}
                    pagination={{ dynamicBullets: true, clickable: true }}>
                    <SwiperSlide>
                      <Box textAlign="center">
                        <CardImg>
                          <img height={80} alt="UiPath" src={icons.UiPath} />
                        </CardImg>
                        <TypographyPrimary align="center" variant="h3" sx={{ mb: 2 }}>
                          UiPath
                        </TypographyPrimary>
                        <TypographySecondary align="center" variant="subtitle2" sx={{ mb: 5 }}>
                          UiPath streamlines processes, uncovers efficiencies and provides insights, making the path to
                          digital transformation fast and cost-effective.
                        </TypographySecondary>
                      </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                      <Box textAlign="center">
                        <CardImg>
                          <img height={80} alt="EA" src={icons.Ea} />
                        </CardImg>
                        <TypographyPrimary align="center" variant="h3" sx={{ mb: 2 }}>
                          Electronic Arts
                        </TypographyPrimary>
                        <TypographySecondary align="center" variant="subtitle2" sx={{ mb: 5 }}>
                          We exist to inspire the world through Play. Electronic Arts is a leading publisher of games on
                          Console, PC and Mobile.
                        </TypographySecondary>
                      </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                      <Box textAlign="center">
                        <CardImg>
                          <img height={80} alt="Autodesk" src={icons.Autodesk} />
                        </CardImg>
                        <TypographyPrimary align="center" variant="h3" sx={{ mb: 2 }}>
                          Autodesk
                        </TypographyPrimary>
                        <TypographySecondary align="center" variant="subtitle2" sx={{ mb: 5 }}>
                          Autodesk is a global leader in design and make technology, with expertise across architecture,
                          engineering, construction, design, manufacturing.
                        </TypographySecondary>
                      </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                      <Box textAlign="center">
                        <CardImg>
                          <img height={80} alt="Adobe" src={icons.Adobe} />
                        </CardImg>
                        <TypographyPrimary align="center" variant="h3" sx={{ mb: 2 }}>
                          Adobe
                        </TypographyPrimary>
                        <TypographySecondary align="center" variant="subtitle2" sx={{ mb: 5 }}>
                          Adobe is changing the world through digital experiences. We help our customers create, deliver
                          and optimize content and applications.
                        </TypographySecondary>
                      </Box>
                    </SwiperSlide>
                  </Swiper>
                </SwiperWrapper>

                <DividerWrapper sx={{ my: 3 }} />
                <List dense sx={{ mb: 3 }}>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary={t('premium features included')}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary={t('no credit card required')}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary={t('modern development solutions')}
                    />
                  </ListItem>
                </List>
              </SidebarContent>
            </Scrollbars>
          </SidebarWrapper>
        </Hidden>
        <MainContent>
          <Hidden smDown>
            <LogoWrapper>
              <Logo />
            </LogoWrapper>
          </Hidden>
          <Container maxWidth="sm">
            <Card sx={{ px: 4, py: 5 }}>
              <Box textAlign="center">
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {t('Create account')}
                </Typography>
                <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 3 }}>
                  {t('Fill in the fields below to sign up for an account.')}
                </Typography>
              </Box>
              <RegisterForm />
              <Box mt={4}>
                <Typography component="span" variant="subtitle2" color="text.primary" fontWeight="bold">
                  {t('Already have an account?')}
                </Typography>{' '}
                <Link underline="hover" href="/account/login-cover">
                  <b>Sign in here</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </MainContent>
      </Content>
    </>
  )
}

export default RegisterCover

RegisterCover.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>
}

/* eslint-disable no-use-before-define */
import { alpha, Box, darken, lighten, List, ListSubheader } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import SidebarMenuItem from './item'
import menuItems, { MenuItem } from './items'

// import { MenuItem } from './items'
const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    margin-bottom: ${theme.spacing(0.5)};
    padding: 0;

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(2)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(11)};
      color: ${lighten(theme.sidebar.menuItemHeadingColor, 0.3)};
      padding: ${theme.spacing(1, 3.2)};
      line-height: 1.4;
    }
`
)

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding: 0;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 3px ${theme.spacing(2)};
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          justify-content: flex-start;
          font-size: ${theme.typography.pxToRem(13)};
          padding-top: ${theme.spacing(1)};
          padding-bottom: ${theme.spacing(1)};
          position: relative;
          font-weight: normal;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(4)};

            .MuiBadge-standard {
              background: ${theme.colors.primary.main};
              font-size: ${theme.typography.pxToRem(9)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.palette.primary.contrastText};
            }
          }
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            transition: ${theme.transitions.create(['all'])};
            border-radius: ${theme.general.borderRadius};
            background: ${lighten(theme.sidebar.menuItemBgActive, 0.05)};
            box-shadow: 0px 2px 4px 0 ${alpha(darken(theme.sidebar.menuItemIconColor, 0.2), 0.6)};
            font-size: ${theme.typography.pxToRem(18)};
            margin-right: ${theme.spacing(1.5)};
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${lighten(theme.sidebar.menuItemIconColorActive, 0.3)};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            font-size: ${theme.typography.pxToRem(22)};
          }

          &.Mui-active,
          &:hover {
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemColorActive};
            }
          }

          &.Mui-active {
            background-color: ${alpha(theme.sidebar.menuItemBgActive, 0.8)};
            box-shadow: 0px 2px 4px ${alpha(darken(theme.sidebar.menuItemBg, 0.35), 0.8)}, 0px 1px 8px 0px ${alpha(
    darken(theme.sidebar.menuItemBg, 0.35),
    0.3
  )};
            color: ${theme.sidebar.menuItemColorActive};
            font-weight: bold;


            .MuiButton-startIcon {
                background: ${theme.colors.primary.main};
                color: ${theme.palette.primary.contrastText};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;
          line-height: 1;

          & > .MuiButton-root {
            .MuiBadge-root {
              right: ${theme.spacing(7)};
            }
          }
      }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px ${theme.spacing(0)};

            .MuiButton-root {
              font-size: ${theme.typography.pxToRem(13)};
              padding: ${theme.spacing(0.5, 2, 0.5, 7.5)};

              &.Mui-active,
              &:hover {
                box-shadow: none;
                background-color: ${theme.sidebar.menuItemBg};
              }
            }
          }
        }
      }
    }
`
)

const renderSidebarMenuItems = ({ items, path }: { items: MenuItem[]; path: string }): JSX.Element => (
  <SubMenuWrapper>
    <List component="div">{items.reduce((ev, item) => ReduceChildRoutes({ ev, item, path }), [])}</List>
  </SubMenuWrapper>
)

const ReduceChildRoutes = ({
  ev,
  path,
  item,
}: {
  ev: JSX.Element[]
  path: string
  item: MenuItem
}): Array<JSX.Element> => {
  const key = item.name
  const router = useRouter()

  if (item.items) {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={router.pathname === item.link}
        open={router.pathname === item.link}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}>
        {renderSidebarMenuItems({
          path,
          items: item.items,
        })}
      </SidebarMenuItem>
    )
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={router.pathname === item.link}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
      />
    )
  }

  return ev
}

// function SidebarMenu({ fetching, error, allMenuItems }) {
// const SidebarMenu = ({ allMenuItems }) => {
// const SidebarMenu = ({ fetching, allMenuItems }) => {
// const SidebarMenu = ({ fetching }) => {
const SidebarMenu = () => {
  const router = useRouter()
  const { t }: { t: any } = useTranslation()

  // const [items, setItems] = useState([])
  // useEffect(() => {
  //   if (items.length === allMenuItems.length) return

  //   setItems(allMenuItems)
  // }, [allMenuItems, items])
  return (
    <>
      {/* {fetching ? (
        <Grid sx={{ py: 10 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item>
            <CircularProgress color="secondary" size="1rem" />
          </Grid>
        </Grid>
      ) : (
        <> */}
      {/* {allMenuItems?.map((section) => ( */}
      {menuItems?.map((section) => (
        <MenuWrapper key={section.heading}>
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {t(section.heading)}
              </ListSubheader>
            }>
            {renderSidebarMenuItems({
              items: section.items,
              path: router.pathname,
            })}
          </List>
        </MenuWrapper>
      ))}
      {/* </>
      )} */}
    </>
  )
}

SidebarMenu.propTypes = {
  allMenuItems: PropTypes.array.isRequired,
  // PropTypes.shape({
  // address: PropTypes.string.isRequired,
  // generated: PropTypes.string.isRequired,
  // balance: PropTypes.string.isRequired,
  // }).isRequired,
  fetching: PropTypes.bool.isRequired,
}

export default SidebarMenu

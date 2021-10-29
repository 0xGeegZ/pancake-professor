import { ListSubheader, Box, List } from '@mui/material'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import menuItems, { MenuItem } from './items'
import SidebarMenuItem from './item'

const MenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      margin-bottom: ${theme.spacing(0.5)};
      padding: 0;

      & > .MuiList-root {
        padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
      }
    }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(11)};
      color: ${theme.colors.primary.main};
      padding: ${theme.spacing(0.8, 2)};
      line-height: 1.4;
    }
`
)

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 2px;
        padding-left: ${theme.spacing(0)};
        padding-right: ${theme.spacing(2)};

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
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          justify-content: flex-start;
          font-size: ${theme.typography.pxToRem(13)};
          padding-top: ${theme.spacing(0.8)};
          padding-left: ${theme.spacing(3)};
          padding-bottom: ${theme.spacing(0.8)};
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
          border-bottom-right-radius: 50px;
          border-top-right-radius: 50px;
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(26)};
            margin-right: ${theme.spacing(1.5)};
            color: ${theme.sidebar.menuItemIconColor};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            font-size: ${theme.typography.pxToRem(22)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemIconColorActive};
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
            padding: 1px;
            padding-left: ${theme.spacing(0)};
            padding-right: ${theme.spacing(0)};

            .MuiButton-root {
              padding: ${theme.spacing(0.3, 2, 0.3, 7.5)};
              font-weight: normal;

              &.Mui-active,
              &:hover {
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
    <List component="div">{items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}</List>
  </SubMenuWrapper>
)

const reduceChildRoutes = ({
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

function SidebarMenu() {
  const router = useRouter()
  const { t }: { t: any } = useTranslation()

  return (
    <>
      {menuItems.map((section) => (
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
    </>
  )
}

export default SidebarMenu

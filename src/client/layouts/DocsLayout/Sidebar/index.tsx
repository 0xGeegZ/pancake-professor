import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'
import { Box, List, ListItem, ListItemText,Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Link from 'src/client/components/Link'

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
  padding-top: ${theme.spacing(10)};
  width: ${theme.sidebar.width};
  color: ${theme.sidebar.textColor};
  background: ${theme.colors.alpha.white[100]};
  box-shadow: ${theme.sidebar.boxShadow};
  height: 100%;
  position: relative;
  z-index: 5;
`
)

const ListWrapper = styled(List)(
  ({ theme }) => `
  .MuiListItem-button {
    margin: ${theme.spacing(0.5)} 0;
    color: ${theme.colors.alpha.black[70]};

    &:first-of-type {
      margin-top: 0;
    }

    &:hover {
      background-color: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
    }
    
    &.Mui-selected {
      color: ${theme.colors.alpha.black[100]};
    }
  }
`
)

const links = [
  { id: '1', title: 'Introduction', url: '/docs' },
  { id: '2', title: 'Installation', url: '/docs/installation' },
  { id: '5', title: 'Dependencies', url: '/docs/dependencies' },
  {
    id: '13',
    title: 'Themes Customization',
    url: '/docs/themes-customization',
  },
  { id: '9', title: 'Routing', url: '/docs/routing' },
  { id: '7', title: 'Internationalization', url: '/docs/internationalization' },
  { id: '10', title: 'RTL Layout', url: '/docs/rtl-layout' },
  { id: '11', title: 'Server Requests', url: '/docs/server-requests' },
  { id: '3', title: 'Changelog', url: '/docs/changelog' },
  { id: '4', title: 'Contact Support', url: '/docs/contact-support' },
]

function Sidebar() {
  return (
    <SidebarWrapper>
      <Scrollbars universal autoHide>
        <Typography component="div" fontWeight="bold" color="text.primary" sx={{ pt: 2, px: 2 }} variant="caption">
          Documentation
        </Typography>
        <ListWrapper sx={{ p: 2 }}>
          {links.map((link) => (
            <ListItem
              sx={{ pr: 0.5 }}
              key={link.id}
              button
              activeClassName="Mui-selected"
              component={Link}
              href={link.url}>
              <ListItemText primaryTypographyProps={{ variant: 'h4' }} primary={link.title} />
              <ChevronRightTwoToneIcon />
            </ListItem>
          ))}
        </ListWrapper>
      </Scrollbars>
    </SidebarWrapper>
  )
}

export default Sidebar

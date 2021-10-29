import { Box, Card, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
`
)

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">&copy; 2021 - Pancake Professor</Typography>
        </Box>
        <Typography sx={{ pt: { xs: 2, md: 0 } }} variant="subtitle1">
          Crafted by{' '}
          <Link underline="hover" href="#" target="_blank" rel="noopener noreferrer">
            Pancake Professor
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  )
}

export default Footer

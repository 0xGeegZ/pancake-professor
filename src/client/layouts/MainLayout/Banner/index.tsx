import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const BannerWrapper = styled(Box)(
  ({ theme }) => `
        background-color: ${theme.colors.warning.main};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        position: relative;
        justify-content: center;
        width: 100%;
`
)

const Banner = ({ networkId }) => {
  const { t }: { t: any } = useTranslation()
  return (
    <BannerWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography align="center" component="span" variant="h6" color="text.secondary" fontWeight="bold">
          {t(
            `Please choose Network id 56 for production (mainnet) and 97 for developpement (testnet) - current : ${networkId}`
          )}
        </Typography>
      </Box>
    </BannerWrapper>
  )
}

export default Banner

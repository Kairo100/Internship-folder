import { CardContent, Typography, Divider, Card, Grid, Box } from '@mui/material'

import { format } from 'date-fns'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import { TOrganisation } from 'src/types/organisations'

interface ColorsType {
  [key: string]: ThemeColor
}

const OrganisationStatusType: ColorsType = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'error'
}

type Props = {
  organisationData: TOrganisation
}

const OrganisationLeftSide = ({ organisationData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {organisationData && (
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar
                skin='light'
                variant='rounded'
                // color={organisationData.avatarColor as ThemeColor}
                sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
              >
                {organisationData.organisation_name && getInitials(organisationData.organisation_name)}
              </CustomAvatar>

              <Typography variant='h4' sx={{ mb: 3 }}>
                {organisationData.organisation_name}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={organisationData.account_status}
                color={OrganisationStatusType[organisationData.account_status]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Details
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>ID:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{organisationData.organisation_id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{organisationData.organisation_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Phone Number:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{organisationData.phone_number}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {organisationData.email_address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Address:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{organisationData.address}</Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Country:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{organisationData.country}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Website:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {organisationData.website_address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Date added:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {format(new Date(organisationData.date_time_added), 'MMMM do yyyy')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

export default OrganisationLeftSide

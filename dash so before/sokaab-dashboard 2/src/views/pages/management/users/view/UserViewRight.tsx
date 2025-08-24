import { SyntheticEvent, useState } from 'react'
import { Box, Typography, CircularProgress, styled, Tab as MuiTab, TabProps } from '@mui/material'
import { TabPanel, TabContext, TabList as MuiTabList, TabListProps } from '@mui/lab'

import Accounts from './Accounts'
import Icon from 'src/@core/components/icon'

// interface Props {
//   tab: string
//   invoiceData: InvoiceType[]
// }

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const UserViewRight = () => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>('accounts')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    setIsLoading(false)
  }

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='accounts' label='Accounts' icon={<Icon fontSize='1.125rem' icon='tabler:building-bank' />} />
        <Tab value='activity_logs' label='Activity Logs' icon={<Icon fontSize='1.125rem' icon='tabler:activity' />} />
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='accounts'>
              <Accounts />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='activity_logs'>
              <Accounts />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default UserViewRight

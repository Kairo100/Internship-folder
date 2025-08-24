import { SyntheticEvent, useState } from 'react'
import { Box, Typography, CircularProgress, styled, Tab as MuiTab, TabProps } from '@mui/material'
import { TabPanel, TabContext, TabList as MuiTabList, TabListProps } from '@mui/lab'

// import Accounts from './Accounts'
import Icon from 'src/@core/components/icon'
import ProjectSummary from './Right/Summary'
import ProjectStory from './Right/Story'
import { IProject } from 'src/types/projects'
import ProjectAccounts from './Right/Accounts'
import ProjectCommittees from './Right/Committees'
import ProjectFiles from './Right/Files'
import ProjectTransactions from './Right/Transactions'
import InkindDonations from './Right/InkindDonations'

import ProjectDocuments from './Right/ProjectDocuments' // <--- IMPORT THE NEW COMPONENT


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

type Props = {
  projectId: number
  projectData: IProject
}

const ProjectRightSide = ({ projectId, projectData }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>('summary')
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
        {/* receipt */}
        {/* <Tab value='summary' label='Summary' icon={<Icon fontSize='1.125rem' icon='tabler:file-pencil' />} />
        <Tab value='story' label='Story' icon={<Icon fontSize='1.125rem' icon='tabler:note' />} />
        <Tab value='accounts' label='Accounts' icon={<Icon fontSize='1.125rem' icon='tabler:coin' />} />
        <Tab value='files' label='Images' icon={<Icon fontSize='1.125rem' icon='tabler:photo' />} />
        <Tab value='owners' label='Committees' icon={<Icon fontSize='1.125rem' icon='tabler:affiliate' />} />
        <Tab value='transactions' label='Transactions' icon={<Icon fontSize='1.125rem' icon='tabler:affiliate' />} />
        <Tab value='inkind' label='In Kind Donations' icon={<Icon fontSize='1.125rem' icon='tabler:affiliate' />} /> */}

        <Tab value='summary' label='Summary' icon={<Icon fontSize='1.125rem' icon='tabler:clipboard-list' />} />
        <Tab value='story' label='Story' icon={<Icon fontSize='1.125rem' icon='tabler:book' />} />
        <Tab value='accounts' label='Accounts' icon={<Icon fontSize='1.125rem' icon='tabler:credit-card' />} />
        <Tab value='files' label='Images' icon={<Icon fontSize='1.125rem' icon='tabler:photo' />} />
        <Tab value='owners' label='Committees' icon={<Icon fontSize='1.125rem' icon='tabler:users' />} />
        <Tab value='transactions' label='Transactions' icon={<Icon fontSize='1.125rem' icon='tabler:exchange' />} />
        <Tab value='inkind' label='In Kind Donations' icon={<Icon fontSize='1.125rem' icon='tabler:gift' />} />
         <Tab value='documents' label='Documents' icon={<Icon fontSize='1.125rem' icon='tabler:file-text' />} /> {/* <--- ADD THIS TAB */}



        {/* <Tab value='contributers' label='Contributers' icon={<Icon fontSize='1.125rem' icon='tabler:report-money' />} />
        <Tab value='lead' label='Lead' icon={<Icon fontSize='1.125rem' icon='tabler:activity' />} /> */}
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='summary'>
              <ProjectSummary projectId={projectId} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='story'>
              <ProjectStory projectData={projectData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='files'>
              <ProjectFiles projectId={projectId} projectData={projectData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='accounts'>
              <ProjectAccounts projectId={projectId} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='owners'>
              <ProjectCommittees projectId={projectId} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='transactions'>
              <ProjectTransactions projectId={projectId} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='inkind'>
              <InkindDonations projectId={projectId} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='documents'> {/* <--- ADD THIS TAB PANEL */}
              <ProjectDocuments projectId={projectId} />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default ProjectRightSide

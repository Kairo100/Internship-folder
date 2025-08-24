import { useState, MouseEvent } from 'react'
import { useRouter } from 'next/router'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  CardContent,
  MenuItem,
  CardHeader,
  Divider,
  IconButton,
  Menu
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'

interface CellType {
  row: any
}

const SubmissionStatusObj: any = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'danger'
}

const SubmissionRoleObj: any = {
  // admin: { icon: 'tabler:device-laptop', color: 'primary' },
  // author: { icon: 'tabler:circle-check', color: 'success' },
  // editor: { icon: 'tabler:edit', color: 'info' },
  // maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  // subscriber: { icon: 'tabler:submission', color: 'warning' }

  admin: { icon: 'tabler:device-laptop', color: 'success' },
  other: { icon: 'tabler:circle-check', color: 'info' }
}

// const dummySubmissionData: ISubmission[] = [
//   {
//     id: 1,
//     submission_uid: 'US_02',
//     full_name: 'Abokor Hassan',
//     submissionname: 'abokor',
//     email: 'abokor@gmail.com',
//     phone_number: '+252634253226',
//     gender: 'Male',
//     avatar: '',
//     address: 'Road Number 1, Near Burj Omar',
//     city: 'Hargeisa',
//     state: 'Maroodi Jeex',
//     country: 'Somaliland',
//     identity_type: 'Client',
//     role: 'admin',
//     status: 'Pending',
//     created_at: '12/Sep/2023'
//   }
// ]

const dummySubmissionData: any = [
  // {
  //   id: 1,
  //   submission_uid: 'US_02',
  //   full_name: 'Abokor Hassan',
  //   submissionname: 'abokor',
  //   email: 'abokor@gmail.com',
  //   phone_number: '+252634253226',
  //   gender: 'Male',
  //   avatar: '',
  //   address: 'Road Number 1, Near Burj Omar',
  //   city: 'Hargeisa',
  //   state: 'Maroodi Jeex',
  //   country: 'Somaliland',
  //   identity_type: 'Client',
  //   role: 'admin',
  //   status: 'Pending',
  //   created_at: '12/Sep/2023'
  // },
  {
    id: 1,
    submission_id: '2823',
    title: '30 Minutes Production',
    funding_goal: '3003',
    status: 'Active',
    submitted_date: '12/Sep/2023'
  },

  {
    id: 2,
    submission_id: '5467',
    title: 'Afri-Tech',
    funding_goal: '23444',
    status: 'Pending',
    submitted_date: '12/Sep/2023'
  }
]

const ActionColumn = ({ id }: { id: number | string }) => {
  // ** Hooks
  const router = useRouter()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Var
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleView = () => {
    // router.push('/submissions/[submissionId]/view', `/submissions/${id}/view`)
    // handleRowOptionsClose()
  }

  const handleUpdate = () => {
    // router.push('/submissions/[submissionId]/update', `/submissions/${id}/update`)
    // handleRowOptionsClose()
  }

  const handleDelete = () => {
    // dispatch(deleteSubmission(id))
    // handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        {/* <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/submission/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem> */}
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleView}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleUpdate} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns: GridColDef[] = [
  {
    flex: 1,
    disableColumnMenu: true,
    headerName: 'ID',
    field: 'submission_id',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.submission_id}
        </Typography>
      )
    }
  },

  {
    flex: 1.3,
    disableColumnMenu: true,
    headerName: 'Title',
    field: 'title',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.title}
        </Typography>
      )
    }
  },

  {
    flex: 1,
    disableColumnMenu: true,
    headerName: 'Funding Goal',
    field: 'funding_goal',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.funding_goal}
        </Typography>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 110,
    disableColumnMenu: true,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.status}
          color={SubmissionStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },

  {
    flex: 1,
    disableColumnMenu: true,
    headerName: 'Submitted Date',
    field: 'submitted_date',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.submitted_date}
        </Typography>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <ActionColumn id={row.submission_uid} />
  }
]

const Submissions = () => {
  // ** State
  const [accountType] = useState<string>('')
  const [statusFilter] = useState<string>('')
  const [textSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const router = useRouter()

  // ** Var
  const store: any[] = dummySubmissionData

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Project Submissions</Typography>} />
        <Grid item xs={12}>
          <Card>
            {/* Filters */}
            <>
              <CardHeader title='Filters' />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item sm={4} xs={12}>
                    <CustomTextField
                      select
                      fullWidth
                      SelectProps={{
                        value: statusFilter,
                        displayEmpty: true
                      }}
                    >
                      <MenuItem value=''>Select Status</MenuItem>
                      <MenuItem value='active'>Active</MenuItem>
                      <MenuItem value='pending'>Pending</MenuItem>
                    </CustomTextField>
                  </Grid>
                </Grid>
              </CardContent>
            </>

            <Divider sx={{ m: '0 !important' }} />

            {/* Table Actions */}
            <Box
              sx={{
                py: 4,
                px: 6,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
                Export
              </Button>
              <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <CustomTextField
                  value={textSearch}
                  sx={{ mr: 4 }}
                  placeholder='search...'

                  // onChange={e => handleFilter(e.target.value)}
                />

                <Button
                  // onClick={() => router.push('/submissions/add')}
                  variant='contained'
                  sx={{ '& svg': { mr: 2 } }}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Add Submission
                </Button>
              </Box>
            </Box>

            {/* Table */}
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={store}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Submissions

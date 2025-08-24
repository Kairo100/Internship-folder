import { useState, MouseEvent, useEffect } from 'react'
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
  Menu,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Dialog as ConfirmDialog,
  Chip,
  DialogActions,
  CircularProgress,
  DialogContentText,
  Switch
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { reject } from 'lodash'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import useApi from 'src/hooks/useApi'
import { approveUpdate, fetchUpdates } from 'src/apis/projects'
import { format } from 'date-fns'

interface CellType {
  row: any
}

const ActionColumn = ({
  row,
  onApprovalChange
}: {
  row: any
  onApprovalChange?: (id: number, approved: boolean) => void
}) => {
  // ** State
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingApprovalStatus, setPendingApprovalStatus] = useState(false)
  const [isApproved, setIsApproved] = useState(row.approved)

  // ** Hooks
  // const { apiCall: approveUpdateApiCall } = useApi()
  const {
    isLoading: approveUpdateLoadingApi,
    error: approveUpdateErrorApi,
    data: approveUpdateApiData,
    apiCall: approveUpdateApiCall,
    clearStates: approveUpdateClearStates
  } = useApi()

  // ** Var

  const approveUpdateLoadingToast = toast

  // Handle opening details
  const handleOpenDetails = () => {
    console.log('666')
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
  }

  // Handle Switch Change - Open Confirmation Dialog
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApprovedStatus = event.target.checked
    setPendingApprovalStatus(newApprovedStatus)
    setConfirmDialogOpen(true)
  }

  // Confirm Approval
  const handleConfirmApproval = async () => {
    try {
      await approveUpdateApiCall(approveUpdate(row.update_id, row.project_id, pendingApprovalStatus))
    } catch (error) {
      toast.error('Failed to update approval status')
    }
  }

  // Cancel Approval
  const handleCancelApproval = () => {
    setConfirmDialogOpen(false)
  }

  // Api Success handling
  useEffect(() => {
    if (approveUpdateApiData) {
      // Update local state
      setIsApproved(pendingApprovalStatus)
      // Call callback to update parent component if provided
      onApprovalChange?.(row.update_id, pendingApprovalStatus)
      // Show success toast
      toast.success(`Update ${pendingApprovalStatus ? 'approved' : 'declined'}`)
      // Close confirmation dialog
      setConfirmDialogOpen(false)

      // approveUpdateClearStates()
      // approveUpdateLoadingToast.success('Status updated successfully', {
      //   duration: 2000
      // })
    }
  }, [approveUpdateApiData])

  // Api Error handling
  useEffect(() => {
    if (approveUpdateErrorApi) {
      // setPublishProject(!publishProject)
      approveUpdateLoadingToast.error(approveUpdateErrorApi, { duration: 2000 })
      setConfirmDialogOpen(false)
    }

    const timer = setTimeout(() => {
      if (approveUpdateErrorApi) approveUpdateClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [approveUpdateErrorApi])

  return (
    <>
      {/* Inline action icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* View Details */}
        <Tooltip title='View Details'>
          <IconButton size='small' color='info' onClick={handleOpenDetails}>
            <Icon icon='tabler:eye' />
          </IconButton>
        </Tooltip>

        {/* Approval Switch */}
        <Tooltip title={isApproved ? 'Approved' : 'Not Approved'} placement='left'>
          <Switch checked={isApproved} onChange={handleSwitchChange} color={isApproved ? 'success' : 'error'} />
        </Tooltip>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelApproval} aria-labelledby='approval-confirmation-dialog'>
        <DialogTitle id='approval-confirmation-dialog'>
          Confirm {pendingApprovalStatus ? 'Approval' : 'Decline'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {pendingApprovalStatus ? 'approve' : 'decline'} this update? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelApproval} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApproval}
            color={pendingApprovalStatus ? 'success' : 'error'}
            variant='contained'
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detailed View Dialog - Previous implementation remains the same */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: '800px',
            backgroundColor: 'background.paper',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 3
          }}
        >
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            {row.update_title}
          </Typography>
          <IconButton
            onClick={handleCloseDetails}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Image Section - Fixed Size */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  width: '19rem',
                  height: '19rem',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <img
                  src={row.picture_url}
                  alt={row.update_title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>

            {/* Details Section */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  height: '100%'
                }}
              >
                {/* Description */}
                <Box>
                  <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                    Description
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6
                    }}
                  >
                    {row.description}
                  </Typography>
                </Box>

                {/* Metadata Chips */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Chip
                    label={`Posted: ${format(new Date(row.date_time_added), 'MMM do, yyyy')}`}
                    icon={<Icon icon='tabler:calendar' />}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                  <Chip
                    label={isApproved ? 'Approved' : 'Not Approved'}
                    icon={<Icon icon={isApproved ? 'tabler:check' : 'tabler::circle-x'} />}
                    color={isApproved ? 'success' : 'error'}
                    size='small'
                    variant='outlined'
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

const Updates = () => {
  // ** State
  const [accountType] = useState<string>('')
  const [statusFilter] = useState<string>('')
  const [textSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [updatesRowsData, setUpdatesRowsData] = useState<any>({
    data: [],
    rowsCount: 0
  })

  const [selectedID, setSelectedID] = useState<number | null>(null)

  // ** Hooks
  const router = useRouter()
  const {
    isLoading: fetchUpdatesApiLoading,
    error: fetchUpdatesApiError,
    data: fetchUpdatesApiData,
    apiCall: fetchUpdatesApiCall
  } = useApi()

  // ** Var
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'update_id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.update_id}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Update Title',
      field: 'update_title',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.update_title}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Description',
      field: 'description',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.description}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      minWidth: 110,
      disableColumnMenu: true,
      field: 'approved',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return row.approved ? (
          <CustomChip skin='light' color='success' label='Approved' icon={<Icon icon='tabler:check' />} />
        ) : (
          // <CustomChip skin='light' color='error' label='Not Approved' icon={<Icon icon='tabler:clock' />} />
          <CustomChip skin='light' color='error' label='Not Approved' icon={<Icon icon='tabler:circle-x' />} />
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Posted Date',
      field: 'date_time_added',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {/* {row.date_time_added} */}
            {format(new Date(row.date_time_added), 'MMMM do yyyy')}
          </Typography>
        )
      }
    },

    // {
    //   flex: 0.1,
    //   minWidth: 110,
    //   disableColumnMenu: true,
    //   field: 'approved',
    //   headerName: 'Status',
    //   renderCell: ({ row }: CellType) => {
    //     return row.approved ? (
    //       <Icon icon='tabler:circle-check' color='green' style={{ cursor: 'help' }} title='Approved' />
    //     ) : (
    //       <Icon icon='tabler:circle-x' color='red' style={{ cursor: 'help' }} title='Not Approved' />
    //     )
    //   }
    // },

    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: ({ row }: CellType) => <ActionColumn id={row.update_uid} />
    // }

    {
      flex: 1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <ActionColumn row={row} onApprovalChange={handleApprovalChange} />
    }
  ]

  // Handler to update rows after approval
  const handleApprovalChange = (id: number, approved: boolean) => {
    // Update the specific row's approved status
    setUpdatesRowsData((prev: any) => ({
      ...prev,
      data: prev.data.map((item: any) => (item.update_id === id ? { ...item, approved } : item))
    }))
  }

  // Calling Api
  useEffect(() => {
    const fetchData = async () => {
      if (fetchUpdatesApiCall)
        await fetchUpdatesApiCall(
          fetchUpdates({
            skip: paginationModel.page + 1,
            take: paginationModel.pageSize,
            search: textSearch
            // ...filters
          })
        )
    }
    fetchData()
  }, [paginationModel, textSearch])

  // Api Success Handling
  useEffect(() => {
    if (fetchUpdatesApiData)
      setUpdatesRowsData({ data: fetchUpdatesApiData.data, rowsCount: fetchUpdatesApiData.rowsCount })

    if (selectedID) {
      const newData = reject(updatesRowsData.data, { update_id: Number(selectedID) })
      const newRow = updatesRowsData.rowsCount - 1
      setUpdatesRowsData({ data: newData, rowsCount: newRow })
    }

    return () => {
      if (selectedID) setSelectedID(null)
    }
  }, [fetchUpdatesApiData, selectedID])

  // Api Error handling
  useEffect(() => {
    if (fetchUpdatesApiError)
      toast.error(fetchUpdatesApiError, {
        duration: 3000
      })
  }, [fetchUpdatesApiError])

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Project Updates</Typography>} />
        <Grid item xs={12}>
          <Card>
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
              </Box>
            </Box>

            {/* Table */}
            {/* <DataGrid
              autoHeight
              rowHeight={62}
              rows={store}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            /> */}
            <DataGrid
              autoHeight
              rowHeight={62}
              getRowId={(row: any) => row.update_id}
              rows={updatesRowsData.data}
              columns={columns}
              loading={fetchUpdatesApiLoading}
              paginationMode='server'
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={updatesRowsData.rowsCount}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Updates

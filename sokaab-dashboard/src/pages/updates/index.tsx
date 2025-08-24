import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  CardContent,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  DialogActions,
  CircularProgress,
  DialogContentText,
  Switch,
  FormControl,
  InputLabel,
  Select,
  Badge,
  TextField
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { reject } from 'lodash'
import { format } from 'date-fns'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import useApi from 'src/hooks/useApi'
import { approveUpdate, fetchUpdates, deleteUpdate } from 'src/apis/projects'

interface CellType {
  row: any
}

interface UpdatesRowsData {
  data: any[]
  rowsCount: number
}

const ActionColumn = ({
  row,
  onApprovalChange,
  onDelete
}: {
  row: any
  onApprovalChange?: (id: number, approved: boolean) => void
  onDelete?: (id: number) => void
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pendingApprovalStatus, setPendingApprovalStatus] = useState(false)
  const [isApproved, setIsApproved] = useState(row.approved)

  const {
    isLoading: approveUpdateLoadingApi,
    error: approveUpdateErrorApi,
    data: approveUpdateApiData,
    apiCall: approveUpdateApiCall,
    clearStates: approveUpdateClearStates
  } = useApi()

  const {
    isLoading: deleteUpdateLoadingApi,
    error: deleteUpdateErrorApi,
    data: deleteUpdateApiData,
    apiCall: deleteUpdateApiCall,
    clearStates: deleteUpdateClearStates
  } = useApi()

  const handleOpenDetails = () => setDetailsOpen(true)
  const handleCloseDetails = () => setDetailsOpen(false)

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApprovedStatus = event.target.checked
    setPendingApprovalStatus(newApprovedStatus)
    setConfirmDialogOpen(true)
  }

  const handleDeleteClick = () => setDeleteDialogOpen(true)

  const handleConfirmApproval = async () => {
    try {
      await approveUpdateApiCall(approveUpdate(row.update_id, row.project_id, pendingApprovalStatus))
    } catch (error) {
      toast.error('Failed to update approval status')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteUpdateApiCall(deleteUpdate(row.update_id))
    } catch (error) {
      toast.error('Failed to delete update')
    }
  }

  const handleCancelApproval = () => setConfirmDialogOpen(false)
  const handleCancelDelete = () => setDeleteDialogOpen(false)

  useEffect(() => {
    if (approveUpdateApiData) {
      setIsApproved(pendingApprovalStatus)
      onApprovalChange?.(row.update_id, pendingApprovalStatus)
      toast.success(`Update ${pendingApprovalStatus ? 'approved' : 'declined'}`)
      setConfirmDialogOpen(false)
    }
  }, [approveUpdateApiData, pendingApprovalStatus, onApprovalChange, row.update_id])

  useEffect(() => {
    if (deleteUpdateApiData) {
      onDelete?.(row.update_id)
      toast.success('Update deleted successfully')
      setDeleteDialogOpen(false)
    }
  }, [deleteUpdateApiData, onDelete, row.update_id])

  useEffect(() => {
    if (approveUpdateErrorApi) {
      toast.error(approveUpdateErrorApi)
      setConfirmDialogOpen(false)
    }
    if (deleteUpdateErrorApi) {
      toast.error(deleteUpdateErrorApi)
      setDeleteDialogOpen(false)
    }

    const timer = setTimeout(() => {
      if (approveUpdateErrorApi) approveUpdateClearStates()
      if (deleteUpdateErrorApi) deleteUpdateClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [approveUpdateErrorApi, deleteUpdateErrorApi, approveUpdateClearStates, deleteUpdateClearStates])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title='View Details'>
          <IconButton size='small' color='info' onClick={handleOpenDetails}>
            <Icon icon='tabler:eye' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Delete Update'>
          <IconButton size='small' color='error' onClick={handleDeleteClick}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Tooltip>

        <Tooltip title={isApproved ? 'Approved' : 'Not Approved'} placement='left'>
          <Switch
            checked={isApproved}
            onChange={handleSwitchChange}
            color={isApproved ? 'success' : 'error'}
            disabled={approveUpdateLoadingApi}
          />
        </Tooltip>
      </Box>

      {/* Approval Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelApproval}>
        <DialogTitle>Confirm {pendingApprovalStatus ? 'Approval' : 'Decline'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {pendingApprovalStatus ? 'approve' : 'decline'} this update?
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
            disabled={approveUpdateLoadingApi}
            endIcon={approveUpdateLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>Delete Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this update "{row.update_title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='error'
            variant='contained'
            disabled={deleteUpdateLoadingApi}
            startIcon={<Icon icon='tabler:trash' />}
            endIcon={deleteUpdateLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth='md' fullWidth>
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
          <IconButton onClick={handleCloseDetails}>
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <img
                  src={row.picture_url}
                  alt={row.update_title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {row.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Posted: ${format(new Date(row.date_time_added), 'MMM do, yyyy')}`}
                    icon={<Icon icon='tabler:calendar' />}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                  <Chip
                    label={isApproved ? 'Approved' : 'Not Approved'}
                    icon={<Icon icon={isApproved ? 'tabler:check' : 'tabler:circle-x'} />}
                    color={isApproved ? 'success' : 'error'}
                    size='small'
                    variant='outlined'
                  />
                  <Chip
                    label={`Project ID: ${row.project_id}`}
                    icon={<Icon icon='tabler:hash' />}
                    size='small'
                    color='info'
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
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [textSearch, setTextSearch] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [updatesRowsData, setUpdatesRowsData] = useState<UpdatesRowsData>({
    data: [],
    rowsCount: 0
  })
  const [deletedID, setDeletedID] = useState<number | null>(null)

  const router = useRouter()
  const {
    isLoading: fetchUpdatesApiLoading,
    error: fetchUpdatesApiError,
    data: fetchUpdatesApiData,
    apiCall: fetchUpdatesApiCall
  } = useApi()

  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 80,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'update_id',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 600, color: 'primary.main' }}>
          #{row.update_id}
        </Typography>
      )
    },
    {
      flex: 1.2,
      minWidth: 200,
      disableColumnMenu: true,
      headerName: 'Update Title',
      field: 'update_title',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' sx={{ mr: 3, width: 35, height: 35 }} src={row.picture_url}>
            <Icon icon='tabler:photo' />
          </CustomAvatar>
          <Box>
            <Typography noWrap sx={{ fontWeight: 500, color: 'text.primary' }}>
              {row.update_title}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Project #{row.project_id}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 1.5,
      minWidth: 250,
      disableColumnMenu: true,
      headerName: 'Description',
      field: 'description',
      renderCell: ({ row }: CellType) => {
        const truncatedDescription =
          row.description.length > 100 ? `${row.description.substring(0, 100)}...` : row.description
        return (
          <Tooltip title={row.description} arrow>
            <Typography
              sx={{
                fontWeight: 400,
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}
            >
              {truncatedDescription}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.8,
      minWidth: 120,
      disableColumnMenu: true,
      field: 'approved',
      headerName: 'Status',
      renderCell: ({ row }: CellType) =>
        row.approved ? (
          <CustomChip
            skin='light'
            color='success'
            label='Approved'
            icon={<Icon icon='tabler:check' />}
            sx={{ textTransform: 'capitalize' }}
          />
        ) : (
          <CustomChip
            skin='light'
            color='error'
            label='Pending'
            icon={<Icon icon='tabler:clock' />}
            sx={{ textTransform: 'capitalize' }}
          />
        )
    },
    {
      flex: 0.8,
      minWidth: 140,
      disableColumnMenu: true,
      headerName: 'Posted Date',
      field: 'date_time_added',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2' sx={{ fontWeight: 500 }}>
            {format(new Date(row.date_time_added), 'MMM do, yyyy')}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {format(new Date(row.date_time_added), 'HH:mm')}
          </Typography>
        </Box>
      )
    },
    {
      flex: 1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <ActionColumn row={row} onApprovalChange={handleApprovalChange} onDelete={handleDelete} />
      )
    }
  ]

  const handleApprovalChange = (id: number, approved: boolean) => {
    setUpdatesRowsData(prev => ({
      ...prev,
      data: prev.data.map(item => (item.update_id === id ? { ...item, approved } : item))
    }))
  }

  const handleDelete = (id: number) => {
    setDeletedID(id)
  }

  // Server-side filtering is now handled by the API, so we don't need client-side filtering

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setStatusFilter('')
    setTextSearch('')
    setStartDate('')
    setEndDate('')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (fetchUpdatesApiCall)
        await fetchUpdatesApiCall(
          fetchUpdates({
            skip: paginationModel.page + 1,
            take: paginationModel.pageSize,
            search: textSearch,
            statusFilter: statusFilter,
            dateFrom: startDate,
            dateTo: endDate
          })
        )
    }
    fetchData()
  }, [paginationModel.page, paginationModel.pageSize, textSearch, statusFilter, startDate, endDate])

  useEffect(() => {
    if (fetchUpdatesApiData) {
      setUpdatesRowsData({
        data: fetchUpdatesApiData.data,
        rowsCount: fetchUpdatesApiData.rowsCount
      })
    }
  }, [fetchUpdatesApiData])

  useEffect(() => {
    if (deletedID) {
      // For server-side pagination, refetch the data to get accurate counts
      const fetchData = async () => {
        if (fetchUpdatesApiCall) {
          // If we're on a page > 0 and this might be the last item, go to previous page
          const currentPage = paginationModel.page
          const shouldGoToPreviousPage = currentPage > 0 && updatesRowsData.data.length === 1 // Only one item on current page

          await fetchUpdatesApiCall(
            fetchUpdates({
              skip: shouldGoToPreviousPage ? currentPage : currentPage + 1,
              take: paginationModel.pageSize,
              search: textSearch,
              statusFilter: statusFilter,
              dateFrom: startDate,
              dateTo: endDate
            })
          )

          // Update pagination if we went to previous page
          if (shouldGoToPreviousPage) {
            setPaginationModel(prev => ({ ...prev, page: currentPage - 1 }))
          }
        }
      }
      fetchData()
      setDeletedID(null)
    }
  }, [deletedID])

  useEffect(() => {
    if (fetchUpdatesApiError) toast.error(fetchUpdatesApiError, { duration: 3000 })
  }, [fetchUpdatesApiError])

  // Get statistics - for server-side pagination, we show current page stats
  const getStatistics = () => {
    const total = updatesRowsData.rowsCount // Total from server
    const currentPageTotal = updatesRowsData.data.length // Current page data
    const approved = updatesRowsData.data.filter(item => item.approved).length
    const pending = currentPageTotal - approved
    return { total, approved, pending, currentPageTotal }
  }

  const stats = getStatistics()

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Box>
              <Typography variant='h4'>Project Updates</Typography>
              {/* <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                Monitor and manage project updates with advanced filtering by status, date range, and search
              </Typography> */}
            </Box>
          }
        />

        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant='h4' sx={{ mb: 1 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Total Updates
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='primary' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:news' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant='h4' sx={{ mb: 1, color: 'info.main' }}>
                      {stats.approved}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Approved Updates
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='info' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:circle-check' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant='h4' sx={{ mb: 1, color: 'warning.main' }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Pending Approval
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='warning' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:clock' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

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
              {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant='h6'>Updates List</Typography>
                <Badge badgeContent={updatesRowsData.rowsCount} color='primary' max={9999}>
                  <Icon icon='tabler:list' fontSize='1.25rem' />
                </Badge>
              </Box> */}

              {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Button
                  color='secondary'
                  variant='outlined'
                  startIcon={<Icon icon='tabler:download' />}
                  onClick={() => toast.success('Export functionality coming soon!')}
                >
                  Export
                </Button>
              </Box> */}
            </Box>

            {/* <Divider /> */}

            {/* Filters */}
            <Box
              sx={{
                py: 3,
                px: 6,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <CustomTextField
                  value={textSearch}
                  placeholder='Search updates...'
                  onChange={e => setTextSearch(e.target.value)}
                  sx={{ minWidth: 200 }}
                  InputProps={{ startAdornment: <Icon icon='tabler:search' fontSize='1.25rem' /> }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label='Status' onChange={e => setStatusFilter(e.target.value)}>
                    <MenuItem value=''>All Status</MenuItem>
                    <MenuItem value='approved'>Approved</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                  </Select>
                </FormControl>

                {/* Date Range Filters */}
                <Tooltip title='Filter updates from this date onwards' arrow>
                  <TextField
                    label='Start Date'
                    type='date'
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={{ minWidth: 150 }}
                  />
                </Tooltip>

                <Tooltip title='Filter updates up to this date (inclusive)' arrow>
                  <TextField
                    label='End Date'
                    type='date'
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: startDate || undefined
                    }}
                    sx={{ minWidth: 150 }}
                  />
                </Tooltip>

                {/* Clear Date Filters */}
                {(startDate || endDate) && (
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      setStartDate('')
                      setEndDate('')
                    }}
                    startIcon={<Icon icon='tabler:x' />}
                  >
                    Clear Dates
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {statusFilter && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    onDelete={() => setStatusFilter('')}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                )}
                {startDate && (
                  <Chip
                    label={`From: ${new Date(startDate).toLocaleDateString()}`}
                    onDelete={() => setStartDate('')}
                    size='small'
                    color='info'
                    variant='outlined'
                  />
                )}
                {endDate && (
                  <Chip
                    label={`To: ${new Date(endDate).toLocaleDateString()}`}
                    onDelete={() => setEndDate('')}
                    size='small'
                    color='info'
                    variant='outlined'
                  />
                )}
                {(statusFilter || startDate || endDate) && (
                  <Button
                    variant='text'
                    size='small'
                    onClick={clearAllFilters}
                    startIcon={<Icon icon='tabler:filter-x' />}
                    sx={{ ml: 1 }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>
            </Box>

            <Divider />

            {/* Table */}
            <DataGrid
              autoHeight
              rowHeight={70}
              getRowId={(row: any) => row.update_id}
              rows={updatesRowsData.data}
              columns={columns}
              loading={fetchUpdatesApiLoading}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={updatesRowsData.rowsCount}
              paginationMode='server'
              sx={{
                '& .MuiDataGrid-cell': { borderBottom: '1px solid', borderColor: 'divider' },
                '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' }
              }}
            />

            {/* Custom Empty State */}
            {!fetchUpdatesApiLoading && updatesRowsData.data.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  gap: 2
                }}
              >
                <Icon icon='tabler:search-off' fontSize='3rem' color='text.secondary' />
                <Typography variant='h6' color='text.secondary'>
                  No updates found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {statusFilter || startDate || endDate || textSearch
                    ? 'Try adjusting your filters or search terms'
                    : 'No project updates available yet'}
                </Typography>
                {(statusFilter || startDate || endDate || textSearch) && (
                  <Button
                    variant='outlined'
                    onClick={clearAllFilters}
                    startIcon={<Icon icon='tabler:filter-x' />}
                    sx={{ mt: 1 }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Updates

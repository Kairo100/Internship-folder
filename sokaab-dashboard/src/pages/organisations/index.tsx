import { useState, MouseEvent, useEffect, Fragment, useCallback, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  MenuItem,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Avatar,
  Chip,
  Tooltip,
  CardContent,
  Divider,
  Link,
  Badge
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { reject } from 'lodash'

import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { deleteOrganisation, fetchOrganisations } from 'src/apis/organisations'
import useApi from 'src/hooks/useApi'
import { TOrganisation } from 'src/types/organisations'
import axiosInstance from 'src/apis/apiConfig'

interface CellType {
  row: TOrganisation & {
    _count?: {
      members: number
      projects: number
    }
  }
}

interface OrganisationRowsData {
  data: (TOrganisation & {
    _count?: {
      members: number
      projects: number
    }
  })[]
  rowsCount: number
}

interface OrganizationStats {
  totalOrganizations: number
  activeOrganizations: number
  totalMembers: number
  totalProjects: number
}

const OrganisationStatusObj: any = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'error'
}

const ActionColumn = ({ id, setDeletedID }: { id: number; setDeletedID: Dispatch<SetStateAction<number | null>> }) => {
  // ** Hooks
  const router = useRouter()
  const {
    isLoading: apiLoading,
    error: apiError,
    data: apiData,
    apiCall: deleteOrganisationApi,
    clearStates
  } = useApi()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)

  // ** Var
  const rowOptionsOpen = Boolean(anchorEl)

  const handleClickOpen = () => setDeleteDialog(true)
  const handleClose = () => setDeleteDialog(false)
  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleRowOptionsClose = () => setAnchorEl(null)

  const handleDetail = () => {
    router.push('/organisations/[organisationId]/detail', `/organisations/${id}/detail`)
    handleRowOptionsClose()
  }

  const handleUpdate = () => {
    router.push('/organisations/[organisationId]/update', `/organisations/${id}/update`)
    handleRowOptionsClose()
  }

  const handleDelete = () => {
    setDeletedID(null)
    handleRowOptionsClose()
    handleClickOpen()
  }

  const deletingOrganisation = async () => await deleteOrganisationApi(deleteOrganisation(Number(id)))

  // Api Success handling
  useEffect(() => {
    if (apiData) {
      setDeletedID(id)
      toast.success('Organisation deleted Successfully', {
        duration: 3000
      })
    }

    return () => {
      clearStates()
      handleClose()
    }
  }, [apiData])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    return () => {
      clearStates()
      handleClose()
    }
  }, [apiError])

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
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDetail}>
          <Icon icon='tabler:eye' fontSize={20} />
          Detail
        </MenuItem>
        <MenuItem onClick={handleUpdate} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        {/* <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem> */}
      </Menu>

      <Dialog
        open={deleteDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold' }}>
          Delete Organisation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this organisation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} variant='contained' color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={deletingOrganisation}
            variant='contained'
            color='error'
            endIcon={apiLoading && <CircularProgress size={20} style={{ color: '#fff' }} />}
            startIcon={<Icon icon='tabler:trash' />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const StatsCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant='h4' sx={{ mb: 1 }}>
            {value.toLocaleString()}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {title}
          </Typography>
        </Box>
        <CustomAvatar skin='light' color={color as any} sx={{ width: 50, height: 50 }}>
          <Icon icon={icon} fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

const Organisations = () => {
  // ** State
  const [filters, setFilters] = useState({
    statusFilter: '',
    categoryFilter: ''
  })
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [organisationRowsData, setOrganisationRowsData] = useState<OrganisationRowsData>({
    data: [],
    rowsCount: 0
  })
  const [deletedID, setDeletedID] = useState<number | null>(null)
  const [stats, setStats] = useState<OrganizationStats>({
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalMembers: 0,
    totalProjects: 0
  })

  // ** Hooks
  const router = useRouter()
  const { isLoading: apiLoading, error: apiError, data: organisationData, apiCall: fetchOrganisationApi } = useApi()

  // ** Var
  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 80,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'organisation_id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 600, color: 'primary.main' }}>
            #{row.organisation_id}
          </Typography>
        )
      }
    },
    {
      flex: 1.2,
      minWidth: 220,
      disableColumnMenu: true,
      headerName: 'Organization',
      field: 'organisation_name',
      renderCell: ({ row }: CellType) => {
        const initials = row.organisation_name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase()

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' sx={{ mr: 3, width: 40, height: 40 }}>
              {initials}
            </CustomAvatar>
            <Box>
              <Typography noWrap sx={{ fontWeight: 500, color: 'text.primary' }}>
                {row.organisation_name}
              </Typography>
              <Typography noWrap variant='body2' color='text.secondary'>
                {row.email_address}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.8,
      minWidth: 150,
      disableColumnMenu: true,
      headerName: 'Contact Info',
      field: 'contact',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Icon icon='tabler:phone' fontSize='0.875rem' />
              <Typography variant='body2' sx={{ ml: 1 }}>
                {row.phone_number || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon icon='tabler:map-pin' fontSize='0.875rem' />
              <Typography variant='body2' sx={{ ml: 1 }}>
                {row.country || 'N/A'}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 100,
      disableColumnMenu: true,
      headerName: 'Members',
      field: 'members',
      renderCell: ({ row }: CellType) => {
        const memberCount = row._count?.members || 0
        const color = memberCount > 10 ? 'success' : memberCount > 5 ? 'warning' : 'info'
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={memberCount} color={color} max={999}>
              <Icon icon='tabler:users' fontSize='1.25rem' color={`${color}.main`} />
            </Badge>
            <Typography sx={{ ml: 2, fontWeight: 500, color: `${color}.main` }}>{memberCount}</Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 100,
      disableColumnMenu: true,
      headerName: 'Projects',
      field: 'projects_created',
      renderCell: ({ row }: CellType) => {
        const projectCount = row._count?.projects || 0
        // const color = projectCount > 5 ? 'success' : projectCount > 2 ? 'warning' : 'error'
        const color = 'success'
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={projectCount} color={color} max={999}>
              <Icon icon='tabler:briefcase' fontSize='1.25rem' color={`${color}.main`} />
            </Badge>
            <Typography sx={{ ml: 2, fontWeight: 500, color: `${color}.main` }}>{projectCount}</Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.6,
      minWidth: 120,
      disableColumnMenu: true,
      headerName: 'Social Links',
      field: 'social',
      renderCell: ({ row }: CellType) => {
        const socialLinks = [
          { url: row.website_address, icon: 'tabler:world', label: 'Website' },
          { url: row.facebook_page, icon: 'tabler:brand-facebook', label: 'Facebook' },
          { url: row.twitter_page, icon: 'tabler:brand-twitter', label: 'Twitter' },
          { url: row.linkedIn_page, icon: 'tabler:brand-linkedin', label: 'LinkedIn' }
        ].filter(link => link.url && link.url.trim() !== '')

        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.length > 0 ? (
              socialLinks.slice(0, 3).map((link, index) => (
                <Tooltip key={index} title={link.label}>
                  <IconButton
                    size='small'
                    onClick={() => window.open(link.url, '_blank')}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' }
                    }}
                  >
                    <Icon icon={link.icon} fontSize='0.875rem' />
                  </IconButton>
                </Tooltip>
              ))
            ) : (
              <Typography variant='body2' color='text.secondary'>
                No links
              </Typography>
            )}
            {socialLinks.length > 3 && (
              <Chip size='small' label={`+${socialLinks.length - 3}`} sx={{ height: 20, fontSize: '0.75rem' }} />
            )}
          </Box>
        )
      }
    },
    // {
    //   flex: 0.5,
    //   minWidth: 100,
    //   disableColumnMenu: true,
    //   headerName: 'Status',
    //   field: 'status',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <CustomChip
    //         rounded
    //         skin='light'
    //         size='small'
    //         label={row.account_status}
    //         color={OrganisationStatusObj[row.account_status]}
    //         sx={{ textTransform: 'capitalize' }}
    //       />
    //     )
    //   }
    // },
    {
      flex: 0.4,
      minWidth: 100,
      disableColumnMenu: true,
      headerName: 'Created',
      field: 'date_time_added',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography variant='body2'>{new Date(row.date_time_added).toLocaleDateString()}</Typography>
            <Typography variant='caption' color='text.secondary'>
              {new Date(row.date_time_added).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              })}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <ActionColumn id={row.organisation_id} setDeletedID={setDeletedID} />
    }
  ]

  const handleFilterChange = (filterName: string) => (event: React.ChangeEvent<{ value: unknown }>) =>
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: event.target.value as string
    }))

  const handleSearchText = (searchText: string) => setTextSearch(searchText)

  // Enhanced API call with statistics
  const fetchEnhancedOrganizations = async () => {
    try {
      // Fetch organizations with counts using the enhanced API
      const orgsResponse = await axiosInstance.get('/organisations', {
        params: {
          skip: paginationModel.page + 1,
          take: paginationModel.pageSize,
          search: textSearch,
          includeCounts: 'true',
          ...filters
        }
      })

      setOrganisationRowsData({
        data: orgsResponse.data.data,
        rowsCount: orgsResponse.data.rowsCount
      })

      // Fetch overall statistics
      try {
        const statsResponse = await axiosInstance.get('/organisations/statistics')
        setStats(statsResponse.data)
      } catch (error) {
        console.error('Error fetching statistics:', error)
        // Fallback: calculate from current page data
        const organizationsWithCounts = orgsResponse.data.data
        const totalOrganizations = orgsResponse.data.rowsCount
        const activeOrganizations = organizationsWithCounts.filter((org: any) => org.account_status === 'Active').length
        const totalMembers = organizationsWithCounts.reduce(
          (sum: number, org: any) => sum + (org._count?.members || 0),
          0
        )
        const totalProjects = organizationsWithCounts.reduce(
          (sum: number, org: any) => sum + (org._count?.projects || 0),
          0
        )

        setStats({
          totalOrganizations,
          activeOrganizations,
          totalMembers,
          totalProjects
        })
      }
    } catch (error) {
      console.error('Error fetching enhanced organizations:', error)
      toast.error('Failed to fetch organization data')
    }
  }

  // Calling Api
  useEffect(() => {
    fetchEnhancedOrganizations()
  }, [paginationModel, filters, textSearch])

  // Handle deleted organization
  useEffect(() => {
    if (deletedID) {
      const newData = reject(organisationRowsData.data, { organisation_id: Number(deletedID) })
      const newRow = organisationRowsData.rowsCount - 1
      setOrganisationRowsData({ data: newData, rowsCount: newRow })
      setDeletedID(null)
    }
  }, [deletedID])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })
  }, [apiError])

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Box>
              <Typography variant='h4'>Organizations</Typography>
              {/* <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                Manage and monitor all organizations in the system
              </Typography> */}
            </Box>
          }
        />

        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title='Total Organizations'
                value={stats.totalOrganizations}
                icon='tabler:building'
                color='primary'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title='Active Organizations'
                value={stats.activeOrganizations}
                icon='tabler:circle-check'
                color='success'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title='Total Members' value={stats.totalMembers} icon='tabler:users' color='info' />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title='Total Projects' value={stats.totalProjects} icon='tabler:briefcase' color='warning' />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            {/* Enhanced Table Actions */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant='h6'>Organizations List</Typography>
                <Chip
                  size='small'
                  label={`${organisationRowsData.rowsCount} Total`}
                  color='primary'
                  variant='outlined'
                />
              </Box>

              <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <CustomTextField
                  value={textSearch}
                  placeholder='Search organizations...'
                  onChange={e => handleSearchText(e.target.value)}
                  sx={{ minWidth: 250 }}
                  InputProps={{
                    startAdornment: <Icon icon='tabler:search' fontSize='1.25rem' />
                  }}
                />

                <Button
                  onClick={() => router.push('/organisations/add')}
                  variant='contained'
                  startIcon={<Icon icon='tabler:plus' />}
                  sx={{ minWidth: 180 }}
                >
                  Add Organization
                </Button>
              </Box>
            </Box>

            <Divider />

            {/* Enhanced Table */}
            <DataGrid
              autoHeight
              rowHeight={80}
              getRowId={(row: TOrganisation) => row.organisation_id}
              rows={organisationRowsData.data}
              columns={columns}
              loading={apiLoading}
              paginationMode='server'
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={organisationRowsData.rowsCount}
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Organisations

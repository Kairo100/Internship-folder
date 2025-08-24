import { useState, MouseEvent, useEffect, Fragment, useCallback, Dispatch, SetStateAction } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  LinearProgress,
  useTheme,
  CircularProgress
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { reject } from 'lodash'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import { deleteProject, fetchProjects } from 'src/apis/projects'
import { IProject } from 'src/types/projects'
import useApi from 'src/hooks/useApi'
//added this
import { useAuth } from 'src/hooks/useAuth'
import { fetchOrganizationMetrics, TOrganisationMetrics } from 'src/apis/organisations';

interface CellType {
  row: any
}

interface NewData {
  data: IProject[]
  rowsCount: number
}

const ProjectStatusObj: any = {
  // Active: 'success',
  Live: 'success',
  Pending: 'warning',
  Inactive: 'error'
}

const ActionColumn = ({
  id,
  setDeletedID
}: {
  id: number | string
  setDeletedID: Dispatch<SetStateAction<number | null>>
}) => {
  // ** Hooks
  const router = useRouter()
  const { isLoading: apiLoading, error: apiError, data: apiData, apiCall: deleteProjectApi } = useApi()
  

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
 
  
  // ** Var
  const rowOptionsOpen = Boolean(anchorEl)
  

  const handleClickOpen = () => setDeleteDialog(true)
  const handleClose = () => setDeleteDialog(false)
  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleRowOptionsClose = () => setAnchorEl(null)

  const handleView = () => {
    router.push('/projects/[projectId]/detail', `/projects/${id}/detail`)
    handleRowOptionsClose()
  }

  const handleUpdate = () => {
    router.push('/projects/[projectId]/update', `/projects/${id}/update`)
    handleRowOptionsClose()
  }

  const handleDelete = () => {
    setDeletedID(null)
    handleRowOptionsClose()
    handleClickOpen()
  }

  const deletingProject = async () => {
    if (deleteProjectApi) await deleteProjectApi(deleteProject(Number(id)))
  }

  useEffect(() => {
    handleClose()

    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    if (apiData) {
      setDeletedID(Number(id))
      toast.success('Project deleted Successfully', {
        duration: 3000
      })
    }
  }, [apiError, apiData])



 

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
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleView}>
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
          Delete Poject
        </DialogTitle>
        {/* <Divider sx={{ m: '0 !important' }} /> */}
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        {/* <Divider sx={{ m: '0 !important' }} /> */}
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} variant='contained' color='secondary'>
            Cancel
          </Button>
          <Button onClick={deletingProject} variant='contained' color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const Projects = () => {
  // ** State
  const [filters, setFilters] = useState({
    statusFilter: '',
    categoryFilter: '',
    //added these
    country_region: '',
    dateFrom: '',
    dateTo: '',
    
  })
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [projectRowsData, setProjectRowsData] = useState<{ data: any[]; rows: number }>({
    data: [],
    rows: 0
  })
  const [deletedID, setDeletedID] = useState<number | null>(null)
   const [metricsData, setMetricsData] = useState<TOrganisationMetrics | null>(null) // <-- NEW STATE


  // ** Hooks
  const router = useRouter()
  const { isLoading: apiLoading, error: apiError, data: projectData, apiCall: fetchProjectApi } = useApi()
  const { isLoading: metricsLoading, data: metricsApiData, apiCall: fetchMetricsApi } = useApi() // <-- NEW USEAPI HOOK
  const { user } = useAuth() // <-- AUTH HOOK
  //added these 2
  const isOrgUser = user?.user_type === 'organisation_member'
  const orgId = user?.organisation_id


  // ** Var
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'project_id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.project_id}
          </Typography>
        )
      }
    },
    {
      flex: 1.4,
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
      headerName: 'Start Date',
      field: 'start_date',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {/* {row.start_date} */}
            {format(new Date(row.start_date), 'MMMM do yyyy')}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'End Date',
      field: 'end_date',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {format(new Date(row.end_date), 'MMMM do yyyy')}
          </Typography>
        )
      }
    },
    {
      flex: 0.6,
      disableColumnMenu: true,
      headerName: 'Funding Goal',
      field: 'funding_goal',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.funding_goal && '$' + row.funding_goal.toLocaleString()}
          </Typography>
        )
      }
    },
    {
      flex: 0.6,
      disableColumnMenu: true,
      headerName: 'Match Fund',
      field: 'available_grant',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.available_grant && '$' + row.available_grant.toLocaleString()}
          </Typography>
        )
      }
    },
    // {
    //   flex: 1,
    //   disableColumnMenu: true,
    //   headerName: 'Category',
    //   field: 'category',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
    //         {row.category}
    //       </Typography>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 110,
    //   disableColumnMenu: true,
    //   field: 'status',
    //   headerName: 'Status',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <CustomChip
    //         rounded
    //         skin='light'
    //         size='small'
    //         label={row.status}
    //         color={ProjectStatusObj[row.status]}
    //         // label={'Active'}
    //         // color={ProjectStatusObj['Active']}
    //         sx={{ textTransform: 'capitalize' }}
    //       />
    //     )
    //   }
    // },

    {
      flex: 0.1,
      minWidth: 110,
      disableColumnMenu: true,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        const status = new Date() >= new Date(row?.end_date) ? 'Closed' : 'Active' // Evaluate status dynamically

        const ProjectStatusObj: any = {
          Active: 'success',
          Closed: 'error'
        }

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={status}
            color={ProjectStatusObj[status]}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <ActionColumn id={row.project_id} setDeletedID={setDeletedID} />
    }
  ]

  const handleFilterChange = (filterName: string) => (event: React.ChangeEvent<{ value: unknown }>) =>
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: event.target.value as string
    }))

  const handleSearchText = (searchText: string) => setTextSearch(searchText)

  useEffect(() => {
    const fetchData = async () => {
      if (fetchProjectApi) {
        await fetchProjectApi(
          fetchProjects({
            skip: paginationModel.page + 1, // I did this 0 is the starting point for DataGrid pagination and with I'm saying page 1,2 ...
            take: paginationModel.pageSize,
            search: textSearch,
            ...filters
          })
        )
      }

      // try {
      //   const data = await fetchProjects({
      //     skip: paginationModel.page,
      //     take: paginationModel.pageSize,
      //     search: textSearch,
      //     ...filters
      //   })
      //   setProjectData({
      //     projects: data.data,
      //     rowsCount: data.rowsCount
      //   })
      // } catch (error) {
      //   console.error('Error fetching data:', error)
      // }
    }
    fetchData()
  }, [paginationModel, filters, textSearch])

  useEffect(() => {
    if (projectData) setProjectRowsData({ data: projectData.data, rows: projectData.rowsCount })
  }, [projectData])

  useEffect(() => {
    if (deletedID) {
      const newData = reject(projectRowsData.data, { project_id: deletedID })
      const newRow = projectRowsData.rows - 1
      setProjectRowsData({ data: newData, rows: newRow })
    }
  }, [deletedID])

  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })
  }, [apiError])


    //added these
 
  // Fetch metrics data specifically for organization members
  useEffect(() => {
    if (isOrgUser && orgId && fetchMetricsApi) {
      fetchMetricsApi(fetchOrganizationMetrics(orgId));
    }
  }, [isOrgUser, orgId]);
 // Update metrics state once API data is available
  useEffect(() => {
    if (metricsApiData) {
      setMetricsData(metricsApiData);
    }
  }, [metricsApiData]);

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Projects</Typography>} />
  

{isOrgUser && (
        <Grid item xs={12}>
          {metricsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Card 1: TOTAL PROJECTS */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant='h4' sx={{ mb: 1, color: 'primary.main' }}>
                        {metricsData?.total_projects}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>Total Projects</Typography>
                    </Box>
                    <CustomAvatar skin='light' color='primary' sx={{ width: 50, height: 50 }}>
                      <Icon icon='tabler:list-details' fontSize='1.75rem' />
                    </CustomAvatar>
                  </CardContent>
                </Card>
              </Grid>

              {/* Card 2: ACTIVE PROJECTS */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant='h4' sx={{ mb: 1, color: 'success.main' }}>
                        {metricsData?.active_projects}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>Active Projects</Typography>
                    </Box>
                    <CustomAvatar skin='light' color='success' sx={{ width: 50, height: 50 }}>
                      <Icon icon='tabler:circle-check' fontSize='1.75rem' />
                    </CustomAvatar>
                  </CardContent>
                </Card>
              </Grid>

              {/* Card 3: TOTAL FUNDING RAISED */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant='h4' sx={{ mb: 1, color: 'info.main' }}>
                        {`$${metricsData?.total_funding_raised?.toLocaleString()}`}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>Total Funding Raised</Typography>
                    </Box>
                    <CustomAvatar skin='light' color='info' sx={{ width: 50, height: 50 }}>
                      <Icon icon='tabler:coin' fontSize='1.75rem' />
                    </CustomAvatar>
                  </CardContent>
                </Card>
              </Grid>

              {/* Card 4: TOTAL MATCHING FUNDS */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant='h4' sx={{ mb: 1, color: 'warning.main' }}>
                        {`$${metricsData?.total_matching_funding?.toLocaleString()}`}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>Total Matching Funds</Typography>
                    </Box>
                    <CustomAvatar skin='light' color='warning' sx={{ width: 50, height: 50 }}>
                      <Icon icon='tabler:cash' fontSize='1.75rem' />
                    </CustomAvatar>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}

        <Grid item xs={12}>
          <Card>
            {/* Filters */}
            <>
              <CardHeader title='Filters' />
              <CardContent>
                <Grid container spacing={6} alignItems="center">
                  
                   <Grid item xs={12} sm={6} md={3}>
      <CustomTextField
        fullWidth
        select
        label='Status'
        SelectProps={{
displayEmpty: true,
        value:filters.statusFilter 
        }}
        
        onChange={handleFilterChange('statusFilter')}
        
      >
        <MenuItem value=''>Select Status</MenuItem>
        <MenuItem value='Live'>Active</MenuItem>
        <MenuItem value='Pending'>Pending</MenuItem>
        <MenuItem value='Inactive'>Inactive</MenuItem>
      </CustomTextField>
    </Grid>
{/* category filtering */}
                  {/* <Grid item sm={4} xs={12}>
                    <CustomTextField
                      value={filters.categoryFilter}
                      select
                      fullWidth
                      onChange={handleFilterChange('categoryFilter')}
                      SelectProps={{
                        value: filters.categoryFilter,
                        displayEmpty: true
                      }}
                    >
                      <MenuItem value=''>Select Category</MenuItem>
                      <MenuItem value='Water'>Water</MenuItem>
                      <MenuItem value='Agriculture'>Agriculture</MenuItem>
                      <MenuItem value='Community Building'>Community Building</MenuItem>
                      <MenuItem value='Education'>Education</MenuItem>
                      <MenuItem value='Food'>Food</MenuItem>
                      <MenuItem value='Health'>Health</MenuItem>
                      <MenuItem value='Human Rights'>Human Rights</MenuItem>
                      <MenuItem value='ICT'>ICT</MenuItem>
                      <MenuItem value='Media & Journalism'>Media & Journalism</MenuItem>
                      <MenuItem value='Health and Environmental Security'>Health and Environmental Security</MenuItem>
                    </CustomTextField>
                  </Grid> */}

                  <Grid item sm={3} xs={6} md={3}>
  <CustomTextField
    value={filters.country_region}
    select
    fullWidth
    label='Region'
    onChange={handleFilterChange('country_region')}
    SelectProps={{
      value: filters.country_region,
      displayEmpty: true
    }}
  >
    <MenuItem value=''>Select Region</MenuItem>
    {/* Add your region options here */}
    <MenuItem value='Republic of Somaliland'>Somaliland</MenuItem>
    <MenuItem value='Puntland'>Puntland</MenuItem>
    <MenuItem value='Galmudug'>Galmudug</MenuItem>
    <MenuItem value='Hirshabelle'>Hirshabelle</MenuItem>
    <MenuItem value='Jubaland'>Jubaland</MenuItem>
    <MenuItem value='South West State'>South West State</MenuItem>


    
  </CustomTextField>
</Grid>

<Grid item sm={3} xs={6} md={3}>
  <CustomTextField
    label='Start Date'
    type='date'
    fullWidth
    value={filters.dateFrom}
    onChange={handleFilterChange('dateFrom')}
    InputLabelProps={{ shrink: true }}
  />
</Grid>

<Grid item sm={3} xs={6} md={3}>
  <CustomTextField
    label='End Date'
    type='date'
    fullWidth
    value={filters.dateTo}
    onChange={handleFilterChange('dateTo')}
    InputLabelProps={{ shrink: true }}
  />
</Grid>
                </Grid>
              </CardContent>
              
            </>

            {/* <Divider sx={{ m: '0 !important' }} /> */}

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
              <Box>
                {/* <Button color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
                  Export
                </Button> */}
              </Box>

              <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <CustomTextField
                  value={textSearch}
                  sx={{ mr: 4 }}
                  placeholder='search...'
                  onChange={e => handleSearchText(e.target.value)}
                />
              

                <Button onClick={() => router.push('/projects/add')} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Add Project
                </Button>
              </Box>
            </Box>

            {/* Table */}
            <DataGrid
              autoHeight
              rowHeight={62}
              getRowId={(row: IProject) => row.project_id}
              rows={projectRowsData.data}
              columns={columns}
              loading={apiLoading}
              paginationMode='server'
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={projectRowsData.rows}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Projects

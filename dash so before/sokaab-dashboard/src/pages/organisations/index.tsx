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
  CircularProgress
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { reject } from 'lodash'

import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { deleteOrganisation, fetchOrganisations } from 'src/apis/organisations'
import useApi from 'src/hooks/useApi'
import { TOrganisation } from 'src/types/organisations'

interface CellType {
  row: TOrganisation
}

interface OrganisationRowsData {
  data: TOrganisation[]
  rowsCount: number
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
    // router.push('/organisations/[organisationId]/view', `/organisations/${id}/view`)
    // handleRowOptionsClose()

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
        {/* <Divider sx={{ m: '0 !important' }} /> */}
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this organisation?
          </DialogContentText>
        </DialogContent>
        {/* <Divider sx={{ m: '0 !important' }} /> */}
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

const Organisations = () => {
  // ** State
  const [filters, setFilters] = useState({
    statusFilter: '',
    categoryFilter: ''
  })
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [organisationRowsData, setOrganisationRowsData] = useState<OrganisationRowsData>({
    data: [],
    rowsCount: 0
  })
  const [deletedID, setDeletedID] = useState<number | null>(null)

  // ** Hooks
  const router = useRouter()
  const { isLoading: apiLoading, error: apiError, data: organisationData, apiCall: fetchOrganisationApi } = useApi()

  // ** Var
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'organisation_id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.organisation_id}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Name',
      field: 'organisation_name',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.organisation_name}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Members',
      field: 'members',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {2}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Projects Created',
      field: 'projects_created',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {9}
          </Typography>
        )
      }
    },
    {
      flex: 0.5,
      disableColumnMenu: true,
      headerName: 'Status',
      field: 'status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.account_status}
            color={OrganisationStatusObj[row.account_status]}
            // label={'Active'}
            // color={OrganisationStatusObj['Active']}
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
      renderCell: ({ row }: CellType) => <ActionColumn id={row.organisation_id} setDeletedID={setDeletedID} />
    }
  ]

  const handleFilterChange = (filterName: string) => (event: React.ChangeEvent<{ value: unknown }>) =>
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: event.target.value as string
    }))

  const handleSearchText = (searchText: string) => setTextSearch(searchText)

  // Calling Api
  useEffect(() => {
    const fetchData = async () => {
      if (fetchOrganisationApi)
        await fetchOrganisationApi(
          fetchOrganisations({
            skip: paginationModel.page + 1, // I did this 0 is the starting point for DataGrid pagination and with I'm saying page 1,2 ...
            take: paginationModel.pageSize,
            search: textSearch,
            ...filters
          })
        )
    }
    fetchData()
  }, [paginationModel, filters, textSearch])

  // Api Success Handling
  useEffect(() => {
    if (organisationData)
      setOrganisationRowsData({ data: organisationData.data, rowsCount: organisationData.rowsCount })

    if (deletedID) {
      const newData: TOrganisation[] = reject(organisationRowsData.data, { organisation_id: Number(deletedID) })
      const newRow = organisationRowsData.rowsCount - 1
      setOrganisationRowsData({ data: newData, rowsCount: newRow })
    }

    return () => {
      if (deletedID) setDeletedID(null)
    }
  }, [organisationData, deletedID])

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
        <PageHeader title={<Typography variant='h4'>Organisations</Typography>} />
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

                <Button
                  onClick={() => router.push('/organisations/add')}
                  variant='contained'
                  sx={{ '& svg': { mr: 2 } }}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Add Organisation
                </Button>
              </Box>
            </Box>

            {/* Table */}
            <DataGrid
              autoHeight
              rowHeight={62}
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
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Organisations

import { useState, MouseEvent, useEffect, Dispatch, SetStateAction } from 'react'
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
  Divider,
  Alert
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { reject } from 'lodash'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

// ** CleaveJS
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { addOrganisationMember, deleteOrganisation, fetchOrganisationMembers } from 'src/apis/organisations'
import useApi from 'src/hooks/useApi'
import { TOrganisationMemeber, TCreatOrganisationMemeber } from 'src/types/organisations'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

interface CellType {
  row: TOrganisationMemeber
}

interface OrganisationRowsData {
  data: TOrganisationMemeber[]
  rowsCount: number
}

type Props = {
  organisationId: number
}

const OrganisationStatusObj: any = {
  Verified: 'success',
  'Non-Verfied': 'error'
}

// Add memebers sources
const defaultValues: TCreatOrganisationMemeber = {
  full_name: '',
  email_address: '',
  telephone_number: '',
  position_held: '',
  password: ''
}

const schema = yup.object().shape({
  full_name: yup.string().required().min(5).max(20),
  email_address: yup.string().email().required(),
  telephone_number: yup.string().required().min(7).max(16),
  position_held: yup.string().max(20),
  password: yup.string().required()
})

const ActionColumn = ({ id, setDeletedID }: { id: number; setDeletedID: Dispatch<SetStateAction<number | null>> }) => {
  // ** Hooks
  const router = useRouter()
  const {
    isLoading: apiLoading,
    error: apiError,
    data: apiData,
    apiCall: deleteOrganisationMemeberApi,
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

  const handleUpdate = () => {
    router.push('/organisations/[organisationId]/update', `/organisations/${id}/update`)
    handleRowOptionsClose()
  }

  const handleDelete = () => {
    setDeletedID(null)
    handleRowOptionsClose()
    handleClickOpen()
  }

  const deletingOrganisation = async () => await deleteOrganisationMemeberApi(deleteOrganisation(Number(id)))

  // Api Success handling
  useEffect(() => {
    if (apiData) {
      setDeletedID(id)
      toast.success('Member deleted Successfully', {
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
        <MenuItem onClick={handleUpdate} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Diaglog */}
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

const OrganisationRightSide = ({ organisationId }: Props) => {
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
  const [addDialog, setAddDialog] = useState(false)
  const [deletedID, setDeletedID] = useState<number | null>(null)

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',

    resolver: yupResolver(schema)
  })
  const {
    isLoading: apiLoading,
    error: apiError,
    data: organisationMemberData,
    apiCall: fetchOrganisationMemberApi
  } = useApi()
  const {
    isLoading: addOrganisationMemberLoadingApi,
    error: addOrganisationMemberErrorApi,
    data: addOrganisationMemberApiData,
    apiCall: addOrganisationMemberApicall,
    clearStates: addOrganisationMemberClearStates
  } = useApi()

  // ** Var
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'member_id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.member_id}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Name',
      field: 'full_name',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.full_name}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Email',
      field: 'email_address',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.email_address}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Phone',
      field: 'telephone_number',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.telephone_number}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Position',
      field: 'position_held',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.position_held}
          </Typography>
        )
      }
    }
    // {
    //   flex: 0.5,
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
    //         // label={'Active'}
    //         // color={OrganisationStatusObj['Active']}
    //         sx={{ textTransform: 'capitalize' }}
    //       />
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: ({ row }: CellType) => <ActionColumn id={row.organisation_id} setDeletedID={setDeletedID} />
    // }
  ]
  const addOrganisationMemberToast = toast

  // ** Actions
  const handleFilterChange = (filterName: string) => (event: React.ChangeEvent<{ value: unknown }>) =>
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: event.target.value as string
    }))
  const handleSearchText = (searchText: string) => setTextSearch(searchText)

  const onSubmit = async (data: TCreatOrganisationMemeber) => {
    await addOrganisationMemberApicall(addOrganisationMember(organisationId, data))
  }
  const fetchData = async () => {
    if (fetchOrganisationMemberApi)
      await fetchOrganisationMemberApi(
        fetchOrganisationMembers(organisationId, {
          skip: paginationModel.page + 1, // I did this 0 is the starting point for DataGrid pagination and with I'm saying page 1,2 ...
          take: paginationModel.pageSize,
          search: textSearch,
          ...filters
        })
      )
  }

  // Calling Api
  useEffect(() => {
    fetchData()
  }, [paginationModel, filters, textSearch])

  // Api Success Handling
  useEffect(() => {
    if (organisationMemberData)
      setOrganisationRowsData({ data: organisationMemberData.data, rowsCount: organisationMemberData.rowsCount })

    if (addOrganisationMemberApiData) {
      addOrganisationMemberClearStates() // Clearing the useApi states after successful addition
      setAddDialog(false) // Skipping the dialog
      reset() // resetting the form
      fetchData() // Fetching the new members data
      addOrganisationMemberToast.success('Memeber added successfully', {
        duration: 2000
      })
    }

    if (deletedID) {
      const newData: TOrganisationMemeber[] = reject(organisationRowsData.data, { organisation_id: Number(deletedID) })
      const newRow = organisationRowsData.rowsCount - 1
      setOrganisationRowsData({ data: newData, rowsCount: newRow })
    }

    return () => {
      if (deletedID) setDeletedID(null)
    }
  }, [organisationMemberData, deletedID, addOrganisationMemberApiData])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (addOrganisationMemberErrorApi) addOrganisationMemberClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [apiError, addOrganisationMemberErrorApi])

  return (
    <Grid container spacing={6} className='match-height'>
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

              <Button onClick={() => setAddDialog(true)} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add Member
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={(row: TOrganisationMemeber) => row.member_id}
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
      {/* Add Dialog */}

      <Dialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth={'md'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
            Add a memeber
          </DialogTitle>
          <Divider sx={{ m: '0 !important' }} />
          <DialogContent>
            <CleaveWrapper>
              {addOrganisationMemberErrorApi && (
                <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 0, mb: 5 }}>
                  {addOrganisationMemberErrorApi}
                </Alert>
              )}
              <Grid container spacing={5}>
                {/* Inputs */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='full_name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Name'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors.full_name)}
                        {...(errors.full_name && { helperText: errors.full_name.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name='email_address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Email Address'
                        type='email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors.email_address)}
                        {...(errors.email_address && { helperText: errors.email_address.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel htmlFor='prefix'>Phone Number</InputLabel>
                  <Controller
                    name='telephone_number'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => {
                      return (
                        <>
                          <Cleave
                            options={{
                              prefix: '+252',
                              blocks: [4, 2, 7],
                              numericOnly: true
                            }}
                            style={errors.telephone_number && { borderColor: '#EA5455' }}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                          />
                          {errors.telephone_number && (
                            <p style={{ fontSize: '0.8rem', color: '#EA5455', marginTop: '0.1rem' }}>
                              {'errors.telephone_number.message'}
                            </p>
                          )}
                        </>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='position_held'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Postion held'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors.position_held)}
                        {...(errors.position_held && { helperText: errors.position_held.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Password'
                        type='password'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CleaveWrapper>
          </DialogContent>
          {/* <Divider sx={{ m: '0 !important' }} /> */}
          <DialogActions className='dialog-actions-dense'>
            <Button
              onClick={() => {
                setAddDialog(false)
                reset()
              }}
              variant='contained'
              color='secondary'
            >
              Cancel
            </Button>

            <Button
              type='submit'
              variant='contained'
              endIcon={addOrganisationMemberLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
            >
              Add
            </Button>
            {/* <Button
              // onClick={deletingOrganisation}
              variant='contained'
              color='error'
              endIcon={apiLoading && <CircularProgress size={20} style={{ color: '#fff' }} />}
              startIcon={<Icon icon='tabler:trash' />}
            >
              Delete
            </Button> */}
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default OrganisationRightSide

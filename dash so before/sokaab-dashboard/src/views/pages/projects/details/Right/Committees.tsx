import { useState, MouseEvent, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
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
import { addProjectCommittee, fetchProjectCommittees, updateProjectCommittee } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { IProjectCommittee, TCreatProjectCommittee, TUpdateProjectCommittee } from 'src/types/projects'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

interface CellType {
  row: IProjectCommittee
}

interface CommitteeRowsData {
  data: IProjectCommittee[]
  rowsCount: number
}

type Props = {
  projectId: number
}

const defaultValues: TCreatProjectCommittee = {
  committee_name: '',
  committee_mobile_number: '',
  position_held: ''
}

const schema = yup.object().shape({
  committee_name: yup.string().required().min(5).max(20),
  committee_mobile_number: yup.string().required().min(7).max(16),
  position_held: yup.string().max(20)
})

const ProjectCommittees = ({ projectId }: Props) => {
  // ** State
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [committeeRowsData, setCommitteeRowsData] = useState<CommitteeRowsData>({
    data: [],
    rowsCount: 0
  })
  const [addDialog, setAddDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [targetCommittee, setTargetCommittee] = useState<IProjectCommittee | null>(null)

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
    control: editControl,
    handleSubmit: editHandleSubmit,
    setValue: editSetValue,
    formState: { errors: editControlErrors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const { isLoading: apiLoading, error: apiError, data: committeeData, apiCall: fetchCommitteeApi } = useApi()
  const {
    isLoading: addProjectCommitteeLoadingApi,
    error: addProjectCommitteeErrorApi,
    data: addProjectCommitteeApiData,
    apiCall: addProjectCommitteeApicall,
    clearStates: addProjectCommitteeClearStates
  } = useApi()
  const {
    isLoading: updateProjectCommitteeLoadingApi,
    error: updateProjectCommitteeErrorApi,
    data: updateProjectCommitteeApiData,
    apiCall: updateProjectCommitteeApicall,
    clearStates: updateProjectCommitteeClearStates
  } = useApi()

  // ** Var
  const addProjectCommitteeToast = toast
  const columns: GridColDef[] = [
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'id',
      field: 'id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.committee_id}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Name',
      field: 'committee_name',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.committee_name}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Phone',
      field: 'committee_mobile_number',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.committee_mobile_number}
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
            {row.position_held || null}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      field: 'Actions',
      headerName: 'actions',
      renderCell: ({ row }: CellType) => {
        return (
          <Button
            variant='contained'
            sx={{ backgroundColor: 'dodgerblue' }}
            onClick={() => handleOpenEditModal(row.committee_id)}
          >
            <Icon icon='tabler:edit' style={{ fontSize: '1rem', margin: '-0.3rem ' }} />
          </Button>
        )
      }
    }
  ]

  // ** Actions
  const handleSearchText = (searchText: string) => setTextSearch(searchText)
  const handleAddModalClose = () => {
    setAddDialog(false)
    reset()
  }
  const onSubmit = async (data: TCreatProjectCommittee) => {
    await addProjectCommitteeApicall(addProjectCommittee(projectId, data))
  }

  const handleEditModalClose = () => {
    setEditDialog(false)
    setTargetCommittee(null)
  }
  const handleOpenEditModal = (committee_id: number) => {
    // Extracting targetted committee
    const [extractedCommittee] = committeeRowsData.data.filter(com => com.committee_id === committee_id)
    setTargetCommittee(extractedCommittee)

    // Populating the values
    editSetValue('committee_name', extractedCommittee.committee_name)
    editSetValue('committee_mobile_number', extractedCommittee.committee_mobile_number)
    editSetValue('position_held', extractedCommittee.position_held)

    setEditDialog(true)
  }
  const onSubmitEdit = async (data: TUpdateProjectCommittee) => {
    const committeeId = targetCommittee?.committee_id || null
    if (committeeId) await updateProjectCommitteeApicall(updateProjectCommittee(projectId, committeeId, data))
  }

  const fetchData = async () => {
    if (fetchCommitteeApi)
      await fetchCommitteeApi(
        fetchProjectCommittees(projectId, {
          skip: paginationModel.page + 1, // I did this 0 is the starting point for DataGrid pagination and with I'm saying page 1,2 ...
          take: paginationModel.pageSize,
          search: textSearch
        })
      )
  }

  // Calling Api
  useEffect(() => {
    fetchData()
  }, [paginationModel, textSearch])

  // Api Success Handling
  useEffect(() => {
    if (committeeData) setCommitteeRowsData({ data: committeeData.data, rowsCount: committeeData.rowsCount })

    if (addProjectCommitteeApiData) {
      addProjectCommitteeClearStates() // Clearing the useApi states after successful addition
      setAddDialog(false) // Skipping the dialog
      reset() // resetting the form
      fetchData() // Fetching the new Committees data
      addProjectCommitteeToast.success('Committee added successfully', {
        duration: 2000
      })
    }

    if (updateProjectCommitteeApiData) {
      updateProjectCommitteeClearStates() // Clearing the useApi states after successful updation
      setEditDialog(false) // Skipping the dialog
      fetchData() // Fetching the new Committees data
      addProjectCommitteeToast.success('Committee added successfully', {
        duration: 2000
      })
    }
  }, [committeeData, addProjectCommitteeApiData, updateProjectCommitteeApiData])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (addProjectCommitteeErrorApi) addProjectCommitteeClearStates()
      if (updateProjectCommitteeErrorApi) updateProjectCommitteeClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [apiError, addProjectCommitteeErrorApi, updateProjectCommitteeErrorApi])

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
                Add
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={(row: IProjectCommittee) => row.committee_id}
            rows={committeeRowsData.data}
            columns={columns}
            loading={apiLoading}
            paginationMode='server'
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={committeeRowsData.rowsCount}
          />
        </Card>
      </Grid>

      {/* Add Dialog */}
      <Dialog
        open={addDialog}
        onClose={handleAddModalClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth={'lg'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
            Add a Committee
          </DialogTitle>
          <Divider sx={{ m: '0 !important' }} />
          <DialogContent>
            <CleaveWrapper>
              {addProjectCommitteeErrorApi && (
                <Alert variant='filled' severity='error' sx={{ py: 0, mx: 3, mt: 0, mb: 5 }}>
                  {addProjectCommitteeErrorApi}
                </Alert>
              )}
              <Grid container spacing={5}>
                {/* Inputs */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='committee_name'
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
                        error={Boolean(errors.committee_name)}
                        {...(errors.committee_name && { helperText: errors.committee_name.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel htmlFor='prefix'>Phone Number</InputLabel>
                  <Controller
                    name='committee_mobile_number'
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
                            style={errors.committee_mobile_number && { borderColor: '#EA5455' }}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                          />
                          {errors.committee_mobile_number && (
                            <p style={{ fontSize: '0.8rem', color: '#EA5455', marginTop: '0.1rem' }}>
                              {errors.committee_mobile_number.message}
                            </p>
                          )}
                        </>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name='position_held'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Position'
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
              </Grid>
            </CleaveWrapper>
          </DialogContent>
          {/* <Divider sx={{ m: '0 !important' }} /> */}
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleAddModalClose} variant='contained' color='secondary'>
              Cancel
            </Button>

            <Button
              type='submit'
              variant='contained'
              endIcon={addProjectCommitteeLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
            >
              Add
            </Button>
            {/* <Button
              // onClick={deletingCommittee}
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

      {/* Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={handleEditModalClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth={'lg'}
      >
        <form onSubmit={editHandleSubmit(onSubmitEdit)}>
          <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
            Edit Committee
          </DialogTitle>
          <Divider sx={{ m: '0 !important' }} />
          <DialogContent>
            <CleaveWrapper>
              {updateProjectCommitteeErrorApi && (
                <Alert variant='filled' severity='error' sx={{ py: 0, mx: 3, mt: 0, mb: 5 }}>
                  {updateProjectCommitteeErrorApi}
                </Alert>
              )}
              <Grid container spacing={5}>
                {/* Inputs */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='committee_name'
                    control={editControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Name'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(editControlErrors.committee_name)}
                        {...(editControlErrors.committee_name && {
                          helperText: editControlErrors.committee_name.message
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel htmlFor='prefix'>Phone Number</InputLabel>
                  <Controller
                    name='committee_mobile_number'
                    control={editControl}
                    rules={{ required: true }}
                    defaultValue=''
                    render={({ field: { value, onChange, onBlur } }) => {
                      return (
                        <>
                          <Cleave
                            options={{
                              prefix: '+252',
                              blocks: [4, 2, 7],
                              numericOnly: true
                            }}
                            style={editControlErrors.committee_mobile_number && { borderColor: '#EA5455' }}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                          />
                          {editControlErrors.committee_mobile_number && (
                            <p style={{ fontSize: '0.8rem', color: '#EA5455', marginTop: '0.1rem' }}>
                              {editControlErrors.committee_mobile_number.message}
                            </p>
                          )}

                          <p style={{ fontSize: '0.8rem', marginTop: '0.1rem' }}>{`CurrentPhone: ${value}`}</p>
                        </>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name='position_held'
                    control={editControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Position'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(editControlErrors.position_held)}
                        {...(editControlErrors.position_held && {
                          helperText: editControlErrors.position_held.message
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CleaveWrapper>
          </DialogContent>
          {/* <Divider sx={{ m: '0 !important' }} /> */}
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleEditModalClose} variant='contained' color='secondary'>
              Cancel
            </Button>

            <Button
              type='submit'
              variant='contained'
              endIcon={updateProjectCommitteeLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
            >
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default ProjectCommittees

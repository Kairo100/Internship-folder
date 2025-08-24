import { useState, MouseEvent, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Divider,
  Alert,
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableBody,
  TablePagination
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { reject } from 'lodash'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import { format } from 'date-fns'

// ** CleaveJS
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { addProjectAccount, fetchProjectAccounts } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { IProjectAccount, TCreatProjectAccount } from 'src/types/projects'
import { banks as listBanks } from 'src/configs/banks'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

interface CellType {
  row: IProjectAccount
}

interface AccountRowsData {
  data: IProjectAccount[]
  rowsCount: number
}

type Props = {
  projectId: number
}

const defaultValues: TCreatProjectAccount = {
  bankId: '',
  AccNo: ''
}

const schema = yup.object().shape({
  bankId: yup.string().required().min(2).max(20),
  AccNo: yup.string().required()
})

const ActionColumn = ({ row, setTargetID }: { row: any; setTargetID: Dispatch<SetStateAction<number | null>> }) => {
  // ** Vars
  let localData: any = window.localStorage.getItem('userData')
  if (localData) {
    localData = JSON.parse(localData)
  }

  // ** Hooks
  const router = useRouter()
  const {
    isLoading: deleteWhiteListApiLoading,
    error: deleteWhiteListApiError,
    data: deleteWhiteListApiData,
    apiCall: deleteWhiteListApi,
    clearStates: deleteWhiteListClearStates
  } = useApi()
  const {
    isLoading: updateStatusApiLoading,
    error: updateStatusApiError,
    data: updateStatusApiData,
    apiCall: updateStatusApi,
    clearStates: updateStatusClearStates
  } = useApi()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [approveDialog, setApproveDialog] = useState(false)

  // ** Var
  const rowOptionsOpen = Boolean(anchorEl)

  const handleClickOpen = () => setDeleteDialog(true)
  const handleClose = () => setDeleteDialog(false)
  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleRowOptionsClose = () => setAnchorEl(null)

  const handleApproveOpen = () => setApproveDialog(true)
  const handleApproveClose = () => setApproveDialog(false)

  const handleApprove = () => {
    handleApproveOpen()
  }

  const confirmApproval = async () => {
    // await updateStatusApi(
    //   updateSupportStatus(row.id, {
    //     status: 'reported'
    //   })
    // )
  }

  // const handleDetail = () => {
  //   // router.push('/whiteLists/[whiteListId]/view', `/whiteLists/${id}/view`)
  //   // handleRowOptionsClose()

  //   router.push('/whiteLists/[whiteListId]/detail', `/whiteLists/${id}/detail`)
  //   handleRowOptionsClose()
  // }

  const handleEdit = () => {
    const serializedRow = encodeURIComponent(JSON.stringify(row))
    // router.push('/white-list/[whiteListId]/edit', `/white-list/${row.id}/edit`)
    router.push({
      pathname: `/white-list/${row.id}/edit`,
      query: { whiteList: serializedRow }
    })
    handleRowOptionsClose()
  }

  const handleDelete = () => {
    setTargetID(null)
    handleRowOptionsClose()
    handleClickOpen()
  }

  // const deletingWhiteList = async () => await deleteWhiteListApi(deleteVoter(row.id))

  // Api Success handling
  useEffect(() => {
    if (updateStatusApiData) {
      setTargetID(row.id)
      toast.success('Support ticket approved successfully', {
        duration: 3000
      })
      handleApproveClose()
    }

    return () => {
      updateStatusClearStates()
    }
  }, [updateStatusApiData])

  // Api Error handling
  useEffect(() => {
    console.log('&&&&', updateStatusApiError)
    if (updateStatusApiError) {
      toast.error(updateStatusApiError, {
        duration: 3000
      })
    }

    return () => {
      updateStatusClearStates()
      handleApproveClose()
    }
  }, [updateStatusApiError])

  return (
    <>
      <div style={{ display: 'flex' }}>
        {/* <MenuItem style={{ margin: 0, padding: '0.5rem' }}>
          <Icon
            icon='tabler:checkbox'
            fontSize={20}
            style={{ color: '#4338ca', margin: 0, padding: 0 }}
            onClick={handleApprove}
          />
        </MenuItem> */}

        <MenuItem style={{ margin: 0, padding: '0.5rem' }}>
          <Icon
            icon='tabler:edit'
            fontSize={20}
            style={{ color: '#4338ca', margin: 0, padding: 0 }}
            // onClick={handleApprove}
          />
        </MenuItem>
      </div>

      <Dialog
        open={approveDialog}
        onClose={handleApproveClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold' }}>
          Report incident
        </DialogTitle>
        <Divider sx={{ m: '0 !important' }} />
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you you reported this incident
          </DialogContentText>
        </DialogContent>
        <Divider sx={{ m: '0 !important' }} />
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleApproveClose} variant='contained' color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={confirmApproval}
            variant='contained'
            color='success'
            endIcon={updateStatusApiLoading && <CircularProgress size={20} style={{ color: '#fff' }} />}
            startIcon={<Icon icon='tabler:check' />}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog
        open={deleteDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold' }}>
          Delete WhiteList
        </DialogTitle>
        <Divider sx={{ m: '0 !important' }} />
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this from the whiteList?
          </DialogContentText>
        </DialogContent>
        <Divider sx={{ m: '0 !important' }} />
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} variant='contained' color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={deletingWhiteList}
            variant='contained'
            color='error'
            endIcon={deleteWhiteListApiLoading && <CircularProgress size={20} style={{ color: '#fff' }} />}
            startIcon={<Icon icon='tabler:trash' />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  )
}

const ProjectAccounts = ({ projectId }: Props) => {
  // ** State
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [accountRowsData, setAccountRowsData] = useState<AccountRowsData>({
    data: [],
    rowsCount: 0
  })
  const [addDialog, setAddDialog] = useState(false)
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [targetID, setTargetID] = useState<number | null>(null)

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { isLoading: apiLoading, error: apiError, data: accountData, apiCall: fetchAccountApi } = useApi()
  const {
    isLoading: addProjectAccountLoadingApi,
    error: addProjectAccountErrorApi,
    data: addProjectAccountApiData,
    apiCall: addProjectAccountApicall,
    clearStates: addProjectAccountClearStates
  } = useApi()

  // ** Var
  const addProjectAccountToast = toast
  const columns: GridColDef[] = [
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Account No.',
      field: 'AccNo',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.AccNo}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Bank',
      field: 'bankId',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.bankId}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Date added',
      field: 'date_time_added',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {format(new Date(row.date_time_added), 'PPP')}
          </Typography>
        )
      }
    },

    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Actions',
      field: 'position_held',
      renderCell: ({ row }: CellType) => {
        return <ActionColumn row={row} setTargetID={setTargetID} />
      }
    }
  ]

  // ** Update AccNo field based on bank selection
  useEffect(() => {
    if (['E-Dahab', 'ZAAD', 'EVC', 'Sahal', 'Paystack'].includes(selectedBank)) {
      const formattedName = `Sokaab-${projectId}-${selectedBank}`
      setValue('AccNo', formattedName)
    } else {
      setValue('AccNo', '') // Clear the field if not one of the special banks
    }
  }, [selectedBank, projectId, setValue])

  // ** Actions
  const handleSearchText = (searchText: string) => setTextSearch(searchText)
  const handleAddModalClose = () => {
    setAddDialog(false)
    reset()
  }

  const onSubmit = async (data: TCreatProjectAccount) => {
    console.log('^^^^^', data)
    await addProjectAccountApicall(addProjectAccount(projectId, data))
  }

  const fetchData = async () => {
    if (fetchAccountApi)
      await fetchAccountApi(
        fetchProjectAccounts(projectId, {
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
    if (accountData) setAccountRowsData({ data: accountData.data, rowsCount: accountData.rowsCount })

    if (addProjectAccountApiData) {
      addProjectAccountClearStates() // Clearing the useApi states after successful addition
      setAddDialog(false) // Skipping the dialog
      reset() // resetting the form
      fetchData() // Fetching the new Accounts data
      addProjectAccountToast.success('Account added successfully', {
        duration: 2000
      })
    }
  }, [accountData, addProjectAccountApiData])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (addProjectAccountErrorApi) addProjectAccountClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [apiError, addProjectAccountErrorApi])

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
            getRowId={(row: IProjectAccount) => row.AccNo}
            rows={accountRowsData.data}
            columns={columns}
            loading={apiLoading}
            paginationMode='server'
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={accountRowsData.rowsCount}
          />

          {/* {apiLoading ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Agent</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>Voting center</TableCell>
                    <TableCell>Date added</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountRowsData.data.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>a</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            cursor: 'pointer',
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            border: '1px solid',
                            minWidth: '60px',
                            textAlign: 'center'
                          }}
                        >
                          row.severity
                        </Box>
                      </TableCell>

                      <TableCell>row.voter?.locatio</TableCell>
                      <TableCell>row.voter?.district</TableCell>
                      <TableCell>
                        <p style={{ fontWeight: 'bolde', fontSize: '1.1rem', color: '#2563eb' }}>
                          row.voter?.voting_center_section
                        </p>
                      </TableCell>

                      <TableCell>format(new Date(row.createdAt), 'M/d/yy h:mm aa')</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )} */}
          {/* <TablePagination
              component='div'
              count={data.rows}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            /> */}
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
            Add account
          </DialogTitle>
          <Divider sx={{ m: '0 !important' }} />
          <DialogContent>
            <CleaveWrapper>
              {addProjectAccountErrorApi && (
                <Alert variant='filled' severity='error' sx={{ py: 0, mx: 3, mt: 0, mb: 5 }}>
                  {addProjectAccountErrorApi}
                </Alert>
              )}
              <Grid container spacing={5}>
                {/* Inputs */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='bankId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='Bank'
                        SelectProps={{
                          value: value,
                          displayEmpty: true,
                          onChange: e => {
                            const bank: any = e.target.value
                            setSelectedBank(bank) // Update selected bank
                            onChange(e) // Set the bankId in the form
                          }
                        }}
                        error={Boolean(errors.bankId)}
                        {...(errors.bankId && { helperText: errors.bankId.message })}
                      >
                        <MenuItem value=''>Select a bank</MenuItem>
                        {listBanks.map(bank => (
                          <MenuItem key={bank.id} value={bank.name}>
                            {bank.showName}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='AccNo'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Account No.'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors.AccNo)}
                        {...(errors.AccNo && { helperText: errors.AccNo.message })}
                        disabled={['E-Dahab', 'ZAAD', 'EVC', 'Sahal', 'Paystack'].includes(selectedBank)}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CleaveWrapper>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleAddModalClose} variant='contained' color='secondary'>
              Cancel
            </Button>

            <Button
              type='submit'
              variant='contained'
              endIcon={addProjectAccountLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default ProjectAccounts

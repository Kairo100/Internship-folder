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
  Alert,
  Chip,
  Avatar,
  Paper
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
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
import {
  // addProjectTransaction,
  fetchProjectTransactions
  //  updateProjectTransaction
} from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import {
  IProjectTransaction
  // TCreatProjectTransaction,
  // TUpdateProjectTransaction
} from 'src/types/projects'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

interface CellType {
  row: IProjectTransaction
}

interface TransactionRowsData {
  data: IProjectTransaction[]
  rowsCount: number
}

type Props = {
  projectId: number
}

// const defaultValues: TCreatProjectTransaction = {
const defaultValues: any = {
  transaction_name: '',
  transaction_mobile_number: '',
  position_held: ''
}

const schema = yup.object().shape({
  transaction_name: yup.string().required().min(5).max(20),
  transaction_mobile_number: yup.string().required().min(7).max(16),
  position_held: yup.string().max(20)
})

// Styled components for transaction type chips
const IncomingChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

const ExpenditureChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

// New Match Fund Chip style
const MatchFundChip = styled(Chip)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

// Fund Raise Chip style
const FundRaiseChip = styled(Chip)(({ theme }) => ({
  border: `1px solid ${theme.palette.success.light}`,
  backgroundColor: 'transparent',
  color: theme.palette.success.light,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

// Compact styled DataGrid
const CompactDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-root': {
    fontSize: '0.875rem'
  },
  '& .MuiDataGrid-row': {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  '& .MuiDataGrid-virtualScroller': {
    minHeight: '200px !important'
  },
  '& .MuiDataGrid-cell': {
    padding: theme.spacing(0.75, 1),
    fontSize: '0.8125rem'
  },
  '& .MuiDataGrid-footerContainer': {
    minHeight: '45px',
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '& .MuiTablePagination-root': {
    fontSize: '0.8125rem'
  }
}))

// Detail Dialog styled components
const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  '& .label': {
    width: 140,
    fontWeight: 600,
    color: theme.palette.text.secondary
  },
  '& .value': {
    flex: 1,
    color: theme.palette.text.primary
  }
}))

const CompactAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  fontSize: '0.75rem'
}))

// Array of match fund transaction IDs
const MATCH_FUND_IDS = [15655, 15654, 15653]

const ProjectTransactions = ({ projectId }: Props) => {
  // ** State
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [transactionRowsData, setTransactionRowsData] = useState<TransactionRowsData>({
    data: [],
    rowsCount: 0
  })
  const [addDialog, setAddDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [detailDialog, setDetailDialog] = useState(false)
  const [targetTransaction, setTargetTransaction] = useState<IProjectTransaction | null>(null)

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

  const { isLoading: apiLoading, error: apiError, data: transactionData, apiCall: fetchTransactionApi } = useApi()
  const {
    isLoading: addProjectTransactionLoadingApi,
    error: addProjectTransactionErrorApi,
    data: addProjectTransactionApiData,
    apiCall: addProjectTransactionApicall,
    clearStates: addProjectTransactionClearStates
  } = useApi()
  const {
    isLoading: updateProjectTransactionLoadingApi,
    error: updateProjectTransactionErrorApi,
    data: updateProjectTransactionApiData,
    apiCall: updateProjectTransactionApicall,
    clearStates: updateProjectTransactionClearStates
  } = useApi()

  // ** Var
  const addProjectTransactionToast = toast

  // Helper function to determine fund type
  const getFundType = (row: IProjectTransaction) => {
    if (MATCH_FUND_IDS.includes(Number(row.id))) {
      return 'match'
    }

    if (row.DrCr?.toLowerCase() === 'cr') {
      return 'fundraise'
    }

    return 'expense'
  }

  // Handle row click for detail view
  const handleRowClick = (params: any) => {
    setTargetTransaction(params.row)
    setDetailDialog(true)
  }

  const handleDetailClose = () => {
    setDetailDialog(false)
    setTargetTransaction(null)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.5,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='caption' sx={{ fontWeight: 600 }}>
            #{row.id}
          </Typography>
        )
      }
    },
    {
      flex: 1.5,
      disableColumnMenu: true,
      headerName: 'Information',
      field: 'info',
      renderCell: ({ row }: CellType) => {
        // Determine avatar color based on transaction type including match funds
        const avatarBgColor = () => {
          if (MATCH_FUND_IDS.includes(Number(row.id))) return 'primary.main'
          return row.DrCr?.toLowerCase() === 'cr' ? 'success.main' : 'error.main'
        }

        const avatarText = () => {
          if (MATCH_FUND_IDS.includes(Number(row.id))) return 'MF'
          return row.DrCr?.toLowerCase() === 'cr' ? 'IN' : 'OUT'
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CompactAvatar
              sx={{
                mr: 1,
                color: 'common.white',
                backgroundColor: avatarBgColor()
              }}
            >
              {avatarText()}
            </CompactAvatar>
            <Box>
              <Typography variant='caption' sx={{ fontWeight: 600, display: 'block' }}>
                {row.Category?.toLowerCase() === 'card' || row.Category?.toLowerCase() === 'dahabshiil bank'
                  ? row.CustomerName
                  : row.Narration}
              </Typography>
              <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {row.Category || 'DARASALAAM BANK'}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.8,
      disableColumnMenu: true,
      headerName: 'Amount',
      field: 'TranAmt',
      renderCell: ({ row }: CellType) => {
        // Determine text color based on transaction type including match funds
        const textColor = () => {
          if (MATCH_FUND_IDS.includes(Number(row.id))) return 'primary.main'
          return row.DrCr?.toLowerCase() === 'cr' ? 'success.main' : 'error.main'
        }

        return (
          <Typography
            variant='caption'
            sx={{
              fontWeight: 600,
              color: textColor()
            }}
          >
            ${Number(row?.TranAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Type',
      field: 'transactionType',
      renderCell: ({ row }: CellType) => {
        return row.DrCr?.toLowerCase() === 'cr' ? (
          <IncomingChip label='Incoming' size='small' />
        ) : (
          <ExpenditureChip label='Expense' size='small' />
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Fund Type',
      field: 'fundType',
      renderCell: ({ row }: CellType) => {
        // Check if it's a match fund based on ID
        if (MATCH_FUND_IDS.includes(Number(row.id))) {
          return <MatchFundChip label='Match Fund' size='small' />
        }

        // Check if it's an incoming transaction (fundraise)
        if (row.DrCr?.toLowerCase() === 'cr') {
          return <FundRaiseChip label='Fund Raise' size='small' />
        }

        // Otherwise, it's an expense with no chip
        return null
      }
    },
    {
      flex: 0.8,
      disableColumnMenu: true,
      headerName: 'Date',
      field: 'date',
      renderCell: ({ row }: CellType) => {
        if (!row.TranDate) return null

        return (
          <Typography variant='caption' color='text.secondary'>
            {new Date(row.Category ? row.TranDate : row.TranDate.split('/').reverse().join('-')).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }
            )}
          </Typography>
        )
      }
    },
    {
      flex: 0.6,
      disableColumnMenu: true,
      field: 'Actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant='contained' // Changed from 'text' to 'contained' to give it a background
              color='primary'
              size='small'
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={e => {
                e.stopPropagation()
                setTargetTransaction(row)
                setDetailDialog(true)
              }}
            >
              <Icon icon='tabler:eye' style={{ fontSize: '0.875rem' }} />
            </Button>
          </Box>
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

  const handleEditModalClose = () => {
    setEditDialog(false)
    setTargetTransaction(null)
  }

  const fetchData = async () => {
    if (fetchTransactionApi)
      await fetchTransactionApi(
        fetchProjectTransactions(projectId, {
          skip: paginationModel.page + 1,
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
    if (transactionData) setTransactionRowsData({ data: transactionData.data, rowsCount: transactionData.rowsCount })

    if (addProjectTransactionApiData) {
      addProjectTransactionClearStates()
      setAddDialog(false)
      reset()
      fetchData()
      addProjectTransactionToast.success('Transaction added successfully', {
        duration: 2000
      })
    }

    if (updateProjectTransactionApiData) {
      updateProjectTransactionClearStates()
      setEditDialog(false)
      fetchData()
      addProjectTransactionToast.success('Transaction updated successfully', {
        duration: 2000
      })
    }
  }, [transactionData, addProjectTransactionApiData, updateProjectTransactionApiData])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (addProjectTransactionErrorApi) addProjectTransactionClearStates()
      if (updateProjectTransactionErrorApi) updateProjectTransactionClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [apiError, addProjectTransactionErrorApi, updateProjectTransactionErrorApi])

  return (
    <Grid container spacing={3} className='match-height'>
      <Grid item xs={12}>
        <Card sx={{ boxShadow: theme => theme.shadows[2] }}>
          {/* Compact Table Header */}
          <Box
            sx={{
              py: 2,
              px: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant='subtitle1' color='primary'>
              {/* Transaction History */}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomTextField
                value={textSearch}
                size='small'
                sx={{ mr: 2, width: '180px' }}
                placeholder='Search...'
                InputProps={{
                  startAdornment: (
                    <Icon icon='tabler:search' style={{ fontSize: '0.875rem', marginRight: 4, color: '#666' }} />
                  )
                }}
                onChange={e => handleSearchText(e.target.value)}
              />
            </Box>
          </Box>

          {/* Compact Table */}
          <CompactDataGrid
            autoHeight
            rowHeight={50}
            rows={transactionRowsData.data}
            columns={columns}
            loading={apiLoading}
            paginationMode='server'
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={transactionRowsData.rowsCount}
            onRowClick={handleRowClick}
            checkboxSelection={false}
            hideFooterSelectedRowCount
            sx={{
              '& .MuiDataGrid-virtualScroller': {
                minHeight: '250px'
              }
            }}
          />
        </Card>
      </Grid>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={handleDetailClose}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 1 }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='subtitle1'>Transaction Details</Typography>
            {targetTransaction && (
              <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={targetTransaction.DrCr?.toLowerCase() === 'cr' ? 'Incoming Fund' : 'Expenditure'}
                    color={targetTransaction.DrCr?.toLowerCase() === 'cr' ? 'success' : 'error'}
                    size='small'
                    variant='outlined'
                  />

                  {/* Display fund type chip in detail dialog */}
                  {MATCH_FUND_IDS.includes(Number(targetTransaction.id)) && (
                    <MatchFundChip label='Match Fund' size='small' />
                  )}

                  {targetTransaction.DrCr?.toLowerCase() === 'cr' &&
                    !MATCH_FUND_IDS.includes(Number(targetTransaction.id)) && (
                      <FundRaiseChip label='Fund Raise' size='small' />
                    )}
                </Box>
              </>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {targetTransaction && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  backgroundColor: theme => theme.palette.background.default
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant='h6'
                    color={
                      MATCH_FUND_IDS.includes(Number(targetTransaction.id))
                        ? 'primary.main'
                        : targetTransaction.DrCr?.toLowerCase() === 'cr'
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    $
                    {Number(targetTransaction.TranAmt).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      ID: #{targetTransaction.id}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Information
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetTransaction.Category?.toLowerCase() === 'card' ||
                  targetTransaction.Category?.toLowerCase() === 'dahabshiil bank'
                    ? targetTransaction.CustomerName
                    : targetTransaction.Narration}
                </Typography>
              </DetailItem>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Source
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetTransaction.Category || 'DARASALAAM BANK'}
                </Typography>
              </DetailItem>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Date
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetTransaction.TranDate}
                </Typography>
              </DetailItem>

              {/* Fund Type Detail */}
              <DetailItem>
                <Typography className='label' variant='caption'>
                  Fund Type
                </Typography>
                <Typography className='value' variant='body2'>
                  {MATCH_FUND_IDS.includes(Number(targetTransaction.id))
                    ? 'Match Fund'
                    : targetTransaction.DrCr?.toLowerCase() === 'cr'
                    ? 'Fund Raise'
                    : 'Expense'}
                </Typography>
              </DetailItem>

              {targetTransaction.CustomerName && (
                <DetailItem>
                  <Typography className='label' variant='caption'>
                    Customer
                  </Typography>
                  <Typography className='value' variant='body2'>
                    {targetTransaction.CustomerName}
                  </Typography>
                </DetailItem>
              )}

              {targetTransaction.Narration && (
                <DetailItem>
                  <Typography className='label' variant='caption'>
                    Narration
                  </Typography>
                  <Typography className='value' variant='body2'>
                    {targetTransaction.Narration}
                  </Typography>
                </DetailItem>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant='outlined' size='small' onClick={handleDetailClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ProjectTransactions

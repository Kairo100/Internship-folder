import { useState, useEffect } from 'react'
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
  Chip,
  Avatar,
  Paper
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { fetchInkindDonations } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { InKindDonations } from 'src/types/projects'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

interface CellType {
  row: InKindDonations
}

interface InKindDonationsRowsData {
  data: InKindDonations[]
  rowsCount: number
}

type Props = {
  projectId: number
}

const defaultValues: any = {
  donatedBy: '',
  mobileNumber: '',
  inkind_type: 0,
  quantityDonated: '',
  totalAmount: 0
}

const schema = yup.object().shape({
  donatedBy: yup.string().required().min(5).max(20),
  mobileNumber: yup.string().required().min(7).max(16),
  inkind_type: yup.number().required(),
  quantityDonated: yup.string().max(20),
  totalAmount: yup.number().required()
})

// Styled component for donation type chips
const DonationChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

// InKind Type Chips
const FoodChip = styled(Chip)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

// Clothes Chip style
const ClothesChip = styled(Chip)(({ theme }) => ({
  border: `1px solid ${theme.palette.success.light}`,
  backgroundColor: 'transparent',
  color: theme.palette.success.light,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': { px: 1, py: 0 }
}))

// Equipment Chip style
const EquipmentChip = styled(Chip)(({ theme }) => ({
  border: `1px solid ${theme.palette.warning.light}`,
  backgroundColor: 'transparent',
  color: theme.palette.warning.light,
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

// Map of inkind types to readable names
const INKIND_TYPES = {
  1: 'Food',
  2: 'Clothes',
  3: 'Equipment',
  4: 'Other'
}

const ProjectInKindDonations = ({ projectId }: Props) => {
  // ** State
  const [textSearch, setTextSearch] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [inKindDonationsRowsData, setInKindDonationsRowsData] = useState<InKindDonationsRowsData>({
    data: [],
    rowsCount: 0
  })
  const [addDialog, setAddDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [detailDialog, setDetailDialog] = useState(false)
  const [targetDonation, setTargetDonation] = useState<any | null>(null)

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

  const { isLoading: apiLoading, error: apiError, data: donationsData, apiCall: fetchDonationsApi } = useApi()
  const {
    isLoading: addInKindDonationLoadingApi,
    error: addInKindDonationErrorApi,
    data: addInKindDonationApiData,
    apiCall: addInKindDonationApicall,
    clearStates: addInKindDonationClearStates
  } = useApi()
  const {
    isLoading: updateInKindDonationLoadingApi,
    error: updateInKindDonationErrorApi,
    data: updateInKindDonationApiData,
    apiCall: updateInKindDonationApicall,
    clearStates: updateInKindDonationClearStates
  } = useApi()

  // ** Var
  const addInKindDonationToast = toast

  // Helper function to get inkind type name
  const getinkind_typeName = (typeId: number) => {
    return INKIND_TYPES[typeId as keyof typeof INKIND_TYPES] || 'Unknown'
  }

  // Handle row click for detail view
  const handleRowClick = (params: any) => {
    setTargetDonation(params.row)
    setDetailDialog(true)
  }

  const handleDetailClose = () => {
    setDetailDialog(false)
    setTargetDonation(null)
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
        // Determine avatar color based on donation type
        const avatarBgColor = () => {
          switch (row.inkind_type) {
            case 1:
              return 'primary.main'
            case 2:
              return 'success.main'
            case 3:
              return 'warning.main'
            default:
              return 'info.main'
          }
        }

        const avatarText = () => {
          switch (row.inkind_type) {
            case 1:
              return 'FD'
            case 2:
              return 'CL'
            case 3:
              return 'EQ'
            default:
              return 'OT'
          }
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
                {row.donated_by || 'Anonymous Donor'}
              </Typography>
              <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {/* {getinkind_typeName(row.inkind_type)} */}
                {row.mobile_number}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Type',
      field: 'donationType',
      renderCell: ({ row }: any) => {
        return <>{row.type_details?.type_name}</>
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Quantity',
      field: 'quantity_donated',
      renderCell: ({ row }: CellType) => {
        return <> {row.quantity_donated} </>
        // switch (row.inkind_type) {
        //   case 1:
        //     return <FoodChip label='Food' size='small' />
        //   case 2:
        //     return <ClothesChip label='Clothes' size='small' />
        //   case 3:
        //     return <EquipmentChip label='Equipment' size='small' />
        //   default:
        //     return <Chip label='Other' size='small' variant='outlined' />
        // }
      }
    },

    {
      flex: 0.8,
      disableColumnMenu: true,
      headerName: 'Amount',
      field: 'totalAmount',
      renderCell: ({ row }: CellType) => {
        // Determine text color based on donation type
        const textColor = () => {
          switch (row.inkind_type) {
            case 1:
              return 'primary.main'
            case 2:
              return 'success.main'
            case 3:
              return 'warning.main'
            default:
              return 'info.main'
          }
        }

        return (
          <Typography
            variant='caption'
            sx={{
              fontWeight: 600,
              color: textColor()
            }}
          >
            $
            {Number(row?.total_amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Typography>
        )
      }
    },
    {
      flex: 0.8,
      disableColumnMenu: true,
      headerName: 'Date',
      field: 'addedOn',
      renderCell: ({ row }: CellType) => {
        if (!row.added_on) return null

        return (
          <Typography variant='caption' color='text.secondary'>
            {new Date(row.added_on).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
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
              variant='contained'
              color='primary'
              size='small'
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={e => {
                e.stopPropagation()
                setTargetDonation(row)
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
    setTargetDonation(null)
  }

  const fetchData = async () => {
    if (fetchDonationsApi)
      await fetchDonationsApi(
        fetchInkindDonations(projectId, {
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
    if (donationsData) setInKindDonationsRowsData({ data: donationsData.data, rowsCount: donationsData.rowsCount })

    if (addInKindDonationApiData) {
      addInKindDonationClearStates()
      setAddDialog(false)
      reset()
      fetchData()
      addInKindDonationToast.success('Donation added successfully', {
        duration: 2000
      })
    }

    if (updateInKindDonationApiData) {
      updateInKindDonationClearStates()
      setEditDialog(false)
      fetchData()
      addInKindDonationToast.success('Donation updated successfully', {
        duration: 2000
      })
    }
  }, [donationsData, addInKindDonationApiData, updateInKindDonationApiData])

  // Api Error handling
  useEffect(() => {
    if (apiError)
      toast.error(apiError, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (addInKindDonationErrorApi) addInKindDonationClearStates()
      if (updateInKindDonationErrorApi) updateInKindDonationClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [apiError, addInKindDonationErrorApi, updateInKindDonationErrorApi])

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
              {/* In-Kind Donations */}
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
              <Button onClick={() => setAddDialog(true)} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add
              </Button>
            </Box>
          </Box>

          {/* Compact Table */}
          <CompactDataGrid
            autoHeight
            rowHeight={50}
            rows={inKindDonationsRowsData.data}
            columns={columns}
            loading={apiLoading}
            paginationMode='server'
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={inKindDonationsRowsData.rowsCount}
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

      {/* Donation Detail Dialog */}
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
            <Typography variant='subtitle1'>Donation Details</Typography>
            {targetDonation && (
              <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <DonationChip label='In-Kind Donation' size='small' />

                  {/* Display donation type chip in detail dialog */}
                  {/* {targetDonation.inkind_type === 1 && <FoodChip label='Food' size='small' />}
                  {targetDonation.inkind_type === 2 && <ClothesChip label='Clothes' size='small' />}
                  {targetDonation.inkind_type === 3 && <EquipmentChip label='Equipment' size='small' />}
                  {targetDonation.inkind_type === 4 && <Chip label='Other' size='small' variant='outlined' />} */}
                </Box>
              </>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {targetDonation && (
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
                    color={() => {
                      switch (targetDonation.inkind_type) {
                        case 1:
                          return 'primary.main'
                        case 2:
                          return 'success.main'
                        case 3:
                          return 'warning.main'
                        default:
                          return 'info.main'
                      }
                    }}
                  >
                    $
                    {Number(targetDonation.total_amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      ID: #{targetDonation.id}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Donor
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetDonation.donated_by || 'Anonymous Donor'}
                </Typography>
              </DetailItem>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Mobile Number
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetDonation.mobile_number || 'Not provided'}
                </Typography>
              </DetailItem>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Donation Type
                </Typography>
                <Typography className='value' variant='body2'>
                  {/* {getinkind_typeName(targetDonation.inkind_type)} */}
                  {targetDonation.type_details?.type_name}
                </Typography>
              </DetailItem>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Quantity
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetDonation.quantity_donated || 'Not specified'}
                </Typography>
              </DetailItem>

              <DetailItem>
                <Typography className='label' variant='caption'>
                  Date Added
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetDonation.added_by
                    ? new Date(targetDonation.added_by).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Not recorded'}
                </Typography>
              </DetailItem>

              {/* <DetailItem>
                <Typography className='label' variant='caption'>
                  Added By
                </Typography>
                <Typography className='value' variant='body2'>
                  {targetDonation.added_by || 'System'}
                </Typography>
              </DetailItem> */}
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

export default ProjectInKindDonations

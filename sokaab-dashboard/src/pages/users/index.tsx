import React, { useState, useEffect, Dispatch, SetStateAction, MouseEvent } from 'react'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContentText,
  CircularProgress,
  DialogContent,
  DialogActions
} from '@mui/material'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
// import * as XLSX from 'xlsx'
import { useRouter } from 'next/router'
import { reject } from 'lodash'

import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { deleteUser, fetchUsers } from 'src/apis/users'
import useApi from 'src/hooks/useApi'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'

const UserStatusObj: any = {
  active: 'success',
  pending: 'warning',
  inactive: 'danger'
}

const UserRoleObj: any = {
  admin: { icon: 'tabler:device-laptop', color: 'success' },
  mis: { icon: 'tabler:edit', color: 'info' },
  viewer: { icon: 'tabler:eye', color: 'primary' },
  other: { icon: 'tabler:eye', color: 'primary' }
  // author: { icon: 'tabler:circle-check', color: 'success' },
  // maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  // subscriber: { icon: 'tabler:user', color: 'warning' }
}

// ** renders client column
const UserColumn: React.FC<{ row: any }> = ({ row }) => {
  const { first_name, last_name, email_address: email } = row
  const name = `${first_name} ${last_name}`

  const renderAvatar = () => {
    if (row?.avatar) {
      // if (row.avatar.length) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          // color={row.avatarColor}
          sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {name && getInitials(name)}
        </CustomAvatar>
      )
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {renderAvatar()}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        <Typography
          noWrap
          // component={Link}
          // href='/apps/user/view/account'
          sx={{
            fontWeight: 500,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {name}
        </Typography>
        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
          {email}
        </Typography>
      </Box>
    </Box>
  )
}

const ActionColumn = ({ row, setDeletedID }: { row: any; setDeletedID: Dispatch<SetStateAction<number | null>> }) => {
  // ** Hooks
  const router = useRouter()
  const {
    isLoading: deleteUserApiLoading,
    error: deleteUserApiError,
    data: deleteUserApiData,
    apiCall: deleteUserApi,
    clearStates: deleteUserClearStates
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

  // const handleDetail = () => {
  //   // router.push('/users/[userId]/view', `/users/${id}/view`)
  //   // handleRowOptionsClose()

  //   router.push('/users/[userId]/detail', `/users/${id}/detail`)
  //   handleRowOptionsClose()
  // }

  const handleEdit = () => {
    const serializedRow = encodeURIComponent(JSON.stringify(row))
    // router.push('/users/[userId]/update', `/users/${id}/update`)
    router.push({
      pathname: `/users/${row.user_id}/edit`,
      query: { user: serializedRow }
    })
    handleRowOptionsClose()
  }

  const handleDelete = () => {
    setDeletedID(null)
    handleRowOptionsClose()
    handleClickOpen()
  }

  const deletingUser = async () => await deleteUserApi(deleteUser(row.id))

  // Api Success handling
  useEffect(() => {
    if (deleteUserApiData) {
      setDeletedID(row.id)
      toast.success('Successfully deleted the user', {
        duration: 3000
      })
    }

    return () => {
      deleteUserClearStates()
      handleClose()
    }
  }, [deleteUserApiData])

  // Api Error handling
  useEffect(() => {
    if (deleteUserApiError)
      toast.error(deleteUserApiError, {
        duration: 3000
      })

    return () => {
      deleteUserClearStates()
      handleClose()
    }
  }, [deleteUserApiError])

  return (
    <>
      <div style={{ display: 'flex' }}>
        <MenuItem style={{ margin: 0, padding: '0.5rem' }}>
          <Icon
            icon='tabler:edit'
            fontSize={20}
            style={{ color: '#4338ca', margin: 0, padding: 0 }}
            onClick={handleEdit}
          />
        </MenuItem>
        {/* <MenuItem style={{ margin: 0, padding: '0.5rem' }}>
          <Icon
            icon='tabler:trash'
            fontSize={20}
            style={{ color: 'red', margin: 0, padding: 0 }}
            onClick={handleDelete}
          />
        </MenuItem> */}
      </div>

      <Dialog
        open={deleteDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold' }}>
          Delete User
        </DialogTitle>
        {/* <Divider sx={{ m: '0 !important' }} /> */}
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this from the users list?
          </DialogContentText>
        </DialogContent>
        {/* <Divider sx={{ m: '0 !important' }} /> */}
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} variant='contained' color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={deletingUser}
            variant='contained'
            color='error'
            endIcon={deleteUserApiLoading && <CircularProgress size={20} style={{ color: '#fff' }} />}
            startIcon={<Icon icon='tabler:trash' />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const Users = () => {
  // ** Vars
  let localData: any = window.localStorage.getItem('userData')
  if (localData) {
    localData = JSON.parse(localData)
  }

  const [filters, setFilters] = useState({
    statusFilter: '',
    categoryFilter: ''
  })
  const [textSearch, setTextSearch] = useState<string>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [data, setData] = useState<{
    data: Array<any>
    rowsCount: number
  }>({
    data: [],
    rowsCount: 0
  })
  const [deletedID, setDeletedID] = useState<number | null>(null)
  console.log('----', data)

  // ** Hooks
  const router = useRouter()
  const { isLoading: apiLoading, error: apiError, data: userData, apiCall: fetchUserApi } = useApi()

  // Add export function
  // const handleExport = () => {
  //   try {
  //     // Transform data for export
  //     const exportData = data.data.map(row => ({
  //       ID: row.id,
  //       Name: row.name,
  //       Username: row.user_name,
  //       Email: row.email,
  //       Role: row.role.name,
  //       'Date Added': format(new Date(row.createdAt), 'M/d/yy')
  //     }))

  //     // Create worksheet
  //     const ws = XLSX.utils.json_to_sheet(exportData)

  //     // Create workbook
  //     const wb = XLSX.utils.book_new()
  //     XLSX.utils.book_append_sheet(wb, ws, 'Users')

  //     // Generate file name with current date
  //     const fileName = `users_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`

  //     // Save file
  //     XLSX.writeFile(wb, fileName)

  //     toast.success('Export successful!')
  //   } catch (error) {
  //     toast.error('Failed to export data')
  //   }
  // }

  // ... existing handlers and effects ...
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchText = (searchText: string) => setTextSearch(searchText)

  const fetchData = async () => {
    if (fetchUserApi) {
      await fetchUserApi(
        fetchUsers({
          skip: page + 1,
          take: rowsPerPage,
          search: textSearch,
          ...filters
        })
      )
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, filters, textSearch])

  useEffect(() => {
    if (userData) setData(userData)

    if (deletedID) {
      const newData: any = reject(data.data, { id: Number(deletedID) })

      const newRow = data.rowsCount - 1
      setData({ data: newData, rowsCount: newRow })
    }

    return () => {
      if (deletedID) setDeletedID(null)
    }
  }, [userData, deletedID])

  useEffect(() => {
    if (apiError) {
      toast.error(apiError, {
        duration: 3000
      })
    }
  }, [apiError])

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Users</Typography>} />
        <Grid item xs={12}>
          <Card>
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
              <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <CustomTextField
                  value={textSearch}
                  sx={{ mr: 4 }}
                  placeholder='search...'
                  onChange={e => handleSearchText(e.target.value)}
                />
              </Box>
              <Box>
                {localData.role === 'admin' && (
                  <Button onClick={() => router.push('/users/add')} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                    <Icon fontSize='1.125rem' icon='tabler:plus' />
                    Add
                  </Button>
                )}
              </Box>
            </Box>

            {/* ... existing table JSX ... */}
            {apiLoading ? (
              <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>ID</TableCell>
                      <TableCell>User</TableCell>
                      {/* <TableCell>UserName</TableCell> */}
                      <TableCell>Role</TableCell>
                      {/* <TableCell>Status</TableCell> */}
                      <TableCell>Date added</TableCell>
                      {/* {localData.role_name === 'admin' && <TableCell>Actions</TableCell>} */}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.data.map((row, index) => (
                      <TableRow key={row.user_id}>
                        <TableCell>{index + 1}</TableCell> {/* Use index + 1 for sequential numbering */}
                        <TableCell>
                          <UserColumn row={row} />
                        </TableCell>
                        {/* <TableCell>{row.user_name}</TableCell> */}
                        {/* <TableCell>{row.account_type}</TableCell> */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar
                              skin='light'
                              sx={{ mr: 4, width: 30, height: 30 }}
                              color={(UserRoleObj[row.account_type || 'other']?.color as ThemeColor) || 'primary'}
                            >
                              <Icon icon={UserRoleObj[row.account_type || 'other']?.icon} />
                            </CustomAvatar>
                            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                              {row.account_type || 'other'}
                            </Typography>
                          </Box>
                        </TableCell>
                        {/* <TableCell>{row.status}</TableCell> */}
                        {/* <TableCell>
                          <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={row.status}
                            color={UserStatusObj[row.status]}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell> */}
                        <TableCell>{format(new Date(row.date_time_added), 'M/d/yy')}</TableCell>
                        {/* {localData.role_name === 'admin' && ( */}
                        <TableCell>
                          <ActionColumn row={row} setDeletedID={setDeletedID} />
                        </TableCell>
                        {/* )} */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              component='div'
              count={data?.rowsCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Users

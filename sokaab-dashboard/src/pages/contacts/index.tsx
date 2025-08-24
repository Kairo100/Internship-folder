import { useState, MouseEvent, useEffect, Fragment, useCallback, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { Typography, Grid, Card, Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchContacts } from 'src/apis/contacts'
import useApi from 'src/hooks/useApi'
import { TContacts } from 'src/types/contacts'

interface CellType {
  row: TContacts
}

interface ContactsRowsData {
  data: TContacts[]
  rowsCount: number
}

const Contacts = () => {
  // ** State
  // const [textSearch, setTextSearch] = useState<string>('')
  //added for filtering by dateconst [startDate, setStartDate] = useState<string | null>(null);
const [startDate, setStartDate] = useState<string>('');
const [endDate, setEndDate] = useState<string>('');
const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [contactsRowsData, setContactsRowsData] = useState<ContactsRowsData>({
    data: [],
    rowsCount: 0
  })

  // ** Hooks
  const router = useRouter()
  const { isLoading: apiLoading, error: apiError, data: contactsData, apiCall: fetchContactsApi } = useApi()

  // ** Var
  const columns: GridColDef[] = [
    {
      flex: 0.3,
      disableColumnMenu: true,
      headerName: 'ID',
      field: 'id',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.id}
          </Typography>
        )
      }
    },
    {
      flex: 0.8,
      disableColumnMenu: true,
      headerName: 'Name',
      field: 'name',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.8,
      disableColumnMenu: true,
      headerName: 'Email',
      field: 'email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.email_address}
          </Typography>
        )
      }
    },
    {
      flex: 0.4,
      disableColumnMenu: true,
      headerName: 'Reason',
      field: 'contact_reason',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.contact_reason}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      disableColumnMenu: true,
      headerName: 'Subject',
      field: 'subject',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.subject}
          </Typography>
        )
      }
    },
    {
      flex: 1.5,
      disableColumnMenu: true,
      headerName: 'Message',
      field: 'message',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.message}
          </Typography>
        )
      }
    },
    {
      flex: 0.7,
      disableColumnMenu: true,
      headerName: 'Added date',
      field: 'addedDate',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {format(new Date(row.added_on), 'PPP')}
          </Typography>
        )
      }
    }
  ]

  // const handleSearchText = (searchText: string) => setTextSearch(searchText)

  // Calling Api
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (fetchContactsApi)
  //       await fetchContactsApi(
  //         fetchContacts({
  //           skip: paginationModel.page + 1, // I did this 0 is the starting point for DataGrid pagination and with I'm saying page 1,2 ...
  //           take: paginationModel.pageSize,
  //           search: textSearch
  //         })
  //       )
  //   }
  //   fetchData()
  // }, [paginationModel, textSearch])
  

  //added for filter change
  useEffect(() => {
  const fetchData = async () => {
    if (fetchContactsApi)
      await fetchContactsApi(
        fetchContacts({
          skip: paginationModel.page + 1,
          take: paginationModel.pageSize,
          startDate: startDate, // Pass the new state variables
          endDate: endDate // Pass the new state variables
        })
      );
  };
  fetchData();
}, [paginationModel, startDate, endDate]); // Update the dependency array

  // Api Success Handling
  useEffect(() => {
    if (contactsData) setContactsRowsData({ data: contactsData.data, rowsCount: contactsData.rowsCount })

    return () => {}
  }, [contactsData])

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
        <PageHeader title={<Typography variant='h4'>Contacts</Typography>} />
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
                {/* <CustomTextField
                  value={textSearch}
                  sx={{ mr: 4 }}
                  placeholder='search...'
                  onChange={e => handleSearchText(e.target.value)}
                /> */}
                     {/* added for filter data */}
                     <CustomTextField
    label="Start Date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    sx={{ mr: 4 }}
    InputLabelProps={{ shrink: true }}
  />
  <CustomTextField
    label="End Date"
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
                {/* <Button onClick={() => router.push('/contacts/add')} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Add Contacts
                </Button> */}
              </Box>

              
            </Box>

            {/* Table */}
            <DataGrid
              autoHeight
              rowHeight={62}
              getRowId={(row: TContacts) => row.id}
              rows={contactsRowsData.data}
              columns={columns}
              loading={apiLoading}
              paginationMode='server'
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={contactsRowsData.rowsCount}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Contacts

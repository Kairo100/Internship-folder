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
  Paper,
  MenuItem ,// <-- Add this import

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
  addProjectTransaction,
  fetchProjectTransactions
  //  updateProjectTransaction
} from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import {
  IProjectTransaction,
  TCreatProjectTransaction,
  // TUpdateProjectTransaction
} from 'src/types/projects'

import { projectsDetailsExport } from 'src/utils/projectsDetailsExport';
import { format } from 'date-fns';


//added these three consts...xlsx, expected headers and exampleexceltable
// Mocking xlsx library for demonstration purposes.
// In a real project, you would import it like: import * as XLSX from 'xlsx';
const XLSX = {
  read: (data: any, options: any) => {
    // This is a simplified mock. A real xlsx.read would parse the binary data.
    // For demonstration, we'll just simulate success or failure based on the file content.
    try {
      const workbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {}
        }
      };
      // Simulate reading headers for validation
      // This is where real XLSX.read would go through the file
      // Convert ArrayBuffer to string for simple mock check
      const decoder = new TextDecoder('utf-8');
      const textData = decoder.decode(data);

      if (textData.includes('TrasdateDate') && textData.includes('TransNo') && textData.includes('AccNo')) {
        // Simulate successful header reading
        const headers = EXPECTED_HEADERS;
         const mockSheet = headers.reduce((acc: Record<string, any>, header, index) => {
          acc[`${String.fromCharCode(65 + index)}1`] = { v: header }; // A1, B1, C1...
          return acc;
        }, {});
        workbook.Sheets.Sheet1 = {
            ...mockSheet,
            '!ref': `A1:${String.fromCharCode(65 + headers.length - 1)}2` // Simulate A1 to last header + one row of data
        };
      } else {
          // Simulate missing headers
          throw new Error("Missing expected headers for simulation.");
      }
      return workbook;
    } catch (e) {
      console.error("XLSX mock read error:", e);
      throw new Error("Failed to read workbook. Make sure it's a valid Excel file.");
    }
  },
  utils: {
    sheet_to_json: (sheet: any, options: any) => {
      // This is a simplified mock. A real xlsx.utils.sheet_to_json would convert sheet data.
      const data = [
        {
          TrasdateDate: '2023-01-15',
          TransNo: 'TXN001',
          AccNo: 'COMM-001',
          CustomerName: 'John Doe',
          TransAmt: 150.00,
          Narration: 'Donation for community project',
          DrCr: 'Cr',
          UTI: 'UTI-001',
          CurrencyCode: 'USD',
          ChargedAmoun: 0,
          Category: 'Dahabshiil'
        },
        {
          TrasdateDate: '2023-01-16',
          TransNo: 'TXN002',
          AccNo: 'COMM-002',
          CustomerName: 'Jane Smith',
          TransAmt: 50.00,
          Narration: 'Office supplies purchase',
          DrCr: 'Dr',
          UTI: 'UTI-002',
          CurrencyCode: 'USD',
          ChargedAmoun: 0,
          Category: 'Purchases'
        }
      ];
      // Simulate reading and returning data based on headers
      const actualHeaders = Object.keys(sheet).filter(key => key.endsWith('1') && sheet[key].v).map(key => sheet[key].v);

      const missingHeaders = EXPECTED_HEADERS.filter(header => !actualHeaders.includes(header));

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}. Please refer to the example format.`);
      }

      return data; // Return mock data if headers are fine
    }
  }
};


const EXPECTED_HEADERS = [
  'TrasdateDate',
  'TransNo',
  'AccNo', // -> Account community
  'CustomerName', // -> (customer name or number)
  'TransAmt',
  'Narration', // -> detail of the transaction
  'DrCr', // -> donation(cr +) expenditure(dr -)
  'UTI',
  'CurrencyCode',
  'ChargedAmoun',
  'Category' // -> “Dahabshiil” as form
];

const ExampleExcelTable = () => (
  <Box sx={{ mt: 4, mb: 2, overflowX: 'auto' }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      Example Excel Document Format:
    </Typography>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
          {EXPECTED_HEADERS.map((header) => (
            <th key={header} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', whiteSpace: 'nowrap' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>2023-01-15</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>TXN001</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>COMM-001</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>John Doe</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>150.00</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Donation for project A</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Cr</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>UTI-001</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>USD</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Dahabshiil</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>2023-01-16</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>TXN002</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>COMM-002</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Jane Smith</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>50.00</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Office supplies</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Dr</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>UTI-002</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>USD</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>Expenses</td>
        </tr>
      </tbody>
    </table>
  </Box>
);



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
interface Transaction {
  id: string | number;
  TrasdateDate: string; // The date string from the API
  TransNo: string;
  AccNo: string;
  CustomerName: string;
  // Note: Use 'TranAmt' as discussed previously, if that's the correct API field.
  TranAmt: number; 
  Narration: string;
  DrCr: 'Dr' | 'Cr'; // Assuming 'Dr' or 'Cr' for debit/credit
  UTI: string;
  CurrencyCode: string;
  ChargedAmoun: number;
  Category: string;
}
type Props = {
  projectId: number
}

// const defaultValues: TCreatProjectTransaction = {
// const defaultValues: any = {
//   transaction_name: '',
//   transaction_mobile_number: '',
//   position_held: ''
// }

// const schema = yup.object().shape({
//   transaction_name: yup.string().required().min(5).max(20),
//   transaction_mobile_number: yup.string().required().min(7).max(16),
//   position_held: yup.string().max(20)
// })


//added this const default values
const defaultValues: TCreatProjectTransaction = {
  Narration: '',
  TransAmt: 0, // This is correct, matching TransAmt in TCreatProjectTransaction
  DrCr: 'Cr',
  Category: '',
  CustomerName: '',
  TrasdateDate: '', // <-- CORRECTED: This must be 'TrasdateDate' to match your type
  TransNo: '',      // <-- Ensure these are present and match your TCreatProjectTransaction
  AccNo: '',
  UTI: '',
  CurrencyCode: '',
  ChargedAmoun: 0,
};

//added scheme 
const schema = yup.object().shape({
  TrasdateDate: yup.string().required('Transaction Date is required.'), // Matches TCreatProjectTransaction
  TransNo: yup.string().max(100, 'Transaction Number cannot exceed 100 characters.').nullable(), // Matches TCreatProjectTransaction
  AccNo: yup.string().max(100, 'Account Number cannot exceed 100 characters.').nullable(), // Matches TCreatProjectTransaction
  CustomerName: yup.string().max(255, 'Customer/Source Name cannot exceed 255 characters.').nullable(), // Matches TCreatProjectTransaction
  TransAmt: yup.number().required('Amount is required.').min(0.01, 'Amount must be greater than 0.'), // Matches TCreatProjectTransaction
  Narration: yup.string().required('Transaction Description is required.').min(5, 'Description must be at least 5 characters.').max(500, 'Description cannot exceed 500 characters.'), // Matches TCreatProjectTransaction
  DrCr: yup.string().oneOf(['Cr', 'Dr'], 'Invalid transaction type.').required('Type is required.'), // Matches TCreatProjectTransaction and is more robust
  UTI: yup.string().max(100, 'UTI cannot exceed 100 characters.').nullable(), // Matches TCreatProjectTransaction
  CurrencyCode: yup.string().max(10, 'Currency Code cannot exceed 10 characters.').nullable(), // Matches TCreatProjectTransaction
  ChargedAmoun: yup.number().min(0, 'Charged Amount cannot be negative.').nullable(), // Matches TCreatProjectTransaction
  Category: yup.string().max(100, 'Category cannot exceed 100 characters.').nullable(), // Matches TCreatProjectTransaction
});



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
  //added these two
  const [excelError, setExcelError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

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


  //added this two  useeffects adn handle file upload
   // Reset form and Excel errors when dialog opens/closes
  useEffect(() => {
    if (!addDialog) {
      reset();
      setExcelError(null);
      setUploadedFileName('');
    }
  }, [addDialog, reset]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setExcelError(null);
      setUploadedFileName('');
      return;
    }

    setUploadedFileName(file.name);
    setExcelError(null); // Clear previous errors

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['xlsx', 'xls'].includes(fileExtension)) {
      setExcelError('Invalid file type. Please upload an Excel document (.xlsx or .xls).');
      toast.error('Invalid file type!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = (workbook.Sheets as Record<string, any>)[firstSheetName]; 
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Get data as array of arrays

        if (jsonData.length === 0) {
          setExcelError('The Excel file is empty.');
          toast.error('Empty Excel file!');
          return;
        }

        const headers = jsonData[0] as string[];
        const lowerCaseHeaders = headers.map(h => String(h).trim());

        const missingHeaders = EXPECTED_HEADERS.filter(
          (expectedHeader) => !lowerCaseHeaders.includes(expectedHeader)
        );

        if (missingHeaders.length > 0) {
          setExcelError(
            `Excel document is missing the following required headers: ${missingHeaders.join(', ')}. ` +
            `Please ensure your Excel file has all the specified columns.`
          );
          toast.error("Excel format mismatch!");
          return;
        }

        // If validation passes, you could potentially set this data to a state
        // and process it further, or directly initiate a bulk upload API call.
        console.log('Parsed Excel Data:', jsonData.slice(1)); // Log data excluding headers

        // Example: If you want to use the parsed data to auto-fill the form (for single transaction upload)
        // Or trigger a bulk upload process here.
        // For simplicity, this example just validates and logs.
        // If you intend to process multiple rows from Excel, you'd iterate and call your API.

        toast.success("Excel file uploaded and validated successfully!");
        setExcelError(null); // Clear any previous errors if validation passes
      } catch (error: any) {
        console.error('Error reading Excel file:', error);
        setExcelError(`Error processing Excel file: ${error.message}. Please ensure it's a valid Excel format and matches the structure.`);
        toast.error("Error processing Excel file!");
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setExcelError('Failed to read file. Please try again.');
    };
    reader.readAsArrayBuffer(file);
  };
  
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

//added this function onsubmitaddtransaction
  const onSubmitAddTransaction = async (data: TCreatProjectTransaction) => {
    // Ensure the date is formatted correctly for your API if needed
    // data.TranDate = new Date(data.TranDate).toISOString(); // Example if API expects ISO string

    // You might want to handle data coming from Excel upload differently
    // For manual entry, proceed as before.
    await addProjectTransactionApicall(addProjectTransaction(projectId, data));
  };



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



  // This is the new function to handle the export
 // This is the new function to handle the export
// const handleExport = async () => {
//     try {
//         const allTransactions = await fetchProjectTransactions(projectId, {
//             skip: 0,
//             take: 999999
//         });

//         if (!allTransactions.data || allTransactions.data.length === 0) {
//             toast.error("No transactions recorded for this project.");
//             return;
//         }

//         const dataToExport = allTransactions.data.map((transaction) => {
//             let formattedDate = '';

//             // Step 1: Validate the date value before creating a Date object
//             if (transaction.TrasdateDate) {
//                 const dateObj = new Date(transaction.TrasdateDate);

//                 // Step 2: Check if the Date object is valid
//                 if (!isNaN(dateObj.getTime())) {
//                     formattedDate = format(dateObj, 'yyyy-MM-dd');
//                 } else {
//                     // Handle invalid date format by providing a default value
//                     formattedDate = 'Invalid Date';
//                 }
//             }

//             return {
//                 'ID': transaction.id,
//                 'Date': formattedDate, // Use the validated and formatted date
//                 'Transaction No': transaction.TransNo || '',
//                 'Account No': transaction.AccNo || '',
//                 'Customer Name': transaction.CustomerName || '',
//                 'Amount': transaction.TransAmt,
//                 'Description': transaction.Narration,
//                 'Type': transaction.DrCr,
//                 'UTI': transaction.UTI || '',
//                 'Currency': transaction.CurrencyCode || '',
//                 'Charged Amount': transaction.ChargedAmoun || 0,
//                 'Category': transaction.Category || '',
//             };
//         });

//         projectsDetailsExport([{
//             sheetName: 'Transactions',
//             data: dataToExport
//         }], `Project_Transactions_ID_${projectId}.xlsx`);

//         toast.success("Transactions exported successfully!");

//     } catch (error) {
//         console.error("Export failed:", error);
//         toast.error("Failed to export transactions.");
//     }
// };

  const handleExport = async () => {
    try {
      // Step 1: Fetch all transactions from the API.
      const allTransactionsResponse = await fetchProjectTransactions(projectId, {
        skip: 0,
        take: 999999 // A large number to fetch all data
      });

      const allTransactionsData = allTransactionsResponse.data;

      if (!allTransactionsData || allTransactionsData.length === 0) {
        toast.error("No transactions recorded for this project.");
        return;
      }

      // Step 2: Prepare the data in the format needed for the Excel sheet
      const dataToExport = allTransactionsData.map((transaction : Transaction) => {
        let formattedDate = '';
    if (transaction.TrasdateDate) {
        const dateObj = new Date(transaction.TrasdateDate);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = format(dateObj, 'yyyy-MM-dd');
        } else {
            formattedDate = 'Invalid Date';
        }
    }

        // --- CRITICAL FIX: Ensure field names for Amount and Charged Amount match your API response ---
        // Based on your DataGrid column definitions, it seems 'TranAmt' is the correct field for the main amount.
        // Assuming 'ChargedAmoun' is correct, but double-check your API response for exact spelling/case.
        return {
          'ID': transaction.id || '',
          'Date': formattedDate || 'Invalid Date',
          'Account No': transaction.AccNo || '',
          'Customer Name': transaction.CustomerName || '',
          'Amount': `$${Number(transaction.TranAmt)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, // Changed to TranAmt and added formatting
          'Description': transaction.Narration || '',
          'Type': transaction.DrCr || '',
          'UTI': transaction.UTI || '',
          'Currency': transaction.CurrencyCode || 'USD',
          'Category': transaction.Category || '',
        };
      });

      // Step 3: Call your export utility with the prepared data
      projectsDetailsExport([{
        sheetName: 'Transactions',
        data: dataToExport
      }], `Project_Transactions_ID_${projectId}.xlsx`);

      toast.success("Transactions exported successfully!");

    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export transactions.");
    }
  };

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
              borderBottom: theme => `1px solid ${theme.palette.divider}`,
              
            }}
          >
            <Typography variant='subtitle1' color='primary'>
              {/* Transaction History */}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomTextField
                value={textSearch}
                size='small'
                sx={{ mr: 2, width: '180px'}}
                placeholder='Search...'
                InputProps={{
                  startAdornment: (
                    <Icon icon='tabler:search' style={{ fontSize: '0.875rem', marginRight: 4, color: '#666' }} />
                  )
                }}
                onChange={e => handleSearchText(e.target.value)}
              />
              {/* adding add btn to add tran/exp manually */}
                     <Button onClick={() => setAddDialog(true)} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                    <Icon fontSize='1.125rem' icon='tabler:plus' />
                     Add 
                  </Button>
                  {/* New Export Button */}
              <Button onClick={handleExport} variant='contained' color='secondary' sx={{ '& svg': { mr: 2 } }}>
                <Icon fontSize='1.125rem' icon='tabler:download' />
                Export
              </Button>
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

 {/* In ProjectTransactions.tsx, after the main Grid containing the DataGrid */}
{/* Add Transaction Dialog */}
{/* <Dialog
  open={addDialog}
  onClose={handleAddModalClose}
  aria-labelledby='add-transaction-dialog-title'
  aria-describedby='add-transaction-dialog-description'
  maxWidth={'md'} 
  fullWidth
>
  <form onSubmit={handleSubmit(onSubmitAddTransaction)}> 
    <DialogTitle id='add-transaction-dialog-title' sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
      Add New Transaction
    </DialogTitle>
    <Divider sx={{ m: '0 !important' }} />
    <DialogContent>
      <CleaveWrapper>
        {addProjectTransactionErrorApi && ( 
          <Alert variant='filled' severity='error' sx={{ py: 0, mx: 3, mt: 0, mb: 5 }}>
            {addProjectTransactionErrorApi}
          </Alert>
        )}
        <Grid container spacing={5}>
        
          <Grid item xs={12} sm={6}>
            <Controller
              name='Narration'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Transaction Description'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., Office Supplies, Fundraiser Donation'
                  error={Boolean(errors.Narration)}
                  {...(errors.Narration && { helperText: errors.Narration.message })}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='TranAmt'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  type='number'
                  label='Amount'
                  value={value === 0 ? '' : value} 
                  onBlur={onBlur}
                  onChange={e => onChange(parseFloat(e.target.value) || 0)}
                  placeholder='0.00'
                  error={Boolean(errors.TranAmt)}
                  {...(errors.TranAmt && { helperText: errors.TranAmt.message })}
                />
              )}
            />
          </Grid>

          
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor='DrCr'>Type</InputLabel>
            <Controller
              name='Source'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  id='DrCr'
                  label='Select Type'
                  defaultValue='Cr'
                  {...field}
                  error={Boolean(errors.DrCr)}
                  {...(errors.DrCr && { helperText: errors.DrCr.message })}
                >
                  <MenuItem value='Cr'>Incoming (Credit)</MenuItem>
                  <MenuItem value='Dr'>Outgoing (Debit)</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

         
          <Grid item xs={12} sm={6}>
            <Controller
              name='Fund Type'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Category (Optional)'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., Supplies, Donation, Bank Transfer'
                  error={Boolean(errors.Category)}
                  {...(errors.Category && { helperText: errors.Category.message })}
                />
              )}
            />
          </Grid>

          
          <Grid item xs={12} sm={6}>
            <Controller
              name='Customer Name'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Customer/Source Name (Optional)'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., John Doe'
                  error={Boolean(errors.CustomerName)}
                  {...(errors.CustomerName && { helperText: errors.CustomerName.message })}
                />
              )}
            />
          </Grid>

        
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor='TranDate'>Transaction Date</InputLabel>
            <Controller
              name='TranDate'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  type='date' 
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.TranDate)}
                  {...(errors.TranDate && { helperText: errors.TranDate.message })}
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
        endIcon={addProjectTransactionLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />} // <-- Use new loading state
      >
        Add Transaction
      </Button>
    </DialogActions>
  </form>
</Dialog>
 */}

<Dialog
  open={addDialog}
  onClose={handleAddModalClose}
  aria-labelledby='add-transaction-dialog-title'
  aria-describedby='add-transaction-dialog-description'
  maxWidth={'md'}
  fullWidth
>
  <form onSubmit={handleSubmit(onSubmitAddTransaction)}>
    <DialogTitle id='add-transaction-dialog-title' sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
      Add New Transaction
    </DialogTitle>
    <Divider sx={{ m: '0 !important' }} />
    <DialogContent>
      <CleaveWrapper>
        {addProjectTransactionErrorApi && (
          <Alert variant='filled' severity='error' sx={{ py: 0, mx: 3, mt: 0, mb: 5 }}>
            {addProjectTransactionErrorApi}
          </Alert>
        )}

        {/* Excel Upload Section (remains the same) */}
        <Grid container spacing={5} sx={{ mb: 5 }}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Transactions via Excel
            </Typography>
            <input
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="excel-upload-button"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="excel-upload-button">
              <Button variant="contained" component="span">
                Upload Excel File
              </Button>
            </label>
            {uploadedFileName && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2, display: 'inline' }}>
                File: {uploadedFileName}
              </Typography>
            )}
            {excelError && (
              <Alert variant='outlined' severity='error' sx={{ mt: 3, width: '100%' }}>
                {excelError}
              </Alert>
            )}
            {excelError && <ExampleExcelTable />}
          </Grid>
          <Grid item xs={12}>
            <Divider>OR Enter Manually</Divider>
          </Grid>
        </Grid>

        {/* Manual Transaction Entry Section (aligned with Excel fields) */}
        <Grid container spacing={5}>
          {/* Transaction Date (TrasdateDate in Excel) */}
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor='TrasdateDate'>Transaction Date</InputLabel> {/* Label for clarity */}
            <Controller
              name='TrasdateDate' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  type='date'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.TrasdateDate)}
                  {...(errors.TrasdateDate && { helperText: errors.TrasdateDate.message })}
                />
              )}
            />
          </Grid>

          {/* Transaction Number (TransNo in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='TransNo' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Transaction Number (Optional)' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., TXN12345'
                  error={Boolean(errors.TransNo)}
                  {...(errors.TransNo && { helperText: errors.TransNo.message })}
                />
              )}
            />
          </Grid>

          {/* Account Community (AccNo in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='AccNo' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Account Community (Optional)' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., COMM-ABC'
                  error={Boolean(errors.AccNo)}
                  {...(errors.AccNo && { helperText: errors.AccNo.message })}
                />
              )}
            />
          </Grid>

          {/* Customer/Source Name (CustomerName in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='CustomerName' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Customer/Source Name (Optional)' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., John Doe'
                  error={Boolean(errors.CustomerName)}
                  {...(errors.CustomerName && { helperText: errors.CustomerName.message })}
                />
              )}
            />
          </Grid>

          {/* Amount (TransAmt in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='TransAmt' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  type='number'
                  label='Amount'
                  value={value === 0 ? '' : value}
                  onBlur={onBlur}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  placeholder='0.00'
                  error={Boolean(errors.TransAmt)}
                  {...(errors.TransAmt && { helperText: errors.TransAmt.message })}
                />
              )}
            />
          </Grid>

          {/* Type (DrCr in Excel) */}
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor='DrCr'>Type</InputLabel> {/* Label for clarity */}
            <Controller
              name='DrCr' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  id='DrCr'
                  label='Select Type'
                  defaultValue='Cr'
                  {...field}
                  error={Boolean(errors.DrCr)}
                  {...(errors.DrCr && { helperText: errors.DrCr.message })}
                >
                  <MenuItem value='Cr'>Incoming (Credit)</MenuItem>
                  <MenuItem value='Dr'>Outgoing (Debit)</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

          {/* UTI (UTI in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='UTI' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='UTI (Optional)' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., Unique Transaction Identifier'
                  error={Boolean(errors.UTI)}
                  {...(errors.UTI && { helperText: errors.UTI.message })}
                />
              )}
            />
          </Grid>

          {/* Currency Code (CurrencyCode in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='CurrencyCode' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Currency Code (Optional)' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., USD, SOS'
                  error={Boolean(errors.CurrencyCode)}
                  {...(errors.CurrencyCode && { helperText: errors.CurrencyCode.message })}
                />
              )}
            />
          </Grid>

          {/* Charged Amount (ChargedAmoun in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='ChargedAmoun' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  type='number'
                  label='Charged Amount (Optional)' // User-friendly label
                  value={value === 0 ? '' : value}
                  onBlur={onBlur}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  placeholder='0.00'
                  error={Boolean(errors.ChargedAmoun)}
                  {...(errors.ChargedAmoun && { helperText: errors.ChargedAmoun.message })}
                />
              )}
            />
          </Grid>

          {/* Category (Category in Excel) */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='Category' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Category (Optional)' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., Dahabshiil, Bank Transfer, Expenses'
                  error={Boolean(errors.Category)}
                  {...(errors.Category && { helperText: errors.Category.message })}
                />
              )}
            />
          </Grid>

          {/* Narration (Narration in Excel) */}
          <Grid item xs={12}>
            <Controller
              name='Narration' // Directly matches the Excel header and TCreatProjectTransaction
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  multiline
                  rows={2}
                  label='Transaction Description' // User-friendly label
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='e.g., Office Supplies purchase for Q1 2024'
                  error={Boolean(errors.Narration)}
                  {...(errors.Narration && { helperText: errors.Narration.message })}
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
        endIcon={addProjectTransactionLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
      >
        Add Transaction
      </Button>
    </DialogActions>
  </form>
</Dialog>





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

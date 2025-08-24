import { Paper, Table, TableRow, TableCell, TableContainer, Typography, Grid } from '@mui/material'

interface Props {
  data: any
}

const BalanceSheet = ({}: Props) => {
  // const { rows, columns } = data

  return (
    <TableContainer component={Paper}>
      <Grid container spacing={6}>
        <Grid item sm={6} xs={12}>
          {/* ---- Asset -----*/}
          <Table sx={{ minWidth: 650, borderColor: '#EFF0F2 !important', border: 1 }} aria-label='simple table'>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#a6c4f5' }} colSpan={3} align='left'>
                Assets
              </TableCell>
            </TableRow>

            {/* Current Asset */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={4}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Current Assets
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Account
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Amount
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Assets
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Non Current Asset */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Non Current Assets
              </TableCell>

              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Assets
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Fixed Asset */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Fixed Assets
              </TableCell>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Assets
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Other Assets */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Other Assets
              </TableCell>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Assets
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold',
                marginTop: '10rem !important'
              }}
            >
              <TableCell align='left' colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total Assets
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
          </Table>

          {/* ---- Income -----*/}
          <Table sx={{ minWidth: 650, borderColor: '#EFF0F2 !important', border: 1, mt: 10 }} aria-label='simple table'>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7eb' }} colSpan={3} align='left'>
                Income
              </TableCell>
            </TableRow>

            {/* Revenue */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={4}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Revenue
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Account
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Amount
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Revenue
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Sales */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Sales
              </TableCell>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Sales
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold',
                marginTop: '10rem !important'
              }}
            >
              <TableCell align='left' colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total Income
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
          </Table>

          {/* ---- Equity -----*/}
          <Table sx={{ minWidth: 650, borderColor: '#EFF0F2 !important', border: 1, mt: 10 }} aria-label='simple table'>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#ebf7ef' }} colSpan={3} align='left'>
                Equity
              </TableCell>
            </TableRow>

            {/* Revenue */}

            {/* Retained Earnings */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Retained Earnings
              </TableCell>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Retained Earnings
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold',
                marginTop: '10rem !important'
              }}
            >
              <TableCell align='left' colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total Equity
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
          </Table>
        </Grid>

        <Grid item sm={6} xs={12}>
          {/* ---- Liabilities -----*/}
          <Table sx={{ minWidth: 650, borderColor: '#EFF0F2 !important', border: 1 }} aria-label='simple table'>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F8F0E7' }} colSpan={3} align='left'>
                Liabilities
              </TableCell>
            </TableRow>

            {/* Current Liabilities */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={4}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Current Liabilities
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Account
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Amount
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Liabilities
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Non Current Asset */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Non Current Liabilities
              </TableCell>

              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Liabilities
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Other Liabilities */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Other Liabilities
              </TableCell>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Current Liabilities
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold',
                marginTop: '10rem !important'
              }}
            >
              <TableCell align='left' colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total Liabilities
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
          </Table>

          {/* ---- Expense -----*/}
          <Table sx={{ minWidth: 650, borderColor: '#EFF0F2 !important', border: 1, mt: 10 }} aria-label='simple table'>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F9E8E7' }} colSpan={3} align='left'>
                Expense
              </TableCell>
            </TableRow>

            {/* Direct Cost */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={4}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Direct Cost
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Account
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Amount
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Direct Cost
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>

            {/* Expense */}
            <TableRow>
              <TableCell
                align='left'
                rowSpan={3}
                sx={{ fontWeight: 'bold', borderColor: '#EFF0F2 !important', border: 1 }}
              >
                Expense
              </TableCell>
              <TableCell align='left'>Account Receivable</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Cash on Hand</TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold'
              }}
            >
              <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                Total Expense
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: '#F9F9F9',
                fontWeight: 'bold',
                marginTop: '10rem !important'
              }}
            >
              <TableCell align='left' colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total Expense
              </TableCell>
              <TableCell align='left'>$232</TableCell>
            </TableRow>
          </Table>
        </Grid>
      </Grid>
    </TableContainer>
  )
}

export default BalanceSheet

// {/* <TableHead> */}
// <TableRow key={data.id}>
//   {rows.map((row: any) => (
//     <TableCell key={row.id}>{row.name}</TableCell>
//   ))}
// </TableRow>
// {/* </TableHead> */}
// {/* <TableBody> */}
// {columns.map((data: any) => (
//   <TableRow
//     key={data.id}
//     sx={{
//       '&:last-of-type td, &:last-of-type th': {
//         border: 0
//       }
//     }}
//   >
//     <TableCell component='th' scope='data'>
//       {data.expense_source}
//     </TableCell>
//     <TableCell align='center'>{data.january}</TableCell>
//     <TableCell align='center'>{data.february}</TableCell>
//     <TableCell align='center'>{data.march}</TableCell>
//     <TableCell align='center'>{data.april}</TableCell>
//     <TableCell align='center'>{data.may}</TableCell>
//     <TableCell align='center'>{data.june}</TableCell>
//     <TableCell align='center'>{data.july}</TableCell>
//     <TableCell align='center'>{data.august}</TableCell>
//     <TableCell align='center'>{data.september}</TableCell>
//     <TableCell align='center'>{data.october}</TableCell>
//     <TableCell align='center'>{data.november}</TableCell>
//     <TableCell align='center'>{data.december}</TableCell>
//   </TableRow>
// ))}
// {/* </TableBody> */}

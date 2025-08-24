import { Paper, Table, TableRow, TableCell, TableContainer, Typography } from '@mui/material'

interface Props {
  data: any
}

const ProfitLoss = ({}: Props) => {
  // const { rows, columns } = data

  return (
    <TableContainer component={Paper}>
      <Typography variant='h4' sx={{ ml: 6, mt: 5, mb: 3 }}>
        Net Income
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }} rowSpan={3} align='left'>
              Revenue
            </TableCell>
            <TableCell
              align='left'
              sx={{
                pl: 6,
                fontWeight: 'bold'
              }}
            >
              Source
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Jan-Mar
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Apr-Jun
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Jul-Sep
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Oct-Dec
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Total
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>Service</TableCell>
            <TableCell align='left'>0.0</TableCell>
            <TableCell align='left'>$1,500</TableCell>
            <TableCell align='left'>0.00</TableCell>
            <TableCell align='left'>$1,50</TableCell>
            <TableCell align='left'>$1,500</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>Service</TableCell>
            <TableCell align='left'>0.0</TableCell>
            <TableCell align='left'>$1,500</TableCell>
            <TableCell align='left'>0.00</TableCell>
            <TableCell align='left'>$1,50</TableCell>
            <TableCell align='left'>$1,500</TableCell>
          </TableRow>
        </>
        <>
          <TableRow>
            <TableCell rowSpan={3} align='left' sx={{ fontWeight: 'bold' }}>
              Revenue
            </TableCell>
            <TableCell
              align='left'
              sx={{
                pl: 6,
                fontWeight: 'bold'
              }}
            >
              Source
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Jan-Mar
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Apr-Jun
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Jul-Sep
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Oct-Dec
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Total
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>Service</TableCell>
            <TableCell align='left'>0.0</TableCell>
            <TableCell align='left'>$1,500</TableCell>
            <TableCell align='left'>0.00</TableCell>
            <TableCell align='left'>$1,50</TableCell>
            <TableCell align='left'>$1,500</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>Service</TableCell>
            <TableCell align='left'>0.0</TableCell>
            <TableCell align='left'>$1,500</TableCell>
            <TableCell align='left'>0.00</TableCell>
            <TableCell align='left'>$1,50</TableCell>
            <TableCell align='left'>$1,500</TableCell>
          </TableRow>
        </>

        <>
          <TableRow
            sx={{
              '&:last-of-type td, &:last-of-type th': {
                border: 0,
                pl: 6
              },
              backgroundColor: '#EDF0F8'
            }}
          >
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Total
            </TableCell>
            <TableCell align='left'></TableCell>
            <TableCell align='left'>0.0</TableCell>
            <TableCell align='left'>$1,500</TableCell>
            <TableCell align='left'>0.00</TableCell>
            <TableCell align='left'>$1,50</TableCell>
            <TableCell align='left'>$1,500</TableCell>
          </TableRow>
        </>
      </Table>
    </TableContainer>
  )
}

export default ProfitLoss

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

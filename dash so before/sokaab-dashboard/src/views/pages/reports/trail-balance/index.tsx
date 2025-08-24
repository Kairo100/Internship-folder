import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  Typography
} from '@mui/material'

interface Props {
  data: any
}

const TrailBalance = ({ data }: Props) => {
  const { rows, columns } = data

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow key={data.id}>
            {rows.map((row: any) => (
              <TableCell key={row.id}>{row.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {columns.map((data: any) => (
            <TableRow
              key={data.id}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='data'>
                {data.account_name}
              </TableCell>
              <TableCell align='left'>{data.debit}</TableCell>
              <TableCell align='left'>{data.credit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow
            sx={{
              // '&:last-of-type td, &:last-of-type th': {
              //   border: 0
              // }
              backgroundColor: '#EDF0F8'
            }}
          >
            <TableCell component='th' scope='data'>
              <Typography variant='h6' sx={{}}>
                Total
              </Typography>
            </TableCell>
            <TableCell align='left'>0.00</TableCell>
            <TableCell align='left'>$4,357</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default TrailBalance

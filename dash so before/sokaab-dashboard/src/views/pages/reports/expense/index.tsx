import { Paper, Table, TableRow, TableHead, TableBody, TableCell, TableContainer } from '@mui/material'

interface Props {
  data: any
}

const Expense = ({ data }: Props) => {
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
                {data.expense_source}
              </TableCell>
              <TableCell align='center'>{data.january}</TableCell>
              <TableCell align='center'>{data.february}</TableCell>
              <TableCell align='center'>{data.march}</TableCell>
              <TableCell align='center'>{data.april}</TableCell>
              <TableCell align='center'>{data.may}</TableCell>
              <TableCell align='center'>{data.june}</TableCell>
              <TableCell align='center'>{data.july}</TableCell>
              <TableCell align='center'>{data.august}</TableCell>
              <TableCell align='center'>{data.september}</TableCell>
              <TableCell align='center'>{data.october}</TableCell>
              <TableCell align='center'>{data.november}</TableCell>
              <TableCell align='center'>{data.december}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Expense

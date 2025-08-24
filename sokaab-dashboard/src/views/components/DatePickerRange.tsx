import { forwardRef } from 'react'
import { SxProps } from '@mui/system'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { format } from 'date-fns'
import { Theme } from '../../../node_modules/@mui/material/styles'

import CustomTextField from 'src/@core/components/mui/text-field'

interface DatePickerRangeProps {
  popperPlacement: ReactDatePickerProps['popperPlacement']
  style?: SxProps<Theme> | undefined
  startDate?: DateType
  endDate?: DateType
  handleOnChange: (dates: any) => void
}

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
  style?: any
}

type DateType = Date | null | undefined

const DatePickerRange: React.FC<DatePickerRangeProps> = ({
  popperPlacement,
  style,
  startDate,
  endDate,
  handleOnChange
}) => {
  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <CustomTextField sx={style} inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  return (
    <div>
      <DatePicker
        selectsRange
        endDate={endDate}
        selected={startDate}
        startDate={startDate}
        id='date-range-picker'
        onChange={handleOnChange}
        shouldCloseOnSelect={false}
        popperPlacement={popperPlacement}
        customInput={<CustomInput style={style} start={startDate as Date | number} end={endDate as Date | number} />}
      />
    </div>
  )
}

export default DatePickerRange

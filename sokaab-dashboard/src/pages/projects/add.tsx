import { ChangeEvent, Fragment, forwardRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Typography,
  Card,
  Grid,
  Avatar,
  Divider,
  Button,
  Stepper,
  MenuItem,
  StepLabel,
  InputAdornment,
  CardContent,
  Alert
} from '@mui/material'
import { Theme, styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiStep, { StepProps } from '@mui/material/Step'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
// import InputAdornment from '@mui/material/InputAdornment'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'

// ** CleaveJS
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

import StepperCustomDot from '../../views/components/StepperCustomDot'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import PageHeader from 'src/@core/components/page-header'
import Icon from 'src/@core/components/icon'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useSettings } from 'src/@core/hooks/useSettings'
import { addProject, getProjectHelpers } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { useAuth } from 'src/hooks/useAuth'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

// Page Configurations
const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  '&:first-of-type': {
    paddingLeft: 0
  },
  '&:last-of-type': {
    paddingRight: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed + svg': {
    color: theme.palette.primary.main
  },
  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': {
      marginBottom: theme.spacing(6)
    }
  }
}))

const steps = [
  {
    icon: 'tabler:home',
    title: 'Project Details'
    // subtitle: 'Enter Project Details'
  },
  {
    icon: 'tabler:coin',
    title: 'Funding Target'
    // subtitle: 'Setup Information'
  },
  {
    icon: 'tabler:user',
    title: 'Community Info'
    // subtitle: 'Setup Information'
  }
]

interface stepFormProps {
  activeStep: number
  handleNext: () => void

  // handleNext: (() => void) | undefined
  handleBack?: () => void
  handleDataSubmit: (payload: any) => void
  basicInfoData?: basicInfoFormData | undefined
  fundingTargetData?: fundingTargetFormData | undefined
  communityInfoData?: communityInfoFormData | undefined
  data?: any
}

interface CustomInputProps {
  value: Date | null | undefined
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

// ** Input Forms
// ****************************************************************
interface basicInfoFormData {
  title: string
  subtitle: string
  description: string
  category: string
  video_url?: string
  tags?: string
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  // partner: string
}

const basicInfoSchema = yup.object().shape({
  title: yup.string().required('').min(5).max(50),
  subtitle: yup.string().required('').min(3).max(60),
  description: yup.string().required(''),
  category: yup.string().required(''),
  video_url: yup.string().url('Video URl must be a valid URL'),
  tags: yup.string(),
  // partner: yup.string().required(''),
  startDate: yup.string().required(),
  endDate: yup.string().required()
})

const BasicInfoForm = ({
  activeStep,
  handleNext,
  handleBack,
  handleDataSubmit,
  basicInfoData,
  data
}: stepFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: basicInfoData,
    mode: 'onBlur',
    resolver: yupResolver(basicInfoSchema)
  })

  const onSubmit = (data: basicInfoFormData) => {
    const newData = {
      ...data,
      video: data?.video_url,
      start_date: data?.startDate,
      end_date: data?.endDate
    }

    delete newData.video_url
    delete newData.startDate
    delete newData.endDate

    handleDataSubmit({
      type: 'basicInfoDataType',
      data: newData
    })
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Fragment>
          <Grid item xs={12} sm={6}>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Project Title'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.title)}
                  {...(errors.title && { helperText: errors.title.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='subtitle'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Subtitle'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.subtitle)}
                  {...(errors.subtitle && { helperText: errors.subtitle.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Controller
              name='video_url'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Video URL'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.video_url)}
                  {...(errors.video_url && { helperText: errors.video_url.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='tags'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Tags'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.tags)}
                  {...(errors.tags && { helperText: errors.tags.message })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='startDate'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => onChange(e)}
                    placeholderText='MM/DD/YYYY'
                    customInput={
                      <CustomInput
                        // value={value}
                        // value={new Date('2024-12-31')}
                        value={new Date('2024-12-31')}
                        onChange={onChange}
                        label='Start Date'
                        error={Boolean(errors.startDate)}
                        aria-describedby='validation-basic-dob'
                        {...(errors.startDate && { helperText: errors.startDate.message })}
                      />
                    }
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='endDate'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => onChange(e)}
                    placeholderText='MM/DD/YYYY'
                    customInput={
                      <CustomInput
                        value={value}
                        onChange={onChange}
                        label='Ending Date'
                        error={Boolean(errors.endDate)}
                        aria-describedby='validation-basic-dob'
                        {...(errors.endDate && { helperText: errors.endDate.message })}
                      />
                    }
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='category'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  select
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label='Category'
                  SelectProps={{
                    value: value,
                    displayEmpty: true,
                    onChange: e => onChange(e)
                  }}
                  id='validation-basic-select'
                  error={Boolean(errors.category)}
                  aria-describedby='validation-basic-select'
                  {...(errors.category && { helperText: errors.category.message })}
                >
                  <MenuItem value=''>Select a Category</MenuItem>
                  {data &&
                    data.categories.map((category: any, index: any) => (
                      <MenuItem key={index} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
          </Grid>

          {/* <Grid item xs={12} sm={3}>
            <Controller
              name='partner'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  select
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label='Partner'
                  SelectProps={{
                    value: value,
                    displayEmpty: true,
                    onChange: e => onChange(e)
                  }}
                  id='validation-basic-select'
                  error={Boolean(errors.partner)}
                  aria-describedby='validation-basic-select'
                  {...(errors.partner && { helperText: errors.partner.message })}
                >
                  <MenuItem value=''>Select a partner</MenuItem>
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='USA'>USA</MenuItem>
                  <MenuItem value='Australia'>Australia</MenuItem>
                  <MenuItem value='Germany'>Germany</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid> */}
          <Grid item xs={12}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  rows={4}
                  fullWidth
                  multiline
                  {...field}
                  label='Description'
                  error={Boolean(errors.description)}
                  aria-describedby='validation-basic-textarea'
                  {...(errors.description && { helperText: errors.description.message })}
                />
              )}
            />
          </Grid>
        </Fragment>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' color='primary' disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant='contained' type='submit'>
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

// ****************************************************************
interface fundingTargetFormData {
  project_value?: string
  recommended_amount: string
  funding_goal: string
  end_method: string
  available_grant: string
}

const fundingTargetSchema = yup.object().shape({
  // project_value: yup.number().typeError('Must be only decimal or numbers'),
  // .required('This field is required'),
  recommended_amount: yup.number().required('This field is required').typeError('Must be only decimal or numbers'),
  funding_goal: yup.number().required('This field is required').typeError('Must be only decimal or numbers'),
  end_method: yup.string().required('This field is required'),
  available_grant: yup.number().required('This field is required').typeError('Must be only decimal or numbers')
})

const FundingTargetForm = ({
  activeStep,
  handleNext,
  handleBack,
  handleDataSubmit,
  fundingTargetData,
  data
}: stepFormProps) => {
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: fundingTargetData,
    mode: 'onBlur',
    resolver: yupResolver(fundingTargetSchema)
  })

  const onSubmit = (data: fundingTargetFormData) => {
    handleDataSubmit({
      type: 'fundingTargetDataType',
      data
    })
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Fragment>
          {/* <Grid item xs={12} sm={4}>
            <Controller
              name='project_value'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Project Value'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                  }}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.project_value)}
                  {...(errors.project_value && { helperText: errors.project_value.message })}
                />
              )}
            />
          </Grid> */}

          <Grid item xs={12} sm={4}>
            <Controller
              name='recommended_amount'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Recommended Amount'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                  }}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.recommended_amount)}
                  {...(errors.recommended_amount && { helperText: errors.recommended_amount.message })}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name='funding_goal'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Funding Goal'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                  }}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.funding_goal)}
                  {...(errors.funding_goal && { helperText: errors.funding_goal.message })}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name='available_grant'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  label='Available Grant(Match Fund)'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                  }}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.available_grant)}
                  {...(errors.available_grant && { helperText: errors.available_grant.message })}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            {/* <Controller
              name='end_method'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  select
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label='End Method'
                  SelectProps={{
                    value: value,
                    displayEmpty: true,
                    onChange: e => onChange(e)
                  }}
                  id='validation-basic-select'
                  error={Boolean(errors.end_method)}
                  aria-describedby='validation-basic-select'
                  {...(errors.end_method && { helperText: errors.end_method.message })}
                >
                  <MenuItem value=''>Select</MenuItem>
                </CustomTextField>
              )}
            /> */}
            <Controller
              name='end_method'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  select
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label='End Method'
                  SelectProps={{
                    value: value,
                    displayEmpty: true,
                    onChange: e => onChange(e)
                  }}
                  id='validation-basic-select'
                  error={Boolean(errors.end_method)}
                  aria-describedby='validation-basic-select'
                  {...(errors.end_method && { helperText: errors.end_method.message })}
                >
                  <MenuItem value=''>Select</MenuItem>
                  {data &&
                    data.endMethodOptions.map((category: any, index: any) => (
                      <MenuItem key={index} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
          </Grid>
        </Fragment>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' color='primary' disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant='contained' type='submit'>
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

// ****************************************************************
interface communityInfoFormData {
  community_name: string
  organisation_id: string
  // entity_id: string
  country_region: string
  location_district: string
  village: string
  latitude?: string
  longitude?: string
}

const communityInfoSchema = yup.object().shape({
  community_name: yup.string().required('This field is required'),
  organisation_id: yup.string().required('This field is required'),
  // entity_id: yup.string().required('This field is required'),
  country_region: yup.string().required('This field is required'),
  location_district: yup.string().required('This field is required'),
  village: yup.string().required('This field is required'),
  latitude: yup.string().required('This field is required'),
  longitude: yup.string().required('This field is required')
})

const CommunityInfoForm = ({
  activeStep,
  handleNext,
  handleBack,
  handleDataSubmit,
  communityInfoData,
  data
}: stepFormProps) => {
  // ** States
  const [districts, setDistricts] = useState([])
  const [selectedState, setSelectedState] = useState('')

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: communityInfoData,
    mode: 'onBlur',
    resolver: yupResolver(communityInfoSchema)
  })

  // Update the districts when state changes
  const handleStateChange = (e: any) => {
    const selectedState = e.target.value
    setSelectedState(selectedState)

    // Find the corresponding districts for the selected state
    const stateData = data?.regionStatesWithDistricts.find((region: any) => region.state === selectedState)

    if (stateData) {
      // Set the districts for the selected state
      if (stateData.districts) {
        setDistricts(stateData.districts)
      } else if (stateData.regions) {
        // If regions are available, you can flatten them into a list of districts
        const allDistricts = stateData.regions.flatMap((region: any) => region.districts)
        setDistricts(allDistricts)
      }
    } else {
      setDistricts([])
    }
  }

  const onSubmit = (data: communityInfoFormData) => {
    handleDataSubmit({
      type: 'communityInfoDataType',
      data: {
        ...data,
        entity_id: 2,
        organisation_id: Number(data.organisation_id)
      }
    })
    // handleNext()
  }

  return (
    <CleaveWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Fragment>
            <Grid item xs={12} sm={4}>
              <Controller
                name='community_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Community Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder=''
                    error={Boolean(errors.community_name)}
                    {...(errors.community_name && { helperText: errors.community_name.message })}
                  />
                )}
              />
            </Grid>

            {/* Only show organization selection for admin users */}
            {data?.user?.user_type !== 'organisation_member' && (
              <Grid item xs={12} sm={4}>
                <Controller
                  name='organisation_id'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Organisation'
                      SelectProps={{
                        value: value,
                        displayEmpty: true,
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.organisation_id)}
                      aria-describedby='validation-basic-select'
                      {...(errors.organisation_id && { helperText: errors.organisation_id.message })}
                    >
                      <MenuItem value=''>Select</MenuItem>
                      {data &&
                        data?.organisations.map((organisation: any) => (
                          <MenuItem key={organisation.organisation_id} value={organisation.organisation_id}>
                            {organisation.organisation_name}
                          </MenuItem>
                        ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}

            {/* Show organization info for organization members */}
            {data?.user?.user_type === 'organisation_member' && (
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  label='Organisation'
                  value={data?.user?.organisation_name || 'Your Organization'}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='tabler:building' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            )}

            {/* <Grid item xs={12} sm={4}>
              <Controller
                name='entity_id'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    onBlur={onBlur}
                    label='Entity'
                    SelectProps={{
                      value: value,
                      displayEmpty: true,
                      onChange: e => onChange(e)
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.entity_id)}
                    aria-describedby='validation-basic-select'
                    {...(errors.entity_id && { helperText: errors.entity_id.message })}
                  >
                    <MenuItem value=''>Select a Category</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={4}>
              <Controller
                name='country_region'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    onBlur={onBlur}
                    label='Region'
                    SelectProps={{
                      value: value,
                      displayEmpty: true,
                      onChange: e => onChange(e)
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.country_region)}
                    aria-describedby='validation-basic-select'
                    {...(errors.country_region && { helperText: errors.country_region.message })}
                  >
                    <MenuItem value=''>Select</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='location_district'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    onBlur={onBlur}
                    label='District'
                    SelectProps={{
                      value: value,
                      displayEmpty: true,
                      onChange: e => onChange(e)
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.location_district)}
                    aria-describedby='validation-basic-select'
                    {...(errors.location_district && { helperText: errors.location_district.message })}
                  >
                    <MenuItem value=''>Select a District</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid> */}

            <Grid item xs={12} sm={4}>
              <Controller
                name='country_region'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    onBlur={onBlur}
                    label='State'
                    SelectProps={{
                      value: value,
                      displayEmpty: true,
                      onChange: e => {
                        onChange(e)
                        handleStateChange(e)
                      }
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.country_region)}
                    aria-describedby='validation-basic-select'
                    {...(errors.country_region && { helperText: errors.country_region.message })}
                  >
                    <MenuItem value=''>Select</MenuItem>
                    {data &&
                      data?.regionStatesWithDistricts.map((region: any) => (
                        <MenuItem key={region.state} value={region.state}>
                          {region.state}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='location_district'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    onBlur={onBlur}
                    label='District'
                    SelectProps={{
                      value: value,
                      displayEmpty: true,
                      onChange: e => onChange(e)
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.location_district)}
                    aria-describedby='validation-basic-select'
                    {...(errors.location_district && { helperText: errors.location_district.message })}
                  >
                    <MenuItem value=''>Select a District</MenuItem>
                    {districts.map((district, index) => (
                      <MenuItem key={index} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='village'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Village'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder=''
                    error={Boolean(errors.village)}
                    {...(errors.village && { helperText: errors.village.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='latitude'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Latitude'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder=''
                    error={Boolean(errors.latitude)}
                    {...(errors.latitude && { helperText: errors.latitude.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='longitude'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Longitude'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder=''
                    error={Boolean(errors.longitude)}
                    {...(errors.longitude && { helperText: errors.longitude.message })}
                  />
                )}
              />
            </Grid>
          </Fragment>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='contained' color='primary' disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </CleaveWrapper>
  )
}

// ****************************************************************

const Add = () => {
  // ** Hooks
  const auth = useAuth()

  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [basicInfoData, setBasicInfo] = useState<basicInfoFormData>(
    {
      title: '',
      subtitle: '',
      description: '',
      category: '',
      video_url: '',
      tags: '',
      startDate: null,
      endDate: null
    }
    // {
    //   title: 'aaaaaa',
    //   subtitle: 'aaa',
    //   description: 'aaa',
    //   category: 'Food',
    //   video_url: 'https://www.Sokaab.com/projects',
    //   tags: 'ada',
    //   startDate: new Date('2023-01-15'),
    //   endDate: new Date('2023-12-31')
    // }
  )

  const [fundingTargetData, setFundingTarget] = useState<fundingTargetFormData>(
    {
      // project_value: '121',
      recommended_amount: '',
      funding_goal: '',
      end_method: '',
      available_grant: ''
    }
    // {
    //   // project_value: '121',
    //   recommended_amount: '2112',
    //   funding_goal: '121',
    //   end_method: 'Target Date',
    //   available_grant: '121'
    // }
  )

  const [communityInfoData, setCommunityInfoData] = useState<communityInfoFormData>(
    {
      community_name: '',
      organisation_id: auth.user?.user_type === 'organisation_member' ? String(auth.user?.organisation_id || '') : '',
      // entity_id: '',
      country_region: '',
      location_district: '',
      village: '',
      latitude: '',
      longitude: ''
    }
    // {
    //   community_name: 'ajdfa',
    //   organisation_id: '5',
    //   // entity_id: '',
    //   // country_region: 'Banaadir',
    //   // location_district: 'Dharkenley',
    //   country_region: '',
    //   location_district: '',
    //   village: 'adfa',
    //   latitude: '',
    //   longitude: ''
    // }
  )

  // ** Hooks
  const { settings } = useSettings()
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const router = useRouter()

  // ** Hooks
  const {
    isLoading: getHelpersApiLoading,
    error: getHelpersApiError,
    data: getHelpersApiData,
    apiCall: getHelpersApi,
    clearStates: getHelpersClearStates
  } = useApi()

  // ** Var
  const { direction } = settings

  const handleDataSubmit = async (payload: any) => {
    if (payload.type === 'basicInfoDataType') setBasicInfo(payload.data)
    if (payload.type === 'fundingTargetDataType') setFundingTarget(payload.data)
    if (payload.type === 'communityInfoDataType') {
      setCommunityInfoData(payload.data)

      const toastId = toast.loading('Loading...')
      const combinedata = { ...basicInfoData, ...fundingTargetData, ...payload.data }

      console.log('^^^^^^^', combinedata)

      try {
        await addProject(combinedata)
        toast.dismiss(toastId)
        toast.success('Project added succssfully', {
          duration: 2000
        })
        router.push('/projects')
      } catch (err: any) {
        setActiveStep(2)
        toast.dismiss(toastId)
        setErrorMessage(err?.data?.message)

        setTimeout(() => {
          setErrorMessage('')
        }, 2500)
      }
    }
  }

  // Handle Stepper
  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1)
  const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1)

  const renderContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm
            activeStep={step}
            handleNext={handleNext}
            handleBack={handleBack}
            handleDataSubmit={handleDataSubmit}
            basicInfoData={basicInfoData}
            data={getHelpersApiData}
          />
        )

      case 1:
        return (
          <FundingTargetForm
            activeStep={step}
            handleNext={handleNext}
            handleBack={handleBack}
            handleDataSubmit={handleDataSubmit}
            fundingTargetData={fundingTargetData}
            data={getHelpersApiData}
          />
        )

      case 2:
        return (
          <CommunityInfoForm
            activeStep={step}
            handleNext={handleNext}
            handleBack={handleBack}
            handleDataSubmit={handleDataSubmit}
            communityInfoData={communityInfoData}
            data={{ ...getHelpersApiData, user: auth.user }}
          />
        )

      // default:
      //   return 'Unknown Step'
    }
  }

  const gettingProjectHelpers = async () => {
    await getHelpersApi(getProjectHelpers())
  }

  // Api Calling
  useEffect(() => {
    gettingProjectHelpers()
  }, [])

  // Api Success handling
  useEffect(() => {
    if (getHelpersApiData) {
      // toast.success('Organisation deleted Successfully', {
      //   duration: 3000
      // })
    }

    return () => {
      // clearStates()
      // handleClose()
    }
  }, [getHelpersApiData])

  // Api Error handling
  useEffect(() => {
    if (getHelpersApiError)
      toast.error(getHelpersApiError, {
        duration: 3000
      })

    return () => {
      // clearStates()
      // handleClose()
    }
  }, [getHelpersApiError])

  return (
    <DatePickerWrapper>
      <Grid container className='match-height'>
        <PageHeader
          title={
            <Typography style={{ marginBottom: '1rem' }} variant='h4'>
              Add Project
            </Typography>
          }
        />
        <Card>
          {/* Top Counter */}
          <CardContent>
            <StepperWrapper>
              <Stepper
                activeStep={activeStep}
                connector={
                  !smallScreen ? (
                    <Icon icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} />
                  ) : null
                }
              >
                {steps.map((step, index) => {
                  const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

                  return (
                    <Step key={index}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <RenderAvatar
                            variant='rounded'
                            {...(activeStep >= index && { skin: 'light' })}
                            {...(activeStep === index && { skin: 'filled' })}
                            {...(activeStep >= index && { color: 'primary' })}
                            sx={{
                              ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                              ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                            }}
                          >
                            <Icon icon={step.icon} />
                          </RenderAvatar>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                            {/* <Typography className='step-subtitle'>{step.subtitle}</Typography> */}
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </CardContent>

          {errorMessage && (
            <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5 }}>
              {errorMessage}
            </Alert>
          )}

          {!errorMessage && <Divider sx={{ m: '0 !important' }} />}

          {/* Step Content */}
          <CardContent>{renderContent(activeStep)}</CardContent>
        </Card>
        {/* {errorMessage && (
          <Alert variant='filled' severity='error' sx={{ py: 0 }}>
            ajdkfj
          </Alert>
        )} */}
      </Grid>
    </DatePickerWrapper>
  )
}

export default Add

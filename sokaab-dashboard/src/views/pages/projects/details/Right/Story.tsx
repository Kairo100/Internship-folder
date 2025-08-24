import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { Grid, Card, CardHeader, Button, CardContent, CircularProgress, Alert } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import { IProject } from 'src/types/projects'
import useApi from 'src/hooks/useApi'
import { updateProjectStory } from 'src/apis/projects'

type Props = {
  projectData: IProject
}

type PojectStory = {
  story: string
}
const defaultValues: PojectStory = {
  story: ''
}

const schema = yup.object().shape({
  story: yup.string().required().min(5)
})
const ProjectStory = ({ projectData }: Props) => {
  const [isEditDisabled, setIsEditDisabled] = useState(true)

  // ** Hooks
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onBlur',

    resolver: yupResolver(schema)
  })
  const {
    isLoading: updateProjectStoryLoadingApi,
    error: updateProjectStoryErrorApi,
    data: updateProjectStoryApiData,
    apiCall: updateProjectStoryApi,
    clearStates: updateProjectStoryClearStates
  } = useApi()

  // ** Var
  const { projectId } = router.query
  const updateProjectStoryLoadingToast = toast

  const onSubmit = async (data: PojectStory) => {
    if (projectId) await updateProjectStoryApi(updateProjectStory(Number(projectId), data.story))
  }

  useEffect(() => {
    if (projectData) setValue('story', projectData.story)
  }, [projectData])

  // Api Success handling
  useEffect(() => {
    if (updateProjectStoryApiData) {
      setIsEditDisabled(true)
      updateProjectStoryClearStates()
      updateProjectStoryLoadingToast.success('Project story updated successfully', {
        duration: 2000
      })
    }
  }, [updateProjectStoryApiData])

  // Api Error handling
  useEffect(() => {
    if (updateProjectStoryErrorApi) updateProjectStoryLoadingToast.dismiss()

    const timer = setTimeout(() => {
      if (updateProjectStoryErrorApi) {
        updateProjectStoryLoadingToast.dismiss()
        updateProjectStoryClearStates()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [updateProjectStoryErrorApi])

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12}>
        <Card>
          <CardHeader title=' Story' />
          {updateProjectStoryErrorApi && (
            <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: -3 }}>
              {updateProjectStoryErrorApi}
            </Alert>
          )}

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='story'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Story'
                        multiline
                        rows={3}
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder=''
                        disabled={isEditDisabled}
                        error={Boolean(errors.story)}
                        {...(errors.story && { helperText: errors.story.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  {!isEditDisabled ? (
                    <Button
                      type='submit'
                      variant='contained'
                      endIcon={updateProjectStoryLoadingApi && <CircularProgress size={20} style={{ color: '#fff' }} />}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      type='button'
                      variant='contained'
                      onClick={e => {
                        e.preventDefault()
                        setIsEditDisabled(false)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectStory

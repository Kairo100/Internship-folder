import { CSSProperties, Fragment, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { Button, Card, Grid, IconButton, List, ListItem, Box, Typography, Alert, CircularProgress } from '@mui/material'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { uploadFiles } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { IProject } from 'src/types/projects'

interface FileProp {
  name: string
  type: string
  size: number
}

type Props = {
  projectId: number
  projectData: IProject
}

const imageContainerStyles: CSSProperties = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px dotted #e8e7e3',
  borderRadius: '0.4rem',
  overflow: 'hidden',
  height: '25rem'
}

const imageStyles: CSSProperties = {
  objectFit: 'contain',
  height: '25rem',
  width: '25rem',
  borderRadius: '0.4rem'
}

const Files = ({ projectId, projectData }: Props) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [images, setImages] = useState<{
    image1: string | null
    image2: string | null
    image3: string | null
  }>({
    image1: null,
    image2: null,
    image3: null
  })

  const {
    error: uploadImagesErrorApi,
    data: uploadImagesApiData,
    apiCall: uploadImagesApi,
    clearStates: uploadImagesClearStates
  } = useApi()

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: async (acceptedFiles: File[]) => {
      if (selectedImageIndex === null) {
        toast.error('Please select an image slot first')
        return
      }

      const file = acceptedFiles[0]
      const reader = new FileReader()

      reader.onload = () => {
        setImages(prev => ({
          ...prev,
          [`image${selectedImageIndex + 1}`]: reader.result as string
        }))
      }
      reader.readAsDataURL(file)

      // Start upload
      setIsUploading(true)
      setUploadingIndex(selectedImageIndex)

      try {
        const formData = new FormData()
        // Using the correct field name for the API: picture_1, picture_2, or picture_3
        formData.append('name', `image_${selectedImageIndex + 1}`)
        formData.append('image', file)
        // formData.append(`picture_${selectedImageIndex + 1}`, file)
        await uploadImagesApi(uploadFiles(projectId, formData))
      } catch (error) {
        toast.error('Failed to upload image')
        // Revert the image on failure
        setImages(prev => ({
          ...prev,
          [`image${selectedImageIndex + 1}`]: null
        }))
      }
    },
    onDropRejected: () => {
      toast.error('Image must be less than 2 MB in size.', {
        duration: 2000
      })
    },
    disabled: isUploading
  })

  // Convert binary data to base64
  const convertingBinary = (pictureData: any) => {
    try {
      const base64Image = btoa(String.fromCharCode(...Array.from(new Uint8Array(pictureData))))
      return `data:image/jpeg;base64,${base64Image}`
    } catch (error) {
      return ''
    }
  }

  // Initialize images from projectData
  useEffect(() => {
    // setImages({
    //   image1: projectData.url_1 ? convertingBinary(projectData.url_1.data) : null,
    //   image2: projectData.url_2 ? convertingBinary(projectData.url_2.data) : null,
    //   image3: projectData.url_3 ? convertingBinary(projectData.url_3.data) : null
    // })

    setImages({
      image1: projectData?.images?.url_1 ? projectData?.images?.url_1 : null,
      image2: projectData?.images?.url_2 ? projectData?.images?.url_2 : null,
      image3: projectData?.images?.url_3 ? projectData?.images?.url_3 : null
    })
  }, [projectData])

  // Handle API success
  useEffect(() => {
    if (uploadImagesApiData) {
      setIsUploading(false)
      setUploadingIndex(null)
      uploadImagesClearStates()
      toast.success('Image uploaded successfully', {
        duration: 2000
      })
      // Reload to get updated images
      // window.location.reload()
    }
  }, [uploadImagesApiData])

  // Handle API error
  useEffect(() => {
    if (uploadImagesErrorApi) {
      // Remove the image
      uploadingIndex &&
        setImages(prev => ({
          ...prev,
          [`image${uploadingIndex + 1}`]: null
        }))
      setIsUploading(false)
      setSelectedImageIndex(null)
      setUploadingIndex(null)
      toast.error(uploadImagesErrorApi)
      uploadImagesClearStates()
    }
  }, [uploadImagesErrorApi])

  const handleImageSelect = (index: number) => {
    if (isUploading) return
    setSelectedImageIndex(index)
  }

  const handleRemoveImage = (index: number) => {
    if (isUploading) return
    setImages(prev => ({
      ...prev,
      [`image${index + 1}`]: null
    }))
    setSelectedImageIndex(null)

    // You might want to add an API call here to remove the image from the server
    // const formData = new FormData()
    // formData.append(`picture_${index + 1}`, null)
    // uploadImagesApi(uploadFiles(projectId, formData))
  }

  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <Card sx={{ padding: '2rem' }}>
            {uploadImagesErrorApi && (
              <Alert variant='filled' severity='error' sx={{ py: 0, mb: 4 }}>
                {uploadImagesErrorApi}
              </Alert>
            )}

            <Typography variant='h3' sx={{ mb: '1rem' }}>
              Project Images
            </Typography>

            <Grid container spacing={4} sx={{ mb: '2rem' }}>
              {[0, 1, 2].map(index => (
                <Grid item xs={12} lg={4} key={index}>
                  <div
                    style={{
                      ...imageContainerStyles,
                      border: selectedImageIndex === index ? '2px solid #2196f3' : '2px dotted #e8e7e3',
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      opacity: isUploading && uploadingIndex !== index ? 0.5 : 1,
                      position: 'relative'
                    }}
                    onClick={() => handleImageSelect(index)}
                  >
                    {uploadingIndex === index && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2
                        }}
                      >
                        <CircularProgress />
                      </div>
                    )}
                    {images[`image${index + 1}` as keyof typeof images] ? (
                      <Fragment>
                        <img
                          src={images[`image${index + 1}` as keyof typeof images] || ''}
                          alt={`Image ${index + 1}`}
                          style={imageStyles}
                        />
                        <IconButton
                          onClick={e => {
                            e.stopPropagation()
                            handleRemoveImage(index)
                          }}
                          disabled={isUploading}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                            '&.Mui-disabled': {
                              backgroundColor: 'rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          <Icon icon='tabler:x' color='white' />
                        </IconButton>
                      </Fragment>
                    ) : (
                      <Typography variant='h3'>Image {index + 1}</Typography>
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>

            {selectedImageIndex !== null && !isUploading && (
              <Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        mb: 8.75,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                      }}
                    >
                      <Icon icon='tabler:upload' fontSize='1.75rem' />
                    </Box>
                    <Typography variant='h4' sx={{ mb: 2.5 }}>
                      Drop file here or click to upload for Image {selectedImageIndex + 1}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Allowed *.jpeg, *.jpg, *.png</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Max size of 2 MB</Typography>
                  </Box>
                </div>
              </Fragment>
            )}

            {isUploading && (
              <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                Uploading image... Please wait
              </Typography>
            )}

            {!selectedImageIndex && !isUploading && (
              <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                Click on an image slot to upload or edit
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default Files

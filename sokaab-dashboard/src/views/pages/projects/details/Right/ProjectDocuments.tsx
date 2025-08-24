// src/views/pages/projects/view/Right/ProjectDocuments.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import useApi from 'src/hooks/useApi' // Assuming you have a useApi hook
import { fetchProjectDocuments, uploadProjectDocument, deleteProjectDocument } from 'src/apis/projects' // We'll define these API functions

// Define the type for a document, matching what your backend returns (or what you expect)
interface IDocument {
  document_id: number // For now, could be Date.now() for non-persistent items
  project_id: number
  fileName: string
  fileType: string
  url: string
  description?: string | null
  uploadDate: string // ISO string
}

interface Props {
  projectId: number
}

const ProjectDocuments = ({ projectId }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentDescription, setDocumentDescription] = useState<string>('')
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [docToDelete, setDocToDelete] = useState<IDocument | null>(null)

  const {
    isLoading: fetchLoading,
    error: fetchError,
    data: fetchedDocumentsData,
    apiCall: fetchDocumentsApi
  } = useApi<IDocument[]>()

  const {
    isLoading: uploadLoading,
    error: uploadError,
    data: uploadedDocumentData,
    apiCall: uploadDocumentApi,
    clearStates: clearUploadStates
  } = useApi<{ message: string; document: IDocument }>()

  const {
    isLoading: deleteLoading,
    error: deleteError,
    data: deleteData,
    apiCall: deleteDocumentApi,
    clearStates: clearDeleteStates
  } = useApi<{ message: string }>()

  // Fetch documents on component mount and when projectId changes
  useEffect(() => {
    const fetchData = async () => {
      if (projectId && fetchDocumentsApi) {
        await fetchDocumentsApi(fetchProjectDocuments(projectId));
      }
    };
    fetchData();
  }, [projectId, fetchDocumentsApi]);

  // Handle successful fetch
  useEffect(() => {
    if (fetchedDocumentsData) {
      setDocuments(fetchedDocumentsData);
    }
  }, [fetchedDocumentsData]);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // Handle document description change
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDocumentDescription(event.target.value);
  };

  // Handle file upload submission
  const handleUploadSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload.', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (documentDescription) {
      formData.append('description', documentDescription);
    }
    // Optional: if you want to explicitly send a filename
    formData.append('fileName', selectedFile.name);

    await uploadDocumentApi(uploadProjectDocument(projectId, formData));
  };

  // Handle successful upload
  useEffect(() => {
    if (uploadedDocumentData) {
      toast.success(uploadedDocumentData.message, { duration: 3000 });
      // When Prisma is disabled, the 'document' returned by backend is simulated.
      // If backend is active (Prisma ON), it will be a real saved document.
      setDocuments(prev => [...prev, uploadedDocumentData.document]);
      setSelectedFile(null); // Clear selected file
      setDocumentDescription(''); // Clear description
      clearUploadStates(); // Clear API hook states
    }
  }, [uploadedDocumentData, clearUploadStates]);

  // Handle upload errors
  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError, { duration: 3000 });
      clearUploadStates();
    }
  }, [uploadError, clearUploadStates]);

  // Handle delete confirmation dialog
  const handleDeleteClick = (document: IDocument) => {
    setDocToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (docToDelete) {
      await deleteDocumentApi(deleteProjectDocument(projectId, docToDelete.document_id));
      setDeleteDialogOpen(false);
      setDocToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocToDelete(null);
  };

  // Handle successful deletion
  useEffect(() => {
    if (deleteData) {
      toast.success(deleteData.message, { duration: 3000 });
      setDocuments(prev => prev.filter(doc => doc.document_id !== docToDelete?.document_id));
      clearDeleteStates();
    }
  }, [deleteData, docToDelete, clearDeleteStates]);

  // Handle delete errors
  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError, { duration: 3000 });
      clearDeleteStates();
    }
  }, [deleteError, clearDeleteStates]);


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Upload New Document
          </Typography>
          <Box component='form' onSubmit={handleUploadSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <input type='file' onChange={handleFileChange} accept='*' style={{ display: 'none' }} id='file-upload-button' />
            <label htmlFor='file-upload-button'>
              <Button
                variant='outlined'
                component='span'
                startIcon={<Icon icon='tabler:upload' />}
                disabled={uploadLoading}
              >
                {selectedFile ? selectedFile.name : 'Choose File'}
              </Button>
            </label>
            {selectedFile && (
              <Typography variant='body2' sx={{ ml: 2, fontStyle: 'italic' }}>
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </Typography>
            )}

            <TextField
              fullWidth
              label='Document Description (Optional)'
              value={documentDescription}
              onChange={handleDescriptionChange}
              placeholder='e.g., Project Proposal, Budget Sheet'
            />

            <Button
              type='submit'
              variant='contained'
              disabled={!selectedFile || uploadLoading}
              endIcon={uploadLoading && <CircularProgress size={20} color='inherit' />}
            >
              Upload Document
            </Button>
          </Box>
          {uploadError && (
            <Alert severity='error' sx={{ mt: 3 }}>
              {uploadError}
            </Alert>
          )}
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Existing Documents
          </Typography>
          {fetchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              {/* <CircularProgress /> */}
            </Box>
          ) : fetchError ? (
            <Alert severity='error'>Error fetching documents: {fetchError}</Alert>
          ) : documents.length === 0 ? (
            <Typography variant='body2' color='text.secondary'>
              No documents found for this project.
            </Typography>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem key={doc.document_id} divider>
                  <ListItemText
                    primary={
                      <a href={doc.url} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Icon icon='tabler:file' fontSize={20} />
                          <Typography variant='body1' sx={{ fontWeight: 500 }}>
                            {doc.fileName || 'Untitled Document'}
                          </Typography>
                        </Box>
                      </a>
                    }
                    secondary={
                      <Typography variant='body2' color='text.secondary'>
                        {doc.description || 'No description'} ({doc.fileType})
                        {doc.uploadDate && ` - Uploaded on: ${new Date(doc.uploadDate).toLocaleDateString()}`}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge='end' aria-label='download' href={doc.url} target='_blank' rel='noopener noreferrer'>
                      <Icon icon='tabler:download' />
                    </IconButton>
                    <IconButton edge='end' aria-label='delete' onClick={() => handleDeleteClick(doc)} disabled={deleteLoading}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Card>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{docToDelete?.fileName}"?</Typography>
          {deleteLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={20} />
            </Box>
          )}
          {deleteError && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='secondary' variant='outlined' disabled={deleteLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained' disabled={deleteLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ProjectDocuments
// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import axiosInstance from 'src/apis/apiConfig'

// ** Utils
import { getInitials } from 'src/@core/utils/get-initials'

// Types
interface OrganizationMember {
  member_id: number
  organisation_id: number
  full_name: string
  email_address: string
  telephone_number: string
  position_held: string
  email_verified: boolean
  date_time_added: string
  added_by: string
}

interface MemberFormData {
  full_name: string
  email_address: string
  telephone_number: string
  position_held: string
  password?: string
}

const OrganizationMembers = () => {
  // ** State
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ** Dialog States
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null)
  const [formData, setFormData] = useState<MemberFormData>({
    full_name: '',
    email_address: '',
    telephone_number: '',
    position_held: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<MemberFormData>>({})
  const [submitting, setSubmitting] = useState(false)

  // ** Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  })

  // ** Hooks
  const auth = useAuth()

  // ** Effects
  useEffect(() => {
    fetchMembersData()
  }, [])

  const fetchMembersData = useCallback(async () => {
    if (auth.user?.organisation_id) {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/organisations/my-organization/members')

        // Check if the response has the expected structure
        if (response.data && typeof response.data === 'object') {
          const membersData = response.data.data || response.data
          setMembers(Array.isArray(membersData) ? membersData : [])
        } else {
          setMembers([])
        }

        setError(null)
      } catch (error: any) {
        console.error('Error fetching members:', error)
        if (error.response?.status === 403) {
          setError('Access denied. Please ensure you are logged in as an organization member.')
        } else if (error.response?.status === 404) {
          setError('Organization not found. Please contact support.')
        } else {
          setError(`Failed to load team members: ${error.response?.data?.message || error.message}`)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
      setError('No organization ID found. Please check your login status.')
    }
  }, [auth.user?.organisation_id])

  // ** Helper Functions
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      email_address: '',
      telephone_number: '',
      position_held: '',
      password: ''
    })
    setFormErrors({})
  }

  const validateForm = (data: MemberFormData, isEdit = false): boolean => {
    const errors: Partial<MemberFormData> = {}

    if (!data.full_name.trim()) {
      errors.full_name = 'Full name is required'
    } else if (data.full_name.length < 5 || data.full_name.length > 20) {
      errors.full_name = 'Full name must be between 5 and 20 characters'
    }

    if (!data.email_address.trim()) {
      errors.email_address = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email_address)) {
      errors.email_address = 'Please enter a valid email address'
    }

    if (!data.telephone_number.trim()) {
      errors.telephone_number = 'Phone number is required'
    } else if (data.telephone_number.length < 7 || data.telephone_number.length > 16) {
      errors.telephone_number = 'Phone number must be between 7 and 16 characters'
    }

    if (!data.position_held.trim()) {
      errors.position_held = 'Position is required'
    } else if (data.position_held.length > 20) {
      errors.position_held = 'Position must be less than 20 characters'
    }

    if (!isEdit && (!data.password || !data.password.trim())) {
      errors.password = 'Password is required'
    } else if (data.password && data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ** CRUD Operations
  const handleCreateMember = async () => {
    if (!validateForm(formData)) return

    setSubmitting(true)
    try {
      const response = await axiosInstance.post('/organisations/my-organization/members', formData)

      if (response.data.statusCode === 200) {
        showSnackbar('Team member added successfully!')
        setOpenCreateDialog(false)
        resetForm()
        fetchMembersData()
      }
    } catch (error: any) {
      console.error('Error creating member:', error)
      showSnackbar(error.response?.data?.message || 'Failed to add team member. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditMember = async () => {
    if (!selectedMember || !validateForm(formData, true)) return

    setSubmitting(true)
    try {
      // Remove password from payload if empty
      const updateData: Partial<MemberFormData> = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }

      const response = await axiosInstance.put(
        `/organisations/my-organization/members/${selectedMember.member_id}`,
        updateData
      )

      if (response.data.statusCode === 200) {
        showSnackbar('Team member updated successfully!')
        setOpenEditDialog(false)
        resetForm()
        setSelectedMember(null)
        fetchMembersData()
      }
    } catch (error: any) {
      console.error('Error updating member:', error)
      showSnackbar(error.response?.data?.message || 'Failed to update team member. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteMember = async () => {
    if (!selectedMember) return

    setSubmitting(true)
    try {
      const response = await axiosInstance.delete(`/organisations/my-organization/members/${selectedMember.member_id}`)

      if (response.data.statusCode === 200) {
        showSnackbar('Team member removed successfully!')
        setOpenDeleteDialog(false)
        setSelectedMember(null)
        fetchMembersData()
      }
    } catch (error: any) {
      console.error('Error deleting member:', error)
      showSnackbar(error.response?.data?.message || 'Failed to remove team member. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ** Dialog Handlers
  const openCreate = () => {
    resetForm()
    setOpenCreateDialog(true)
  }

  const openEdit = (member: OrganizationMember) => {
    setSelectedMember(member)
    setFormData({
      full_name: member.full_name,
      email_address: member.email_address,
      telephone_number: member.telephone_number,
      position_held: member.position_held,
      password: '' // Don't populate password for security
    })
    setFormErrors({})
    setOpenEditDialog(true)
  }

  const openDelete = (member: OrganizationMember) => {
    setSelectedMember(member)
    setOpenDeleteDialog(true)
  }

  const closeDialogs = () => {
    setOpenCreateDialog(false)
    setOpenEditDialog(false)
    setOpenDeleteDialog(false)
    setSelectedMember(null)
    resetForm()
  }

  const renderMemberAvatar = (member: OrganizationMember) => {
    return (
      <CustomAvatar skin='light' sx={{ width: 40, height: 40, mr: 3 }}>
        {getInitials(member.full_name)}
      </CustomAvatar>
    )
  }

  const renderPositionChip = (position: string) => {
    let color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary'

    switch (position?.toLowerCase()) {
      case 'manager':
      case 'director':
        color = 'success'
        break
      case 'coordinator':
      case 'supervisor':
        color = 'warning'
        break
      case 'volunteer':
        color = 'secondary'
        break
      default:
        color = 'primary'
    }

    return <Chip label={position || 'Member'} color={color} variant='outlined' size='small' />
  }

  if (auth.user?.user_type !== 'organisation_member') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Access Denied. This page is only accessible to organization members.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h4' sx={{ mb: 4 }}>
        Team Members - {auth.user?.organisation_name}
      </Typography>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Organization Team'
              subheader={`${members.length} member${members.length !== 1 ? 's' : ''} in your organization`}
              action={
                <Button
                  variant='contained'
                  startIcon={<Icon icon='tabler:plus' />}
                  onClick={openCreate}
                  disabled={loading}
                >
                  Add Member
                </Button>
              }
            />
            <CardContent>
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography>Loading team members...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color='error'>Error: {error}</Typography>
                </Box>
              ) : members.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CustomAvatar skin='light' sx={{ width: 80, height: 80, mb: 4, mx: 'auto' }}>
                    <Icon icon='tabler:users-group' fontSize='2.5rem' />
                  </CustomAvatar>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    No Team Members Found
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
                    No other members found in your organization. Start by adding your first team member.
                  </Typography>
                  <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={openCreate}>
                    Add First Member
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map(member => (
                        <TableRow key={member.member_id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {renderMemberAvatar(member)}
                              <Box>
                                <Typography variant='subtitle2'>{member.full_name}</Typography>
                                <Typography variant='body2' color='text.secondary'>
                                  {member.email_address}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{renderPositionChip(member.position_held)}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Icon icon='tabler:phone' fontSize='1rem' />
                              <Typography variant='body2' sx={{ ml: 1 }}>
                                {member.telephone_number || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {new Date(member.date_time_added).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align='right'>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title='Edit Member'>
                                <IconButton size='small' color='primary' onClick={() => openEdit(member)}>
                                  <Icon icon='tabler:edit' fontSize='1.125rem' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Delete Member'>
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => openDelete(member)}
                                  disabled={member.member_id === (auth.user?.member_id || Number(auth.user?.id))}
                                >
                                  <Icon icon='tabler:trash' fontSize='1.125rem' />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Organization Info Card */}
        {/* <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <CustomAvatar skin='light' sx={{ mr: 3, width: 50, height: 50 }}>
                  <Icon icon='tabler:building' fontSize='1.75rem' />
                </CustomAvatar>
                <Box>
                  <Typography variant='h6'>Your Role</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {auth.user?.position_held || 'Member'}
                  </Typography>
                </Box>
              </Box>

              <Typography variant='subtitle2' sx={{ mb: 2 }}>
                Organization Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary'>
                  Organization
                </Typography>
                <Typography variant='body2'>{auth.user?.organisation_name}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary'>
                  Your Position
                </Typography>
                <Typography variant='body2'>{auth.user?.position_held || 'Team Member'}</Typography>
              </Box>

              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Member Since
                </Typography>
                <Typography variant='body2'>Member of this organization</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Create Member Dialog */}
      <Dialog open={openCreateDialog} onClose={closeDialogs} maxWidth='sm' fullWidth>
        <DialogTitle>Add New Team Member</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 4 }}>
            Add a new team member to your organization. They will be able to login and access your organization's data.
          </DialogContentText>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label='Full Name'
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              error={!!formErrors.full_name}
              helperText={formErrors.full_name}
              fullWidth
              required
            />

            <TextField
              label='Email Address'
              type='email'
              value={formData.email_address}
              onChange={e => setFormData(prev => ({ ...prev, email_address: e.target.value }))}
              error={!!formErrors.email_address}
              helperText={formErrors.email_address}
              fullWidth
              required
            />

            <TextField
              label='Phone Number'
              value={formData.telephone_number}
              onChange={e => setFormData(prev => ({ ...prev, telephone_number: e.target.value }))}
              error={!!formErrors.telephone_number}
              helperText={formErrors.telephone_number}
              fullWidth
              required
            />

            <TextField
              label='Position'
              value={formData.position_held}
              onChange={e => setFormData(prev => ({ ...prev, position_held: e.target.value }))}
              error={!!formErrors.position_held}
              helperText={formErrors.position_held}
              fullWidth
              required
            />

            <TextField
              label='Password'
              type='password'
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateMember}
            variant='contained'
            disabled={submitting}
            startIcon={
              submitting ? <Icon icon='tabler:loader-2' className='animate-spin' /> : <Icon icon='tabler:plus' />
            }
          >
            {submitting ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={openEditDialog} onClose={closeDialogs} maxWidth='sm' fullWidth>
        <DialogTitle>Edit Team Member</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 4 }}>
            Update the team member's information. Leave the password field empty if you don't want to change it.
          </DialogContentText>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label='Full Name'
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              error={!!formErrors.full_name}
              helperText={formErrors.full_name}
              fullWidth
              required
            />

            <TextField
              label='Email Address'
              type='email'
              value={formData.email_address}
              onChange={e => setFormData(prev => ({ ...prev, email_address: e.target.value }))}
              error={!!formErrors.email_address}
              helperText={formErrors.email_address}
              fullWidth
              required
            />

            <TextField
              label='Phone Number'
              value={formData.telephone_number}
              onChange={e => setFormData(prev => ({ ...prev, telephone_number: e.target.value }))}
              error={!!formErrors.telephone_number}
              helperText={formErrors.telephone_number}
              fullWidth
              required
            />

            <TextField
              label='Position'
              value={formData.position_held}
              onChange={e => setFormData(prev => ({ ...prev, position_held: e.target.value }))}
              error={!!formErrors.position_held}
              helperText={formErrors.position_held}
              fullWidth
              required
            />

            <TextField
              label='New Password (optional)'
              type='password'
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={!!formErrors.password}
              helperText={formErrors.password || 'Leave empty to keep current password'}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleEditMember}
            variant='contained'
            disabled={submitting}
            startIcon={
              submitting ? (
                <Icon icon='tabler:loader-2' className='animate-spin' />
              ) : (
                <Icon icon='tabler:device-floppy' />
              )
            }
          >
            {submitting ? 'Updating...' : 'Update Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={openDeleteDialog} onClose={closeDialogs} maxWidth='xs' fullWidth>
        <DialogTitle>Remove Team Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{selectedMember?.full_name}</strong> from your organization? This
            action cannot be undone and they will no longer be able to access your organization's data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteMember}
            color='error'
            variant='contained'
            disabled={submitting}
            startIcon={
              submitting ? <Icon icon='tabler:loader-2' className='animate-spin' /> : <Icon icon='tabler:trash' />
            }
          >
            {submitting ? 'Removing...' : 'Remove Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OrganizationMembers

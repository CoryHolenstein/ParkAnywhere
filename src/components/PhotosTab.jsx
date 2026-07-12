import { useState } from 'react'
import { Box, Button, ImageList, ImageListItem, ImageListItemBar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export default function PhotosTab() {
  const [photos, setPhotos] = useState([
    { id: 1, name: 'Vacation.jpg', src: 'https://via.placeholder.com/300x300?text=Vacation', uploadedDate: '2024-01-07' },
    { id: 2, name: 'Family.jpg', src: 'https://via.placeholder.com/300x300?text=Family', uploadedDate: '2024-01-06' },
    { id: 3, name: 'Sunset.jpg', src: 'https://via.placeholder.com/300x300?text=Sunset', uploadedDate: '2024-01-05' },
    { id: 4, name: 'Mountain.jpg', src: 'https://via.placeholder.com/300x300?text=Mountain', uploadedDate: '2024-01-04' },
  ])
  const [openDialog, setOpenDialog] = useState(false)
  const [photoName, setPhotoName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleOpenDialog = () => {
    setPhotoName('')
    setError(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleAddPhoto = async () => {
    if (!photoName.trim()) {
      setError('Photo name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call to API Gateway/Lambda
      const newPhoto = {
        id: photos.length + 1,
        name: photoName,
        src: 'https://via.placeholder.com/300x300?text=NewPhoto',
        uploadedDate: new Date().toISOString().split('T')[0],
      }
      setPhotos([newPhoto, ...photos])
      handleCloseDialog()
    } catch (err) {
      setError('Failed to add photo')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePhoto = async (id) => {
    try {
      // TODO: Replace with actual API call to API Gateway/Lambda
      setPhotos(photos.filter((photo) => photo.id !== id))
    } catch (err) {
      setError('Failed to delete photo')
      console.error(err)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <h2>Photos</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Photo
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      {photos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <p>No photos yet. Start uploading!</p>
        </Box>
      ) : (
        <ImageList sx={{ width: '100%' }} cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={8}>
          {photos.map((photo) => (
            <ImageListItem key={photo.id}>
              <img
                src={photo.src}
                alt={photo.name}
                loading="lazy"
                style={{ cursor: 'pointer', width: '100%', height: 'auto', borderRadius: '8px' }}
              />
              <ImageListItemBar
                title={photo.name}
                subtitle={photo.uploadedDate}
                position="bottom"
                sx={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  borderRadius: '0 0 8px 8px'
                }}
                actionIcon={
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeletePhoto(photo.id)}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Delete
                  </Button>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
   
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Photo</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Photo Name"
            value={photoName}
            onChange={(e) => setPhotoName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddPhoto()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddPhoto} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

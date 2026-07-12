import { useState } from 'react'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export default function VideosTab() {
  const [videos, setVideos] = useState([
    { id: 1, name: 'Tutorial.mp4', duration: '12:45', size: '125 MB', uploadedDate: '2024-01-03' },
    { id: 2, name: 'Vlog.mp4', duration: '8:30', size: '95 MB', uploadedDate: '2024-01-02' },
    { id: 3, name: 'Recording.mp4', duration: '45:20', size: '450 MB', uploadedDate: '2024-01-01' },
  ])
  const [openDialog, setOpenDialog] = useState(false)
  const [videoName, setVideoName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleOpenDialog = () => {
    setVideoName('')
    setError(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleAddVideo = async () => {
    if (!videoName.trim()) {
      setError('Video name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call to API Gateway/Lambda
      const newVideo = {
        id: videos.length + 1,
        name: videoName,
        duration: '0:00',
        size: '0 MB',
        uploadedDate: new Date().toISOString().split('T')[0],
      }
      setVideos([newVideo, ...videos])
      handleCloseDialog()
    } catch (err) {
      setError('Failed to add video')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (id) => {
    try {
      // TODO: Replace with actual API call to API Gateway/Lambda
      setVideos(videos.filter((video) => video.id !== id))
    } catch (err) {
      setError('Failed to delete video')
      console.error(err)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <h2>Videos</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Video
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Video Name</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} hover>
                <TableCell>{video.name}</TableCell>
                <TableCell>{video.duration}</TableCell>
                <TableCell>{video.size}</TableCell>
                <TableCell>{video.uploadedDate}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Video</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Video Name"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddVideo()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddVideo} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

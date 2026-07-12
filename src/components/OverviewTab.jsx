import { useState, useEffect } from 'react'
import { Box, Paper, Typography, Grid, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import ImageIcon from '@mui/icons-material/Image'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { GetItemCount } from '../api/GetItemCount'
import { GetFolderSize } from '../api/GetFolderSize'
import { ListFiles } from '../api/ListFiles'
import useAuthStore from '../store/useAuthStore'

export default function OverviewTab() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [itemCount, setItemCount] = useState(null)
  const [folderSize, setFolderSize] = useState(null)
  const user = useAuthStore((s) => s.user)


  useEffect(() => {
    if (!user?.id) {
      setFiles([])
      return
    }

    fetchLatestFiles(user.id)
    
    async function fetchItemCount() {
      if (user?.id) {
        try {
          const result = await GetItemCount(user.id)
          setItemCount(result)
        } catch (err) {
          console.error('Failed to fetch item count:', err)
        }
      }
    }
     async function fetchFolderSize() {
      if (user?.id) {
        try {
          const result = await GetFolderSize(user.id)
          setFolderSize(result)
        } catch (err) {
          console.error('Failed to fetch folder size:', err)
        }
      }
    }
    fetchItemCount()
    fetchFolderSize()
  }, [user?.id])

  const fetchLatestFiles = async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await ListFiles(userId)
      const latestFiles = (response.files || [])
        .filter((file) => file.name && !file.name.endsWith('/'))
        .sort((a, b) => new Date(b.uploadedDate || 0) - new Date(a.uploadedDate || 0))
        .slice(0, 5)
        .map((file) => ({
          id: file.id,
          name: file.name,
          date: file.uploadedDate || 'Unknown date',
          size: file.size || '0 Bytes',
          type: getFileType(file.name)
        }))

      setFiles(latestFiles)
    } catch (err) {
      setError('Failed to fetch files. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const photoExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'm4v']

    if (photoExtensions.includes(extension)) {
      return 'photo'
    }
    if (videoExtensions.includes(extension)) {
      return 'video'
    }
    return 'file'
  }

  const getIcon = (type) => {
    switch (type) {
      case 'photo':
        return <ImageIcon sx={{ marginRight: 1 }} />
      case 'video':
        return <VideoLibraryIcon sx={{ marginRight: 1 }} />
      case 'file':
      default:
        return <InsertDriveFileIcon sx={{ marginRight: 1 }} />
    }
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2.5,
          borderRadius: 3,
          border: '1px solid rgba(36, 84, 122, 0.16)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,249,255,0.98) 100%)',
          boxShadow: '0 10px 26px rgba(22, 58, 92, 0.09)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#214d74', letterSpacing: '0.01em' }}>
          Overview
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#4d6a83' }}>
          Snapshot of your storage activity and latest uploaded files.
        </Typography>
      </Paper>

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.2,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'linear-gradient(135deg, #1b5f9b 0%, #2b78b8 100%)',
              color: 'white',
              boxShadow: '0 10px 22px rgba(22, 77, 124, 0.28)'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {itemCount ? itemCount.itemCount : '0'}
            </Typography>
            <Typography variant="body2">{loading ? 'Loading...' : 'Total Files'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.2,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'linear-gradient(135deg, #0f7d89 0%, #11a5a1 100%)',
              color: 'white',
              boxShadow: '0 10px 22px rgba(12, 99, 106, 0.28)'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {folderSize ? `${folderSize.totalSizeMB} MB` : '0 MB'}
            </Typography>
            <Typography variant="body2">{loading ? 'Loading...' : 'Storage Used'}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid rgba(36, 84, 122, 0.14)',
          boxShadow: '0 8px 22px rgba(21, 53, 91, 0.08)'
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 700, color: '#214d74' }}>
          Latest Files
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : files.length === 0 ? (
          <Typography sx={{ color: '#5f788f' }}>No files yet. Start uploading!</Typography>
        ) : (
          <List>
            {files.map((file) => (
              <ListItem key={file.id} sx={{ px: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {getIcon(file.type)}
                  <ListItemText
                    primary={file.name}
                    secondary={`Added on ${file.date} • ${file.size}`}
                    primaryTypographyProps={{ fontWeight: 600, color: '#2a4f70' }}
                    secondaryTypographyProps={{ color: '#668099' }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}

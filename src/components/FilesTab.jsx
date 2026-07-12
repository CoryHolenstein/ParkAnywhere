import { useState, useRef, useEffect } from 'react'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FolderIcon from '@mui/icons-material/Folder'
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined'
import { AddFile } from '../api/AddFile'
import { DeleteFile } from '../api/DeleteFile'
import { ListFiles } from '../api/ListFiles'
import { CreateFolder } from '../api/CreateFolder'
import { MoveFile } from '../api/MoveFile'
import useAuthStore from '../store/useAuthStore'

export default function FilesTab() {
  const { user } = useAuthStore()
  const [files, setFiles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openFolderDialog, setOpenFolderDialog] = useState(false)
  const [openMoveDialog, setOpenMoveDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedFileToDelete, setSelectedFileToDelete] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedFileToMove, setSelectedFileToMove] = useState(null)
  const [moveDestination, setMoveDestination] = useState('')
  const [currentFolderPath, setCurrentFolderPath] = useState('')
  const [folderName, setFolderName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(true)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const normalizeFiles = (rawFiles) =>
    (rawFiles || []).map((file) => {
      const isFolder = file.name?.endsWith('/')
      return {
        ...file,
        isFolder,
        size: isFolder ? '-' : file.size
      }
    })

  const getParentPath = (path) => {
    const trimmed = (path || '').replace(/\/$/, '')
    if (!trimmed.includes('/')) {
      return ''
    }
    return `${trimmed.substring(0, trimmed.lastIndexOf('/') + 1)}`
  }

  const deriveFolderPaths = (allFiles) => {
    const folderPaths = new Set([''])

    for (const file of allFiles) {
      const normalizedName = file.name || ''
      if (!normalizedName) {
        continue
      }

      if (normalizedName.endsWith('/')) {
        folderPaths.add(normalizedName)
      }

      const segments = normalizedName.replace(/\/$/, '').split('/')
      if (segments.length > 1) {
        for (let i = 1; i < segments.length; i++) {
          folderPaths.add(`${segments.slice(0, i).join('/')}/`)
        }
      }
    }

    return Array.from(folderPaths).sort((a, b) => a.localeCompare(b))
  }

  const getVisibleItems = (allFiles, folderPath) => {
    const folderMap = new Map()
    const visibleFileItems = []

    for (const file of allFiles) {
      const fileName = file.name || ''
      if (!fileName.startsWith(folderPath)) {
        continue
      }

      const remainingPath = fileName.slice(folderPath.length)
      if (!remainingPath) {
        continue
      }

      const nextSlashIndex = remainingPath.indexOf('/')
      if (nextSlashIndex === -1) {
        if (!file.isFolder) {
          visibleFileItems.push(file)
        }
        continue
      }

      const immediateFolderName = `${remainingPath.slice(0, nextSlashIndex)}/`
      const fullFolderPath = `${folderPath}${immediateFolderName}`
      if (!folderMap.has(fullFolderPath)) {
        folderMap.set(fullFolderPath, {
          id: `folder-${fullFolderPath}`,
          name: immediateFolderName,
          size: '-',
          uploadedDate: '',
          isFolder: true,
          path: fullFolderPath
        })
      }
    }

    const folders = Array.from(folderMap.values())
    return [...folders, ...visibleFileItems]
  }

  const fetchFiles = async () => {
    if (!user?.id) {
      setFiles([])
      return
    }

    try {
      setLoadingFiles(true)
      const result = await ListFiles(user.id)
      setFiles(normalizeFiles(result.files))
    } catch (err) {
      console.error('Failed to fetch files:', err)
      setError('Failed to load files')
    } finally {
      setLoadingFiles(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [user?.id])

  const handleOpenDialog = () => {
    setSelectedFiles([])
    setError(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedFiles([])
  }

  const handleOpenFolderDialog = () => {
    setFolderName('')
    setError(null)
    setOpenFolderDialog(true)
  }

  const handleOpenMoveDialog = (file) => {
    setSelectedFileToMove(file)
    setMoveDestination('')
    setError(null)
    setOpenMoveDialog(true)
  }

  const handleCloseFolderDialog = () => {
    setOpenFolderDialog(false)
    setFolderName('')
  }

  const handleCloseMoveDialog = () => {
    setOpenMoveDialog(false)
    setSelectedFileToMove(null)
    setMoveDestination('')
  }

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setError('Folder name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await CreateFolder(user.id, folderName.trim(), currentFolderPath)
      await fetchFiles()
      handleCloseFolderDialog()
    } catch (err) {
      setError('Failed to create folder. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event) => {
    const filesToUpload = Array.from(event.target.files || [])
    if (filesToUpload.length > 0) {
      setSelectedFiles(filesToUpload)
      setError(null)
    }
  }

  const handleAddFile = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await Promise.all(selectedFiles.map((file) => AddFile(user.id, file)))

      const uploadedFiles = selectedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: formatFileSize(file.size),
        uploadedDate: new Date().toISOString().split('T')[0],
      }))

      setFiles([...uploadedFiles, ...files])
      handleCloseDialog()
    } catch (err) {
      setError('Failed to upload file. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleOpenDeleteDialog = (file) => {
    setSelectedFileToDelete(file)
    setError(null)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedFileToDelete(null)
  }

  const handleDeleteFile = async () => {
    if (!selectedFileToDelete?.name) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await DeleteFile(user.id, selectedFileToDelete.name)
      setFiles((prevFiles) => prevFiles.filter((file) => file.name !== selectedFileToDelete.name))
      handleCloseDeleteDialog()
    } catch (err) {
      setError('Failed to delete file')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMoveFile = async () => {
    if (!selectedFileToMove) {
      return
    }

    if (moveDestination === '') {
      setError('Please choose a destination folder')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await MoveFile(user.id, selectedFileToMove.name, moveDestination)
      await fetchFiles()
      handleCloseMoveDialog()
    } catch (err) {
      setError('Failed to move file. Ensure the move-file API route is available.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const visibleItems = getVisibleItems(files, currentFolderPath)
  const folderOptions = deriveFolderPaths(files)

  const filteredFiles = visibleItems.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2,
          borderRadius: 3,
          border: '1px solid rgba(36, 84, 122, 0.16)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,249,255,0.98) 100%)',
          boxShadow: '0 10px 26px rgba(22, 58, 92, 0.09)'
        }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#214d74', letterSpacing: '0.01em' }}>
            Files Library
          </Typography>
          <Typography variant="body2" sx={{ color: '#4d6a83', mt: 0.5 }}>
            Browse, search, and manage your uploaded files in one place.
          </Typography>
          <Typography variant="caption" sx={{ color: '#5e7f9b', fontWeight: 600, display: 'block', mt: 0.5 }}>
            {filteredFiles.length} visible item(s)
          </Typography>
          <Typography variant="caption" sx={{ color: '#5e7f9b', display: 'block', mt: 0.25 }}>
            Current folder: /{currentFolderPath || ''}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {currentFolderPath && (
            <Button
              variant="outlined"
              startIcon={<ArrowUpwardOutlinedIcon />}
              onClick={() => setCurrentFolderPath(getParentPath(currentFolderPath))}
              sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
            >
              Up
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<CreateNewFolderIcon />}
            onClick={handleOpenFolderDialog}
            sx={{
              borderRadius: 999,
              px: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #eef5ff 0%, #e4f0ff 100%)',
              color: '#1c5182',
              border: '1px solid #c5dcf4',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #e3efff 0%, #d8e8ff 100%)',
                boxShadow: '0 6px 14px rgba(44, 98, 149, 0.2)'
              }
            }}
          >
            New Folder
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              borderRadius: 999,
              px: 2.2,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #176ab3 0%, #1195a0 100%)',
              boxShadow: '0 8px 18px rgba(19, 94, 151, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f5da0 0%, #0a858e 100%)',
                boxShadow: '0 10px 22px rgba(14, 81, 132, 0.4)'
              }
            }}
          >
            Add File
          </Button>
        </Box>
      </Box>
      </Paper>

      <TextField
        fullWidth
        placeholder="Search files by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            backgroundColor: 'rgba(255,255,255,0.9)'
          }
        }}
      />

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      {loadingFiles ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow key={file.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {file.isFolder && <FolderIcon color="primary" fontSize="small" />}
                    {file.name}
                  </Box>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadedDate || '-'}</TableCell>
                <TableCell align="right">
                  {file.isFolder ? (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FolderOpenOutlinedIcon />}
                      onClick={() => setCurrentFolderPath(file.path || `${currentFolderPath}${file.name}`)}
                    >
                      Open
                    </Button>
                  ) : (
                    <Box sx={{ display: 'inline-flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DriveFileMoveOutlinedIcon />}
                        onClick={() => handleOpenMoveDialog(file)}
                      >
                        Move to
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleOpenDeleteDialog(file)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredFiles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  {searchTerm ? 'No files match your search.' : 'No files found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file(s) selected`
                : 'Click to select file(s)'}
            </Typography>
            {selectedFiles.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total size: {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddFile} variant="contained" disabled={loading || selectedFiles.length === 0}>
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFolderDialog} onClose={handleCloseFolderDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder()
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFolderDialog}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained" disabled={loading || !folderName.trim()}>
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMoveDialog} onClose={handleCloseMoveDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Move File To</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            File: {selectedFileToMove?.name}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="move-destination-label">Destination Folder</InputLabel>
            <Select
              labelId="move-destination-label"
              value={moveDestination}
              label="Destination Folder"
              onChange={(e) => setMoveDestination(e.target.value)}
            >
              {folderOptions.map((folderPath) => (
                <MenuItem key={folderPath || 'root'} value={folderPath}>
                  {folderPath ? `/${folderPath}` : '/ (root)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMoveDialog}>Cancel</Button>
          <Button onClick={handleMoveFile} variant="contained" disabled={loading || !selectedFileToMove}>
            {loading ? <CircularProgress size={24} /> : 'Move'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete File?</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This action cannot be undone.
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
            {selectedFileToDelete?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>Cancel</Button>
          <Button onClick={handleDeleteFile} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

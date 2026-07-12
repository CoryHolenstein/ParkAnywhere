import {
  Alert,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { statusOptions } from '../data/mockData'
import { parkingService } from '../services/parkingService'
import { formatDateTime } from '../utils/formatting'

export default function EnforcerPage() {
  const [lots, setLots] = useState([])
  const [selectedLotId, setSelectedLotId] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    parkingService.getLandingSnapshot().then((snapshot) => {
      setLots(snapshot.lots)
    })
  }, [])

  const lotIds = useMemo(() => {
    return selectedLotId ? [selectedLotId] : []
  }, [selectedLotId])

  useEffect(() => {
    parkingService
      .searchReservations({ lotIds, query, status })
      .then((result) => setRows(result))
      .catch(() => setError('Could not load reservations.'))
  }, [lotIds, query, status])

  const handleStatusChange = async (reservationId, nextStatus) => {
    await parkingService.updateReservationStatus(reservationId, nextStatus)
    const refreshed = await parkingService.searchReservations({ lotIds, query, status })
    setRows(refreshed)
  }

  return (
    <Stack spacing={3} className="page-shell">
      <SectionHeader
        eyebrow="Enforcer"
        title="Reservation enforcement dashboard"
        subtitle="Search by plate, spot, or customer and update vehicle status in real time."
      />

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Lot</InputLabel>
                <Select
                  value={selectedLotId}
                  label="Lot"
                  onChange={(event) => setSelectedLotId(event.target.value)}
                >
                  <MenuItem value="">All lots</MenuItem>
                  {lots.map((lot) => (
                    <MenuItem key={lot.id} value={lot.id}>
                      {lot.name} ({lot.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Search"
                placeholder="Plate, spot, customer"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={(event) => setStatus(event.target.value)}>
                  <MenuItem value="">Any</MenuItem>
                  {statusOptions.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Active reservations
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>License</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Spot</TableCell>
                <TableCell>Lot</TableCell>
                <TableCell>Ends</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.licensePlate}</TableCell>
                  <TableCell>
                    {reservation.customerFirst} {reservation.customerLast}
                  </TableCell>
                  <TableCell>{reservation.spotNumber || 'N/A'}</TableCell>
                  <TableCell>{reservation.lotId}</TableCell>
                  <TableCell>{formatDateTime(reservation.expiresAt)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={reservation.status}
                      color={reservation.status === 'PARKED' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={reservation.status}
                        onChange={(event) =>
                          handleStatusChange(reservation.id, event.target.value)
                        }
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  )
}

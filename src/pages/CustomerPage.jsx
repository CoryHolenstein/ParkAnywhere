import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { parkingService } from '../services/parkingService'
import { toCurrency } from '../utils/formatting'

const defaultFormState = {
  lotId: '',
  firstName: '',
  lastName: '',
  phone: '',
  licensePlate: '',
  spotNumber: '',
  durationHours: 2,
  parkingType: 'DURATION',
  notes: '',
}

export default function CustomerPage() {
  const { lotId: routeLotId } = useParams()
  const [lotIdInput, setLotIdInput] = useState(routeLotId ?? '')
  const [lot, setLot] = useState(null)
  const [formState, setFormState] = useState(defaultFormState)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!routeLotId) {
      return
    }

    parkingService.getLotById(routeLotId).then((result) => {
      setLot(result)
      setFormState((current) => ({ ...current, lotId: routeLotId }))
    })
  }, [routeLotId])

  const payableAmount = useMemo(() => {
    if (!lot) {
      return 0
    }

    if (formState.parkingType === 'ALL_DAY') {
      return lot.pricing.allDayRate
    }

    return Number(formState.durationHours || 0) * lot.pricing.hourlyRate
  }, [lot, formState.durationHours, formState.parkingType])

  const handleLoadLot = async () => {
    const normalized = lotIdInput.trim()

    if (!normalized) {
      setError('Enter a lot ID first.')
      return
    }

    const result = await parkingService.getLotById(normalized)

    if (!result) {
      setError('Lot not found. Verify the sign URL and lot ID.')
      setLot(null)
      return
    }

    setError('')
    setLot(result)
    setFormState((current) => ({ ...current, lotId: normalized }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!lot) {
      setError('Load a valid lot before paying.')
      return
    }

    if (!formState.firstName || !formState.licensePlate) {
      setError('Complete all required fields.')
      return
    }

    if (lot.requireSpotNumber && !formState.spotNumber) {
      setError('This lot requires a parking spot number.')
      return
    }

    await parkingService.createReservation({
      lotId: formState.lotId,
      firstName: formState.firstName,
      lastName: formState.lastName,
      phone: formState.phone,
      licensePlate: formState.licensePlate,
      spotNumber: formState.spotNumber,
      durationHours: formState.parkingType === 'ALL_DAY' ? 24 : Number(formState.durationHours),
      paidAmount: payableAmount,
      notes: formState.notes,
    })

    setSuccessMessage(`Parking confirmed in ${lot.name}. Total paid: ${toCurrency(payableAmount)}.`)
    setError('')
    setFormState((current) => ({
      ...defaultFormState,
      lotId: current.lotId,
      parkingType: lot.pricing.allDayEnabled ? 'DURATION' : 'ALL_DAY',
    }))
  }

  return (
    <Stack spacing={3}>
      <SectionHeader
        eyebrow="Customer"
        title="Pay for parking"
        subtitle="Open from a lot sign URL and complete the required details for your session."
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Lot ID"
              value={lotIdInput}
              onChange={(event) => setLotIdInput(event.target.value)}
              placeholder="8989898"
              fullWidth
            />
            <Button variant="contained" onClick={handleLoadLot}>
              Load Lot
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {lot ? (
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6">{lot.name}</Typography>
                <Typography color="text.secondary">{lot.address}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Rate: {toCurrency(lot.pricing.hourlyRate)}/hr
                  {lot.pricing.allDayEnabled ? ` or ${toCurrency(lot.pricing.allDayRate)} all-day` : ''}
                </Typography>
              </Box>

              <Divider />

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="First Name"
                      value={formState.firstName}
                      onChange={(event) => setFormState((c) => ({ ...c, firstName: event.target.value }))}
                      required={lot.customerFields.firstName}
                      fullWidth
                    />
                  </Grid>

                  {lot.customerFields.lastName ? (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Last Name"
                        value={formState.lastName}
                        onChange={(event) => setFormState((c) => ({ ...c, lastName: event.target.value }))}
                        required
                        fullWidth
                      />
                    </Grid>
                  ) : null}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="License Plate"
                      value={formState.licensePlate}
                      onChange={(event) => setFormState((c) => ({ ...c, licensePlate: event.target.value }))}
                      required={lot.customerFields.licensePlate}
                      fullWidth
                    />
                  </Grid>

                  {lot.customerFields.phone ? (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Phone"
                        value={formState.phone}
                        onChange={(event) => setFormState((c) => ({ ...c, phone: event.target.value }))}
                        required
                        fullWidth
                      />
                    </Grid>
                  ) : null}

                  {lot.customerFields.spotNumber || lot.requireSpotNumber ? (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Spot Number"
                        value={formState.spotNumber}
                        onChange={(event) => setFormState((c) => ({ ...c, spotNumber: event.target.value }))}
                        required={lot.requireSpotNumber}
                        fullWidth
                      />
                    </Grid>
                  ) : null}

                  {lot.allowDurationParking ? (
                    <>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          label="Parking Type"
                          value={formState.parkingType}
                          onChange={(event) =>
                            setFormState((c) => ({
                              ...c,
                              parkingType: event.target.value,
                            }))
                          }
                          fullWidth
                        >
                          <MenuItem value="DURATION">Duration</MenuItem>
                          {lot.pricing.allDayEnabled ? <MenuItem value="ALL_DAY">All Day</MenuItem> : null}
                        </TextField>
                      </Grid>

                      {formState.parkingType === 'DURATION' ? (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            type="number"
                            label="Duration (hours)"
                            value={formState.durationHours}
                            onChange={(event) =>
                              setFormState((c) => ({ ...c, durationHours: Number(event.target.value) }))
                            }
                            inputProps={{ min: 1, max: 24 }}
                            fullWidth
                          />
                        </Grid>
                      ) : null}
                    </>
                  ) : null}

                  {lot.customerFields.notes ? (
                    <Grid size={12}>
                      <TextField
                        label="Notes"
                        value={formState.notes}
                        onChange={(event) => setFormState((c) => ({ ...c, notes: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                  ) : null}

                  <Grid size={12}>
                    <Typography variant="h6">Total: {toCurrency(payableAmount)}</Typography>
                  </Grid>

                  <Grid size={12}>
                    <Button type="submit" variant="contained" size="large">
                      Pay & Register Vehicle
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
    </Stack>
  )
}

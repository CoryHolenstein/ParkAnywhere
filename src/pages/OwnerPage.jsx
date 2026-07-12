import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { parkingService } from '../services/parkingService'

const defaultCustomerFields = {
  firstName: true,
  lastName: true,
  phone: false,
  licensePlate: true,
  spotNumber: false,
  notes: false,
}

const defaultNewLot = {
  companyId: '',
  name: '',
  address: '',
  allowDurationParking: true,
  requireSpotNumber: false,
  customerFields: defaultCustomerFields,
  pricing: {
    hourlyRate: 5,
    allDayRate: 20,
    allDayEnabled: true,
  },
}

export default function OwnerPage() {
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [lots, setLots] = useState([])
  const [selectedLotId, setSelectedLotId] = useState('')
  const [newLot, setNewLot] = useState(defaultNewLot)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    parkingService.getCompanies().then((data) => {
      setCompanies(data)
      if (data[0]) {
        setSelectedCompanyId(data[0].id)
        setNewLot((current) => ({ ...current, companyId: data[0].id }))
      }
    })
  }, [])

  useEffect(() => {
    if (!selectedCompanyId) {
      return
    }

    parkingService.getOwnerLots(selectedCompanyId).then((data) => {
      setLots(data)
      if (data[0]) {
        setSelectedLotId(data[0].id)
      }
    })
  }, [selectedCompanyId])

  const selectedLot = useMemo(() => {
    return lots.find((lot) => lot.id === selectedLotId)
  }, [lots, selectedLotId])

  const patchSelectedLot = async (patch) => {
    if (!selectedLot) {
      return
    }

    const updated = await parkingService.updateLotConfig(selectedLot.id, patch)

    setLots((current) => current.map((lot) => (lot.id === updated.id ? updated : lot)))
    setMessage(`Updated ${updated.name}.`)
  }

  const handleCreateLot = async (event) => {
    event.preventDefault()

    if (!newLot.companyId || !newLot.name || !newLot.address) {
      setError('Company, lot name, and address are required.')
      return
    }

    const created = await parkingService.createLot(newLot)
    const refreshed = await parkingService.getOwnerLots(newLot.companyId)

    setLots(refreshed)
    setSelectedLotId(created.id)
    setMessage(`Created lot ${created.name}.`)
    setError('')
    setNewLot((current) => ({
      ...defaultNewLot,
      companyId: current.companyId,
    }))
  }

  return (
    <Stack spacing={3} className="page-shell">
      <SectionHeader
        eyebrow="Owner"
        title="Business owner controls"
        subtitle="Manage lot settings, required customer fields, and pricing options by company."
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              select
              label="Company"
              value={selectedCompanyId}
              onChange={(event) => {
                setSelectedCompanyId(event.target.value)
                setNewLot((current) => ({ ...current, companyId: event.target.value }))
              }}
              fullWidth
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.id})
                </option>
              ))}
            </TextField>
            <Typography color="text.secondary">
              Admin authentication target: Cognito user pool per environment.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Lots
              </Typography>
              <List dense>
                {lots.map((lot) => (
                  <ListItemButton
                    key={lot.id}
                    selected={lot.id === selectedLotId}
                    onClick={() => setSelectedLotId(lot.id)}
                  >
                    <ListItemText primary={lot.name} secondary={`Lot ID: ${lot.id}`} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6">Create lot</Typography>
                <Box component="form" onSubmit={handleCreateLot}>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Lot name"
                        value={newLot.name}
                        onChange={(event) =>
                          setNewLot((current) => ({ ...current, name: event.target.value }))
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Address"
                        value={newLot.address}
                        onChange={(event) =>
                          setNewLot((current) => ({ ...current, address: event.target.value }))
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        type="number"
                        label="Hourly rate"
                        value={newLot.pricing.hourlyRate}
                        onChange={(event) =>
                          setNewLot((current) => ({
                            ...current,
                            pricing: {
                              ...current.pricing,
                              hourlyRate: Number(event.target.value),
                            },
                          }))
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        type="number"
                        label="All day rate"
                        value={newLot.pricing.allDayRate}
                        onChange={(event) =>
                          setNewLot((current) => ({
                            ...current,
                            pricing: {
                              ...current.pricing,
                              allDayRate: Number(event.target.value),
                            },
                          }))
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newLot.pricing.allDayEnabled}
                            onChange={(event) =>
                              setNewLot((current) => ({
                                ...current,
                                pricing: {
                                  ...current.pricing,
                                  allDayEnabled: event.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Enable all-day"
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button type="submit" variant="contained">
                        Create lot
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {selectedLot ? (
              <Card>
                <CardContent>
                  <Typography variant="h6">{selectedLot.name} settings</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Lot ID: {selectedLot.id}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedLot.allowDurationParking}
                            onChange={(event) =>
                              patchSelectedLot({ allowDurationParking: event.target.checked })
                            }
                          />
                        }
                        label="Allow duration parking"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedLot.requireSpotNumber}
                            onChange={(event) =>
                              patchSelectedLot({ requireSpotNumber: event.target.checked })
                            }
                          />
                        }
                        label="Require spot number"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Required customer fields</Typography>

                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {Object.entries(selectedLot.customerFields).map(([field, enabled]) => (
                      <Grid key={field} size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enabled}
                              onChange={(event) =>
                                patchSelectedLot({
                                  customerFields: {
                                    ...selectedLot.customerFields,
                                    [field]: event.target.checked,
                                  },
                                })
                              }
                            />
                          }
                          label={field}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ) : null}
          </Stack>
        </Grid>
      </Grid>

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  )
}

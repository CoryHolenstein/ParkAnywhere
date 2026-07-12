import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import StorefrontIcon from '@mui/icons-material/Storefront'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { parkingService } from '../services/parkingService'
<<<<<<< HEAD
=======
import './LandingPage.css'
>>>>>>> master

export default function LandingPage() {
  const navigate = useNavigate()
  const [lotId, setLotId] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ companies: 0, lots: 0, activeReservationCount: 0 })

  useEffect(() => {
    parkingService.getLandingSnapshot().then((snapshot) => {
      setStats({
        companies: snapshot.companies.length,
        lots: snapshot.lots.length,
        activeReservationCount: snapshot.activeReservationCount,
      })
    })
  }, [])

  const handleStart = async (event) => {
    event.preventDefault()
    const normalized = lotId.trim()

    if (!normalized) {
      setError('Enter a lot ID to continue.')
      return
    }

    const lot = await parkingService.getLotById(normalized)

    if (!lot) {
      setError('No lot found for that ID.')
      return
    }

    setError('')
    navigate(`/customer/${normalized}`)
  }

  return (
<<<<<<< HEAD
    <Stack spacing={4}>
      <Box
=======
    <Stack spacing={4} className="landing-page page-shell">
      <Box
        className="hero-section"
>>>>>>> master
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background:
            'radial-gradient(circle at 15% 15%, rgba(29,78,216,0.16), transparent 38%), linear-gradient(130deg, #ffffff 20%, #ebfffc 100%)',
          border: '1px solid #d9ebea',
        }}
      >
        <SectionHeader
          eyebrow="Pay For Parking Here"
          title="Fast check-in for drivers, strong controls for lot teams"
          subtitle="Customers can enter lot ID and pay in under a minute. Enforcers and owners get live visibility and controls."
        />

        <Stack component="form" direction={{ xs: 'column', md: 'row' }} spacing={2} onSubmit={handleStart}>
          <TextField
            value={lotId}
            onChange={(event) => setLotId(event.target.value)}
            label="Enter lot ID"
            placeholder="Example: 8989898"
            fullWidth
          />
          <Button variant="contained" size="large" type="submit">
            Start Parking Session
          </Button>
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: 'wrap' }}>
          <Chip label={`${stats.companies} companies onboarded`} />
          <Chip label={`${stats.lots} active lots`} />
          <Chip label={`${stats.activeReservationCount} cars parked now`} color="primary" />
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <DirectionsCarIcon color="primary" />
                <Typography variant="h6">Customer flow</Typography>
                <Typography color="text.secondary">
                  Drivers open URL.com/lotid, provide required info, pay, and receive parking confirmation.
                </Typography>
                <Button component={Link} to="/customer" variant="outlined">
                  Open Customer View
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <SupportAgentIcon color="primary" />
                <Typography variant="h6">Enforcer workflow</Typography>
                <Typography color="text.secondary">
                  Search reservations by plate or spot, then update status to PARKED, EXPIRED, or TOWED.
                </Typography>
                <Button component={Link} to="/enforcer" variant="outlined">
                  Open Enforcer View
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <StorefrontIcon color="primary" />
                <Typography variant="h6">Owner controls</Typography>
                <Typography color="text.secondary">
                  Create lots, set required customer inputs, and configure spot and pricing rules per lot.
                </Typography>
                <Button component={Link} to="/owner" variant="outlined">
                  Open Owner View
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

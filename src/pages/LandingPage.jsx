import { Button, Container, Box, Typography, Grid, Card, CardContent } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SecurityIcon from '@mui/icons-material/Security'
import StorageIcon from '@mui/icons-material/Storage'
import SearchIcon from '@mui/icons-material/Search'
import ShareIcon from '@mui/icons-material/Share'
import SpeedIcon from '@mui/icons-material/Speed'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LoginButton from '../components/LoginButton'
import './LandingPage.css'

export default function LandingPage() {

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Bank-Level Security',
      description: 'Your files are encrypted and protected with enterprise-grade security'
    },
    {
      icon: <StorageIcon sx={{ fontSize: 48 }} />,
      title: 'Unlimited Organization',
      description: 'Organize files into folders and categories that make sense for you'
    },
    {
      icon: <SearchIcon sx={{ fontSize: 48 }} />,
      title: 'Smart Search',
      description: 'Find any file instantly with powerful search and filtering'
    },
    {
      icon: <ShareIcon sx={{ fontSize: 48 }} />,
      title: 'Easy Sharing',
      description: 'Share files and folders securely with customizable permissions'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Lightning Fast',
      description: 'Lightning-fast uploads and downloads for all your files'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
      title: 'Always Available',
      description: 'Access your files anytime, anywhere from any device'
    }
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 80, color: '#ffffff', marginBottom: 3 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              File Storage
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 4, maxWidth: '600px', margin: '0 auto 32px' }}>
              Securely store, organize, and access your files in the cloud. Manage your documents, photos, and videos all in one place.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <LoginButton
                name="Get Started"
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              />
              <LoginButton
                name="Sign In"
                variant="outlined"
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#ffffff',
                  },
                }}
              />
            </Box>
          </Box>
        </Container>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 6, fontWeight: 'bold' }}>
            Powerful Features Built for You
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', boxShadow: 2, borderRadius: 2, transition: 'transform 0.3s ease, boxShadow 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 } }}>
                  <CardContent>
                    <Box sx={{ color: '#667eea', marginBottom: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
            Ready to Simplify Your File Management?
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 4, maxWidth: '600px', margin: '0 auto 32px', opacity: 0.9 }}>
            Join thousands of users who trust us with their important files
          </Typography>
          <LoginButton
            name="Start Free Today"
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5568d3',
              },
            }}
          />
        </Container>
      </div>
    </div>
  )
}

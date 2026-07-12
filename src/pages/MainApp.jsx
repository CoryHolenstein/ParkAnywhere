import { useState } from 'react'
import { Box, Tabs, Tab, Container, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import OverviewTab from '../components/OverviewTab'
import FilesTab from '../components/FilesTab'
import SettingsTab from '../components/SettingsTab'
import SupportTab from '../components/SupportTab'
import './MainApp.css'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function MainApp() {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box className="main-app-shell" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box className="tabs-shell" sx={{ borderBottom: 1, borderColor: 'divider', display: { xs: 'none', sm: 'block' } }}>
        <Box className="tabs-side-accent tabs-side-accent-left" />
        <Tabs value={value} onChange={handleChange} aria-label="file storage tabs" className="main-tabs" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
          <Tab icon={<DashboardOutlinedIcon fontSize="small" />} iconPosition="start" label="Overview" id="tab-0" aria-controls="tabpanel-0" />
          <Tab icon={<FolderOpenOutlinedIcon fontSize="small" />} iconPosition="start" label="Files" id="tab-1" aria-controls="tabpanel-1" />
          <Tab icon={<SettingsOutlinedIcon fontSize="small" />} iconPosition="start" label="Settings" id="tab-2" aria-controls="tabpanel-2" />
          <Tab icon={<SupportAgentOutlinedIcon fontSize="small" />} iconPosition="start" label="Support" id="tab-3" aria-controls="tabpanel-3" />
        </Tabs>
        <Box className="tabs-side-accent tabs-side-accent-right" />
      </Box>

      <Container maxWidth="lg" sx={{ flex: 1, pb: { xs: 10, sm: 0 } }}>
        <TabPanel value={value} index={0}>
          <OverviewTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FilesTab />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SettingsTab />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <SupportTab />
        </TabPanel>
      </Container>

      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', sm: 'none' },
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden'
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          showLabels
        >
          <BottomNavigationAction label="Overview" icon={<DashboardOutlinedIcon />} />
          <BottomNavigationAction label="Files" icon={<FolderOpenOutlinedIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsOutlinedIcon />} />
          <BottomNavigationAction label="Support" icon={<SupportAgentOutlinedIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

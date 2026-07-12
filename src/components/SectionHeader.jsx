import { Stack, Typography } from '@mui/material'

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      {eyebrow ? (
        <Typography
          variant="overline"
          sx={{ letterSpacing: 1.2, color: 'primary.main', fontWeight: 700 }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
    </Stack>
  )
}

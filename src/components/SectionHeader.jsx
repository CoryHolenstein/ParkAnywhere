import { Stack, Typography } from '@mui/material'

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      {eyebrow ? (
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h3">{title}</Typography>
      {subtitle ? (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  )
}

import { Stack, Typography } from '@mui/material'

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      {eyebrow ? (
<<<<<<< HEAD
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
=======
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
>>>>>>> master
    </Stack>
  )
}

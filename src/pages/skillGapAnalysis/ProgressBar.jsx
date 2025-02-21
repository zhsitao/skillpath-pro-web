/* eslint-disable react/prop-types */
import { Box, LinearProgress, Typography } from "@mui/material";

export default function ProgressBar({ value, max }) {
  const percentage = (value / max) * 100;

  return (
    <Box sx={{ width: "100%", mr: 1 }}>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Box sx={{ minWidth: 35, mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(percentage)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

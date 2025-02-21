/* eslint-disable react/prop-types */
import "react";
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function EditSkill({ skill, onEditClick, onProficiencyChange }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper sx={{ p: 2, position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1">{skill.skillName}</Typography>
          <IconButton
            onClick={() => onEditClick(skill.id)}
            color={skill.isEditing ? "primary" : "default"}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Select
          fullWidth
          value={skill.proficiencyLevel || ""}
          onChange={(e) => onProficiencyChange(skill.id, e.target.value)}
          disabled={!skill.isEditing}
        >
          <MenuItem value="">Select proficiency</MenuItem>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </Paper>
    </Grid>
  );
}

export default EditSkill;

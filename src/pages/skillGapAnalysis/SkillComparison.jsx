/* eslint-disable react/prop-types */
import { Paper, Grid, Typography, Chip, Box, Tooltip } from "@mui/material";

function SkillComparison({ userSkills, requiredSkills }) {
  const getSkillStatus = (skillName) => {
    const userSkill = userSkills.find((s) => s.skillName === skillName);
    if (!userSkill) return "missing";

    const proficiencyLevels = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    const requiredSkill = requiredSkills.find((s) => s.skillName === skillName);
    if (!requiredSkill) return "extra";

    const userLevel = proficiencyLevels[userSkill.proficiencyLevel];
    const requiredLevel = proficiencyLevels[requiredSkill.requiredProficiency];

    return userLevel >= requiredLevel ? "met" : "partial";
  };

  const getChipColor = (status) => {
    const colors = {
      met: "success",
      partial: "warning",
      missing: "error",
      extra: "info",
    };
    return colors[status];
  };

  const getTooltipMessage = (skill, isUserSkill) => {
    if (isUserSkill) {
      const status = getSkillStatus(skill.skillName);
      const messages = {
        met: "Meets or exceeds required level",
        partial: "Below required proficiency level",
        missing: "Required skill not acquired",
        extra: "Additional skill not required for role",
      };
      return messages[status];
    }
    return `Required proficiency: ${skill.requiredProficiency}`;
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Your Skills
          </Typography>
          {userSkills.map((skill, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Tooltip title={getTooltipMessage(skill, true)} arrow>
                <Chip
                  label={`${skill.skillName} - ${skill.proficiencyLevel}`}
                  color={getChipColor(getSkillStatus(skill.skillName))}
                  sx={{
                    width: "100%",
                    "&:hover": {
                      transform: "scale(1.02)",
                      transition: "transform 0.2s",
                    },
                  }}
                />
              </Tooltip>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Required Skills
          </Typography>
          {requiredSkills.map((skill, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Tooltip title={getTooltipMessage(skill, false)} arrow>
                <Chip
                  label={`${skill.skillName} - ${skill.requiredProficiency}`}
                  variant="outlined"
                  sx={{
                    width: "100%",
                    "&:hover": {
                      transform: "scale(1.02)",
                      transition: "transform 0.2s",
                    },
                  }}
                />
              </Tooltip>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SkillComparison;

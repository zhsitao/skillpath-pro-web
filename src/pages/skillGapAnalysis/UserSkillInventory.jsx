/* eslint-disable no-constant-binary-expression */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ProgressBar from "./ProgressBar";
import Toast from "../../assets/components/toast/Toast";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
}));

function UserSkillInventory() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: "" });
  const [error, setError] = useState("");
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [skillProgress, setSkillProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const fetchUserSkills = () => {
    const userId = 2;
    axios
      .get(`http://localhost:8080/api/skills/${userId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSkills(response.data);
        }
      })
      .catch(() => {
        setToast({
          open: true,
          message: "Failed to fetch skills",
          severity: "error",
        });
      });
  };

  const fetchSkillProgress = () => {
    const userId = 2;
    axios
      .get(`http://localhost:8080/api/skill-gap/progress/${userId}`)
      .then((response) => {
        setSkillProgress(response?.data[0]?.overallProgress);
      })
      .catch((error) => {
        console.error("Error fetching skill progress:", error);
      });
  };

  const fetchGapAnalysis = () => {
    const userId = 2;
    const roleId = 1;
    axios
      .get(`http://localhost:8080/api/skill-gap/${userId}/${roleId}`)
      .then((response) => {
        setGapAnalysis(response.data);
      })
      .catch((error) => {
        console.error("Error fetching gap analysis:", error);
      });
  };

  const handleProficiencyChange = (skillId, proficiency) => {
    setError("");
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId
          ? { ...skill, proficiencyLevel: proficiency, isModified: true }
          : skill
      )
    );
  };

  const handleNewSkillChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setNewSkill((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveEdits = async () => {
    const userId = 2;
    const modifiedSkills = skills.filter((skill) => skill.isModified);

    if (modifiedSkills.length === 0) {
      setToast({
        open: true,
        message: "No changes to save",
        severity: "info",
      });
      return;
    }

    try {
      const updatePromises = modifiedSkills.map((skill) =>
        axios.put(`http://localhost:8080/api/skills/${userId}`, [
          {
            id: skill.id,
            skillName: skill.skillName,
            proficiencyLevel: skill.proficiencyLevel,
          },
        ])
      );

      await Promise.all(updatePromises);
      await Promise.all([
        fetchUserSkills(),
        fetchGapAnalysis(),
        fetchSkillProgress(),
      ]);

      setIsEditing(false);
      setToast({
        open: true,
        message: "Skills updated successfully",
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: "Failed to update skills" ?? error.message,
        severity: "error",
      });
    }
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    const userId = 2;

    if (!newSkill.name.trim() || !newSkill.proficiency) {
      setToast({
        open: true,
        message: "Please complete both skill name and proficiency level",
        severity: "warning",
      });
      return;
    }

    const skillToAdd = {
      userId,
      skillName: newSkill.name.trim(),
      proficiencyLevel: newSkill.proficiency,
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/skills`, [
        skillToAdd,
      ]);

      if (response.status === 200) {
        setNewSkill({ name: "", proficiency: "" });
        // Fetch fresh data after successful addition
        await Promise.all([
          fetchUserSkills(),
          fetchGapAnalysis(),
          fetchSkillProgress(),
        ]);
        setToast({
          open: true,
          message: response.data,
          severity: "success",
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: "Failed to add skill" ?? error.message,
        severity: "error",
      });
    }
  };

  const handleToastClose = (reason) => {
    if (reason === "close") {
      return;
    }
    setToast({
      ...toast,
      open: false,
      message: "",
      severity: "success",
    });
  };

  const handleDeleteSkill = async () => {
    const userId = 2;
    try {
      if (skillToDelete) {
        await axios.delete(
          `http://localhost:8080/api/skills/${userId}/${skillToDelete}`
        );
        await Promise.all([
          fetchUserSkills(),
          fetchGapAnalysis(),
          fetchSkillProgress(),
        ]);
        setToast({
          open: true,
          message: "Skill deleted successfully",
          severity: "success",
        });
        setConfirmDialogOpen(false);
      }
    } catch (error) {
      setToast({
        open: true,
        message: "Failed to delete skill" ?? error.message,
        severity: "error",
      });
    }
  };

  const handleConfirmDialogOpen = (skillId) => {
    setSkillToDelete(skillId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setSkillToDelete(null);
  };

  useEffect(() => {
    fetchUserSkills();
    fetchGapAnalysis();
    fetchSkillProgress();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Skill Gap Analysis
      </Typography>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Overall Skill Progress
        </Typography>
        <ProgressBar value={skillProgress ?? 0} max={100} />

        {gapAnalysis && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gap Analysis Score
            </Typography>
            <ProgressBar value={gapAnalysis.totalScore} max={100} />
          </Box>
        )}
      </StyledPaper>

      <StyledPaper elevation={3}>
        <form onSubmit={handleAddSkill}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Add New Skill</Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  label="Skill Name"
                  name="name"
                  value={newSkill.name}
                  onChange={handleNewSkillChange}
                />
                <Select
                  sx={{ minWidth: 200 }}
                  name="proficiency"
                  value={newSkill.proficiency}
                  onChange={handleNewSkillChange}
                  displayEmpty
                >
                  <MenuItem value="">Select proficiency</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
                <Button variant="contained" color="primary" type="submit">
                  Add New Skill
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Current Skills</Typography>
          <Box>
            {isEditing && (
              <IconButton
                onClick={handleSaveEdits}
                color="success"
                sx={{ mr: 1 }}
              >
                <CheckIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              color={isEditing ? "primary" : "default"}
            >
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
        <Grid container spacing={2}>
          {Array.isArray(skills) &&
            skills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} key={skill.id}>
                <Paper sx={{ p: 2, position: "relative" }}>
                  {isEditing ? (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {skill.skillName}
                      </Typography>
                      <Select
                        fullWidth
                        value={skill.proficiencyLevel?.toUpperCase() || ""}
                        onChange={(e) =>
                          handleProficiencyChange(skill.id, e.target.value)
                        }
                      >
                        <MenuItem value="BEGINNER">Beginner</MenuItem>
                        <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                        <MenuItem value="ADVANCED">Advanced</MenuItem>
                      </Select>
                    </Box>
                  ) : (
                    <Typography textAlign="center">
                      {skill.skillName} -{" "}
                      {skill.proficiencyLevel || "Not rated"}
                    </Typography>
                  )}
                  {!isEditing && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <IconButton
                        onClick={() => handleConfirmDialogOpen(skill.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
        </Grid>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </StyledPaper>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleToastClose}
      />

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this skill?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSkill} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserSkillInventory;

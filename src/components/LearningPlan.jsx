import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Box } from '@mui/material';
import { Check, Delete } from '@mui/icons-material';

const LearningPlan = ({ plan, onMarkCompleted, onRemoveFromPlan }) => {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                My Learning Plan
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    In Progress
                </Typography>
                <List>
                    {plan.plannedResources?.map((resource) => (
                        <ListItem key={resource.id}>
                            <ListItemText
                                primary={resource.title}
                                secondary={`${resource.provider} • ${resource.durationHours}h`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => onMarkCompleted(resource.id)}
                                    sx={{ mr: 1 }}
                                >
                                    <Check />
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => onRemoveFromPlan(resource.id)}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
                <Typography variant="subtitle1" gutterBottom>
                    Completed
                </Typography>
                <List>
                    {plan.completedResources?.map((resource) => (
                        <ListItem key={resource.id}>
                            <ListItemText
                                primary={resource.title}
                                secondary={`${resource.provider} • ${resource.durationHours}h`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Paper>
    );
};

export default LearningPlan;
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Alert, CircularProgress } from '@mui/material';
import ResourceCard from './components/ResourceCard';
import ResourceFilters from './components/ResourceFilters';
import LearningPlan from './components/LearningPlan';
import api from './services/api';

function App() {
    const [resources, setResources] = useState([]);
    const [userPlan, setUserPlan] = useState({ plannedResources: [], completedResources: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        freeOnly: false,
        type: '',
        maxDuration: null
    });

    // Mock user ID (in real app would come from auth)
    const userId = "user123";

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await api.getResources(filters);
            setResources(data);
            setError(null);
        } catch (err) {
            setError('Failed to load resources. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const loadUserPlan = async () => {
        try {
            const plan = await api.getUserPlan(userId);
            setUserPlan(plan);
        } catch (err) {
            setError('Failed to load learning plan. Please try again later.');
        }
    };

    useEffect(() => {
        loadResources();
        loadUserPlan();
    }, [filters]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleAddToPlan = async (resourceId) => {
        try {
            await api.addToPlan(userId, resourceId);
            await loadUserPlan();
        } catch (err) {
            setError('Failed to add resource to plan. Please try again.');
        }
    };

    const handleMarkCompleted = async (resourceId) => {
        try {
            await api.markAsCompleted(userId, resourceId);
            await loadUserPlan();
        } catch (err) {
            setError('Failed to mark resource as completed. Please try again.');
        }
    };

    const handleRemoveFromPlan = async (resourceId) => {
        try {
            await api.removeFromPlan(userId, resourceId);
            await loadUserPlan();
        } catch (err) {
            setError('Failed to remove resource from plan. Please try again.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                SkillPath Pro
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <ResourceFilters 
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {resources.map(resource => (
                                <Grid item xs={12} sm={6} key={resource.id}>
                                    <ResourceCard
                                        resource={resource}
                                        onAddToPlan={handleAddToPlan}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <LearningPlan
                        plan={userPlan}
                        onMarkCompleted={handleMarkCompleted}
                        onRemoveFromPlan={handleRemoveFromPlan}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;

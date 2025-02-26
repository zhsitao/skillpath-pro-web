import React from 'react';
import { Paper, FormGroup, FormControlLabel, Checkbox, TextField, Select, MenuItem, Box, Typography } from '@mui/material';

const ResourceFilters = ({ filters, onFilterChange }) => {
    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Filters
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.freeOnly}
                                onChange={(e) => onFilterChange('freeOnly', e.target.checked)}
                            />
                        }
                        label="Free Resources Only"
                    />
                </FormGroup>

                <TextField
                    select
                    label="Resource Type"
                    value={filters.type || ''}
                    onChange={(e) => onFilterChange('type', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="COURSE">Courses</MenuItem>
                    <MenuItem value="CERTIFICATION">Certifications</MenuItem>
                    <MenuItem value="ARTICLE">Articles</MenuItem>
                </TextField>

                <TextField
                    type="number"
                    label="Max Duration (hours)"
                    value={filters.maxDuration || ''}
                    onChange={(e) => onFilterChange('maxDuration', e.target.value)}
                    fullWidth
                />
            </Box>
        </Paper>
    );
};

export default ResourceFilters;
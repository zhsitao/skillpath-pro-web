import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { AccessTime, AttachMoney, School } from '@mui/icons-material';

const ResourceCard = ({ resource, onAddToPlan }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                        icon={<School />}
                        label={resource.provider}
                        size="small"
                    />
                    <Chip
                        icon={<AccessTime />}
                        label={`${resource.durationHours}h`}
                        size="small"
                    />
                    <Chip
                        icon={<AttachMoney />}
                        label={resource.isFree ? 'Free' : `$${resource.price}`}
                        color={resource.isFree ? 'success' : 'default'}
                        size="small"
                    />
                </Box>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    variant="contained" 
                    fullWidth
                    onClick={() => onAddToPlan(resource.id)}
                >
                    Add to Plan
                </Button>
            </CardActions>
        </Card>
    );
};

export default ResourceCard;
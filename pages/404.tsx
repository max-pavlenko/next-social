import React from 'react';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';
import MetaTags from '../components/utils/MetaTags';

const NotFound = () => {
    return (
        <main>
            <MetaTags title='Page Not Found' desc='Requested page couldn`t be found or it doesnt exist!' imagePath='public/vercel.svg' />
            <Typography textAlign = 'center' variant = 'h3'>Requested page doesn't seem to exist...◾
            </Typography>
            <Link href = '/'>
                <div style = {{display: 'flex', justifyContent: 'center'}}>
                    <Button size = 'large' sx = {{mx: 'auto', mt: '20px'}} variant = 'contained' color = 'secondary'>
                        Go Home
                    </Button>
                </div>
            </Link>
        </main>
    );
};

export default NotFound;

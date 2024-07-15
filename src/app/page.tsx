"use client";

export const dynamic = 'force-dynamic'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../sections/TaskList';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

export default function App() {

  return (     
    <Authenticator>
        {({ signOut, user }) => (
          <Box
            sx={{
              minHeight: '100vh',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Typography variant="h2" component="h1" gutterBottom align="center">
              SelinのToDoリスト
            </Typography>
            <TaskList onDeleteTask={() => { } } tasks={[]} />
            <button onClick={signOut}>Sign out</button>
          </Box>
        )}
    </Authenticator>
  );
}
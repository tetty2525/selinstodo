"use client";

export const dynamic = 'force-dynamic'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import * as React from 'react';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import TaskInput from '../sections/TaskInput';
import TaskList from '../sections/TaskList';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

export default function App() {
  const [tasks, setTasks] = useState<string[]>([]);

  function handleAddTask(task: string) {
    setTasks([...tasks, task]);
  }

  function handleDeleteTask(index: number) {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  }

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
      <TaskInput onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
      <button onClick={signOut}>Sign out</button>
    </Box>
     )}
  </Authenticator>
  );
}
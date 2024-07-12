import * as React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Schema } from '../../amplify/data/resource'; 
import { generateClient } from 'aws-amplify/data';

interface TaskListProps {
  tasks: string[];
  onDeleteTask: (index: number) => void;
  onAddTask: (task: string) => void; // Add this prop for adding tasks
}

const client = generateClient<Schema>();

export default function TaskList({ tasks, onDeleteTask, onAddTask }: TaskListProps) {
  const createTodo = async () => {
    const content = window.prompt("Todo content?");
    if (content) {
      await client.models.Todo.create({
        content
      });
      onAddTask(content); // Call the prop function to update the task list
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={createTodo} sx={{ marginBottom: 2 }}>
        Add new todo
      </Button>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {tasks.map((task, index) => (
          <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
            <ListItemText primary={task} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTask(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

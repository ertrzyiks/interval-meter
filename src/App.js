import React, { useReducer, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import Done from '@material-ui/icons/Done';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { AnimateGroup } from 'react-animate-mount'
import format from 'date-fns/format'
import './App.css';

function formatElapsedTime(ms) {
  const s = ms / 1000

  const min = s / 60
  if (min < 1) {
    return '< 1min'
  }

  return `~ ${Math.round(min)}min`
}

function formatTime (timestamp) {
  return format(new Date(timestamp), 'HH:mm')
}

function reducer(state, action) {
  switch (action) {
    case 'tick':
      const now = Date.now()
      const elapsedTime = state.length > 0 ? now - state[0].now : null
      const id = state.length > 0 ? state[0].id + 1 : 1
      return [{id, elapsedTime, now}, ...state].slice(0, 20)
    default:
      throw new Error()
  }
}

function App({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(
    () => {
      window.localStorage.setItem('items', JSON.stringify(state));
    },
    [state]
  )

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" color="primary" onClick={() => dispatch('tick')}>
          Now
        </Button>
      </header>

      <Container maxWidth="sm">
        <Paper>
          { state.length > 0 &&
            <List>
              <AnimateGroup>
              {state.map(({now, elapsedTime, id}) =>
                <ListItem key={id}>
                  <ListItemIcon>
                    { elapsedTime && elapsedTime < 10 * 60 * 1000 ? <OfflineBolt /> : <Done />}
                  </ListItemIcon>
                  <ListItemText primary={formatTime(now)} secondary={elapsedTime && formatElapsedTime(elapsedTime)} />
                </ListItem>
              )}
              </AnimateGroup>
            </List>
          }

          { state.length === 0 &&
            <List>
              <ListItem>
                <ListItemText primary='Click the button to start measuring intervals' />
              </ListItem>
            </List>
          }
        </Paper>
      </Container>
    </div>
  );
}

export default App;

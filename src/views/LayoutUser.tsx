import { Button, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import type { IUserSession } from '../interfaces/Session';
import { Class, Menu, PeopleAlt, Person } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router';

export const LayoutUser = () => {

  const sessionContext = useContext(SessionContext);
  const [userSession, setUserSession] = useState<IUserSession | null>();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserSession(sessionContext?.getUserSession());
  }, [])

  const onClickButtonMenu = () => {
    setOpenMenu(!openMenu);
  }

  const onClickMenuOption = (route: string) => {
    setOpenMenu(false);
    navigate(`/layoutUser/${route}`);
  }

  const onClickLogout = () => {
    sessionContext?.logout();
  }

  return (
    <Stack width={'100%'} height={'100%'} direction={'column'} alignItems={'center'}>
      <Grid width={'100%'} container spacing={1}>
        <Grid width={'100%'} size={12} padding={1} sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Stack direction={'row'} gap={0.5} alignItems={'center'}>
            <IconButton aria-label='Menú' onClick={onClickButtonMenu}><Menu /></IconButton>
            <Typography variant='h5' color='text.secondary'>{userSession?.firstName} {userSession?.lastName}</Typography>
          </Stack>
          <Button variant='outlined' color='info' onClick={onClickLogout}>Cerrar Sesión</Button>
        </Grid>
      </Grid>
      <Stack width={'70%'}>
        <Outlet />
      </Stack>
      <Drawer open={openMenu} onClose={onClickButtonMenu}>
        <List>
          {
            userSession?.role?.id == 1 &&
            <ListItem>
              <ListItemButton onClick={() => onClickMenuOption('users')}>
                <ListItemIcon>
                  <PeopleAlt fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
              </ListItemButton>
            </ListItem>
          }
          {
            userSession?.role?.id == 2 &&
            <ListItem>
              <ListItemButton onClick={() => onClickMenuOption('registerSubjects')}>
                <ListItemIcon>
                  <Class fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={'Inscribir Materias'} />
              </ListItemButton>
            </ListItem>
          }
        </List>
      </Drawer>
    </Stack>
  )
}
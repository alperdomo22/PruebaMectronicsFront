import { Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import type { IUserRequest, IUserResponse } from '../interfaces/Users';
import { apiRequest } from '../services/ApiService';
import type { IGeneralReponse } from '../interfaces/HttpRequest';
import { Add, Delete, Edit } from '@mui/icons-material';
import type { IRoleResponse } from '../interfaces/Role';
import { ModalUser } from '../components/ModalUser';
import { toast, ToastContainer } from 'react-toastify';
import { SessionContext } from '../contexts/SessionContext';

export const Users = () => {

    const [users, setUsers] = useState<IUserResponse[]>([]);
    const [roles, setRoles] = useState<IRoleResponse[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [idUserUpdate, setIdUserUpdate] = useState<number|undefined>();
    const [userUpdate, setUserUpdate] = useState<IUserRequest|undefined>(undefined);
    const sessionContext = useContext(SessionContext);

    useEffect(() => {
        getUsers();
        getRoles();
        sessionContext?.validateSession();
    }, []);

    const getUsers = async () => {
        setUserUpdate(undefined);
        const responseGetUsers = await apiRequest<IGeneralReponse<IUserResponse[]>>("/User/GetAll", "GET");
        if (responseGetUsers.success && responseGetUsers.data) {
            setUsers(responseGetUsers.data.data);
        }
    }

    const getRoles = async () => {
        const responseGetRoles = await apiRequest<IGeneralReponse<IRoleResponse[]>>("/Role/GetAll", "GET");
        if (responseGetRoles.success && responseGetRoles.data) {
            setRoles(responseGetRoles.data.data);
        }
    }

    const onHandleModal = () => {
        setOpenModal(!openModal);
        if (openModal) {
            setIdUserUpdate(undefined);
            setUserUpdate(undefined);
        }
    }

    const selectUpdateUser = (selectedUser: IUserResponse) => {
        setOpenModal(true);
        setIdUserUpdate(selectedUser.id);
        setUserUpdate({
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            email: selectedUser.email,
            changePasswordRequired: selectedUser.changePasswordRequired,
            roleId: selectedUser.role?.id
        });
    }

    const registerUpdateUser = async (idUser: number|undefined, user: IUserRequest) => {
        setUserUpdate(undefined);
        setIdUserUpdate(undefined);
        if (!idUser) {
            const responseAddUser = await apiRequest<IGeneralReponse<IUserResponse>>("/User/Add", "POST", user);
            if (responseAddUser.success && responseAddUser.data) {
                getUsers();
                getRoles();
                setOpenModal(false);

                toast(
                    responseAddUser.data?.description,
                    {
                        type: 'success',
                        position: 'top-center'
                    }
                );
            } else {
                toast(
                    responseAddUser.data?.description,
                    {
                        type: 'error',
                        position: 'top-center'
                    }
                );
            }
        } else {
            const responseUpdateUser = await apiRequest<IGeneralReponse<IUserResponse>>(`/User/Update/${idUser}`, "PUT", user);
            if (responseUpdateUser.success && responseUpdateUser.data) {
                getUsers();
                getRoles();
                setOpenModal(false);

                toast(
                    responseUpdateUser.data?.description,
                    {
                        type: 'success',
                        position: 'top-center'
                    }
                );
            } else {
                toast(
                    responseUpdateUser.data?.description,
                    {
                        type: 'error',
                        position: 'top-center'
                    }
                );
            }
        }
    }

    const deleteUser = async (idUser: number) => {
        setUserUpdate(undefined);
        const responseAddUser = await apiRequest<IGeneralReponse<string>>(`/User/Delete/${idUser}`, "DELETE");
        if (responseAddUser.success && responseAddUser.data) {
            getUsers();
            getRoles();
            setOpenModal(false);

            toast(
                responseAddUser.data?.description,
                {
                    type: 'success',
                    position: 'top-center'
                }
            );
        } else {
            toast(
                responseAddUser.data?.description,
                {
                    type: 'error',
                    position: 'top-center'
                }
            );
        }
    }

    return (
        <Grid container size={12} width={'100%'}>
            <Stack direction={'column'} gap={1.5} width={'100%'}>
                <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
                    <Typography variant="h4" color="text.secondary">Usuarios</Typography>
                    <Button color='success' variant='outlined' size='small' sx={{ width: 'auto' }} onClick={onHandleModal}>
                        <Add fontSize='small' />
                    </Button>
                </Stack>
                <TableContainer component={Paper} sx={{ widt: '100%' }}>
                    <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                        <TableHead sx={{ background: '#353535ff' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#FFF' }}>Id</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Nombres</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Apellidos</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Correo electrónico</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Require cambiar clave</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Rol</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                users.map((user: IUserResponse) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.changePasswordRequired ? 'Si' : 'No'}</TableCell>
                                        <TableCell>{user.role ? user.role.name : '(Sin rol asignado)'}</TableCell>
                                        <TableCell align='right'>
                                            <Stack direction={'row'} gap={0.5}>
                                                <Button color='warning' variant='outlined' size='small' sx={{ width: 'auto' }} onClick={() => selectUpdateUser(user)}>
                                                    <Edit fontSize='small' />
                                                </Button>
                                                <Button color='error' variant='outlined' size='small' onClick={() => deleteUser(user.id)}>
                                                    <Delete fontSize='small' />
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
            <ToastContainer />
            {
                openModal &&
                <ModalUser
                    open={openModal}
                    roles={roles}
                    updateUser={userUpdate}
                    idUser={idUserUpdate}
                    registerUpdateUser={registerUpdateUser}
                    onHandleModal={onHandleModal}
                />
            }
        </Grid>
    )
}
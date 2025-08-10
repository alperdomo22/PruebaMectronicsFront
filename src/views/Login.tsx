import { Button, Card, CardContent, Grid, Link, Stack, TextField, Typography } from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ILogin } from '../interfaces/Login';
import { apiRequest } from '../services/ApiService';
import { useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import type { IUserSession } from '../interfaces/Session';
import { ToastContainer, toast } from 'react-toastify';
import type { IGeneralReponse } from '../interfaces/HttpRequest';
import { useNavigate } from 'react-router';

export const Login = () => {

    const { register, handleSubmit } = useForm<ILogin>();
    const sessionContext = useContext(SessionContext);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<ILogin> = (data: ILogin) => {
        loginUser(data);
    }

    const loginUser = async (data: ILogin) => {
        const responseAuthenticate = await apiRequest<IGeneralReponse<IUserSession>>("/Login/Authenticate", "POST", data);
        if (responseAuthenticate.success && responseAuthenticate.data) {
            sessionContext?.login({
                id: responseAuthenticate.data.data.id,
                firstName: responseAuthenticate.data.data.firstName,
                lastName: responseAuthenticate.data.data.lastName,
                email: responseAuthenticate.data.data.email,
                role: responseAuthenticate.data.data.role
            });
            toast(
                responseAuthenticate.data?.description,
                {
                    type: 'success',
                    position: 'top-center',
                    onClose: redirectIndexUser
                }
            );
        } else {
            toast(
                responseAuthenticate.data?.description,
                {
                    type: 'error',
                    position: 'top-center'
                }
            );
        }
    }

    const redirectIndexUser = () => {
        navigate('/layoutUser');
    }

    return (
        <>
            <Stack direction={'row'} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                <ToastContainer />
                <Grid container spacing={1.5}>
                    <Grid size={12}>
                        <Card sx={{ maxWidth: 550, minWidth: 275 }}>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack width={'100%'} direction={'column'} gap={1} textAlign={'center'}>
                                        <Typography
                                            variant='h6'
                                        >
                                            LOG IN
                                        </Typography>
                                        <TextField
                                            placeholder='Correo'
                                            type='text'
                                            variant='outlined'
                                            size='small'
                                            {...register('email')}
                                        />
                                        <TextField
                                            placeholder='Contraseña'
                                            type='password'
                                            variant='outlined'
                                            size='small'
                                            {...register('password')}
                                        />
                                        <Button
                                            variant='outlined'
                                            type='submit'
                                        >Ingresar</Button>
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={() => {
                                                navigate('/changePassword');
                                            }}
                                        >
                                            Cambiar contraseña
                                        </Link>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}
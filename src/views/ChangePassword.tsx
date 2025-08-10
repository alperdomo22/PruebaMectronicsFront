import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from "@mui/material"
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify"
import type { ILogin } from "../interfaces/Login";
import { apiRequest } from "../services/ApiService";
import type { IGeneralReponse } from "../interfaces/HttpRequest";
import type { IUserSession } from "../interfaces/Session";
import { useNavigate } from "react-router";

export const ChangePassword = () => {

    const { register, handleSubmit } = useForm<ILogin>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<ILogin> = (data: ILogin) => {
        changeNewPassword(data);
    }

    const changeNewPassword = async (data: ILogin) => {
        const responseAuthenticate = await apiRequest<IGeneralReponse<IUserSession>>("/User/UpdateNewPassword", "POST", data);
        if (responseAuthenticate.success && responseAuthenticate.data) {
            toast(
                responseAuthenticate.data?.description,
                {
                    type: 'success',
                    position: 'top-center',
                    onClose: redirectIndexLogin
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

    const redirectIndexLogin = () => {
        navigate('/');
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
                                        >Cambiar contraseña</Button>
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
import { Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField } from '@mui/material';
import type { FunctionComponent } from 'react';
import type { IUserModalComponent, IUserRequest } from '../interfaces/Users';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { IRoleResponse } from '../interfaces/Role';

export const ModalUser: FunctionComponent<IUserModalComponent> = ({
    open,
    updateUser,
    roles,
    idUser,
    onHandleModal,
    registerUpdateUser
}) => {

    const { register, handleSubmit } = useForm<IUserRequest>({
        defaultValues: updateUser
    });

    const onSubmit: SubmitHandler<IUserRequest> = (data: IUserRequest) => {
        registerUpdateUser(idUser, data);
    }

    return (
        <Modal
            open={open}
            onClose={onHandleModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={'column'} gap={1.5} sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Stack direction={'row'} gap={0.5}>
                        <TextField
                            placeholder='Nombres'
                            type='text'
                            variant='outlined'
                            size='small'
                            required
                            {...register('firstName')}
                        />
                        <TextField
                            placeholder='Apellidos'
                            type='text'
                            variant='outlined'
                            size='small'
                            required
                            {...register('lastName')}
                        />
                    </Stack>
                    <Stack direction={'row'} gap={0.5} marginBottom={2}>
                        <TextField
                            placeholder='Correo electrónico'
                            type='email'
                            variant='outlined'
                            size='small'
                            required={true}
                            {...register('email')}
                        />
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                {...register('roleId')}
                                label="Rol"
                                size='small'
                                defaultValue={updateUser?.roleId ? updateUser.roleId : -1}
                            >
                                <MenuItem value={-1} disabled>{'Seleccione'}</MenuItem>
                                {
                                    roles.map((role: IRoleResponse) => (
                                        <MenuItem value={role.id}>{role.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    <Button type='submit' variant='outlined' color='success' size='small'>{updateUser ? 'Actualizar' : 'Registrar'}</Button>
                </Stack>
            </form>
        </Modal>
    )
}
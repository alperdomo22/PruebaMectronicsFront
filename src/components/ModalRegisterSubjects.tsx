import { Button, Card, CardContent, Grid, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState, type FunctionComponent } from "react"
import type { IModalRegisterSubjectsComponent, ISubjectsInscriptionsRequest } from "../interfaces/SubjectInscription"
import { useForm, type SubmitHandler } from "react-hook-form"
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import type { ISubjectResponse } from "../interfaces/Subject"
import { SessionContext } from "../contexts/SessionContext"
import type { IUserSession } from "../interfaces/Session"

export const ModalRegisterSubjects: FunctionComponent<IModalRegisterSubjectsComponent> = ({
    open,
    subjects = [],
    onHandleModal,
    registerSubjects
}) => {

    const sessionContext = useContext(SessionContext);
    const [userSession, setUserSession] = useState<IUserSession | null>();
    const [subjectRegistered, setSubjectRegistered] = useState<ISubjectResponse[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<ISubjectResponse[]>([]);
    const { handleSubmit } = useForm<ISubjectsInscriptionsRequest>();

    useEffect(() => {
        setAvailableSubjects(subjects);
        setUserSession(sessionContext?.getUserSession());
    }, []);

    const onSubmit: SubmitHandler<ISubjectsInscriptionsRequest> = (data: ISubjectsInscriptionsRequest) => {
        console.log(data);
        // registerUpdateUser(idUser, data);
    }

    const addRegisteredSubject = (subject: ISubjectResponse) => {
        setSubjectRegistered([
            ...subjectRegistered,
            subject
        ]);

        setAvailableSubjects([
            ...availableSubjects.filter((subjectFilter: ISubjectResponse) => subjectFilter.id != subject.id)
        ]);
    }

    const removeRegisteredSubject = (subject: ISubjectResponse) => {
        setSubjectRegistered([
            ...subjectRegistered.filter((subjectFilter: ISubjectResponse) => subjectFilter.id != subject.id)
        ]);

        setAvailableSubjects([
            ...availableSubjects,
            subject
        ]);
    }

    const registerInscriptionSubjects = () => {
        registerSubjects({
                UserStudentId: userSession?.id ?? 0,
                Subjects: subjectRegistered.map((subject: ISubjectResponse): ISubjectsInscriptionsRequest => ({
                    Id: subject.id,
                    Observation: ''
                }))
            });
    }

    return (
        <Modal
            open={open}
            onClose={onHandleModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            sx={{ width: '100%' }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={'column'} gap={1.5} sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4
                }} height={'80%'}>
                    <Stack width={'100%'} height={'100%'}>
                        <Stack width={'100%'} direction={'row'} justifyContent={'center'} height={'fit-content'}>
                            <Typography variant='h5' color='text.secondary'><b>Materias</b></Typography>
                        </Stack>
                        <Grid container size={12} width={'100%'} gap={1} height={'90%'} sx={{ overflowY: 'auto' }}>
                            <Grid size={{ sm: 12, md: 5.9 }} sx={{ display: 'block', gap: 1, overflowY: 'auto' }}>
                                <Stack width={'100%'} direction={'row'} justifyContent={'center'} height={'fit-content'}>
                                    <Typography variant='subtitle1' color='text.secondary'><b>Disponibles</b></Typography>
                                </Stack>
                                <Stack width={'100%'} direction={'column'} gap={1} display={'grid'}>
                                    {
                                        availableSubjects.map((subject: ISubjectResponse) => (
                                            <Card sx={{ display: 'flex', width: '100%' }}>
                                                <Stack direction={'row'} width={'100%'}>
                                                    <CardContent sx={{ display: 'flex', padding: 1, paddingBottom: '8px!important', alignItems: 'initial', justifyContent: 'space-between', width: '100%' }}>
                                                        <Stack direction={'column'} gap={1}>
                                                            <Typography variant="subtitle2"><b>{subject.name}</b></Typography>
                                                            <Stack direction={'row'} gap={1}>
                                                                <Typography variant="caption" color='text.secondary'><b>Maestro: </b></Typography>
                                                                <Typography variant="caption" color='text.secondary'>{subject.userName}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                        <Stack direction={'row'}>
                                                            <IconButton color="success" size="small" onClick={() => addRegisteredSubject(subject)} disabled={subjectRegistered.length >= 3 ? true : false}>
                                                                <AddCircleOutline />
                                                            </IconButton>
                                                        </Stack>
                                                    </CardContent>
                                                </Stack>
                                            </Card>
                                        ))
                                    }
                                </Stack>
                            </Grid>
                            <Grid size={{ sm: 12, md: 5.9 }} sx={{ display: 'block', gap: 1 }}>
                                <Stack width={'100%'} direction={'row'} justifyContent={'center'} height={'auto'}>
                                    <Typography variant='subtitle1' color='text.secondary' height={'auto'}><b>Agregadas</b></Typography>
                                </Stack>
                                <Stack width={'100%'} direction={'column'} gap={1}>
                                    {
                                        subjectRegistered.map((subject: ISubjectResponse) => (
                                            <Card sx={{ display: 'flex', width: '100%' }}>
                                                <Stack direction={'row'} width={'100%'}>
                                                    <CardContent sx={{ display: 'block', padding: 1, paddingBottom: '8px!important', alignItems: 'center', width: '100%' }}>
                                                        <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                                            <Stack direction={'column'} gap={1}>
                                                                <Typography variant="subtitle2"><b>{subject.name}</b></Typography>
                                                                <Stack direction={'row'} gap={1}>
                                                                    <Typography variant="caption" color='text.secondary'><b>Maestro: </b></Typography>
                                                                    <Typography variant="caption" color='text.secondary'>{subject.userName}</Typography>
                                                                </Stack>
                                                            </Stack>
                                                            <Stack direction={'row'}>
                                                                <IconButton color="error" size="small" onClick={() => removeRegisteredSubject(subject)}>
                                                                    <RemoveCircleOutline />
                                                                </IconButton>
                                                            </Stack>
                                                        </Stack>
                                                        <Stack direction={'row'} width={'100%'}>
                                                            <TextField
                                                                variant='outlined'
                                                                type='text'
                                                                placeholder='Observaciones'
                                                                size='small'
                                                                sx={{ width: '100%' }}
                                                            />
                                                        </Stack>
                                                    </CardContent>
                                                </Stack>
                                            </Card>
                                        ))
                                    }
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack width={'100%'} display={'flex'} justifyContent={'center'} height={'fit-content'}>
                            <Button type='submit' variant='outlined' color='success' size='small' disabled={subjectRegistered.length == 0} onClick={registerInscriptionSubjects}>Inscribir</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </form>
        </Modal>
    )
}
import { Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { SessionContext } from '../contexts/SessionContext';
import { apiRequest } from '../services/ApiService';
import type { IGeneralReponse } from '../interfaces/HttpRequest';
import type { ISubjectInscriptionRequest, ISubjectInscriptionResponse } from '../interfaces/SubjectInscription';
import type { IUserSession } from '../interfaces/Session';
import { Add, Article, Delete } from '@mui/icons-material';
import { ModalRegisterSubjects } from '../components/ModalRegisterSubjects';
import type { ISubjectResponse } from '../interfaces/Subject';

export const RegisterSubjects = () => {

    const sessionContext = useContext(SessionContext);
    const [userSession, setUserSession] = useState<IUserSession | null>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [subjectsInscription, setSubjectsInscription] = useState<ISubjectInscriptionResponse[]>([]);
    const [subjects, setSubjects] = useState<ISubjectResponse[]>([]);
    const [inscriptionSubjetsBySubject, setInscriptionSubjetsBySubject] = useState<ISubjectInscriptionResponse[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<ISubjectInscriptionResponse|null>(null);

    useEffect(() => {
        sessionContext?.validateSession();
        setUserSession(sessionContext?.getUserSession());
        getSubjectsInscriptions();
        getSubjects();
    }, []);

    const getSubjectsInscriptions = async () => {
        const responseGetByStudentUserId = await apiRequest<IGeneralReponse<ISubjectInscriptionResponse[]>>(`/SubjectInscription/GetByUSerStudentId/${sessionContext?.getUserSession()?.id}`, "GET");
        if (responseGetByStudentUserId.success && responseGetByStudentUserId.data) {
            setSubjectsInscription(responseGetByStudentUserId.data.data);
        }
    }

    const getSubjects = async () => {
        const responseGetAllSubjects = await apiRequest<ISubjectResponse[]>(`/Subject/GetAll`, "GET");
        if (responseGetAllSubjects.success && responseGetAllSubjects.data) {
            console.log(responseGetAllSubjects.data);
            setSubjects(responseGetAllSubjects.data);
        }
    }

    const onHandleModal = () => {
        setOpenModal(!openModal);
    }

    const registerInscriptionSubjects = async (subjectsRegistered: ISubjectInscriptionRequest) => {
        const responseInscriptionOfMultplesSubjects = await apiRequest<IGeneralReponse<ISubjectInscriptionResponse[]>>("/SubjectInscription/InscriptionOfMultplesSubjects", "POST", subjectsRegistered);
        if (responseInscriptionOfMultplesSubjects.success && responseInscriptionOfMultplesSubjects.data) {
            getSubjectsInscriptions();
            setOpenModal(false);

            toast(
                responseInscriptionOfMultplesSubjects.data?.description,
                {
                    type: 'success',
                    position: 'top-center'
                }
            );
        } else {
            toast(
                responseInscriptionOfMultplesSubjects.data?.description,
                {
                    type: 'error',
                    position: 'top-center'
                }
            );
        }
    }

    const selectSubjectByStudent = (inscriptionSubject: ISubjectInscriptionResponse) => {
        setSelectedSubject(inscriptionSubject);
        getInscriptionSubjectsBySubjectId(inscriptionSubject.subject.id);
    }

    const getInscriptionSubjectsBySubjectId = async (subjectId: number) => {
        const responseGetAllSubjects = await apiRequest<IGeneralReponse<ISubjectInscriptionResponse[]>>(`/SubjectInscription/GetBySubjectId/${subjectId}`, "GET");
        if (responseGetAllSubjects.success && responseGetAllSubjects.data) {
            setInscriptionSubjetsBySubject(responseGetAllSubjects.data.data);
        }
    }

    const deleteSubjectInscription = async (id: number) => {
        const responseDeleteSubjectInscription = await apiRequest<IGeneralReponse<boolean>>(`/SubjectInscription/DeleteSubjectInscription/${id}`, "DELETE");
        if (responseDeleteSubjectInscription.success && responseDeleteSubjectInscription.data) {
            getSubjectsInscriptions();
            toast(
                responseDeleteSubjectInscription.data?.description,
                {
                    type: 'success',
                    position: 'top-center'
                }
            );
        } else {
            toast(
                responseDeleteSubjectInscription.data?.description,
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
                    <Typography variant="h4" color="text.secondary">Materias inscritas</Typography>
                    <Button color='success' variant='outlined' size='small' sx={{ width: 'auto' }} onClick={onHandleModal}>
                        <Add fontSize='small' />
                    </Button>
                </Stack>
                <TableContainer component={Paper} sx={{ widt: '100%' }}>
                    <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                        <TableHead sx={{ background: '#353535ff' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#FFF' }}>Materia</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Créditos</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Observaciones</TableCell>
                                <TableCell sx={{ color: '#FFF' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                subjectsInscription.map((subjectInscription: ISubjectInscriptionResponse) => (
                                    <TableRow
                                        key={subjectInscription.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{subjectInscription.subject.name}</TableCell>
                                        <TableCell>{subjectInscription.subject.credits}</TableCell>
                                        <TableCell>{subjectInscription.observation}</TableCell>
                                        <TableCell align='right'>
                                            <Stack direction={'row'} gap={0.5}>
                                                <Button color='error' variant='outlined' size='small' sx={{ width: 'auto' }} onClick={() => deleteSubjectInscription(subjectInscription.id)}>
                                                    <Delete fontSize='small' />
                                                </Button>
                                                <Button color='inherit' variant='outlined' size='small' onClick={() => selectSubjectByStudent(subjectInscription)}>
                                                    <Article fontSize='small' />
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
            {
                (inscriptionSubjetsBySubject.length > 0 && selectedSubject != null) &&
                <Stack direction={'column'} gap={1.5} width={'100%'} marginTop={5}>
                    <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
                        <Typography variant="h4" color="text.secondary">Estudiantes inscritos en {selectedSubject.subject.name}</Typography>
                    </Stack>
                    <TableContainer component={Paper} sx={{ widt: '100%' }}>
                        <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                            <TableHead sx={{ background: '#353535ff' }}>
                                <TableRow>
                                    <TableCell sx={{ color: '#FFF' }}>Nombres</TableCell>
                                    <TableCell sx={{ color: '#FFF' }}>Apellidos</TableCell>
                                    <TableCell sx={{ color: '#FFF' }}>Correo Electrónico</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    inscriptionSubjetsBySubject.map((subjectInscription: ISubjectInscriptionResponse) => (
                                        <TableRow
                                            key={subjectInscription.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{subjectInscription.student.firstName}</TableCell>
                                            <TableCell>{subjectInscription.student.lastName}</TableCell>
                                            <TableCell>{subjectInscription.student.email}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            }
            <ToastContainer />
            {
                openModal &&
                <ModalRegisterSubjects
                    open={openModal}
                    subjects={subjects}
                    registerSubjects={registerInscriptionSubjects}
                    onHandleModal={onHandleModal}
                />
            }
        </Grid>
    )
}
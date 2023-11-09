import { FC, useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAccounts } from '../../hooks/useAccounts';
import { URL_API } from '../../constants/constantsApp';

type PropsAccount = {
  authToken: string | null;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Название бюджета обязательно'),
  balance: Yup.number().required('Сумма обязательна').positive('Сумма должна быть положительным числом'),
});

const AccountCreate: FC<PropsAccount> = ({ authToken }) => {
    const { accounts, setAccounts } = useAccounts();
    const [showModal, setShowModal] = useState<boolean>(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Box>
            <Button sx={{ width: '100%', padding: '10px', fontSize: '30px', marginTop: '30px' }} variant="contained" onClick={() => setShowModal(true)}>Создать бюджет</Button>
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button id="modal-modal-title" component="h2">
                        Создать бюджет
                    </Button>
                    <Formik
                        initialValues={{
                            name: '',
                            balance: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setSubmitting(true);
                            try {
                                const response = await fetch(`${URL_API}/account`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${authToken}`,
                                    },
                                    body: JSON.stringify(values),
                                });

                                if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.message || 'Ошибка при отправке данных');
                                }

                                const responseData = await response.json();
                                setAccounts([...accounts, responseData.data]);
                                resetForm();
                                setShowModal(false);
                            } catch (error) {
                                console.error('Ошибка:', error);
                            }
                            setSubmitting(false);
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Field as={TextField}
                                    name="name"
                                    label="Название бюджета"
                                    fullWidth
                                    margin="normal"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <Field as={TextField}
                                    name="balance"
                                    label="Сумма"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    error={touched.balance && Boolean(errors.balance)}
                                    helperText={touched.balance && errors.balance}
                                />
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        Создать
                                    </Button>
                                    <Button onClick={() => setShowModal(false)} disabled={isSubmitting}>
                                        Отмена
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </Box>
    );
};

export default AccountCreate;

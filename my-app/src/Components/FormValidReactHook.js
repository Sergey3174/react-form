import styles from './app.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';

const fieldsSheme = yup.object().shape({
	email: yup.string().required('Обязательное поле ввода').email('Некорректный email'),
	password: yup
		.string()
		.required('Обязательное поле ввода')
		.matches(/(?=.*[0-9])/, 'В пароле должна быть одна цифра')
		.matches(/(?=.*[A-Z])/, 'В пароле должна быть одна заглавная буква'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Пароли не совпадает'),
});
export const FormValidReactHook = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		resolver: yupResolver(fieldsSheme),
	});

	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const confirmPasswordError = errors.confirmPassword?.message;

	useEffect(() => {
		if (isValid) {
			submitRef.current.focus();
		}
	}, [isValid]);

	const submitRef = useRef(null);

	const onSubmit = (formData) => {
		console.log(formData);
		reset();
	};

	return (
		<div className={styles.container}>
			<h1>Форма с react hook form + Yup</h1>
			<form className={styles.form_registration} onSubmit={handleSubmit(onSubmit)}>
				<label>Введите почту</label>
				<input name="email" type="text" {...register('email')}></input>
				{emailError && <div className={styles.error}>{emailError}</div>}

				<label>Придумайте пароль</label>
				<input name="password" type="password" {...register('password')}></input>
				{passwordError && <div className={styles.error}>{passwordError}</div>}

				<label>Повторите пароль</label>
				<input
					name="confirmPassword"
					type="password"
					{...register('confirmPassword')}
				></input>
				{confirmPasswordError && (
					<div className={styles.error}>{confirmPasswordError}</div>
				)}

				<button type="submit" disabled={!isValid} ref={submitRef}>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};

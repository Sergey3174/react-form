import styles from './app.module.css';
import { useEffect, useRef, useState } from 'react';

const initialState = {
	email: '',
	password: '',
	confirmPassword: '',
};

const useStore = () => {
	const [state, setState] = useState(initialState);
	return {
		getState: () => state,
		updateState: (field, newValue) => setState({ ...state, [field]: newValue }),
		resetState: () => setState(initialState),
	};
};

const sendData = (formData) => {
	console.log(formData);
};

export const FormValid = () => {
	const { getState, updateState, resetState } = useStore();
	const [passwordError, setPasswordError] = useState(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState(null);
	const [emailError, setEmailError] = useState(null);
	const [isValid, setIsValid] = useState(false);

	const { email, password, confirmPassword } = getState();

	useEffect(() => {
		if (
			passwordError ||
			confirmPasswordError ||
			password !== confirmPassword ||
			!email ||
			!password ||
			emailError
		) {
			setIsValid(false);
		} else {
			setIsValid(true);
		}
	}, [
		passwordError,
		confirmPasswordError,
		password,
		confirmPassword,
		email,
		emailError,
	]);

	useEffect(() => {
		if (isValid) {
			submitRef.current.focus();
		}
	});

	const submitRef = useRef(null);

	const onSubmit = (event) => {
		event.preventDefault();
		sendData(getState());
		resetState();
		setIsValid(false);
	};

	const onChange = ({ target }) => updateState(target.name, target.value);

	const onBlurEmail = ({ target }) => {
		if (
			!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
				target.value,
			)
		) {
			setEmailError('Некорректный email');
		} else setEmailError(null);
	};

	const onBlurPassword = ({ target }) => {
		let error = null;
		if (!/(?=.*[0-9])/.test(target.value)) {
			error = 'В пароле должна быть одна цифра';
		} else if (!/(?=.*[A-Z])/.test(target.value)) {
			error = 'Должна быть одна заглавная буква';
		}
		setPasswordError(error);
	};

	const onChangeConfirmPassword = ({ target }) => {
		updateState(target.name, target.value);
		if (target.value !== password) {
			setConfirmPasswordError('Пароли должны совпадать');
		} else if (target.value === password) {
			setConfirmPasswordError(null);
		}
	};

	return (
		<div className={styles.container}>
			<h1>Форма без библиотек</h1>
			<form className={styles.form_registration} onSubmit={onSubmit}>
				<label>Введите почту</label>
				<input
					name="email"
					type="text"
					value={email}
					onChange={onChange}
					onBlur={onBlurEmail}
					required
				></input>
				{emailError && <div className={styles.error}>{emailError}</div>}

				<label>Придумайте пароль</label>
				<input
					name="password"
					type="password"
					value={password}
					onChange={onChange}
					onBlur={onBlurPassword}
				></input>
				{passwordError && <div className={styles.error}>{passwordError}</div>}

				<label>Повторите пароль</label>
				<input
					name="confirmPassword"
					type="password"
					value={confirmPassword}
					onChange={onChangeConfirmPassword}
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

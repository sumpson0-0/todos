import React, { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../fbase';

const Auth: React.FunctionComponent = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [toggleAccount, setToggleAccount] = useState<boolean>(false);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const value = (form.children[1] as HTMLInputElement).value;
		try {
			if (value === 'SIGN UP') {
				await authService.createUserWithEmailAndPassword(email, password);
			} else if (value === 'LOGIN') {
				await authService.signInWithEmailAndPassword(email, password);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value: inputValue },
		} = e;
		if (e.target.type === 'email') {
			setEmail(inputValue);
		} else if (e.target.type === 'password') {
			setPassword(inputValue);
		}
	};

	const onClick = (): void => {
		setToggleAccount(prev => !prev);
	};

	return (
		<Container>
			<Header>
				<AppTitle>To Dos</AppTitle>
			</Header>
			<Main>
				<Title>{toggleAccount ? 'Sign In' : 'Sign Up'}</Title>
				<Form onSubmit={onSubmit}>
					<TextInputWrapper>
						<TextInput type="email" value={email} placeholder="Email" onChange={onChange} required />
						<TextInput
							type="password"
							value={password}
							placeholder="Password"
							onChange={onChange}
							required
						/>
					</TextInputWrapper>
					<SubmitInput type="submit" value={toggleAccount ? 'LOGIN' : 'SIGN UP'} />
				</Form>
				<ToggleWrapper>
					<GuidePhrase>
						{toggleAccount ? `Don't you have an Account?` : `Already have an Account?`}
					</GuidePhrase>
					<ToggleButton onClick={onClick}>{toggleAccount ? 'Sign Up' : 'Sign In'}</ToggleButton>
				</ToggleWrapper>
			</Main>
			<Footer />
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100vh;
	width: 100vw;
	background-color: ${props => props.theme.light.greenColor};
	color: ${props => props.theme.light.whiteColor};
`;

/* ************** Header ************** */
const Header = styled.header`
	display: flex;
	align-items: center;
	width: 100vw;
	height: 12vh;
	padding: 2rem 1.5rem 1rem 1.5rem;
	background-color: ${props => props.theme.light.greenColor};
	border-bottom: 1px solid ${props => props.theme.light.grayColor};
	color: ${props => props.theme.light.whiteColor};
	${({ theme }) => theme.media.portraitTabletS`
		padding : 1rem 2.5rem;
	`}
`;

const AppTitle = styled.h1`
	margin: 0;
	text-align: center;
	cursor: pointer;
	font-size: 1rem;
`;

/* ************** Main ************** */
const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	height: 78vh;
	width: 100vw;
	padding: 1.5rem;
	${({ theme }) => theme.media.portraitTabletS`
		height : 88vh;
		width : 60vw;
		padding : 1rem;
	`}
	${({ theme }) => theme.media.portraitTablet`
		width : 50vw;
	`}
	${({ theme }) => theme.media.landscapeTablet`
		width : 40vw;
    `}
	 ${({ theme }) => theme.media.desktop`
		width : 40vw;


    `}
`;

const Title = styled.h1`
	text-align: center;
	font-size: 0.8rem;
	font-weight: 400;
	margin: 0;
	margin-bottom: 2rem;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-bottom: 3rem;
	${({ theme }) => theme.media.portraitTabletS`
		margin-bottom: 1.5rem;
	`}
`;

const TextInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 4rem;
	margin-bottom: 1.5rem;
	font-size: 1rem;
`;

const TextInput = styled.input`
	height: 50%;
	border: none;
	border-bottom: 2px solid ${props => props.theme.light.whiteColor};
	background: none;
	font-weight: 900;
	color: ${props => props.theme.light.whiteColor};
	&:focus {
		outline: none;
	}
	&::placeholder {
		font-weight: 900;
		color: ${props => props.theme.light.whiteColor};
	}
`;

const SubmitInput = styled.input`
	width: 100%;
	height: 1.5rem;
	background-color: ${props => props.theme.light.whiteColor};
	font-weight: 700;
	font-size: 0.8rem;
	color: ${props => props.theme.light.greenColor};
	border: none;
	outline: none;
	cursor: pointer;
`;

const ToggleWrapper = styled.div`
	display: flex;
	justify-content: center;
`;

const GuidePhrase = styled.span`
	margin-right: 10px;
	font-weight: 300;
	font-size: 0.6rem;
`;

const ToggleButton = styled.span`
	border: none;
	font-size: 0.6rem;
	font-weight: 700;
	background: none;
	cursor: pointer;
`;

/* ************** Footer ************** */
const Footer = styled.footer`
	border-top: 1px solid ${props => props.theme.light.grayColor};
	height: 10vh;
	width: 100vw;
	${({ theme }) => theme.media.portraitTabletS`
		display : none;
	`}
`;

export default Auth;

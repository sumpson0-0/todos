import React, { useState, useEffect, createContext, useReducer } from 'react';
import Router from './Router';
import { authService } from '../fbase';
import Initializing from './Initializing';

interface UserStateI {
	uid: string | null;
	displayName: string | null;
	updateProfile: (args: { displayName: string | null }) => void;
}

interface UserActionI {
	type: 'SET_USER_INFO';
	uid: string | null;
	displayName: string | null;
	updateProfile: (args: { displayName: string | null }) => void;
}

const userReducer = (state: UserStateI, action: UserActionI): UserStateI => {
	switch (action.type) {
		case 'SET_USER_INFO':
			return {
				...state,
				uid: action.uid,
				displayName: action.displayName,
				updateProfile: action.updateProfile,
			};
		default:
			throw new Error('Unhandled action');
	}
};

export const UserStateContext = createContext<UserStateI>({
	uid: null,
	displayName: null,
	updateProfile: (args: { displayName: string | null }) => args,
});

const App: React.FunctionComponent = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [init, setInit] = useState<boolean>(false);
	const [userState, userDispatch] = useReducer(userReducer, {
		uid: null,
		displayName: null,
		updateProfile: (args: { displayName: string | null }) => args,
	});

	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	window.addEventListener('resize', () => {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	});

	useEffect(() => {
		authService.onAuthStateChanged((loggedUser: firebase.User | null): void => {
			if (loggedUser) {
				userDispatch({
					type: 'SET_USER_INFO',
					uid: loggedUser.uid,
					displayName: loggedUser.displayName,
					updateProfile: args => loggedUser.updateProfile(args),
				});
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	const reRender = (): void => {
		const loggedUser: firebase.User | null = authService.currentUser;
		if (loggedUser) {
			userDispatch({
				type: 'SET_USER_INFO',
				uid: loggedUser.uid,
				displayName: loggedUser.displayName,
				updateProfile: args => loggedUser.updateProfile(args),
			});
		}
	};

	return (
		<>
			{init ? (
				<UserStateContext.Provider value={userState}>
					<Router isLoggedIn={isLoggedIn} reRender={reRender} />
				</UserStateContext.Provider>
			) : (
				<Initializing />
			)}
		</>
	);
};

export default App;

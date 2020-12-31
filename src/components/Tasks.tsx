import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dbService } from '../fbase';
import { v4 as uuidv4 } from 'uuid';
import TaskContainer from './TaskContainer';
import { TempCold } from 'styled-icons/remix-line';

interface IProps {
	userInfo: {
		uid: string | null;
		displayName: string | null;
		updateProfile: (args: { displayName: string | null }) => void;
	};
}

const Tasks: React.FunctionComponent<IProps> = ({ userInfo }) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [date, setDate] = useState<string>('날짜미정');
	const [taskList, setTaskList] = useState<any[]>([]);
	const temporaryStorage: any[] = [];

	console.log('Tasks.tsx taskList', taskList);
	console.log('Tasks.tsx 실행');

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value },
		} = e;
		setInputValue(value);
	};

	const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value },
		} = e;
		setDate(value === '' ? '날짜미정' : value);
	};

	const onSubmitTask = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		console.log('Tasks.tsx내부 submit 실행');
		e.preventDefault();
		if (userInfo.uid !== null) {
			const copyedTaskList = JSON.parse(JSON.stringify(taskList));
			const docList = copyedTaskList.map((doc: { date: string; tasks: { task: string } }) => doc.date);
			try {
				if (docList.includes(date)) {
					const docIndex = copyedTaskList.findIndex(
						(Sequence: { date: string; tasks: { task: string } }) => Sequence.date === date,
					);
					const data = copyedTaskList[docIndex].tasks;
					const dataLength = Object.keys(data).length;
					await dbService.doc(`${userInfo.uid}/${date}`).update({ [dataLength]: inputValue });
					const taskObj = {
						date,
						tasks: {
							...data,
							[dataLength]: inputValue,
						},
					};
					copyedTaskList.splice(docIndex, 1, taskObj);
				} else {
					await dbService.collection(userInfo.uid).doc(date).set({
						0: inputValue,
					});
					const taskObj = {
						date: date,
						tasks: {
							0: inputValue,
						},
					};
					copyedTaskList.push(taskObj);
					copyedTaskList.sort(function (
						a: { date: string; tasks: { task: string } },
						b: { date: string; tasks: { task: string } },
					) {
						return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
					});
				}
			} catch (err) {
				alert('오류로 인해 저장에 실패하였습니다. 재시도 해주세요.');
			} finally {
				setTaskList(copyedTaskList);
				setInputValue('');
				setDate('날짜미정');
			}
		}
	};

	useEffect(() => {
		const getTasks = async (): Promise<void> => {
			if (userInfo.uid !== null) {
				const userCollection = await dbService.collection(userInfo.uid).get();
				if (!userCollection.empty) {
					// 유저 데이터 있음
					userCollection.forEach(
						async (
							doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
						): Promise<void> => {
							const docDate = doc.id;
							const tasks = doc.data();
							const taskValues = Object.values(doc.data());
							try {
								if (taskValues.length > 0) {
									const taskObj = {
										date: docDate,
										tasks,
									};
									await temporaryStorage.push(taskObj);
								} else if (taskValues.length === 0) {
									doc.ref.delete();
								}
							} catch (err) {
								alert('오류로 인해 불러오기에 실패하였습니다. 페이지를 새로고침 합니다.');
								temporaryStorage.length = 0;
								window.location.reload();
							}
						},
					);
					setTaskList(temporaryStorage);
				} else {
					// 유저 데이터 없음 -> 새로운 유저 / 데이터 하나도 없는 유저
					setTaskList([]);
				}
			}
		};

		getTasks();
	}, []);

	return (
		<Container>
			<AddTaskWrapper>
				<Shape />
				<TaskForm onSubmit={onSubmitTask}>
					<WriteTask
						type="text"
						placeholder="Add Task"
						value={inputValue}
						onChange={onChangeInput}
						maxLength={50}
						required
						autoFocus
					/>
					<TaskDate type="date" value={date === '날짜미정' ? '' : date} onChange={onChangeDate} />
					<SubmitTask type="submit" value="추가" />
				</TaskForm>
			</AddTaskWrapper>
			<TaskListWrapper>
				{taskList &&
					taskList.length > 0 &&
					taskList.map((result: { date: string; tasks: { taskKey: string; taskValue: string } }) => (
						<TaskContainer
							key={uuidv4()}
							date={result.date}
							tasks={result.tasks}
							userInfo={userInfo}
							taskList={taskList}
							setTaskList={setTaskList}
						/>
					))}
			</TaskListWrapper>
		</Container>
	);
};

const Container = styled.main`
	overflow: scroll;
	height: 75vh;
	margin-top: 12vh;
	margin-bottom: 13vh;
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`;

/* ********************* Add Task Wrapper ********************* */
const AddTaskWrapper = styled.section`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 2.3rem;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid ${props => props.theme.light.grayColor};
`;

const Shape = styled.div`
	height: 24px;
	width: 24px;
	background-color: transparent;
	border-radius: 5px;
	border: 2px solid ${props => props.theme.light.whiteColor};
`;

const TaskForm = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 95%;
`;

const WriteTask = styled.input`
	width: 90%;
	outline: none;
	border: none;
	background-color: ${props => props.theme.light.greenColor};
	color: ${props => props.theme.light.whiteColor};
`;

const TaskDate = styled.input`
	padding: 0 1rem;
	border: none;
	border-right: 1px solid ${props => props.theme.light.grayColor};
	border-left: 1px solid ${props => props.theme.light.grayColor};
	background-color: transparent;
	font-size: 0.7rem;
	color: white;
`;

const SubmitTask = styled.input`
	font-size: 0.7rem;
	padding-left: 1rem;
	outline: none;
	border: none;
	background-color: ${props => props.theme.light.greenColor};
	color: ${props => props.theme.light.whiteColor};
`;

/* ********************* Task Wrapper ********************* */
const TaskListWrapper = styled.section`
	z-index: -1;
	padding: 0 1rem;
`;

export default React.memo(Tasks);

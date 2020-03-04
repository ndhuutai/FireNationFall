import React, {useState} from 'react';
import axios from 'axios';

import PortfolioContext from '../../contexts/PortfoliosContext';
import {useAuth0} from '../../react-auth0-spa';


import AboutForm from './PortfolioForms/AboutForm';
import EducationForm from './PortfolioForms/EducationForm';
import ExperienceForm from './PortfolioForms/ExperienceForm';
import SkillsForm from './PortfolioForms/SkillsForm';

import AfterSubmit from './AfterSubmit';
import {map} from 'react-bootstrap/cjs/ElementChildren';


export default (props) => {

	// state = {
	// 	forms:,
	// 	currentFormIndex : 0
	// };

	const {getTokenSilently} = useAuth0();

	let formsArray = [
		AboutForm,
		EducationForm,
		ExperienceForm,
		SkillsForm,
		AfterSubmit
	];

	const [form, setForm] = useState({
		formIndex: 0,
		formData: null
	});

	function buildFormData(formData, data, parentKey) {
		if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
			Object.keys(data).forEach(key => {
				buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
			});
		} else {
			const value = data == null ? '' : data;

			formData.append(parentKey, value);
		}
	}


	const onSaveHandler = async (values) => {
		if (form.formIndex < formsArray.length - 2) {
			setForm(prevState => {
				return {
					formIndex: prevState.formIndex + 1,
					formData: {
						...prevState.formData,
						...values
					}
				}
			});
		} else {

			const token = await getTokenSilently();

			const data = {
				...form.formData,
				...values
			};

			console.log(data);
			// {
			// 	clientID: 'OS4q4gAZovKeNFaZf9ScOYxrmZ4ojKps',
			// 		domain: 'fire-nation.auth0.com',
			// 	responseType: 'token id_token',
			// 	audience: 'https://localhost:3001/api',
			// 	redirectUri: 'https://localhost:3001/admin',
			// 	scope: 'openid profile read:timesheets create:timesheets'
			// }

			const formData = new FormData();

			buildFormData(formData, data);


			axios.post('https://localhost:3001/api/portfolios', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`
				}
			}).then(result => {
				console.log(result);
				setForm(prevState => {
					return {
						formIndex: prevState.formIndex + 1
					}
				});
			}).catch(err => {
				console.log(err);
			})
		}
	};

	//FIXME: rendering is not correct.

	let Component = null;
	// if (form.formIndex === formsArray.length - 2) {
	// 	Component = formsArray[form.formIndex]({onSave: onSaveHandler, btnName: 'Submit'});
	// } else if (form.formIndex === formsArray.length - 1) {
	// 	Component = formsArray[form.formIndex]({onSave: onSaveHandler, btnName: 'Save'});
	// } else {
	// 	Component = formsArray[form.formIndex]({onClick: () => console.log('clicked')})
	// }

	// if(form.formIndex === formsArray.length - 1) {
	// 	Component = formsArray[form.formIndex]({onClick: () => console.log('clicked')})
	// } else if(form.formIndex === formsArray.length - 2) {
	// 	Component = formsArray[form.formIndex]({onSave: onSaveHandler, btnName: 'Submit'});
	// } else {
	// 	Component = formsArray[form.formIndex]({onSave: onSaveHandler, btnName: 'Save'});
	// }

	//this Portfolio component will receive data as part of props

	formsArray = formsArray.map((form, index) => {
		if (index === formsArray.length - 1) {
			return form({onClick: () => console.log('clicked')})
		}
		if (index === formsArray.length - 2) {
			return form({onSave: onSaveHandler, btnName: 'Submit'})
		}
		return form({onSave: onSaveHandler, btnName: 'Save'})
	});
	//

	return (
		<>
			{formsArray[form.formIndex]}
		</>
	)
}
class Question {
	constructor(id, description, answers, answer) {
		this.id = id;
		this.description = description ?? '';
		this.answers = answers ?? [
			{ answer: '', description: '', question_id: '' },
			{ answer: '', description: '', question_id: '' },
			{ answer: '', description: '', question_id: '' },
			{ answer: '', description: '', question_id: '' },
		];
		this.answer = answer ?? 0;
	}
}

const questionContainer = document.getElementById('questionContainer');
const addBtn = document.getElementById('addButton');

const questionsLoaded = [];
let questionNo = 0;

const xhr = new XMLHttpRequest();

// get request for questions
const getQuestions = (callback) => {
	const questionsArray = [];
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const { questions, answers } = JSON.parse(this.response);

			questions.forEach((question) => {
				let questionAnswers = [];

				answers.forEach((answer) => {
					if (question.id == answer.question_id) {
						questionAnswers.push(answer);
					}
				});
				let questionObj = new Question(question.id, question.description, questionAnswers, question.answer);
				console.log(questionObj);
				questionsArray.push(questionObj);
			});
			callback(questionsArray);
		}
	};
	xhr.open('GET', 'https://comp-4537-assignment-2-bnmd5.ondigitalocean.app/questions', true);
	xhr.send();
};

getQuestions((questions) => {
	questionsLoaded.push(...questions);
	if (questionsLoaded) {
		questionsLoaded.forEach(addQuestion);
	} else {
		questionsLoaded.push(new Question(1));
	}
});

const postQuestion = (question) => {
	console.log('POST');
	const questionsString = JSON.stringify(question);
	xhr.open('POST', 'https://comp-4537-assignment-2-bnmd5.ondigitalocean.app/questions', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			console.log(this.responseText);
		}
	};
	xhr.send(questionsString);
};

const updateQuestion = (question) => {
	const questionsString = JSON.stringify(question);
	xhr.open('PUT', 'https://comp-4537-assignment-2-bnmd5.ondigitalocean.app/questions', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			console.log(this.responseText);
		}
	};
	xhr.send(questionsString);
};

const addQuestion = (questionData) => {
	let newQuestion = true;

	if (questionData.id) {
		questionNo = questionData.id;
		newQuestion = false;
	} else {
		questionNo++;
		questionData.id = questionNo;
	}

	let questionDiv = document.createElement('div');
	questionDiv.className = 'questions';
	questionContainer.appendChild(questionDiv);

	let qLabel = document.createElement('label');
	qLabel.innerHTML = `Question ${questionNo}`;
	qLabel.className = 'qLabel';
	questionDiv.appendChild(qLabel);

	let lineBreak = document.createElement('br');
	questionDiv.appendChild(lineBreak);

	let qTextArea = document.createElement('textarea');
	qTextArea.id = 'questionText' + questionNo;
	qTextArea.value = questionData.description;
	qTextArea.addEventListener('change', (event) => {
		questionData.description = event.target.value;
	});
	questionDiv.appendChild(qTextArea);

	questionDiv.appendChild(document.createElement('p'));

	let answerTextList = [];
	let answerRadioList = [];

	// append radio and input text
	for (let i = 0; i < 4; i++) {
		let answerRadio = document.createElement('input');
		answerRadioList.push(answerRadio);
		answerRadio.type = 'radio';
		answerRadio.name = 'answerBox' + questionNo;
		answerRadio.checked = questionData.answer - 1 === i;
		answerRadio.addEventListener('change', (event) => {
			questionData.answer = i + 1;
		});
		questionDiv.appendChild(answerRadio);
		questionData.answers[i].answer = i + 1;
		questionData.answers[i].question_id = questionNo;
		let answerText = document.createElement('textarea');
		answerTextList.push(answerText);
		answerText.type = 'text';
		answerText.className = 'answerText';
		answerText.value = questionData.answers[i].description ?? '';
		answerText.addEventListener('change', (event) => {
			questionData.answers[i].description = event.target.value;
			console.log(questionData.answers[i].description);
		});
		questionDiv.appendChild(answerText);

		let lineBreak = document.createElement('br');
		questionDiv.appendChild(lineBreak);
	}

	const validateQuestionDescription = () => {
		// check question description field
		if (qTextArea.value !== '') {
			qTextArea.className = '';
			qTextArea.placeholder = '';
			return true;
		} else {
			qTextArea.className = 'errorBorder';
			qTextArea.placeholder = 'please enter question description';
			return false;
		}
	};

	const validateAnswersDescription = () => {
		let error = true;
		answerTextList.forEach((element) => {
			console.log('value', element.value);
			if (element.value == '') {
				element.className = 'errorBorder';
				element.placeholder = 'enter description';
				error = false;
			} else {
				element.className = 'answerText';
				error = true;
			}
		});

		return error;
	};

	const validateAnswersRadio = (questionDiv) => {
		for (let i = 0; i < answerRadioList.length; i++) {
			if (answerRadioList[i].checked) {
				questionDiv.className = '';
				return true;
			}
		}
		questionDiv.className = 'errorBorder';
		questionDiv.value = 'must select answer';
		return false;
	};
	let saveBtn = document.createElement('button');
	saveBtn.textContent = newQuestion ? 'POST' : 'UPDATE';
	saveBtn.class = 'saveButtons';
	saveBtn.style.backgroundColor = 'dodgerblue';
	saveBtn.style.color = 'white';
	saveBtn.style.marginTop = '20px';
	saveBtn.style.marginBottom = '20px';
	saveBtn.addEventListener('click', () => {
		console.log(validateAnswersDescription());

		if (validateQuestionDescription() && validateAnswersDescription() && validateAnswersRadio(qTextArea)) {
			if (newQuestion) {
				postQuestion(questionData);
				newQuestion = false;
				saveBtn.textContent = newQuestion ? 'POST' : 'UPDATE';
			} else {
				updateQuestion(questionData);
			}
		}
	});
	questionDiv.appendChild(saveBtn);

	let hr = document.createElement('hr');
	questionDiv.appendChild(hr);
};

addBtn.addEventListener('click', () => {
	const question = new Question();
	questionsLoaded.push(question);
	addQuestion(question);
});

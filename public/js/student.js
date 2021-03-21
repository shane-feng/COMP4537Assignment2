const questionsLoaded = [];
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
	xhr.open('GET', 'http://127.0.0.1:3000/questions', true);
	xhr.send();
};

getQuestions((questions) => {
	questionsLoaded.push(...questions);
	if (questionsLoaded) {
		questionsLoaded.forEach(loadQuestion);
	} else {
		questionsLoaded.push(new Question(1));
	}
});

const loadQuestion = ({ id }) => {
	const studentDiv = document.getElementById('studentContainer');
	const questionObj = questionsLoaded[id - 1];
	const questionLabel = document.createElement('label');
	const questionText = document.createElement('pre');
	const lineBreak = document.createElement('br');
	const answersHeader = document.createElement('p');

	questionLabel.innerHTML = `Question ${id}`;
	questionLabel.className = 'questionHeader';
	questionText.className = 'textArea';
	questionText.innerHTML = questionObj.description;
	questionText.disabled = true;
	answersHeader.innerHTML = 'Answers*';

	studentDiv.appendChild(questionLabel);
	studentDiv.appendChild(lineBreak);
	studentDiv.appendChild(questionText);
	studentDiv.appendChild(answersHeader);

	for (let i = 0; i < 4; i++) {
		const answerRadio = document.createElement('input');
		const answerText = document.createElement('pre');
		const lineBreak = document.createElement('br');

		answerRadio.type = 'radio';
		answerRadio.name = `answerBox${id}`;
		answerRadio.id = `answerRadio${id}answerNo${i + 1}`;

		answerText.id = `answerText${id}answerNo${i + 1}`;
		answerText.className = 'textArea';
		answerText.disabled = true;
		answerText.innerHTML = questionObj.answers[i].description;

		studentDiv.appendChild(answerRadio);
		studentDiv.appendChild(answerText);
		studentDiv.appendChild(lineBreak);
	}
};

const markQuestion = (questionNum, solution) => {
	// count blank answers
	let unansweredCount = 0;
	for (let i = 1; i <= 4; i++) {
		let answerRadio = document.getElementById(`answerRadio${questionNum}answerNo${i}`);
		if (!answerRadio.checked) {
			unansweredCount++;
		}
	}

	// check if all answers are blank
	if (unansweredCount == 4) {
		for (let i = 1; i <= 4; i++) {
			let correctAnswerText = document.getElementById(`answerText${questionNum}answerNo${solution}`);
			let userAnswerText = document.getElementById(`answerText${questionNum}answerNo${i}`);
			userAnswerText.className = 'textArea wrongAnswer';
			userAnswerText.innerHTML = 'You did not select any answers';
			correctAnswerText.className = 'textArea correctAnswer';
			correctAnswerText.innerHTML = 'This was suppose to be the correct answer';
		}
	} else {
		for (let i = 1; i <= 4; i++) {
			let correctAnswerText = document.getElementById(`answerText${questionNum}answerNo${solution}`);
			console.log(solution);
			let answerRadio = document.getElementById(`answerRadio${questionNum}answerNo${i}`);
			let userAnswerText = document.getElementById(`answerText${questionNum}answerNo${i}`);
			if (answerRadio.checked && solution == i) {
				userAnswerText.className = 'textArea correctAnswer';
				userAnswerText.innerHTML = 'You chose the correct answer';
				return 1;
			} else if (answerRadio.checked && solution != i) {
				userAnswerText.className = 'textArea wrongAnswer';
				userAnswerText.innerHTML = 'Your choice was incorrect';
				correctAnswerText.className = 'textArea correctAnswer';
				correctAnswerText.innerHTML = 'This was the correct answer';
			}
		}
	}
	return 0;
};

const markQuiz = () => {
	const questionsCount = questionsLoaded.length;
	let quizScore = 0;
	for (let i = 0; i < questionsCount; i++) {
		// every question i - solution
		let solution = questionsLoaded[i].answer;
		// mark individual question
		quizScore += markQuestion(i + 1, solution);
	}

	setTimeout(() => {
		alert(`You answered ${quizScore} out of ${questionsCount} questions correctly on the quiz!`);
	}, 1000);
};

const renderQuiz = () => {
	if (questionsLoaded) {
		questionsLoaded.forEach((_, index) => loadQuestion(index + 1));
		let submitBtn = document.getElementsByClassName('submitButton')[0];
		submitBtn.className = 'submitButtonDisplay';
		submitBtn.addEventListener('click', markQuiz);
	}
};

renderQuiz();

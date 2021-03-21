const express = require('express');
const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.DBHOST,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	database: process.env.DBDATABASE,
	port: process.env.DBPORT,
});

con.connect((error) => {
	if (error) throw error;
	console.log('db connected');
});

const app = express();

app.use(express.json());

// mount custom middleware for cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

const PORT = process.env.PORT || 3000;

// get questions
app.get('/questions', async (req, res) => {
	const questions = await new Promise((resolve, reject) => {
		const getQuestionsQuery = 'SELECT * FROM Questions';

		con.query(getQuestionsQuery, (error, results) => {
			if (error) return reject(error);
			resolve(JSON.parse(JSON.stringify(results)));
		});
	});
	const answers = await new Promise((resolve, reject) => {
		const getAnswersQuery = 'SELECT * FROM UserAnswers';

		con.query(getAnswersQuery, (error, results) => {
			if (error) return reject(error);
			resolve(JSON.parse(JSON.stringify(results)));
		});
	});
	res.status(200).send({ questions, answers });
});

// post question
app.post('/questions', (req, res) => {
	const { id, description, answers, answer } = req.body;
	const postQuestionQuery = `INSERT INTO Questions(id, description, answer) VALUES(${id}, "${description}", ${answer})`;
	con.query(postQuestionQuery, (error, results) => {
		if (error) return res.send(error);
		console.log('POST QUESTION SUCCESS');
	});

	answers.forEach((answer) => {
		console.log('ANSWERS', answer);
		const postAnswerQuery = `INSERT INTO UserAnswers(answer, description, question_id) VALUES(${answer.answer}, "${answer.description}", ${answer.question_id})`;
		con.query(postAnswerQuery, (error, results) => {
			if (error) {
				console.log('ERROR');
				return res.send(error);
			}
			console.log('POST ANSWER SUCCESS');
		});
	});
	res.status(200).send('POST TO DB SUCCESSFUL');
});

// update question
app.put('/questions', (req, res) => {
	console.log('QUESTIONS', req.body);
	const { id, description, answers, answer } = req.body;
	const updateQuestionQuery = `UPDATE Questions SET description="${description}", answer=${answer} WHERE id=${id}`;
	con.query(updateQuestionQuery, (error, results) => {
		if (error) return res.send(error);
		console.log('UPDATE QUESTION SUCCESS');
	});

	answers.forEach((ans) => {
		console.log('ANSWERS', ans);
		const updateAnswerQuery = `UPDATE UserAnswers SET description="${ans.description}" WHERE answer=${ans.answer} AND question_id=${id}`;
		con.query(updateAnswerQuery, (error, results) => {
			if (error) {
				return res.send(error);
			}
			console.log('UPDATE ANSWER SUCCESS');
		});
	});
	res.status(200).send('UPDATE TO DB SUCCESSFUL');
});

app.listen(PORT, () => {
	console.log(`server running on PORT:${PORT}`);
});

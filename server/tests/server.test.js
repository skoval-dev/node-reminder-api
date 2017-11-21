const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Reminder} = require('./../models/reminder');

const _reminders = [
	{text: 'Reminder, R-1'},
	{text: 'Reminder, R-2'},
	{text: 'Reminder, R-3'},
];

beforeEach((done) => {
	Reminder.remove({}).then(() => {
		return Reminder.insertMany(_reminders);
	}).then(() => done()).catch((err) => {
		done(err);
	});
});

describe('POST /reminders', () => {
	it('Should create a new reminder', (done) => {
		let text = 'Reminder, R-1';

		request(app)
			.post('/reminders')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}
				Reminder.find().then((reminders) => {
					expect(reminders.length).toBe(_reminders.length + 1);
					expect(reminders[0].text).toBe(text);
					done();
				}).catch((err) => {
					done(err);
				});	
			}); 
	});

	it('Should not create reminder with invalid body data', (done) => {
		let text = ' ';
		request(app)
			.post('/reminders')
			.send('')
			.expect(400)
			.expect((res) => {
				expect(res.body.name).toBe('ValidationError');
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}
				Reminder.find().then((reminders) => {
					expect(reminders.length).toBe(_reminders.length);
					done();
				}).catch((err) => {
					done(err);
				});	
			})
	});

});
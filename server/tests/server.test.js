const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Reminder} = require('./../models/reminder');

beforeEach((done) => {
	Reminder.remove({}).then(() => {
		done();
	}).catch((err) => {
		done(err);
	});
});

describe('POST /reminder', () => {
	it('Should create a new reminder', (done) => {
		let text = 'Test reminder text';

		request(app)
			.post('/reminder')
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
					expect(reminders.length).toBe(1);
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
			.post('/reminder')
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
					expect(reminders.length).toBe(0);
					done();
				}).catch((err) => {
					done(err);
				});	
			})
	});

});
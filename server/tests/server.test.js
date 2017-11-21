const      request = require('supertest');
const       expect = require('expect');

const        {app} = require('./../server');
const   {Reminder} = require('./../models/reminder');
const   {ObjectID} = require('mongodb');

const _reminders = [
	{
	    _id: new ObjectID(),
	    text: 'Reminder, R-1',
        completed: true,
        completed_at: 1511300279632
    }, {
        _id: new ObjectID(),
        text: 'Reminder, R-2',
        completed: true,
        completed_at: 1511300279632
    }, {
        _id: new ObjectID(),
        text: 'Reminder, R-3',
        completed: true,
        completed_at: 1511300279632
    },
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
			});
	});

});

describe('GET /reminders', () => {
	it('Should get all reminders', (done) => {
		request(app)
			.get('/reminders')
			.expect(200)
			.expect((res) => {
				expect(res.body.reminders.length).toBe(3);
			}).end((err, res) => {
				if(err){
					return done(err);
				}
				done();
			});
	});
});

describe('GET /reminders/:id', () => {
    it('Should return reminder by id', (done) => {
        request(app)
            .get(`/reminders/${_reminders[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.reminder.text).toBe(_reminders[0].text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                done();
            });
    });

    it('Should return 404 for non-matched id', (done) => {
        let hex_id = new ObjectID().toHexString();
        request(app)
            .get(`/reminders/${hex_id}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/reminders/1234')
            .expect(404)
            .end(done);
    });
});


describe('DELETE /reminders/:id', () => {
    it('Should delete reminder by id', (done) => {
        let hex_id = _reminders[0]._id.toHexString();
        request(app)
            .del(`/reminders/${hex_id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.reminder._id).toBe(hex_id);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
            });

        Reminder.findById(hex_id).then((res) => {
           expect(res.body).toNotExist();
           done();
        }).catch((err) => done(err));
    });

    it('Should return 404 for non-deleted id', (done) => {
        let hex_id = new ObjectID().toHexString();
        request(app)
            .del(`/reminders/${hex_id}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .del('/reminders/1234')
            .expect(404)
            .end(done);
    });

});


describe("PATCH /reminders/:id", () => {
   it("Should update the reminder", (done) => {
        let id = _reminders[0]._id.toHexString();
        let payload = {
            text: 'New test text',
            completed: true
        };
        request(app)
            .patch(`/reminders/${id}`)
            .send(payload)
            .expect(200)
            .expect((res) => {
                expect(res.body.reminder.text).toBe(payload.text);
                expect(res.body.reminder.completed).toBe(payload.completed);
                expect(res.body.reminder.completed_at).toBeGreaterThan(-1);
            }).end((err, res) => {
                if(err){
                    return done(err);
                }
                done();
            })
   });

    it("Should clear completed_at when reminder is not completed", (done) => {
        let id = _reminders[0]._id.toHexString();
        let payload = {
            text: 'New test text 2',
            completed: false
        };
        request(app)
            .patch(`/reminders/${id}`)
            .send(payload)
            .expect(200)
            .expect((res) => {
                expect(res.body.reminder.text).toBe(payload.text);
                expect(res.body.reminder.completed).toBe(payload.completed);
                expect(res.body.reminder.completed_at).toBe(-1);
            }).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        })
    });
});
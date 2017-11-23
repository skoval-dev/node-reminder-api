const      request = require('supertest');
const       expect = require('expect');

const        {app} = require('./../server');
const   {Reminder} = require('./../models/reminder');
const   {User} = require('./../models/user');
const   {ObjectID} = require('mongodb');
const   {_reminders, populate_reminders, _users, populate_users} = require('./seed/seed');

beforeEach(populate_reminders);
beforeEach(populate_users);

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
					return done(err);
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
					return done(err);
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
                done(err);
        })
    });
});

describe("GET /users/me", () => {
    it("Should return user if authenticated", (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', _users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(_users[0]._id.toHexString());
                expect(res.body.email).toBe(_users[0].email);
            }).end(done);
    });

    it("Should return 401 if not authenticated", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.body.message).toBe("The provided token is incorrect!");
            }).end(done);
    });
});

describe("POST /users", () => {
    it("Should create a user", (done) => {
        let email = "example@example.com",
            password = "123asd";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);
            }).end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.pass).toNotBe(password);
                    expect(user.email).toBe(email);
                    done();
                });
        });
    });

    it("Should return validation errors if request invalid", (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'skoval',
                password: '12344563453'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.body.message).toInclude("User validation failed");
            }).end(done);
    });

    it("Should not create user if email exist", (done) => {
        request(app)
            .post('/users')
            .send({
                email: _users[0].email,
                password: _users[0].password
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.body.message).toInclude("duplicate key error collection");
            }).end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findOne({email: _users[0].email}).then((user) => {
                    expect(user.email).toBe(_users[0].email);
                    done();
                }).catch((err) => {
                    return done(err);
                })
            });
    });
});


describe("POST /users/login", () => {
    it("Should login user and return auth token", (done) => {
        const payload = {
            email: _users[1].email,
            password: _users[1].password
        };

        request(app)
            .post("/users/login")
            .send(payload)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(payload.email);
                expect(res.body.password).toNotBe(payload.password);
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findOne({email: payload.email}).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done(err);
                }).catch((err) => {
                    return done(err);
                });

            });
    });

    it("Should denied invalid credentials", (done) => {
        const payload = {
            email: _users[1].email,
            password: _users[1].password + '_wrong'
        };

        request(app)
            .post("/users/login")
            .send(payload)
            .expect(400)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err)
                }

                User.findOne({email: payload.email}).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });
});


describe("DELETE /users/me/token", () => {
    it("Should remove token on logout", (done) => {
        let token_obj = _users[0].tokens[0];
       request(app)
           .delete("/users/me/token")
           .set('x-auth', token_obj.token)
           .expect(200)
           .expect((res) => {
                expect(res.body.message).toBe("The token was deleted");
                expect(res.body.success).toBe(true);
            }).end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email: _users[0].email}).then((res) => {
                       expect(res.tokens.length).toBe(0);
                   done();
                }).catch((err) => {
                    done(err);
                });

            });
    });
});
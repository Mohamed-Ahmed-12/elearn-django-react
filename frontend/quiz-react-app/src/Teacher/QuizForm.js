import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createQuiz } from '../redux/slices/quizSlice'
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function QuizForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState({ title: "", instruction: "", start: null, end: null, duration: 0 });

    const resetValues = () => {
        setQuiz({ title: "", instruction: "", start: null, end: null, duration: 0 });
        setQuestions([]);
    }

    const handleQuizChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index][e.target.name] = e.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        if (questions.length > 0) {
            const lastQuestion = questions[questions.length - 1];
            const isComplete =
                lastQuestion.question &&
                lastQuestion.option1 &&
                lastQuestion.option2 &&
                lastQuestion.option3 &&
                lastQuestion.option4 &&
                lastQuestion.correctOption &&
                lastQuestion.scale;

            if (!isComplete) {
                toast.error("Complete previous before adding a new one.");
                return;
            }
        }

        setQuestions([...questions, { question: "", option1: "", option2: "", option3: "", option4: "", correctOption: "", scale: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(createQuiz({ quiz, questions }));
            console.log(resultAction); // Log the resultAction to see its full structure

            if (createQuiz.fulfilled.match(resultAction)) {
                if (resultAction.payload && resultAction.payload.user) {
                    toast.success(`Quiz created successfully by ${resultAction.payload.user.username}`, {
                        position: 'top-right',
                        autoClose: 5000,
                    });
                } else {
                    toast.warning('Quiz created but no user data available.', {
                        position: 'top-right',
                        autoClose: 5000,
                    });
                }
                resetValues()
                navigate('/te/dashboard#dashboard')
            } else if (createQuiz.pending.match(resultAction)) {
                toast.info('Quiz creation in progress', {
                    position: 'top-right',
                    autoClose: 5000,
                });
            } else {
                toast.error('Quiz creation failed', {
                    position: 'top-right',
                    autoClose: 5000,
                });
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Error creating quiz', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };


    return (

        <>
            <h4 className="text-indigo-50 font-bold" style={{ fontFamily: "sans-serif" }}>Create New Quiz</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="quizTitle" className='my-4'>
                    <Form.Control
                        name="title"
                        type="text"
                        placeholder="Quiz Title"
                        required
                        onChange={handleQuizChange} />
                </Form.Group>

                <Form.Group controlId="quizInstructions" className='my-4'>
                    <Form.Control
                        as="textarea" // Specify it as a textarea
                        name="instructions"
                        placeholder="Quiz Instructions"
                        rows={5} // Set the number of rows
                        required
                        onChange={handleQuizChange} // Handle change to update state
                    />
                </Form.Group>

                <Form.Group controlId="quizStart" className='my-4'>
                    <Form.Control
                        name="start"
                        type="datetime-local"
                        required
                        onChange={handleQuizChange} />
                </Form.Group>

                <Form.Group controlId="quizEnd" className='my-4'>
                    <Form.Control
                        name="end"
                        type="datetime-local"
                        required
                        onChange={handleQuizChange} />
                </Form.Group>

                <Form.Group controlId="quizDuration" className='my-4'>
                    <Form.Control
                        name="duration"
                        type="number"
                        placeholder="Duration (minutes)"
                        required
                        onChange={handleQuizChange} />
                </Form.Group>

                {questions.map((question, index) => (
                    <div key={index} className='mb-4'>

                        <Form.Group controlId={`question${index}`} className='my-2'>
                            <h1>Q{index + 1}</h1>
                            <Form.Control
                                name="question"
                                type="text"
                                placeholder={`Question ${index + 1}`}
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, e)}
                                required />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group controlId={`option1${index}`} className='my-2'>
                                    <Form.Control
                                        name="option1"
                                        type="text"
                                        placeholder="Option 1"
                                        value={question.option1}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId={`option2${index}`} className='my-2'>
                                    <Form.Control
                                        name="option2"
                                        type="text"
                                        placeholder="Option 2"
                                        value={question.option2}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId={`option3${index}`} className='my-2'>
                                    <Form.Control
                                        name="option3"
                                        type="text"
                                        placeholder="Option 3"
                                        value={question.option3}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId={`option4${index}`} className='my-2'>
                                    <Form.Control
                                        name="option4"
                                        type="text"
                                        placeholder="Option 4"
                                        value={question.option4}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId={`correctOption${index}`} className='my-2'>
                            <Form.Control
                                as="select"
                                name="correctOption"
                                value={question.correctOption}
                                onChange={(e) => handleQuestionChange(index, e)}
                                required
                            >
                                <option value="">Select Correct Option</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={`scale${index}`} className='my-2'>
                            <Form.Control
                                name="scale"
                                type="number"
                                placeholder="Scale"
                                value={question.scale}
                                onChange={(e) => handleQuestionChange(index, e)}
                                required />
                        </Form.Group>
                    </div>
                ))}

                <Row className='my-4'>
                    <Col>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={addQuestion}
                            className="w-100"
                        >
                            Add a Question
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="submit"
                            variant="indigo-100"
                            className="w-100"
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

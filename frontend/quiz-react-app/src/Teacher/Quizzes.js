import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Badge, Button, Modal, Spinner, ListGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes, fetchSingleQuiz } from "../redux/slices/quizSlice";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { formatDate } from '../utilities'
const StatusBadge = ({ isActive }) => (
    <Badge bg={isActive ? "success" : "danger"}>
        {isActive ? "Active" : "Not Active"}
    </Badge>
);

export default function Quizzes() {
    const [show, setShow] = useState(false);
    const quizzes = useSelector((state) => state.quiz.quizzes);
    console.log(quizzes)
    // const questions = useSelector((state) => state.quiz.questions);
    const [selectedQuiz, setSelectedQuiz] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchQuizzes());

    }, [dispatch]);

    useEffect(() => {
        console.log(selectedQuiz)
    }, [selectedQuiz]);


    const handleGetQuiz = async (quizId) => {
        try {
            const resultAction = await dispatch(fetchSingleQuiz(quizId));
            console.log(resultAction.payload)
            setShow(true);
            setSelectedQuiz((state) => resultAction.payload);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Modal
                fullscreen={true}
                scrollable={true}
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-100w"
                aria-labelledby="quiz-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="quiz-modal" className="tex-indigo-100">
                        Quiz Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="p-3">
                        <Card className="p-4 shadow-sm">
                            <Card.Title className="mb-2">Instructions:</Card.Title>
                            <Card.Body>
                                {selectedQuiz?.instructions ? (
                                    <ul className="ps-3">
                                        {selectedQuiz.instructions
                                            .split("\n")
                                            .filter((line) => line.trim() !== "")
                                            .map((line, index) => (
                                                <li key={index}>{line}</li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No instructions available.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                    {selectedQuiz.exam_questions ? (
                        <Container className="p-3">
                            {selectedQuiz.exam_questions?.map((question, index) => (
                                <div key={index} className="mb-4 bg-light p-3 rounded-3 shadow-3">
                                    <Row>
                                        <Col><h3 className="text-indigo-100 fw-bold" style={{ fontFamily: "fantasy" }}>{index + 1}: {question.content.endsWith('?') ? question.content : question.content + ' ?'}</h3></Col>
                                        <Col sm={1}><Badge bg="indigo-50">Scale : {question.scale}</Badge></Col>
                                    </Row>
                                    <ListGroup className="ms-4">
                                        {question.question_answers.map((ans) => (

                                            <ListGroup.Item
                                                variant={ans.is_correct === true ? 'success' : 'secondary'}
                                                className={`my-2 rounded-1 ${ans.is_correct === true ? 'border-success border-top correct-answer' : ''
                                                    }`}
                                                key={ans.id}
                                            >
                                                {ans.is_correct === true ? (
                                                    <FaRegCheckCircle className="text-success me-2" />
                                                ) : (
                                                    <FaXmark className="text-danger me-2" />
                                                )}
                                                {ans.content}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            ))}
                        </Container>
                    ) : (
                        <Spinner />
                    )}
                </Modal.Body>
            </Modal>
            <h4 className="text-indigo-50 font-bold" style={{ fontFamily: "sans-serif" }}>Quizzes</h4>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>
                            <Form.Check id="all" />
                        </th>
                        <th>Title</th>
                        <th>Duration</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>No. questions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody >
                    {quizzes.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No quizzes available.
                            </td>
                        </tr>
                    ) : (
                        quizzes.map((quiz, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Check id={`quiz${quiz.id}`} />
                                </td>
                                <td>{quiz.title}</td>
                                <td>{quiz.duration} minutes</td>
                                <td>{formatDate(quiz.start)}</td>
                                <td>{formatDate(quiz.end)}</td>
                                <td>
                                    <StatusBadge isActive={quiz.is_active} />
                                </td>
                                <td>
                                    {quiz.exam_questions.length} questions
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleGetQuiz(quiz.id)}
                                    >
                                        Show
                                    </Button>

                                    <Link to={`/te/quiz/${quiz.id}/results`} className=" btn btn-outline-success btn-sm me-2">
                                        Results
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
}

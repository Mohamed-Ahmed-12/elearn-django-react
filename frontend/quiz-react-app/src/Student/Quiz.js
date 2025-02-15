import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSingleQuiz, saveStudentAnswer } from '../redux/slices/quizSlice';
import { IoMdTime } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import Result from './Result';
import { readableTimeFormat } from '../utilities';

export default function Quiz() {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const { quiz, loading, error, result, isTaken } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timing, setTiming] = useState({ start: null, completed: null });
  const [quizTimer, setQuizTimer] = useState('00:00:00');
  const [countdownInterval, setCountdownInterval] = useState(null);

  useEffect(() => {
    if (!isTaken) {
      dispatch(fetchSingleQuiz(quizId));
    }
  }, [isTaken, quizId, dispatch]);

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  const startCountdown = () => {
    if (!quiz?.duration) return;

    let durationSeconds = quiz.duration * 60;
    let endTime = Date.now() + durationSeconds * 1000;

    const countdown = setInterval(() => {
      let timeLeft = Math.round((endTime - Date.now()) / 1000);

      if (timeLeft <= 0) {
        clearInterval(countdown);
        setQuizTimer('00:00:00');
        handleSubmit(); // Automatically submit the quiz
      } else {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        let timeString = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
        setQuizTimer(timeString);
      }
    }, 1000);

    setCountdownInterval(countdown); // Save interval ID to clear it when needed
  };

  useEffect(() => {
    if (isStarted && !submitted) {
      startCountdown();
    }
  }, [isStarted, submitted]);

  const handleStartQuiz = () => {
    setIsStarted(true);
    setSubmitted(false);
    setTiming({ start: Date.now(), completed: null });
  };

  useEffect(() => {
    if (submitted) {
      dispatch(saveStudentAnswer({ answers, timing, quizId }));
    }
  }, [submitted, answers, timing, quizId, dispatch]);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault(); // Prevent default if submit is triggered by button click
    setTiming({ start: timing.start, completed: Date.now() });
    setSubmitted(true);
  };

  if (isTaken) {
    return <Result result={result} quiz={quiz} />;
  }

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" size="lg" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert key={"danger"} variant={"danger"}>
          {error}
        </Alert>
      </Container>
    );

  return (
    <Container>
      <Row className="my-4">
        {!isStarted ? (
          <Col xs="12" className="mb-3">
            <h2 className="fw-bold mb-3">Quiz Details </h2>
            <Card className="shadow-sm border">
              <Card.Header className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="text-primary" style={{ overflow: "hidden" }}>
                  {quiz?.title}
                </h4>
                <Badge pill bg={`${quiz?.is_active ? "success" : "danger"}`}>
                  {quiz?.is_active ? "Active" : "Inactive"}
                </Badge>
              </Card.Header>
              <Card.Body>
 {/* 🔹 Improved Instructions Section */}
 <Row>
              <Col xs="12" className="mb-3">
                <Card className="border-0 bg-light p-3">
                  <Card.Title className="mb-2 text-dark">📌 Instructions:</Card.Title>
                  {quiz?.instructions ? (
                    <blockquote className="blockquote">
                      <ul className="ps-3">
                        {quiz.instructions
                          .split("\n")
                          .filter((line) => line.trim() !== "")
                          .map((line, index) => (
                            <li key={index}>{line}</li>
                          ))}
                      </ul>
                    </blockquote>
                  ) : (
                    <p className="text-muted">No instructions available.</p>
                  )}
                </Card>
              </Col>
            </Row>
                <Row className="mb-3 ms-2 align-items-start">
                  <Col xs="auto" className="d-flex justify-content-center align-items-center">
                    <SlCalender size={"1.8em"} className="text-secondary mt-1" />
                  </Col>
                  <Col>
                    <h6 className="my-0 fw-bold">Start at:</h6>
                    <p className="text-muted">{readableTimeFormat(quiz?.start)}</p>
                  </Col>
                </Row>
                <Row className="mb-3 ms-2">
                  <Col xs="auto" className="d-flex justify-content-center align-items-center">
                    <SlCalender size={"1.8em"} className="text-secondary" />
                  </Col>
                  <Col>
                    <h6 className="mb-0 fw-bold">End at:</h6>
                    <p className="text-muted">{readableTimeFormat(quiz?.end)}</p>
                  </Col>
                </Row>
                <Row className="mb-3 ms-2">
                  <Col xs="auto" className="d-flex justify-content-center align-items-center">
                    <IoMdTime size={"1.8em"} className="text-secondary" />
                  </Col>
                  <Col>
                    <h6 className="mb-0 fw-bold">Duration:</h6>
                    <p className="text-muted">{quiz?.duration} minutes</p>
                  </Col>
                </Row>
              </Card.Body>
              {quiz?.is_active && (
                <Card.Footer className="d-flex justify-content-center">
                  <button
                    className="btn btn-outline-indigo-100 fw-bold"
                    onClick={handleStartQuiz}
                  >
                    Start Quiz
                  </button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ) : (
          <Col sm="12">
            <div className="d-flex justify-content-between mb-3 ">
              <h4 className="fw-bold mb-3">Questions </h4>
              <span
                className="rounded-pill bg-light p-2 text-center border bg-indigo-0"
                style={{ width: "auto", height: "45px" }}
              >
                {quizTimer}
              </span>
            </div>

            <Form>
              {quiz.exam_questions?.map((question, index) => (
                <Card className="mb-4" key={question.id}>
                  <Card.Body>
                    <Card.Title>
                      Q{index + 1}:{" "}
                      {question.content.endsWith("?")
                        ? question.content
                        : question.content + " ?"}
                    </Card.Title>
                    <Form.Group className="p-1">
                      {question.question_answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={
                            answers[question.id] === answer.id
                              ? "border border-primary my-3 p-2"
                              : "border my-3 p-2"
                          }
                        >
                          <Form.Check
                            type="radio"
                            name={`question-${question.id}`}
                            id={`answer-${answer.id}`}
                            label={answer.content}
                            checked={answers[question.id] === answer.id}
                            onChange={() => handleAnswerChange(question.id, answer.id)}
                            disabled={submitted}
                            required={true}
                            className="w-100"
                          />
                        </div>
                      ))}
                    </Form.Group>
                  </Card.Body>
                </Card>
              ))}
              <div className="d-grid my-3">
                {loading ? (
                  <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={(e) => handleSubmit(e)}
                    id="submit-btn"
                  >
                    Save answer
                  </Button>
                )}
              </div>
            </Form>
          </Col>
        )}
      </Row>
    </Container>
  );
}

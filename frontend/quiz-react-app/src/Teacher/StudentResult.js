import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchStudentAnswer } from "../redux/slices/quizSlice";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";

export default function StudentResult() {
  const { resultId } = useParams();
  const dispatch = useDispatch();
  const quizData = useSelector((state) => state.quiz.result);

  useEffect(() => {
    dispatch(fetchStudentAnswer(resultId));
  }, [dispatch, resultId]);

  return (
    <Container className="p-3">
      {quizData &&
        quizData?.map((item, index) => (
          <div key={item.id} className="mb-4 bg-light p-3 rounded-3 shadow-3">
            <Row>
              <Col>
                <h3 className="fw-bold" style={{ fontFamily: "fantasy" }}>
                  {index + 1}: {item.question.content.endsWith("?") 
                    ? item.question.content 
                    : `${item.question.content} ?`}
                </h3>
              </Col>
              <Col sm={1}>
                <Badge bg="info">Scale: {item.question.scale}</Badge>
              </Col>
            </Row>
            <ListGroup className="ms-4">
              {item.question.question_answers.map((ans) => (
                <ListGroup.Item
                  key={ans.id}
                  variant={
                    ans.is_correct
                      ? "success"
                      : ans.id === item.answer.id
                      ? "primary"
                      : "secondary"
                  }
                  className={`my-2 rounded-1 ${
                    ans.is_correct
                      ? "border-success border-top"
                      : ans.id === item.answer.id
                      ? "border-primary border-top"
                      : ""
                  }`}
                >
                  {ans.is_correct ? (
                    <FaRegCheckCircle className="text-success me-2" />
                  ) : ans.id === item.answer.id ? (
                    <FaTimes className="text-primary me-2" />
                  ) : (
                    <FaTimes className="text-danger me-2" />
                  )}
                  {ans.content}
                  {ans.id === item.answer.id && (
                    <Badge bg="primary" className="ms-2">
                      Student Answer
                    </Badge>
                  )}
                  {ans.is_correct && (
                    <Badge bg="success" className="ms-2">
                      Correct Answer
                    </Badge>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))}
    </Container>
  );
}

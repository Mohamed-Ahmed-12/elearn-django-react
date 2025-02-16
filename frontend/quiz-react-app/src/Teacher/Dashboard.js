import React, { useState } from 'react';
import { Card, Col, Image, ListGroup, Row, Tab } from 'react-bootstrap';
import { CiHome, CiViewList, CiDatabase, CiLogout } from "react-icons/ci";
import { FaCalendar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import Quizzes from './Quizzes';
import QuizForm from './QuizForm';
import TeacherIcon from '../teacher.png'
import Calender from './Calender'
export default function Dashboard() {
    const [contentName, setContentName] = useState('#dashboard');
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.auth.user);
    const handleLogout = () => {
        dispatch(logout());
    };

    const handleTabChange = (key) => {
        setContentName(key);
    };

    const Main = () => {
        return (
            <>
                <h4 className="text-indigo-50 font-bold" style={{ fontFamily: "sans-serif" }}>Welcome to the Dashboard</h4>
                <div class="row mt-4 mx-1">
                    <div className='col border-top border-primary bg-light border-3 p-3'>
                        <h6>Quizzes</h6>
                        <span>5</span>
                    </div>
                    <div className='col border-top border-indigo-50 bg-light border-3 p-3 mx-3'>
                    <h6>Quizzes</h6>
                    <span>5</span>
                    </div>
                    <div className='col border-top border-danger bg-light border-3 p-3'>
                    <h6>Quizzes</h6>
                    <span>5</span>
                    </div>
                </div>
            </>

        );
    }
    const renderContent = () => {
        switch (contentName) {
            case '#quizzes':
                return <Quizzes />;
            case '#quizForm':
                return <QuizForm />;
            case '#dashboard':
                return <Main />;
            case '#calender':
                return <Calender />;
            default:
                return <h4>?</h4>
        }
    };

    return (
        <Tab.Container id="list-group-tabs-example" activeKey={contentName}>
            <Row className="px-0 " style={{ backgroundColor: 'rgb(248, 249, 255)' }}>
                {/* Side Content */}
                <Col xl={2} md={3} sm={12} className="vh-100 p-3">
                    <Card className="border shadow-sm rounded h-100 p-1">
                        <div className='d-flex align-items-end justify-content-center mt-2'>
                            <Image
                                alt="Logo"
                                src="https://cdn-icons-png.freepik.com/512/10266/10266327.png"
                                height="45"
                                width="auto"
                                style={{ objectFit: 'contain' }}
                            />
                            <h5 className='text-indigo-100 ms-2'>Quizzat</h5>
                        </div>
                        <ListGroup className='mt-3 rounded-0'>
                            <ListGroup.Item
                                action
                                href="#dashboard"
                                className="d-flex align-items-center my-2 rounded-0 border-0"
                                onClick={() => handleTabChange('#dashboard')}
                            >
                                <CiHome size="1.4rem" />
                                <h6 className="mb-0 ms-2">Dashboard</h6>
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                href="#quizzes"
                                className="d-flex align-items-center my-2 rounded-0 border-0"
                                onClick={() => handleTabChange('#quizzes')}
                            >
                                <CiViewList size="1.4rem" />
                                <h6 className="mb-0 ms-2">Quizzes</h6>
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                href="#quizForm"
                                className="d-flex align-items-center my-2 rounded-0 border-0"
                                onClick={() => handleTabChange('#quizForm')}
                            >
                                <CiViewList size="1.4rem" />
                                <h6 className="mb-0 ms-2">New Quiz</h6>
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                href="#questions"
                                className="d-flex align-items-center my-2 rounded-0 border-0"
                                onClick={() => handleTabChange('#questions')}
                            >
                                <CiDatabase size="1.4rem" />
                                <h6 className="mb-0 ms-2">Questions Bank</h6>
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                href="#calender"
                                className="d-flex align-items-center my-2 rounded-0 border-0"
                                onClick={() => handleTabChange('#calender')}
                            >
                                <FaCalendar size="1.4rem" />
                                <h6 className="mb-0 ms-2">Calender</h6>
                            </ListGroup.Item>

                            <ListGroup.Item
                                action
                                className="d-flex align-items-center my-2 rounded-0 border-0"
                                onClick={handleLogout}
                            >
                                <CiLogout size="1.4rem" />
                                <h6 className="mb-0 ms-2">Logout</h6>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col xl={10} md={9} sm={12} className="vh-100 p-3" >
                    <Card className="border shadow-sm rounded p-2">
                        <div className='d-flex align-items-end justify-content-end gap-2'>
                            <Image src={TeacherIcon} height={'35px'} style={{ objectFit: 'contain' }} className='rounded-circle border' />
                            <h6 className='text-purple-100 fw-bold mx-2' style={{ fontFamily: "initial" }}>{userState.username} </h6>
                        </div>
                    </Card>

                    <Card className="border shadow-sm rounded my-2 p-4">
                        <Tab.Content style={{overflow: "scroll"}}>
                            <Tab.Pane eventKey={contentName}>{renderContent()}</Tab.Pane>
                        </Tab.Content>
                    </Card>
                </Col>
            </Row>
        </Tab.Container>
    );
}

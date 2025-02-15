import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Quizzes from './Teacher/Quizzes';
import QuizForm from './Teacher/QuizForm';
import NavbarComponent from "./components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import Quiz from "./Student/Quiz";
import Unauth from "./pages/Unauth";
import Dashboard from "./Teacher/Dashboard";
import PageNotFound from "./pages/NoPage";
import Result from "./Student/Result";
import gif from './giphy.gif';
import AllResults from "./Teacher/AllResults";
import StudentResult from "./Teacher/StudentResult";
import store from './redux/Store'
import { refreshAccessToken } from "./redux/slices/authSlice";
import { useEffect } from "react";

/*
JSON.parse(null); // Error
JSON.parse("Hello"); // Error
JSON.parse(""); // Error
JSON.parse('{'key':'value',....}'); // Correct
*/


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Accessing Redux state
  const token = useSelector((state) => state.auth.token?.access);
  const userState = useSelector((state) => state.auth.user);

  // Check if userState is a valid JSON string or already parsed object
  let user = null;
  try {
    user = userState && typeof userState === "string" ? JSON.parse(userState) : userState;
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const userRole = user ? user.role : null;

  // Redirect to login if the user is not authenticated
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Redirect to unauthorized if the user's role is not allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the children if the user is authenticated and authorized
  return children;
};

const GifComponent = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const loading = useSelector((state) => state.quiz.loading)

  console.log(isLoading, loading)
  if (isLoading || loading) return (

    <div className="h-100 w-100" style={{
      position: 'absolute',
      zIndex: "1000",
      backgroundImage: `url(${gif})`,
      backgroundColor: "rgba(0,0,0,.2)",
      backgroundSize: "20%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>

    </div>

  )
  return

}

/*
allowedRoles ['Student', 'Teacher']
to specific any user role can access page 
type user role as item in array for ProtectedRoute component with allowedRoles prop
ex

 <ProtectedRoute allowedRoles={['Student', 'Teacher']}> this for shared pages like login form and signup
 <ProtectedRoute allowedRoles={['Teacher']}> this for Teacher pages like add new quiz , see results , etc ...
 <ProtectedRoute allowedRoles={['Student']}> this for Student pages like take a quiz , see result of quiz , etc ...
 <ProtectedRoute allowedRoles={[]}> this not for any teacher or student may be for admin

*/
function App() {
  
  function setupTokenRefresh() {
    const token = store.getState().auth.token.refresh;
    console.log(token)
    if (token) {
      return setInterval(() => {
        store.dispatch(refreshAccessToken());
      }, 600000);
    }
  }

  useEffect(() => {
    const intervalId = setupTokenRefresh();
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <>
      <BrowserRouter>
        {/* <TokenRefresher /> */}
        <Container fluid={true}>
          <Row>
            {/* Main */}
            <Col>
              <GifComponent />
              <NavbarComponent />
              <main className="vh-100" style={{ position: 'relative' }}>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowedRoles={['Student']}>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="te/quizzes"
                    element={
                      <ProtectedRoute allowedRoles={['Teacher']}>
                        <Quizzes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="te/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['Teacher']}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="te/quiz/add"
                    element={
                      <ProtectedRoute allowedRoles={['Teacher']}>
                        <QuizForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="te/quiz/:quizId/results"
                    element={
                      <ProtectedRoute allowedRoles={['Teacher']}>
                        <AllResults />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="te/result/:resultId"
                    element={
                      <ProtectedRoute allowedRoles={['Teacher']}>
                        <StudentResult />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="st/quiz/:quizId"
                    element={
                      <ProtectedRoute allowedRoles={['Student']}>
                        <Quiz />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="st/result"
                    element={
                      <ProtectedRoute allowedRoles={['Student']}>
                        <Result />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/unauthorized" element={<ProtectedRoute allowedRoles={['Student', 'Teacher']}><Unauth /></ProtectedRoute>} />
                  <Route path="*" element={<ProtectedRoute allowedRoles={['Student', 'Teacher']}><PageNotFound /></ProtectedRoute>} />
                </Routes>
              </main>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;

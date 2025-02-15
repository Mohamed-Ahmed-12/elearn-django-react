import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchQuizResults } from '../redux/slices/quizSlice';
import { useDispatch , useSelector } from 'react-redux';
import {formatDate} from '../utilities' 
export default function AllResults() {
    const dispatch = useDispatch();
    const {results} = useSelector((state)=> state.quiz);
    const { quizId } = useParams();
    useEffect(() => {
        dispatch(fetchQuizResults(quizId));
    },[])

  return (
    <div className="container mt-5">
      <h2>Quiz Results</h2>
      {results && results.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Total Marks</th>
              <th>Started At</th>
              <th>Completed At</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.user.username}</td>
                <td>{result.total_mark}</td>
                <td>{formatDate(result.started_at)}</td>
                <td>{formatDate(result.completed_at)}</td>
                <td><Link to={`/te/result/${result.id}`} className="btn btn-primary btn-sm">Show</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No results available.</div>
      )}
    </div>
  )
}


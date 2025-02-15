import React, { useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { BsFillCheckCircleFill } from "react-icons/bs";
import gif from '../../src/celebrate.gif';
import {formatDate} from '../utilities';
export default function Result({ result , quiz}) {
  const [isFullmark , setIsFullmark] = useState(false);


  useEffect(()=>{
    if(result.total_mark === quiz?.total_scale){
      setIsFullmark(true)
    }
  },[result,quiz]);
  return (
    <Container
      className="d-flex align-items-center justify-content-center vh-100"

      style={{ backgroundImage : isFullmark ?  `url(${gif})`: null,backgroundRepeat: "no-repeat",backgroundPosition: "center",backgroundSize: "contain",
    }}
    >
      <Card>
        <Card.Body>
          <Card.Title className="text-center">Result</Card.Title>
          <div className='text-center text-success my-3' style={{fontSize:'5em'}}>
              <BsFillCheckCircleFill />
          </div>

          <Card.Text>
            <strong>Total Marks:</strong> {result.total_mark} / {quiz.total_scale}
          </Card.Text>

          <Card.Text>
            <strong>Started At:</strong> {formatDate(result.started_at)}
          </Card.Text>

          <Card.Text>
            <strong>Completed At:</strong> {formatDate(result.completed_at)}
          </Card.Text>


          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              onClick={() => alert(`View more details for result ID: ${result.id}`)}
            >
              View Details
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

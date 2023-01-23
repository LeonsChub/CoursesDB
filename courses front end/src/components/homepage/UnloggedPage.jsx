import React from 'react'

import pythonImg from '../../assets/Images/python.png'
import javaImg from '../../assets/Images/java.png'
import nodeImg from '../../assets/Images/node.png'
import { Link } from 'react-router-dom'
import './style.css'

function UnloggedPage() {
  return (
    <div>
      <div id="fullSpanBanner">
        <h2>The last academy you'll have to attend!</h2>

        <p>
          ORPerbyc guarantees an 87% success rate for graduates in finding their
          next high-tech postion.
        </p>
      </div>

      <div className="courseInfo split">
        <div className="courseImg">
          <img src={pythonImg} alt="" />
        </div>
        <div className="courseText">
          <h3>Python</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus neque accusantium quas, ut exercitationem ratione aut
            accusamus tenetur aliquam vitae.
          </p>
        </div>
      </div>

      <div className="courseInfo split">
        <div className="courseImg">
          <img src={javaImg} alt="" />
        </div>
        <div className="courseText">
          <h3>Java</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus neque accusantium quas, ut exercitationem ratione aut
            accusamus tenetur aliquam vitae.
          </p>
        </div>
      </div>

      <div className="courseInfo split" id="nodeCourse">
        <div className="courseImg">
          <img src={nodeImg} alt="" />
        </div>
        <div className="courseText">
          <h3>JavaScript</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus neque accusantium quas, ut exercitationem ratione aut
            accusamus tenetur aliquam vitae.
          </p>
        </div>
      </div>

      <div className="btnWrap">
        <Link to="signup">
          <button id="callToAction">Start Your Journey</button>
        </Link>
      </div>
    </div>
  )
}

export default UnloggedPage

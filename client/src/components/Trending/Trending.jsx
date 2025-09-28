import Flower1 from '../../assets/images/Flower1.png';
import Flower2 from '../../assets/images/Flower2.png';
import Flower3 from '../../assets/images/Flower3.png';
import './Trending.css';    
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function Trending() {
    return (
        <div>
{/* trending product */}
      <div className = "container">
        <div className = "title">
                {/**       <h4>trending now</h4>
          <h2>best selling product</h2>*/}
    
        </div>

        <div className = "trend-grid">
      {/*item */}
          <div className = "trend-item">
            <img src ={Flower1} alt = "flower1"/>
            <div className = "trend-item-content">
                   <h4>Peach & Plum</h4>
              <h4>$60.00</h4>
        <div className="stars">
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={regularStar} /></span>
      </div>
      <span className="chevron-icon">
        <FontAwesomeIcon icon={faChevronRight} />
      </span>
            </div>
          </div>
      {/*end of item */}
      {/*item */}
          <div className = "trend-item">
            <img src ={Flower2} alt = "flower2"/>
            <div className = "trend-item-content">
              <h4>Fusch Lusch</h4>
              <h4>$80.00</h4>
        <div className="stars">
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={regularStar} /></span>
      </div>
      <span className="chevron-icon">
        <FontAwesomeIcon icon={faChevronRight} />
      </span>
            </div>
          </div>
      {/*end of item */}
      {/*item */}
          <div className = "trend-item">
            <img src ={Flower3} alt = "flower3"/>
            <div className = "trend-item-content">
              <h4>Pale & Perfect</h4>
              <h4>$30.00</h4>
            <div className="stars">
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={solidStar} /></span>
        <span><FontAwesomeIcon icon={regularStar} /></span>
      </div>
      <span className="chevron-icon">
        <FontAwesomeIcon icon={faChevronRight} />
      </span>
            </div>
          </div>
      {/*end of item */}
        </div>
      </div>

{/*end of trending product */}
</div>
    );
}

export default Trending;

import Flower1 from '../../assets/flower1.png';
import Flower2 from '../../assets/flower2.png';
import Flower3 from '../../assets/flower3.png';
import './Trending.css';


{/* trending product */}
    <section class = "trend">
      <div class = "container">
        <div class = "title">
          <h4>trending now</h4>
          <h2>best selling product</h2>
        </div>

        <div class = "trend-grid">
      {/*item */}
          <div class = "trend-item">
            <img src ={Flower1} alt = "flower1"/>
            <div class = "trend-item-content">
              <h4>Brown Sofa With Pillows</h4>
              <h4>$60.00</h4>
              <div class = "stars">
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "far fa-star"></i></span>
              </div>
              <span class = "chevron-icon">
                <i class = "fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
      {/*end of item */}
      {/*item */}
          <div class = "trend-item">
            <img src ={Flower2} alt = "flower2"/>
            <div class = "trend-item-content">
              <h4>Comfortable Pink Sofa</h4>
              <h4>$80.00</h4>
              <div class = "stars">
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "far fa-star"></i></span>
              </div>
              <span class = "chevron-icon">
                <i class = "fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
      {/*end of item */}
      {/*item */}
          <div class = "trend-item">
            <img src ={Flower3} alt = "flower3"/>
            <div class = "trend-item-content">
              <h4>Stylish Red Chair</h4>
              <h4>$30.00</h4>
              <div class = "stars">
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "fas fa-star"></i></span>
                <span><i class = "far fa-star"></i></span>
              </div>
              <span class = "chevron-icon">
                <i class = "fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
      {/*end of item */}
        </div>
      </div>
    </section>
{/*end of trending product */}

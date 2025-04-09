// Error404.js
import React from 'react';
import './Error404.css';

const Error404 = () => {
  return (
    <section className="page_404">
      <div className="page_404-container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                <h1>404</h1>
              </div>
              <div className="content_box_404">
                <h3>Look like you're lost</h3>
                <p>The page you are looking for is not available!</p>
                <a href="/" className="link_404">
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error404;
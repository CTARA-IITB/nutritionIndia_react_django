import React from "react";
import "./SkeletonCard.css";
import Skeleton from "react-loading-skeleton";
import {Row } from 'react-bootstrap';
const SkeletonDropdown = () => {

    return (
      <section>
        <Row>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h2 className="section-title" >
          <Skeleton duration={.15} height={20} width={300} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={20} width={300} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={20} width={300} />
        </h2>
        <hr/>
         </Row>
         <Row>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Skeleton rectangle={true} height={400} width={600} />
        &nbsp;<Skeleton rectangle={true} height={400} width={600} /> 
        {/* &nbsp;&nbsp;<Skeleton rectangle={true} height={100} width={100} /> */}
        </Row>   
        <Row>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Skeleton rectangle={true} height={400} width={600} />
        &nbsp;<Skeleton rectangle={true} height={400} width={600} /> 
        {/* &nbsp;&nbsp;<Skeleton rectangle={true} height={100} width={100} /> */}
        </Row>   
       </section>
    );
  };
  const SkeletonMapCard = () => {

    return (
      <section>
        <Row>
        <Skeleton rectangle={true} height={300} width={250} /> 
        &nbsp;&nbsp;<Skeleton rectangle={true} height={100} width={100} />
        </Row>   
      </section>
    );
  };
  const SkeletonCard = () => {

    return (
      <section>
        <div>
        <Skeleton rectangle={true} height={250} width={240} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Skeleton rectangle={true} height={250} width={240} />
        <br/>
        <br/>
        <Skeleton rectangle={true} height={250} width={240} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Skeleton rectangle={true} height={250} width={240} />


</div>
      </section>

);
  };
   export { SkeletonCard, SkeletonMapCard, SkeletonDropdown}
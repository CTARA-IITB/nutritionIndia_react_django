import React,{useState,useEffect} from "react";

import {Row, Col } from 'react-bootstrap';
import { TreeSelect } from 'antd';
import { json } from 'd3';

import { fetchAreaCode,createHierarchy } from '../../utils';

export const Dropdown = ({
    tabId,
    selArea,
    selIndicator,
    selTimeperiod,
    selSubgroup,
    setSelArea,
    setSelIndicator,
    setSelTimeperiod,
    setSelSubgroup,
    setAreaName,
    setLevel,
    setAreaList,
    setIsLevelThree}) =>{
    
    let tab;
    if(tabId === undefined || tabId === 'section1')
    {
      tab =8;
    }
    else if(tabId === 'section2'){
      tab=1;
    }
    else if(tabId === 'section3'){
      tab=3;
    }
    else if(tabId === 'section4'){ 
      tab=6;
    }
    //Area
    
    const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
    const [stateID,setStateID] = useState(null);

    // console.log(areaList.filter(d => d.area_level));
    useEffect(() => {
        const url = 'http://localhost:8000/api/area';
        json(url).then( options =>{
        const [country,statesID] = createHierarchy(options);
        setStateID(statesID)
        setAreaDropdownOpt(country);
        setAreaList(options);
        }
        )
      }, [])


    //Indicator
 
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState(null);



  useEffect(() => {
    const url = 'http://localhost:8000/api/indicator/'+tab;
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    }
    )
  }, [tabId])

   // change selIndicator when indicator updated
   useEffect(() => {
    if(indicatorDropdownOpt){
      setSelIndicator(indicatorDropdownOpt[0].value)
    }
   
    }, [indicatorDropdownOpt])



   //subgroup
   
   const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState(null);


   useEffect(() => {
    const url = `http://localhost:8000/api/subgroup/${selIndicator}`;
    json(url).then( options =>{
      setSubgroupDropdownOpt(options);
    }
    )
  }, [selIndicator])





   //timeperiod
  
   const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState(null);


   useEffect(() => {
    const url = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${selArea}`;
    json(url).then( options =>{
      setTimeperiodDropdownOpt(options);
    }
    )

  }, [selIndicator,selSubgroup,selArea])


      // change selTimeperiod when indicator updated
      useEffect(() => {
        let flag = false;
        if(timeperiodDropdownOpt){
          timeperiodDropdownOpt.forEach(timeperiod => {
            if(timeperiod.value === selTimeperiod){
              flag = true;
            }
          });
          if(!flag) setSelTimeperiod(timeperiodDropdownOpt[0].value)
        }
       
        }, [timeperiodDropdownOpt])

    return (
        <Row className='mb-5 mt-3 '>
    
        <Col>
            <span className="dropdown-title">Select Area</span>
            <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selArea}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={areaDropdownOpt}
                // treeDefaultExpandAll
                onChange={ (value,title) =>  {
                    if(value === "1"){
                        setLevel(1)
                        setIsLevelThree(false);
                    }
                    else if(stateID.indexOf(parseInt(value)) !== -1){
                        setIsLevelThree(false);
                        setLevel(2)

                    }
                    else setLevel(3);
                        setSelArea(value);
                        setAreaName(title[0]);
                    // console.log(stateID.indexOf(parseInt(value)),'test');
                    // setAreaCode(fetchAreaCode(areaList, value));
                  } 
                }
              />
            </Col>

            <Col>
            <span className="dropdown-title">Select Indicator</span>

            <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selIndicator}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={indicatorDropdownOpt}
                onChange={ value => setSelIndicator(value) }
                />
            </Col>

              
                <Col>
            <span className="dropdown-title">Select subgroup</span>

                <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selSubgroup}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={subgroupDropdownOpt}
                onChange={ value => setSelSubgroup(value)}
                />
                </Col>
        
              <Col>
            <span className="dropdown-title"> Select timeperiod</span>

                <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selTimeperiod}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={timeperiodDropdownOpt}
                onChange={value => setSelTimeperiod(value) }
                />
              </Col>
             
    </Row>
    )
}



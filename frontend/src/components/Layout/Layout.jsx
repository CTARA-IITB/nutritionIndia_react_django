
import React, { useCallback,useState, useEffect, useRef } from "react";
import { Dropdown } from "../../components/Dropdown/Dropdown";
// import 'react-dropdown/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Table } from 'react-bootstrap';
// import ClipLoader from "react-spinners/ClipLoader";
import { SkeletonCard, SkeletonDropdown, SkeletonMapCard } from "../SkeletonCard";
import {Bar,Line} from 'react-chartjs-2';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

// import Form from "../../components/Form/Form";
import { Map } from "../../components/Map/Map";
import { useData, useDataDistrict, useDataState, useNewBoundaries ,useNewDistrictBoundaries} from '../UseData'
import { json } from 'd3';

import Cards from '../../components/Cards/Cards.jsx';
import SplitPane, { Pane } from 'react-split-pane';
import "./Layout.css";
import { TextCenter } from "react-bootstrap-icons";

// const renderedMap = (boundaries) => (boundaries.state);

const Layout = ({ 
  tabId,
  setLevel,
  selIndicator,
  selSubgroup,
  selTimeperiod,
  level,
  parentArea,
  selArea,
  areaName,
  areaList,
  setAreaName,
  setParentArea,
  setSelIndicator,
  setSelArea,
  setFilterDropdownValue,
  areaDropdownOpt,
  searchRef}) => {

  const screen1 = useFullScreenHandle();
  const screen2 = useFullScreenHandle();
  const [switchDisplay,setSwitchDisplay] = useState(true);


  useEffect(() => {
    setLevel(1);
  }, [tabId])
  const [isLevelThree, setIsLevelThree] = useState(false);


  const [indicatorBar, setIndicatorBar] = useState(null);
  const [indicatorTrend, setIndicatorTrend]=useState(null);



  const [indicatorDetail, setIndicatorDetail] = useState(null);
  const [unit, setUnit] = useState(null);
  const [unitList, setUnitList] = useState(null);
  const [indicatorSense, setIndicatorSense] = useState(null);

  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState(null);


  // useEffect(() => {
  //   const url = `http://localhost:8000/api/indiaMap/12/6/19/3`;
  //   json(url).then( data =>{
  //     setSelDistrictData(data);

  //   }
  //   )
  // },[])

   

 
//india data
  const [selIndiaData, setSelIndiaData] = useState(null);

  useEffect(() => {
    const url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`;
    json(url).then(data => {
      setSelIndiaData(data);
    }
    )

    //switch Display
    const switchurl=`http://localhost:8000/api/getDistrictDetails/${selIndicator}/${selSubgroup}/${selTimeperiod}`;
    json(switchurl).then(data =>{
      if(data.length)
        setSwitchDisplay(true);
      else
        setSwitchDisplay(false);
    })

  }, [selIndicator, selSubgroup, selTimeperiod])


  //state data

  const [selStateData, setSelStateData] = useState(null);

  useEffect(() => {
    let url;
    if (level === 1)
      url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/3`
    else if (level === 2) {
      if (isLevelThree)
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${parentArea}`
      else
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${selArea}`;
    }
    json(url).then(data => {
      setSelStateData(data);
    }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selIndicator, selSubgroup, selTimeperiod, selArea, parentArea])

//  get graph title
// useEffect(() => {
//   const url = 'http://localhost:8000/api/indicator/'+tab;
//   json(url).then( options =>{
//     setIndicatorDropdownOpt(options);
//   }   
//   )
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//  }, [tabId])
 let graphTitle=selIndicator;
 let graphUnit =unit;
 let graphArea = selArea;
 let graphTimeperiod =selTimeperiod
 if (indicatorDetail) {
    indicatorDetail.map(indi => {
       if(indi.indicator.indicator_id=== parseInt(selIndicator))
         { 
           graphTitle=indi.indicator.indicator_name;
           graphUnit = indi.unit.unit_name;
           graphArea = indi.area.area_name;
           graphTimeperiod = indi.timeperiod.timeperiod;
         }
       });
     
   }
//getting graph data
  useEffect(() => {
    const url = `http://localhost:8000/api/getIndicatorBar/${selIndicator}/${selTimeperiod}/${selArea}`;
    json(url).then(indicatorBar => {
      setIndicatorBar(indicatorBar)
    })
}, [selIndicator, selSubgroup, selTimeperiod, selArea])

  //getting trend chart data
  useEffect(() => {
    const url = `http://localhost:8000/api/getIndicatorTrend/${selIndicator}/${selSubgroup}/${selArea}`;
    json(url).then(indicatorTrend => {
      setIndicatorTrend(indicatorTrend)
    })
  }, [selIndicator, selSubgroup, selArea])
  
//set Unit on indicator and subgroup change

  useEffect(() => {
    const url = `http://localhost:8000/api/getUnit/${selIndicator}/${selSubgroup}`;
    json(url).then(unit => {
      setUnit(unit[0].unit)
    })
    json()
  }, [selIndicator, selSubgroup])
  let tab;
  if (tabId === undefined || tabId === 'section1') {
    tab = 8;
  }
  else if (tabId === 'section2') {
    tab = 1;
  }
  else if (tabId === 'section3') {
    tab = 3;
  }
  else if (tabId === 'section4') {
    tab = 6;
  }
  // get indicatorDetails-1-immediate cause,3-underlying cause,6-basic cause,8-manifest-tab
  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/getIndicatorDetails/${tab}/${selArea}`;
    json(url).then(indicatorDetail => {
      setIndicatorDetail(indicatorDetail)

    })
  }, [tab, selArea])
  
 //get Units Name

  useEffect(() => {
    const url = "http://localhost:8000/api/getUnitName";
    json(url).then(unitList => {
      setUnitList(unitList)
    })
  }, [])


  //getting indicator sense
  useEffect(() => {
    const url = `http://localhost:8000/api/getIndicatorType/${selIndicator}`;
    json(url).then(indicatorSense => {
      setIndicatorSense(indicatorSense)
    })
  }, [selIndicator])


  const boundaries = useData();
  const newBoundaries = useNewBoundaries();
  const Dboundaries = useDataDistrict();
  const NewDboundaries = useNewDistrictBoundaries();
  const stateBoundary = useDataState(areaName, Dboundaries);
  const newDistrictBoundaries = useDataState(areaName,NewDboundaries)
  const handleClick = () => {
    setToggleState(!toggleState);
    let text = null;
    if (buttonText === 'District')
      text = 'state';
    else
      text = 'District';
    changeText(text);
  }


  const chevronWidth = 40;

  const [buttonText, setButtonText] = useState("District");
  const changeText = (text) => setButtonText(text);
  const [toggleState, setToggleState] = useState(true)
  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   setLoading(true);
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 5000);
  //   // Cancel the timer while unmounting
  //   return () => clearTimeout(timer);
  // }, []);

  //set area name to parent when level is 3
  if (level === 3) {

    let areaParentId = areaList.filter(f => f.area_id === parseInt(selArea))[0].area_parent_id; // loop 1
    let parentName = areaList.filter(f => f.area_id === areaParentId)[0].area_name;  //loop 2  later optimise this

    setAreaName(parentName);
    setParentArea(areaParentId);
    setIsLevelThree(true);
    setLevel(2);
  }
  // if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt || !stateBoundary  || !areaList || !unitList){
  // 	return <pre>Loading...</pre>
  // }
  if (!boundaries || !stateBoundary || !unitList || !newBoundaries || !indicatorTrend ||!indicatorBar) {
    return <div><Row><SkeletonCard /><SkeletonMapCard /> </Row> </div>
  }

  let renderMap = null;
  let nutritionData = null;

  if (level === 1 || stateBoundary.features === undefined) {
    if (toggleState === true) {
      if (selTimeperiod === '22')    // change state boundaries when timeperiod is NFHS5
        renderMap = newBoundaries.new_state;
      else
        renderMap = boundaries.state;
      nutritionData = selIndiaData;
    }
    else {
      if(selTimeperiod === '22')
      renderMap = newBoundaries.new_dist;
      else
      renderMap = Dboundaries.dist;

      console.table(newBoundaries.new_dist.features[0].properties, 'newBoundaries')
      console.table(Dboundaries.dist.features[0].properties, 'oldBoundaries')
      nutritionData = selStateData;

    }
  } else {

    if (selStateData.length > 0) {
      if(selTimeperiod === '22')
      renderMap = newDistrictBoundaries;
      else
      renderMap = stateBoundary;
      nutritionData = selStateData;

    } else {
      renderMap = boundaries.state;
      nutritionData = selIndiaData;
    }
  }

  

    let barLabel=[];
    indicatorBar.map(i=>{
      barLabel.push(i.subgroup.subgroup_name+";"+i.subgroup.sub_category)
    })
    var colors = []
for(var i = 0; i < barLabel.length; i++){
  if(barLabel[i].split(";")[1] === 'null')
  {
    colors[i] = 'rgb(0,153,255)';
  }
  else  if(barLabel[i].split(";")[1] === 'Sex')
  {
    colors[i] = 'rgb(254,225,211)';
  }
  else  if(barLabel[i].split(";")[1] === 'Location')
  {
    colors[i] = 'rgb(251,161,167)';
  }
  else  if(barLabel[i].split(";")[1] === 'Caste')
  {
    colors[i] = 'rgb(247,104,161)';
  }
  else  if(barLabel[i].split(";")[1] === 'Wealth Index')
  {
    colors[i] = 'rgb(230,23,173)';
  }
  
}
    let barData=[];
    indicatorBar.map(i=>{
      barData.push(+i.data_value)
    })
    let  datab= {
      labels:barLabel,
      datasets: [{
      label: [graphTitle, graphUnit],
      data:barData,
      xAxisID:'xAxis1',
      //backgroundColor: "rgb(255, 99, 132)"
      backgroundColor: colors,
      borderColor: '#ffffff',
      borderWidth: 1
      }]
}

    let trendLabel=[];
    indicatorTrend.map(i=>{
      trendLabel.push(i.timeperiod.timeperiod)
    })
    let trendData=[];
    indicatorTrend.map(i=>{
      trendData.push(+i.data_value)
    })
    let graphSubgroup = indicatorTrend[0].subgroup.subgroup_name;
    let  datal= {
      labels:trendLabel,
      datasets: [{
      label: [graphTitle, graphUnit, graphSubgroup],
      fill: false,
      lineTension:0,
      borderWidth:3,
      borderColor:'rgb(106, 166, 41)',
      data:trendData
      }]
     
    }


  // if (!nutritionData) {
  //   return
  // }
  return (
    <React.Fragment>

      <div className="layout">
        <div className="layout__header">

        </div>
        <div className="layout__body">
          <div className="layout__body__left">
            <div className="layout__body__left__cards">
              <Cards indicatorDetail={indicatorDetail} 
              setSelIndicator={setSelIndicator}
              />
            </div>
            <button className="button_fullscreen_trend"><img src="./fullscreen.jpg" alt="image" onClick={screen2.enter} /></button>
            <div style={{ marginRight:"5px" ,marginLeft: "10px", width: "300px" }}>
             
            </div>
            
          </div>
          <div className="layout__body__right">
            <div className="layout__body__right__map">
              {
              nutritionData.length > 0 ? 
              <Map geometry={renderMap} 
              data={nutritionData} 
              onMapClick={setAreaName} 
              setLevel={setLevel} 
              level={level} 
              setSelArea={setSelArea} 
              unit={unit} 
              unitName={graphUnit} 
              selArea={selArea} 
              isLevelThree={isLevelThree} 
              setIsLevelThree={setIsLevelThree} 
              handleClick={handleClick} 
              searchRef={searchRef} 
              setFilterDropdownValue={setFilterDropdownValue} 
              areaDropdownOpt={areaDropdownOpt} selIndicator={selIndicator}
              indicatorSense={indicatorSense} 
              switchDisplay={switchDisplay}
              toggleState={toggleState}
              indiName ={graphTitle}
              areaName ={graphArea}
              timepName ={graphTimeperiod}
              subName = {graphSubgroup}

              />
                : <div className="text-center"></div>
              }
            </div>
            <div className="layout__body__right__bar">
              <Bar data={datab} 
                options={{
                  legend:
                  {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: [graphTitle +','+ graphUnit, graphArea +', '+ graphTimeperiod],
                    fontColor: "black",
                },
                  scales: {
                    xAxes:[{
                      id:'xAxis1',
                      type:"category",
                      ticks:{
                        callback:function(label){
                          var subgroup = label.split(";")[0];
                          return subgroup;
                        }
                      },
                      gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                      },

                    },
                    {
                      id:'xAxis2',
                      type:"category",
                      gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                      },
                      ticks:{
                        minRotation: 0,
                        callback:function(label){
                          var subgroup = label.split(";")[0];
                          var type = label.split(";")[1];
                          if(subgroup === "Rural" || subgroup === "Female"  || subgroup ==="ST" || subgroup === "Middle"){
                            return type
                          }
                          else
                          return ""
                        }  
                      },
                      gridLines: {
                        drawOnChartArea:false
                    }
                    }],
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      },
                      gridLines: {
                        drawOnChartArea:false
                    }
                    }]
                  }
                }}
            />
            </div>
       
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Layout;
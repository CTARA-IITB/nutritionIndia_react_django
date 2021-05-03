import React,{useState,useEffect,useRef} from "react";
import {Row, Col } from 'react-bootstrap';
import { TreeSelect,Input } from 'antd';
import { json } from 'd3';
import { createHierarchy, setVisulaizationData, setCardData, populateDropdowns } from '../../utils';
import { useParams } from "react-router-dom";
import Cards  from "../../components/Cards/Cards";
import {Trend}  from "../../components/Trend/Trend";
import {BarGraph, BarGraphArea}  from "../../components/BarGraph/BarGraph";
import { feature } from 'topojson';
import { SkeletonCard, SkeletonDropdown, SkeletonMapCard } from "../SkeletonCard";
import { Map } from "../../components/Map/Map";
import "./Dropdown.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import arrow_fullscreen from './arrow_fullscreen.svg';
import { Switch } from 'antd';
const {Search} = Input;
export const Dropdown = ({}) =>{
  let { id } = useParams();
  const iniSelArea = '1';  //india
  const [selArea, setSelArea] = useState(iniSelArea);
  const iniSelIndicator = '12';
  const [selIndicator, setSelIndicator] = useState(iniSelIndicator);
  // const iniSelSubgroup = '6';  //All
  // const [selSubgroup, setSelSubgroup] = useState(iniSelSubgroup);
  const iniSelTimeperiod = '22';  //NHHS5
  const [selTimeperiod, setSelTimeperiod] = useState(iniSelTimeperiod);
  const [unit, setUnit] = useState(1);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState([]);
  const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState([]);
  // const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState([]);
  const [stateID,setStateID] = useState(null);
  const [indicatorSense, setIndicatorSense] = useState('Negative');
  const [isSelected , setIsSelected] = useState(false);
  const [openDropdown,setOpenDropdown] = useState(false);
  const treeRef = useRef();
  const [areaName, setAreaName] = useState('India');
  const [level, setLevel] = useState(1);
  const [areaList, setAreaList] = useState(null);
  const [isLevelThree, setIsLevelThree] = useState(false);
  const searchRef = useRef();
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [parentArea, setParentArea] = useState(null);
  const [indicatorDetail, setIndicatorDetail] = useState(null);
  const [indicatorTrend, setIndicatorTrend] = useState(null);
  const[indicatorBar, setIndicatorBar]= useState(null);
  const[selIndiaData, setSelIndiaData]= useState(null);
  const [boundaries, setBoundaries] = useState(null);
  const [graphTitle, setGraphTitle] = useState("Prevalence of stunting in under-five year olds");
  const [graphSubgroup, setGraphSubgroup] = useState('All');
  const [graphTimeperiod, setGraphTimeperiod] = useState('NFHS5 2019-20');
  const [graphUnit, setGraphUnit] = useState('Percent');
  const [switchDisplay,setSwitchDisplay] = useState(true);
  const [toggleState, setToggleState] = useState(true);
  const [buttonText, setButtonText] = useState("District");
  const [selStateData, setSelStateData] = useState(null);
  const [selDistrictsData, setSelDistrictsData] = useState(null);
  const changeText = (text) => setButtonText(text);
  const screen1 = useFullScreenHandle();
  const screen2 = useFullScreenHandle();
  const screen3 = useFullScreenHandle();
  const screen4 = useFullScreenHandle();

  const map = document.getElementsByClassName("map");
  const [burdenbuttonText, setBurdenButtonText] = useState("Burden");
  const changeBurdenText = (text) => setBurdenButtonText(text);
  const [toggleStateBurden,setToggleStateBurden]=useState(true);

  // let boundaries;
  // let newBoundaries;
  // let Dboundaries;
  // let NewDboundaries;


    let tab =8;
    let indiVal ='12'

      if(id === undefined || id === 'section1')
      {
        tab =8;
        indiVal ='12';
      }
      else if(id === 'section2'){
        tab=1;
        indiVal = '2';  
      }
      else if(id === 'section3'){
        tab=3;
        indiVal = '74';
      }
      else if(id === 'section4'){ 
        tab=6;
        indiVal = '56';
      }

      useEffect(() => {
      async function populateTabData()
      {
        setIsSelected(false);
        setToggleState(true);
        setToggleStateBurden(true);
        let subVal = '6';
        //await populateDropdowns(tab, indiVal, subVal, setIndicatorDropdownOpt, setSubgroupDropdownOpt, setSelIndicator, setSelSubgroup, setUnit, setGraphTitle, setGraphSubgroup, setGraphUnit)
        await populateDropdowns(tab, indiVal, subVal, setIndicatorDropdownOpt, setSelIndicator, setUnit, setGraphTitle, setGraphUnit)
        let timeVal = selTimeperiod;
        const solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=indicator_id%3A${indiVal}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${selArea}`);
        // const body_2 = await url_2.json();
        const solr_body_2 = await solr_url.json();
        // console.log(body_2);
        setTimeperiodDropdownOpt(solr_body_2.response.docs);
        setSelTimeperiod(solr_body_2.response.docs[0].value);
        timeVal = solr_body_2.response.docs[0].value;
        setGraphTimeperiod(solr_body_2.response.docs[0].title);
        await setVisulaizationData(indiVal, timeVal, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData);
        //await setCardData(tab, selArea, setIndicatorDetail)
        setIsSelected(true);
      }
      populateTabData();
      }, [id])


      useEffect(() => {
        // const url_4 = 'http://13.234.11.176/api/area';
        const solr_url_4 = 'http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=area_id%2Carea_parent_id%2Carea_code%2Carea_name%2Carea_level&group.field=area_id&group.main=true&group=true&omitHeader=true&q=*%3A*&rows=7000&sort=area_id%20asc';
        json(solr_url_4).then( options =>{
        const [country,statesID] = createHierarchy(options.response.docs);
        setStateID(statesID)
        setAreaDropdownOpt(country);
        setAreaList(options.response.docs);  
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

        useEffect(() => {
          async function fetchData(){

            const jsonIndianstate =
            'https://gist.githubusercontent.com/AnimeshN/b705d4f1a910a16013348e6743d597f4/raw/13ff136e1cd3a90b2fcca370158960dddf74fbee/india_state_old.json';
            const jsonIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/9b27088c28f134b51983f1a25012474e/raw/7d551013cc70a2b4f08bc1bebd092f3e53a9ceca/india_district_old_v2.json';
        
    
            const jsonNewIndianstate = 'https://gist.githubusercontent.com/AnimeshN/95d3e079cd1933a0fae19bf3b99b9eec/raw/d0b9a50879e7fb01816cd4ae578219abeb4ec0ac/india_state_nfhs5.json';
            const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/262881c21197aa8da0524550b128d639/raw/ffd5cb39d90469934c1072ab7399c16e823fc82e/india_district_new_v3.json';   

            const stateTopology = await json(jsonIndianstate);
            const districtTopology = await json(jsonIndiaDistrict);
            const newStateTopology = await json(jsonNewIndianstate);
            const newDistrictTopology = await json(jsonNewIndiaDistrict);

            const stateObject = stateTopology.objects.india_state_old;
            const districtObject = districtTopology.objects.india_district_old_v2;
            const newStateObject = newStateTopology.objects.india_state_nfhs5;
            const newDistrictObject = newDistrictTopology.objects.india_district_new_v3;
            
            setBoundaries({
              'state':feature(stateTopology,stateObject),
              'dist':feature(districtTopology,districtObject),
              'new_state': feature(newStateTopology,newStateObject),
              'new_dist':feature(newDistrictTopology,newDistrictObject)
            });
          }
          fetchData(); 
        }, []);

        if(!areaDropdownOpt){
          return <SkeletonDropdown />
        }
        const dataList = [];
        const generateList = (data) => {
          for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { value , title} = node;
            dataList.push({ value, title});
            if (node.children) {
              generateList(node.children);
            }
          }
        };
        generateList(areaDropdownOpt)

      
     
        const indicatorChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setToggleState(true);
          setToggleStateBurden(true);
          setSelIndicator(e);
          let indiSense = indicatorDropdownOpt.filter(f => f.value === val)[0].indi_sense;
          let indiName = indicatorDropdownOpt.filter(f => f.value === val)[0].title;
          setGraphTitle(indiName);
          setIndicatorSense(indiSense);
          // const url_1 = await fetch(`http://localhost:8000/api/subgroup/${val}`);
          // const body = await url_1.json()
          // setSubgroupDropdownOpt(body);
          // setSelSubgroup(body[0].value);
          // setGraphSubgroup(body[0].title);
          let url;
          let solr_url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(isLevelThree){
              // url = await fetch(`http://13.234.11.176/api/timeperiod/${val}/6/${parentArea}`);
              solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=indicator_id%3A${val}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${parentArea}`);

            }
            else{
              // url = await fetch(`http://13.234.11.176/api/timeperiod/${val}/6/${selArea}`);
              solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=indicator_id%3A${val}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${selArea}`);
            }


            // const body_1 = await url.json()
            const solr_body_1 = await solr_url.json()

              setTimeperiodDropdownOpt(solr_body_1.response.docs);
              let flag = false;
              let timeValue = selTimeperiod;
              if(solr_body_1.response.docs){
                solr_body_1.response.docs.forEach(timeperiod => {
                  if(timeperiod.value === selTimeperiod){
                    flag = true;
                  }
                });
                if(!flag){
                  timeValue = solr_body_1.response.docs[0].value;
                  setSelTimeperiod(solr_body_1.response.docs[0].value);
                  setGraphTimeperiod(solr_body_1.response.docs[0].title);
                }
            } 
            // const url_3 = await fetch(`http://13.234.11.176/api/getUnit/${val}/6`);
            const solr_url_3 = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=unit_id%2Cunit_name%2Cindicator_id&fq=indicator_id%3A${val}&fq=subgroup_id%3A6&group.field=unit_id&group.main=true&group=true&omitHeader=true&q=*%3A*`);

            // const body_3 = await url_3.json()
            const solr_body_3 = await solr_url_3.json()
            setUnit(solr_body_3.response.docs[0].unit_id);
            setGraphUnit(solr_body_3.response.docs[0].unit_name);
            await setVisulaizationData(val, timeValue, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData);
            setIsSelected(true);
        }

       
 
        // const subgroupChange = async(e) =>{
        //   let val = e;
        //   setIsSelected(false);
        //   setToggleState(true);
        //   setToggleStateBurden(true);
        //   setSelSubgroup(e);
        //   let subName = subgroupDropdownOpt.filter(f => f.value === val)[0].title;
        //   setGraphSubgroup(subName);
        //   let url;
        //     // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
        //     if(isLevelThree)
        //     url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${val}/${parentArea}`);
        //     else
        //     url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${val}/${selArea}`);
        //     const body_1 = await url.json()
        //       setTimeperiodDropdownOpt(body_1);
        //       let flag = false;
        //       let timeValue = selTimeperiod;
        //       if(body_1){
        //         body_1.forEach(timeperiod => {
        //           if(timeperiod.value === selTimeperiod){
        //             flag = true;
        //           }
        //         });
        //         if(!flag) {
        //           timeValue = body_1[0].value;
        //           setSelTimeperiod(body_1[0].value);
        //           setGraphTimeperiod(body_1[0].title);
        //         }
        //     } 
        //   await setVisulaizationData(selIndicator, val, timeValue, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData);
        //   setIsSelected(true);
        // }

        const timeperiodChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setToggleState(true);
          setToggleStateBurden(true);
          setSelTimeperiod(e);
          let timePeriodName = timeperiodDropdownOpt.filter(f => f.value === e)[0].title;
          setGraphTimeperiod(timePeriodName);
          await setVisulaizationData(selIndicator, val, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData);
          setIsSelected(true);
        }

        const areaChange = async(e) => {
          let value = e
          let newLevel = 1;
          let levelThree = false;
          setIsSelected(false);
          setToggleState(true);
          setToggleStateBurden(true);
            if(value === "1"){
                setLevel(1)
                setIsLevelThree(false);
                levelThree = false;
                
            }
            else if(stateID.indexOf(parseInt(value)) !== -1){
                setIsLevelThree(false);
                levelThree = false;
                newLevel = 2;
                setLevel(2)
            }
            else {
              newLevel = 3;
              setLevel(3);
            }
            setSelArea(value);
            let title = areaList.filter(f => f.area_id === parseInt(value))[0].area_name;
            setAreaName(title);
            treeRef.current.blur()
        
        
          let areaParentId;
          if (newLevel === 3) {
        
            areaParentId = areaList.filter(f => f.area_id === parseInt(value))[0].area_parent_id; // loop 1
            let parentName = areaList.filter(f => f.area_id === areaParentId)[0].area_name;  //loop 2  later optimise this
            setAreaName(parentName);
            setParentArea(areaParentId);
            setIsLevelThree(true);
            levelThree = true;
            setLevel(2);
            newLevel = 2;
          }
          let url;
          let solr_url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(levelThree){
              solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=indicator_id%3A${selIndicator}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${areaParentId}`);

              // url = await fetch(`http://13.234.11.176/api/timeperiod/${selIndicator}/6/${areaParentId}`);
            }
            else{
              solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv3/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=indicator_id%3A${selIndicator}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${value}`);

              // url = await fetch(`http://13.234.11.176/api/timeperiod/${selIndicator}/6/${value}`);

            }
            // const body_1 = await url.json()
            let solr_body_1 = await solr_url.json()
            solr_body_1 = solr_body_1.response.docs;
              setTimeperiodDropdownOpt(solr_body_1);
              let flag = false;
              let timeValue = selTimeperiod;
              if(solr_body_1){
                solr_body_1.forEach(timeperiod => {
                  if(timeperiod.value === selTimeperiod){
                    flag = true;
                  }
                });
               
                if(!flag) {
                  timeValue = solr_body_1[0].value;
                  setSelTimeperiod(solr_body_1[0].value);
                  setGraphTimeperiod(solr_body_1[0].title);
                }
            } 
            await setVisulaizationData(selIndicator, timeValue, value, areaParentId, newLevel, levelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData);
            //await setCardData(tab, value, setIndicatorDetail)
            setIsSelected(true);
        
        }

        const onChange = (e) =>{
          setIsSelected(false);
          let { value } = e.target;
          value = value.charAt(0).toUpperCase() + value.slice(1);
          if(value === ""){
            setOpenDropdown(false);
            setFilterDropdownValue(areaDropdownOpt)
          }
          else{
            setOpenDropdown(true);
            const expandedKeys = dataList
            .map((item) => {
              if (item.title.indexOf(value) > -1) {
                return item;
              }
              return null;
            }).filter((item, i, self) => item && self.indexOf(item) === i);
        
            setFilterDropdownValue(expandedKeys)
          }
          setIsSelected(true);
        }
        if (!boundaries || !boundaries.state  || !boundaries.new_state) {
          return <div><Row><SkeletonCard /><SkeletonMapCard /> </Row> </div>
        }
      
      //  const makeitFull = ()=> {
      //   // map.style.height="100vh";
      //   ();

      // }

      const checkchange = (state,handle)=>{
        if(map){
          if(state === true){
            map[0].style.height = "100vh";
          }
          else if(state === false){
            if(map[0] != undefined)
            map[0].style.height = "50vh";
            // map[0].style.height = "50vh";
          }
        }
      }
      
      const burdenClick = () => {
        setToggleStateBurden(!toggleStateBurden); 
        let text = null;
        if (burdenbuttonText === 'Burden')
        {
          text = 'Prevalence';
        }
        else
        {
          text = 'Burden';
        }
          changeBurdenText(text);   
      }

      let burdenIndicators = [12, 13, 17, 18, 19, 20, 29, 107, 108, 53, 62];
      let burdenButton;
      if (burdenIndicators.includes(selIndicator)) {
          burdenButton = <Switch className="mb-2" size="large" checkedChildren="Burden" unCheckedChildren="Prevalence" onClick={burdenClick} />
        }
        else{
          burdenButton= null;
        }


    return (
      <>
      <Row className=' mt-3 mb-3'>
      <Col>
            <span className="dropdown-title">Select Area</span>
            {/* <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange}  ref={searchRef}/> */}

            <TreeSelect
                showSearch
                // filterTreeNode={filterTree}
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selArea}
                onFocus={()=>setOpenDropdown(true)}
                onBlur={() => setOpenDropdown(false)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={(filterDropdownValue.length !==0)?filterDropdownValue:areaDropdownOpt}
                treeDefaultExpandAll={false}
                ref = {treeRef}
                open={openDropdown}
                treeNodeFilterProp ='title'
                onChange={areaChange}
              />
            </Col>

            <Col>
            <span className="dropdown-title">Select Indicator</span>

            <TreeSelect
                showSearch
                // onSearch={onSearch}
                optionFilterProp="children"
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selIndicator}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={indicatorDropdownOpt}
                filterTreeNode
                treeNodeFilterProp ='title'
                onChange={ indicatorChange }
                />
            </Col>
                {/* <Col>
            <span className="dropdown-title">Select subgroup</span>

                <TreeSelect
                showSearch
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selSubgroup}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={subgroupDropdownOpt}
                treeNodeFilterProp ='title'
                onChange={ subgroupChange}
                />
                </Col> */}
        
              <Col>
            <span className="dropdown-title"> Select timeperiod</span>

                <TreeSelect
                showSearch
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selTimeperiod}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={timeperiodDropdownOpt}
               // onChange={value => setSelTimeperiod(value) }
               treeNodeFilterProp ='title'
               onChange={timeperiodChange}
                />
              </Col>
             
    </Row>
    {isSelected?
    <div className="btn_toggle text-center">
      {burdenButton}
      </div>: null}
  
 
    
    {/* <div className="layout__body__left">
            <div className="layout__body__left__cards">
            {isSelected? <Cards indicatorDetail = {indicatorDetail} indicatorChange = {indicatorChange}/> : null}
            </div>
    </div> */}

<div class="layout" id="layoutid">
   <div class="layout_left">
    <div class="layout_left_map">
      <button className="button_fullscreen_trend"><img src={arrow_fullscreen} alt="image" onClick={screen1.enter} /></button>
      <FullScreen  className="fullscreen_css" handle={screen1} onChange={checkchange}>
        {isSelected? <Map boundaries={boundaries} 
          selIndiaData={selIndiaData} 
          setSelIndiaData ={setSelIndiaData}
          setLevel={setLevel} 
          level={level} 
          setSelArea={setSelArea} 
          unit={unit} 
          unitName={graphUnit} 
          selArea={selArea} 
          searchRef={searchRef} 
          setFilterDropdownValue={setFilterDropdownValue} 
          areaDropdownOpt={areaDropdownOpt} 
          selIndicator={selIndicator}
          indicatorSense={indicatorSense} 
          isLevelThree = {isLevelThree}
          switchDisplay = {switchDisplay}
          setSwitchDisplay = {setSwitchDisplay}
          selTimeperiod = {selTimeperiod}
          parentArea = {parentArea}
          toggleState = {toggleState}
          setToggleState = {setToggleState}
          setIsLevelThree = {setIsLevelThree}
          buttonText = {buttonText}
          changeText = {changeText}
          areaName = {areaName}
          selStateData = {selStateData}
          setSelStateData = {setSelStateData}
          selDistrictsData = {selDistrictsData}
          areaChange = {areaChange}
          graphTitle = {graphTitle}
          graphTimeperiod = {graphTimeperiod}
          graphUnit = {graphUnit}
          areaName = {areaName}
          toggleStateBurden={toggleStateBurden}
          setToggleStateBurden={setToggleStateBurden}
          burdenbuttonText={burdenbuttonText} 
          changeBurdenText={changeBurdenText}

          /> : null}
          </FullScreen>
     </div>
     <div class="layout_left_bar1">
     <button className="button_fullscreen_trend"><img src={arrow_fullscreen} alt="image" onClick={screen3.enter} /></button>
      <FullScreen className="fullscreen_css" handle={screen3}>
      {isSelected? <BarGraphArea 
      indicatorBar = {indicatorBar}
      graphTitle = {graphTitle}
      graphTimeperiod = {graphTimeperiod}
      graphUnit = {graphUnit}
      selIndiaData={selIndiaData} 
      level={level} 
      unit={unit} 
      unitName={graphUnit} 
      selArea={selArea} 
      selIndicator={selIndicator}
      isLevelThree = {isLevelThree}
      selTimeperiod = {selTimeperiod}
      areaName = {areaName}
      selStateData = {selStateData}
      toggleStateBurden = {toggleStateBurden}/>: null}
      </FullScreen>
     </div>
   </div>
    <div class="layout_right">
      <div class="layout_right_trend" >
      <button className="button_fullscreen_trend"><img src={arrow_fullscreen} alt="image" onClick={screen2.enter} /></button>
      <FullScreen  className="fullscreen_css" handle={screen2}>
      {isSelected?
      <Trend indicatorTrend = {indicatorTrend}
      graphTitle = {graphTitle}
      graphSubgroup = {graphSubgroup}
      graphUnit = {graphUnit}
      areaName = {areaName}
      graphTimeperiod = {graphTimeperiod}
      toggleStateBurden = {toggleStateBurden}/>: null}
      </FullScreen>
      </div>
     <div class="layout_right_bar2">
     <button className="button_fullscreen_trend"><img src={arrow_fullscreen} alt="image" onClick={screen4.enter} /></button>
      <FullScreen className="fullscreen_css" handle={screen4}>
      {isSelected? <BarGraph indicatorBar = {indicatorBar}
      setIndicatorBar = {setIndicatorBar}
      selIndicator = {selIndicator}
      selTimeperiod = {selTimeperiod}
      selArea = {selArea}
      graphTitle = {graphTitle}
      graphUnit = {graphUnit}
      areaName = {areaName}
      toggleStateBurden = {toggleStateBurden}/>: null}
      </FullScreen>
     </div>
    </div>
  </div>

 

      
     
     
   </>
    )
}
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import IconDelete from '../../../images/IconDelete';
import './AnalysisItem2.css'
import IconAscending from '../../../images/ascending.png'
import IconDescending from '../../../images/descending.png'

const FilterableTable = require('react-filterable-table');

const subRegionName = [
  'Centiloid_Composite',
  'Frontal_L',
  'Frontal_R',
  'Precuneus_PCC_L', 
  'Precuneus_PCC_R', 
  'Lateral_temporal_L', 
  'Lateral_temporal_R', 
  'Parietal_L', 
  'Parietal_R', 
  'Occipital_L', 
  'Occipital_R', 
  'Medial_temporal_L', 
  'Medial_temporal_R', 
  'Basal_ganglia_L', 
  'Basal_ganglia_R',
]

export default class AnalysisItem2 extends Component {
  constructor(props) {
    super(props);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderClick = this.renderClick.bind(this);
    this.renderCentiloid = this.renderCentiloid.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.state = {
      filterState:[
          {title:'ID', state:true},
          {title:'SubRegion', state:false},
          {title:'SUVR', state:false},
          {title:'Centiloid', state:false},
        ],
      clickListenerState: false,
      data: subRegionName.map((v,i)=>{return {id:i, Focus:false, Select: false, SubRegion:v, SUVR:this.props.subRegion[v], Centiloid:this.props.subRegion[v+'_C']}}),
      // data: [
      //   { id:0, Focus:false, Select: true, SubRegion:"Composite",              SUVR: 0.85, Centiloid: 60.8},
      //   { id:1, Focus:false, Select: true, SubRegion:"Prefrontal R",           SUVR: 0.55, Centiloid: 46.8},
      //   { id:2, Focus:false, Select: true, SubRegion:"Prefrontal L",           SUVR: 0.33, Centiloid: 75.8},
      //   { id:3, Focus:false, Select: true, SubRegion:"Anterior Cingulate R",   SUVR: 0.93, Centiloid: 44.8},
      //   { id:4, Focus:false, Select: true, SubRegion:"Anterior Cingulate L",   SUVR: 0.93, Centiloid: 45.8},

      //   { id:5, Focus:false, Select: false, SubRegion:"Precuneous R",           SUVR: 0.92, Centiloid: 64.8},
      //   { id:6, Focus:false, Select: false,  SubRegion:"Precuneous L",           SUVR: 1.22, Centiloid: 45.8},
      //   { id:7, Focus:false, Select: false, SubRegion:"Temporal Lateral R",     SUVR: 0.92, Centiloid: 56.8},
      //   { id:8, Focus:false, Select: false, SubRegion:"Temporal Lateral L",     SUVR: 1.84, Centiloid: 77.8},
      //   { id:9, Focus:false, Select: false, SubRegion:"Occipital R",            SUVR: 1.66, Centiloid: 76.8},

      //   { id:10, Focus:false, Select: false, SubRegion:"Occipital L",           SUVR: 1.44, Centiloid: 56.8},
      //   { id:11, Focus:false, Select: false,  SubRegion:"Sensorimotor R",        SUVR: 1.32, Centiloid: 66.8},
      //   { id:12, Focus:false, Select: false, SubRegion:"Sensorimotor L",        SUVR: 1.50, Centiloid: 86.8},
      //   { id:13, Focus:false, Select: false, SubRegion:"Temporal Medial R",     SUVR: 1.50, Centiloid: 23.8},
      //   { id:14, Focus:false, Select: false, SubRegion:"Tmeporal Medial L",     SUVR: 1.50, Centiloid: 54.8},

      //   { id:15, Focus:false, Select: false, SubRegion:"Cerebellum Grey",       SUVR: 1.23, Centiloid: 34.8},
      //   { id:16, Focus:false, Select: false,  SubRegion:"Cerebellum Whole",      SUVR: 0.91, Centiloid: 44.8},
      //   { id:17, Focus:false, Select: false, SubRegion:"Pons",                  SUVR: 0.81, Centiloid: 20.8},
      // ],
    };
  }
  componentWillUnmount(){
      clearInterval(this.myInterval);
      try{
          ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0].removeEventListener('click', this.handleSort);
          ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1].removeEventListener('click', this.handleSort);
          ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2].removeEventListener('click', this.handleSort);
          ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[3].removeEventListener('click', this.handleSort);
          this.setState({clickListenerState:false})
      } catch(e){
          console.log('findDOMNode error when componentWillUnmount')
      }
  }
  componentDidUpdate(prevProps, prevState){
    // console.log('componentDidUpdate in analysis2')
    if (prevProps.subRegion !== this.props.subRegion){
      const data=subRegionName.map((v,i)=>{return {id:i, Focus:false, Select: false, SubRegion:v, SUVR:this.props.subRegion[v], Centiloid:this.props.subRegion[v+'_C']}});
      this.setState({
        data,
      })
      // console.log(data)
    }
    // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1])
    if (this.state.clickListenerState==false){
        try{
            // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0])
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0].addEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1].addEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2].addEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[3].addEventListener('click', this.handleSort);
            // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0])
            // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1])
            // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2])
            this.setState({clickListenerState:true})
        }catch(e){
            // console.log('findDOMNode error when componentDidUpdate')
        }
    }
  }
  handleSort = e => {
      const {filterState} = this.state;
      const targetColumn = e.currentTarget.textContent.split(' ')[0].trim();
      // console.log(e.currentTarget);
      this.setState({
          filterState:[
              ...filterState.map((v)=>{if (v.title==targetColumn) {return {...v, state: !v.state}} else {return {...v, state: false}}}),
          ]
      })
  }
  renderCentiloid = (props) => {
      const {data} = this.state;
      const styleDiv = {
          height: "100%",
          width: `${Math.min(100,Math.max(0,props.value))}%`,
          background:'red',
          borderRadius:"5px",
      }
      return(
          <div  className={`AnalysisItem2Table-Default ${props.record.Select && 'sel'}`}
                      onClick={()=>{
                          this.setState({
                              // data:[...data, props.record]
                                  data: data.map(
                                  item => props.record.id === item.id ?
                                  { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                                    : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                              ),
                          });
                      }
                  }
              >
              <div className={`AnalysisItem2Table-SUVR`}>
                  <span>{Number(props.value)?.toFixed(1)}</span>
                  {/* <progress value={props.value} min={0} max={5} /> */}
                  <div style={{width: "100px", height:"5px", borderRadius:"5px",
                  boxSizing:"border-box", background:"#91919C"}}>
                      <div style={styleDiv}></div>
                  </div>
              </div>
          </div>
      );
  }
  renderIndex = (props) => {
      const {data} = this.state;
      return(
          <div className={`AnalysisItem2Table-Default ${props.record.Select && 'sel'}`} >
              {props.record.id+1}
          </div>
      );
  }
  renderSelect = (props) => {
      const {data} = this.state;
      return(
          <div className={`AnalysisItem2Table-Default ${props.record.Select && 'sel'}`} 
                      onClick={()=>{
                          this.setState({
                            // data:[...data, props.record]
                              data: data.map(
                              item => props.record.id === item.id ?
                              { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                                : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                              ),
                          });
                          console.dir(props)
                      }
                  }
              >
              <div className={`AnalysisItem2Table-Select ${props.value && 'act'}`} >
                  <div></div>
              </div>
          </div>
      );
  }
  renderClick = (props) => {
    const { data } = this.state;
      return(
          <div className={`AnalysisItem2Table-Default ${props.record.Select && 'sel'} ${props.record.Focus && 'focus'}`} 
            onClick={()=>{
                  this.setState({
                    // data:[...data, props.record]
                    data: data.map(
                      item => item.id === props.record.id ?
                        { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                          : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                    ),
                  });
                  console.dir(props)
                }
              }
            >
              {isNaN(Number(props.value)) ? props.value:Number(props.value)?.toFixed(2)}
          </div>
      );
  }
  render() {
    const {data, filterState} = this.state;
    // console.log(filterState)
    const fields = [
      // { render: this.renderIndex, name: 'id', displayName: "ID", inputFilterable: true, sortable: true },
      { render: this.renderIndex, name: 'id', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>ID&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='ID').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, sortable: true },
      // { render: this.renderSelect, name: 'Select', displayName: "", inputFilterable: true, sortable: true },
      { render: this.renderClick, name: 'SubRegion', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>SubRegion&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='SubRegion').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, sortable: true },
      { render: this.renderClick, name: 'SUVR', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>SUVR&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='SUVR').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, sortable: true },
      { render: this.renderCentiloid, name: 'Centiloid', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Centiloid&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Centiloid').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, sortable: true },
      // { render: this.renderClick, name: 'SubRegion', displayName: "SubRegion", inputFilterable: true, exactFilterable: false, sortable: true },
      // { render: this.renderClick, name: 'SUVR', displayName: "SUVR", inputFilterable: true, exactFilterable: false, sortable: true },
      // { render: this.renderCentiloid, name: 'Centiloid', displayName: "Centiloid", inputFilterable: true, exactFilterable: false, sortable: true },
    ];
    return (
      <FilterableTable
          className="AnalysisItem2Table"
          tableClassName="AnalysisItem2Table"
          // trClassName="WorklistTable"
          namespace="AnalysisItem2Table"
          initialSort="name"
          data={data}
          fields={fields}
          noRecordsMessage="There are no people to display"
          noFilteredRecordsMessage="No people match your filters!"
          pageSize={100}
      />
    );
  }
}
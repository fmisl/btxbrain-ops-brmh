import React, { Component } from 'react';
import IconDelete from '../../../images/IconDelete';
import './PACsTable.css'
import IconAscending from '../../../images/ascending.png'
import IconDescending from '../../../images/descending.png'

const FilterableTable = require('react-filterable-table');

export default class PACsTable extends Component {
  constructor(props) {
    super(props);
    this.renderRemove = this.renderRemove.bind(this);
    this.renderClick = this.renderClick.bind(this);
    this.renderTracer = this.renderTracer.bind(this);
  }
  renderRemove = (props) => {
    // const { data } = this.state;
      return(
        <div className={`PACsTable-Default ${props.record.Select && 'sel'}`} 
              onClick={()=>{
                this.props.removeFileList(props.record.id);
                this.props.getJPGURL('')
                // this.setState({data:this.props.fileList.filter((v,i)=>{return v.id != props.record.id})});
              }
            }
          >
          <div style={{userSelect:"none"}}>
              <IconDelete className="UploaderIcon-Delete"/>
          </div>
        </div>
      );
  }
  renderClick = (props) => {
    // const { data } = this.state;
      return(
          <div className={`PACsTable-Default ${props.record.Select && 'sel'} ${props.record.Focus && 'focus'}`} 
            onClick={(e)=>{
                //   this.props.updateFileList(props.record)
                  // this.setState({
                  //   // data:[...data, props.record]
                  //   data: data.map(
                  //     item => item.id === props.record.id ?
                  //       { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                  //         : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                  //   ),
                  // });
                //   this.props.getJPGURL(props.record.FileName)
                //   this.props.setListID(props.record.id)
                }
              }
            >
              <div className="Hide-Scroll">{props.value}</div>
          </div>
      );
  }
  renderTracer = (props) => {
    // const { data } = this.state;
      return(
        <div className={`PACsTable-Default ${props.record.Select && 'sel'} ${props.record.Focus && 'focus'}`} 
            onClick={(e)=>{
                // this.props.updateFileList(props.record)
                // this.setState({
                //   // data:[...data, props.record]
                //   data: data.map(
                //     item => props.record.id === item.id ?
                //     { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                //       : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                //   ),
                // });
                // this.props.getJPGURL(props.record.FileName)
                // this.props.setListID(props.record.id)
              }
            }
          >
          <div className={`PACsTable-Tracer ${props.record.Tracer.slice(-3)}`}>
              {/* <div>&nbsp;&nbsp;&nbsp;&nbsp;{props.record.Tracer}</div> */}
              <div>&emsp;[<sup>{props.record.Tracer.split(/[\[,\]]/)[1].slice(0,-1)}</sup>{props.record.Tracer.split(/[\[,\]]/)[1].slice(-1)}]{props.record.Tracer.split(/[\[,\]]/)[2]}</div>
          </div>
        </div>
      );
  }
  // componentWillUnmount(){
  //   const {runFiles} = this;
  //   console.log('componentWillUnmount', this.props.runCall)
  //   if (this.props.runCall == true){
  //     runFiles();
  //   }
  // }
  // componentDidUpdate(prevProps){
  //   if (prevProps.fileList !== this.props.fileList){
  //     console.log('componentDidUpdate in PACsTable')
  //     this.setState({
  //       data:this.props.fileList,
  //     })
  //   }
  // }
  render() {
    // const {data} = this.state;
    const {fileList, getJPGURL} = this.props;
    // console.log("PACsTable",fileList)
    const fields = [
      { render: this.renderTracer, name: 'Tracer', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Tracer&nbsp;</div>, inputFilterable: false, sortable: false },
      { render: this.renderClick, name: 'PatientID', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>PatientID&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderClick, name: 'PatientName', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>PatientName&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderClick, name: 'BirthDate', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>BirthDate&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderClick, name: 'StudyDate', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>StudyDate&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderClick, name: 'Modality', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Modality&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderClick, name: 'StudyDescription', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>StudyDescription&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
    //   { render: this.renderClick, name: 'FileName', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>FileName&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderRemove, name: 'Remove', displayName: "", inputFilterable: false, exactFilterable: false, sortable: false },
    ];
    return (
      <FilterableTable
          className="PACsTable"
          tableClassName="PACsTable"
          // trClassName="WorklistTable"
          namespace="PACsTable"
          initialSort="PatientName"
          data={fileList}
          fields={fields}
          noRecordsMessage="There are no people to display or query timeout"
          noFilteredRecordsMessage="No people match your filters!"
          pageSize={500}
      />
    );
  }
}
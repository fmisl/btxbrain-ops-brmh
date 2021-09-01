import React, { Component } from 'react';
import IconDelete from '../../../images/IconDelete';
import './UploaderTable.css'
import IconAscending from '../../../images/ascending.png'
import IconDescending from '../../../images/descending.png'

const FilterableTable = require('react-filterable-table');

export default class UploaderTable extends Component {
  constructor(props) {
    super(props);
    this.renderRemove = this.renderRemove.bind(this);
    this.renderClick = this.renderClick.bind(this);
    this.renderTracer = this.renderTracer.bind(this);
  }
  renderRemove = (props) => {
    // const { data } = this.state;
      return(
        <div className={`UploaderTable-Default ${props.record.Select && 'sel'}`} 
          onClick={()=>{
                this.props.removeFileList(props.record)
                this.props.getJPGURL('')
                // this.setState({
                //   data: data.filter(item => item.id !== props.record.id)
                // })
                // console.dir(props)
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
          <div className={`UploaderTable-Default ${props.record.Select && 'sel'} ${props.record.Focus && 'focus'}`} 
            onClick={(e)=>{
                  this.props.updateFileList(props.record)
                  // this.setState({
                  //   // data:[...data, props.record]
                  //   data: data.map(
                  //     item => item.id === props.record.id ?
                  //       { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                  //         : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                  //   ),
                  // });
                  this.props.getJPGURL(props.record.FileName)
                  this.props.setListID(props.record.id)
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
        <div className={`UploaderTable-Default ${props.record.Select && 'sel'} ${props.record.Focus && 'focus'}`} 
            onClick={(e)=>{
                this.props.updateFileList(props.record)
                // this.setState({
                //   // data:[...data, props.record]
                //   data: data.map(
                //     item => props.record.id === item.id ?
                //     { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                //       : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                //   ),
                // });
                this.props.getJPGURL(props.record.FileName)
                this.props.setListID(props.record.id)
              }
            }
          >
          <div className={`UploaderTable-Tracer ${this.props.selectTracer.slice(-3)}`}>
              {/* <div>&nbsp;&nbsp;&nbsp;&nbsp;{this.props.selectTracer}</div> */}
              <div>&emsp;[<sup>{this.props.selectTracer.split(/[\[,\]]/)[1].slice(0,-1)}</sup>{this.props.selectTracer.split(/[\[,\]]/)[1].slice(-1)}]{this.props.selectTracer.split(/[\[,\]]/)[2]}</div>
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
  //     console.log('componentDidUpdate in uploaderTable')
  //     this.setState({
  //       data:this.props.fileList,
  //     })
  //   }
  // }
  render() {
    // const {data} = this.state;
    const {fileList, getJPGURL} = this.props;
    // console.log("uploaderTable",fileList)
    const fields = [
      { render: this.renderTracer, name: 'Tracer', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Tracer&nbsp;</div>, inputFilterable: false, sortable: false },
      { render: this.renderClick, name: 'PatientName', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>PatientName&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderClick, name: 'FileName', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>FileName&nbsp;</div>, inputFilterable: false, exactFilterable: false, sortable: false },
      { render: this.renderRemove, name: 'Remove', displayName: "", inputFilterable: true, exactFilterable: false, sortable: true },
    ];
    return (
      <FilterableTable
          className="UploaderTable"
          tableClassName="UploaderTable"
          // trClassName="WorklistTable"
          namespace="UploaderTable"
          initialSort="name"
          data={fileList}
          fields={fields}
          noRecordsMessage="There are no people to display"
          noFilteredRecordsMessage="No people match your filters!"
          pageSize={500}
      />
    );
  }
}
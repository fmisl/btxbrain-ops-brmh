import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './UploadTable.css'
import { connect } from 'react-redux';
import * as actions from '../../../reduxs/actions';
import spinner from '../../../images/gif/spinner5.gif'
import * as services from '../../../services/fetchApi'
import { withRouter } from 'react-router-dom';
// import IconQuestion from '../../../images/IconQuestion'
import IconQuestion from '../../../images/IconQuestion.png'
import IconAscending from '../../../images/ascending.png'
import IconDescending from '../../../images/descending.png'

const FilterableTable = require('react-filterable-table');
 
class UploadTable extends Component {
    constructor(props) {
      super(props);
      this.wrapper = React.createRef();
      this.handleSelect = this.handleSelect.bind(this);
      this.handleSort = this.handleSort.bind(this);
      this.state={
          filterState:[
              {title:'Tracer', state:false},
              {title:'Centiloid', state:false},
              {title:'PatientName', state:false},
              {title:'PatientID', state:false},
              {title:'BirthDate', state:false},
              {title:'Sex', state:false},
              {title:'ScanDate', state:false},
              {title:'Update', state:false}
            ],//{Select:false, Tracer:false, Centiloid:false, PatientName:false, PatientID:false, BirthDate:false, Sex:false, ScanDate:false, Update:false},
          data: [],
          selectAll: false,
          clickListenerState: false,
      }
    }
    handleSelect = event => {
        const {selectAll} = this.state;
        console.log(selectAll)
        if (selectAll==false) {
            this.props.selectAllTrue();
            this.setState({
                selectAll: true,
            })
        }
        else {
            this.props.selectAllFalse();
            this.setState({
                selectAll: false,
            })
        }
        // console.log('Enter: ' + this.props.menuItem.caption.toUpperCase());
    }
    handleSort = e => {
        const {filterState} = this.state;
        const targetColumn = e.currentTarget.textContent.split(' ')[0].trim();
        // console.log(filterState.map(v=>));
        this.setState({
            filterState:[
                ...filterState.map((v)=>{if (v.title==targetColumn) {return {...v, state: !v.state}} else {return {...v, state: false}}}),
            ]
        })
    }
    componentDidMount = async() =>{
        const {fileList} = this.props;
        const token = localStorage.getItem('token')
        const res = await services.testing({'token':token})
        let newdata = res.data
        // console.log("interval: ",data!=this.state.data, data,this.state.data)
        // console.log('UploadTable-componentDidMount-updateCentiloid')
        if (newdata!=this.state.data){
            // console.log('data changed: ', newdata, fileList, fileList.map((v,i)=>{return {...v, Centiloid:newdata.filter(vv=>vv.id==v.id).Composite_C}}))
            this.props.updateCentiloid(newdata)
            try{
                const newfileList = fileList.map((v,i)=>{
                    const foundData = newdata.find(vv=>vv.id==v.id);
                    return {
                        ...v, 
                        Centiloid:foundData.Composite_C,
                        Complete:foundData.Complete,
                    }
                });
                this.setState({
                    data:newfileList,
                })
            } catch (e) {
                this.setState({
                    data:newdata,
                })
            }
        } else {
            this.setState({
                data:fileList,
            })
        }
        this.myTimer();
    }
    myTimer = async()=>{
        this.myInterval = setInterval(async ()=>{
            const {fileList} = this.props;
            const token = localStorage.getItem('token')
            const res = await services.testing({'token':token})
            let newdata = res.data
            // console.log("interval: ",data!=this.state.data, data,this.state.data)
            // console.log('UploadTable-componentDidMount-myTimer', newdata)
            if (newdata!=this.state.data){
                // console.log('data changed: ', this.state.data)
                this.props.updateCentiloid(newdata)
                // try{
                //     const newfileList = fileList.map((v,i)=>{
                //         const foundData = newdata.find(vv=>vv.id==v.id);
                //         return {
                //             ...v, 
                //             Centiloid:foundData.Composite_C,
                //             Complete:foundData.Complete,
                //         }
                //     });
                //     this.setState({
                //         data:newfileList,
                //     })
                // } catch (e) {
                //     this.setState({
                //         data:newdata,
                //     })
                // }
            }
        }, 10000)
    }
    componentWillUnmount(){
        clearInterval(this.myInterval);
        try{
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0].removeEventListener('click', this.handleSelect);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[3].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[4].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[5].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[6].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[7].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[8].removeEventListener('click', this.handleSort);
            this.setState({clickListenerState:false})
        } catch(e){
            console.log('findDOMNode error when componentWillUnmount')
        }
    }
    componentDidUpdate(prevProps, prevState){
        if (prevProps.fileList != this.props.fileList){
            // console.log('componentDidUpdate in UploadTable(fileList):',this.props.fileList)
            const {fileList} = this.props;
            this.setState({
                data:fileList,
            })
        }
        if (this.state.clickListenerState==false){
            try{
                // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0])
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0].addEventListener('click', this.handleSelect);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[3].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[4].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[5].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[6].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[7].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[8].addEventListener('click', this.handleSort);
                // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0])
                // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1])
                // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2])
                this.setState({clickListenerState:true})
            }catch(e){
                // console.log('findDOMNode error when componentDidUpdate')
            }
        }
        // console.log(temp.children[1].children[0])
        // console.dir(temp.children[1].children[0])
        // console.log(temp.children[1].children[0].childNodes)
        // console.dir(temp.children[1].children[0].childNodes)
        // console.log(temp.children[1].children[0].childNodes[0])
        // console.dir(temp.children[1].children[0].childNodes[0])
        // console.log(temp.children[1].children[0].children[0].childNodes)
        // console.dir(temp.children[1].children[0].children[0].childNodes)
    }
    renderSelect = (props) => {
        const {data} = this.state;
        return(
            <div className={`UploadTable-Default ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`} 
                        onClick={()=>{{props.record.Composite_C != null && (props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id))}}}
                >
                <div className={`UploadTable-Select ${props.value && 'act'}`} >
                    <div></div>
                </div>
            </div>
        );
    }
    renderClick = (props) => {
        const {data} = this.state;
        return(
            <div className={`UploadTable-Default ${props.record.Composite_C == null && 'unact'} ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`} 
                            onClick={()=>{{props.record.Composite_C != null && (props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id))}}}
                            onDoubleClick={()=>{
                                const nextStackManager = [...this.props.stackManager, ...this.props.fileList.filter((v, i)=>v.Opened == false && v.fileID == props.record.fileID).map(v=>{return {fileID:v.fileID, currentC:50, currentS:50, currentA:50, PatientName:v.PatientName, PatientID:v.PatientID, Age:v.Age, Sex:v.Sex, in_suvr_max:v.in_suvr_max, in_suvr_min:v.in_suvr_min, out_suvr_max:v.out_suvr_max, out_suvr_min:v.out_suvr_min}})];
                                const isNewlyOpened = nextStackManager.length!==this.props.stackManager.length
                                // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}
                                {props.record.Composite_C != null && (this.props.openItem(props.record.id))}
                                // {console.log('counter: ',this.props.counter, props.record.fileID)}
                                // ...fileList.filter((v,i)=>{if(v.Opened == false && v.Select == true) return {fileID:v.fileID, currentC:50, currentS:50, currentA:50}})
                                {props.record.Composite_C != null && this.props.addStack(nextStackManager)};
                                {(props.record.Composite_C != null && isNewlyOpened) ? this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID}):this.props.tab_location({...this.props.counter, tabX:this.props.stackManager.findIndex(item=>item.fileID==props.record.fileID), fileID: props.record.fileID})};
                                // {console.log('stackManager: ', nextStackManager.length)}
                                // {props.record.Composite_C != null && this.props.tab_location({...this.props.counter, tabX:this.props.stackManger.length-1, fileID: props.record.fileID})}
                                // this.props.tab_location({...this.props.counter, tabX:0, fileID:props.record.fileID});
                                // {props.record.Composite_C != null && (this.props.tab_location({...this.props.counter, tabX: this.props.counter.tabX+1, fileID:props.record.fileID}))}

                                {props.record.Composite_C != null && (setTimeout(() => this.props.history.push('/analysis/suvr/'+props.record.fileID), 100))}
                            }}
                >
                {props.value}
            </div>
        );
    }
    renderTracer = (props) => {
        const {data} = this.state;
        return(
            <div className={`UploadTable-Default ${props.record.Composite_C == null && 'unact'} ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`} 
                            onClick={()=>{{props.record.Composite_C != null && (props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id))}}}
                            onDoubleClick={()=>{
                                const nextStackManager = [...this.props.stackManager, ...this.props.fileList.filter((v, i)=>v.Opened == false && v.fileID == props.record.fileID).map(v=>{return {fileID:v.fileID, currentC:50, currentS:50, currentA:50, PatientName:v.PatientName, PatientID:v.PatientID, Age:v.Age, Sex:v.Sex, in_suvr_max:v.in_suvr_max, in_suvr_min:v.in_suvr_min, out_suvr_max:v.out_suvr_max, out_suvr_min:v.out_suvr_min}})];
                                const isNewlyOpened = nextStackManager.length!==this.props.stackManager.length
                                // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}
                                {props.record.Composite_C != null && this.props.openItem(props.record.id)}
                                {props.record.Composite_C != null && this.props.addStack(nextStackManager)};
                                {(props.record.Composite_C != null && isNewlyOpened) ? this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID}):this.props.tab_location({...this.props.counter, tabX:this.props.stackManager.findIndex(item=>item.fileID==props.record.fileID), fileID: props.record.fileID})};
                                // {props.record.Composite_C != null && setTimeout(() => this.props.history.push('/analysis/suvr/'+this.props.counter.tabX), 300)}
                                {props.record.Composite_C != null && (setTimeout(() => this.props.history.push('/analysis/suvr/'+props.record.fileID), 100))}
                           }}
                >
                <div className={`UploadTable-Tracer ${props.value.slice(-3)}`} >
                    {/* {console.log(props.value, props.value.split(/[\[,\]]/)[1].slice(0,-1))} */}
                    <div>&emsp;[<sup>{props.value.split(/[\[,\]]/)[1].slice(0,-1)}</sup>{props.value.split(/[\[,\]]/)[1].slice(-1)}]{props.value.split(/[\[,\]]/)[2]}</div>
                </div>
            </div>
        );
    }
    renderCentiloid = (props) => {
        const {data} = this.state;
        const styleDiv = {
            height: "100%",
            width: `${Math.min(100,Math.max(0,props.value))}%`,
            background:'red',
            borderRadius:"5px",
        }
        // console.log(props)
        return(
            <div  className={`UploadTable-Default ${props.record.Composite_C == null && 'unact'} ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`}
                            onClick={()=>{{props.record.Composite_C != null && (props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id))}}}
                            onDoubleClick={()=>{
                                const nextStackManager = [...this.props.stackManager, ...this.props.fileList.filter((v, i)=>v.Opened == false && v.fileID == props.record.fileID).map(v=>{return {fileID:v.fileID, currentC:50, currentS:50, currentA:50, PatientName:v.PatientName, PatientID:v.PatientID, Age:v.Age, Sex:v.Sex, in_suvr_max:v.in_suvr_max, in_suvr_min:v.in_suvr_min, out_suvr_max:v.out_suvr_max, out_suvr_min:v.out_suvr_min}})];
                                const isNewlyOpened = nextStackManager.length!==this.props.stackManager.length
                                // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}
                                {props.record.Composite_C != null && this.props.openItem(props.record.id)}
                                {props.record.Composite_C != null && this.props.addStack(nextStackManager)};
                                {(props.record.Composite_C != null && isNewlyOpened) ? this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID}):this.props.tab_location({...this.props.counter, tabX:this.props.stackManager.findIndex(item=>item.fileID==props.record.fileID), fileID: props.record.fileID})};
                                // {props.record.Composite_C != null && setTimeout(() => this.props.history.push('/analysis/suvr/'+this.props.counter.tabX), 500)}
                                {props.record.Composite_C != null && (setTimeout(() => this.props.history.push('/analysis/suvr/'+props.record.fileID), 100))}
                            }}
                >
                    {/* {console.log(props.record.Select && (props.record.Composite_C != null))} */}
                <div className={`UploadTable-SUVR ${props.record.Tracer.slice(-3)}`}>
                    {props.value != null ? 
                    // <span>{Number(props.value).toFixed(2)}</span>
                    <span>{Number(props.value).toFixed(1)}</span>
                    :<span>processing... &emsp;</span>}
                    {props.value != null ? 
                    <div style={{width: "150px", height:"5px", borderRadius:"5px",boxSizing:"border-box", background:"#383C41"}}>
                        <div style={styleDiv}></div>
                    </div>
                    :<span>&emsp;<img src={spinner} style={{width:"60px", height:"60px"}} alt="spinner"/></span>}
                </div>
            </div>
        );
    }
    render() {
        const {data, filterState} = this.state;
        // console.log('state', data);
        const fields = [
            { render: this.renderSelect, name: 'Select', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Select</div>, inputFilterable: false, sortable: false},
            { render: this.renderTracer, name: 'Tracer', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Tracer&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Tracer').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, sortable: true },
            { render: this.renderCentiloid, name: 'Composite_C', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Centiloid &nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Centiloid').state ? IconAscending:IconDescending}/>&nbsp;<img className='UploadTable-IconQuestion' src={IconQuestion} width={'30px'} height={'30px'}/><span className="UploadTable-msg" >Centiloid composite ROI relative to whole cerebellum</span></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            // { render: this.renderCentiloid, name: 'Centiloid', displayName: <div>Centiloid<IconQuestion width={'25px'} height={'25px'}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'PatientName', displayName: <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>PatientName&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='PatientName').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'PatientID', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>PatientID&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='PatientID').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'Age', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>BirthDate&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='BirthDate').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'Sex', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Sex&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Sex').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'AcquisitionDateTime', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>ScanDate&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='ScanDate').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'Update', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Update&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Update').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true, visible: true },
        ];
        return (
            <FilterableTable
                ref={this.wrapper}
                className="UploadTable"
                tableClassName="UploadTable"
                // trClassName="WorklistTable"
                namespace="UploadTable"
                initialSort="Update"
                initialSortDir={false}
                data={data}
                fields={fields}
                noRecordsMessage="There are no people to display"
                noFilteredRecordsMessage="No people match your filters!"
                pageSize={100}
            />
        );
    }
}
const mapStateToProps = (state) => ({
  // storeCount: state.count.count,
  counter:state.counter,
  isLogged:state.isLogged,
  stackManager:state.stackManager,
  fileList: state.fileList,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(actions.increment()),
  decrement: () => dispatch(actions.decrement()),
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
  tab_location: (items) => dispatch(actions.tab_location(items)),
  addStack: (items) => dispatch(actions.addStack(items)),
  openItem: (itemID) => dispatch(actions.openItem(itemID)),
  updateCentiloid: (items) => dispatch(actions.updateCentiloid(items)),
  closeItem: (itemID) => dispatch(actions.closeItem(itemID)),
  selectItem: (itemID) => dispatch(actions.selectItem(itemID)),
  unselectItem: (itemID) => dispatch(actions.unselectItem(itemID)),
  selectAllTrue: () => dispatch(actions.selectAllTrue()),
  selectAllFalse: () => dispatch(actions.selectAllFalse()),
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UploadTable));
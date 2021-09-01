import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './WorklistTable.css'
import { connect } from 'react-redux';
import * as actions from '../../../reduxs/actions';
import IconDelete from '../../../images/IconDelete';
import * as services from '../../../services/fetchApi'
import IconAscending from '../../../images/ascending.png'
import IconDescending from '../../../images/descending.png'

const FilterableTable = require('react-filterable-table');

class WorklistTable extends Component {
    state={
        filterState:[
            {title:'Tracer', state:false},
            // {title:'Centiloid', state:false},
            {title:'PatientName', state:false},
            {title:'PatientID', state:false},
            {title:'BirthDate', state:false},
            {title:'Sex', state:false},
            // {title:'ScanDate', state:false},
            // {title:'Update', state:false}
          ],
        token: localStorage.getItem('token'),
        data: [],
        selectAll:false,
        clickListenerState:false,
        // data: [
        //     {id:0, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.11, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 38, Sex:"M", Update:"20.07.15" },
        //     {id:1, Focus:false, Select:false, Tracer: "FBB", SUVR: 1.5, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 26, Sex:"M", Update:"20.07.15" },
        //     {id:2, Focus:false, Select:false, Tracer: "FBB", SUVR:1.1, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 39, Sex:"M", Update:"20.07.15" },
        //     {id:3, Focus:false, Select:false, Tracer: "FBP", SUVR: 2.1, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 33, Sex:"M", Update:"20.07.15" },
        //     {id:4, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.5, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 34, Sex:"M", Update:"20.07.15"  },
        
        //     {id:5, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.51, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 42, Sex:"M", Update:"20.07.15" },
        //     {id:6, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 1.2, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 55, Sex:"M", Update:"20.07.15" },
        //     {id:7, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 1.52, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 72, Sex:"M", Update:"20.07.15" },
        //     {id:8, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 0.72, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 46, Sex:"M", Update:"20.07.15" },
        //     {id:9, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.0, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 88, Sex:"M", Update:"20.07.15"  },
        
        //     {id:10, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.2, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 56, Sex:"M", Update:"20.07.15" },
        //     {id:11, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.8, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 47, Sex:"M", Update:"20.07.15" },
        //     {id:12, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 3.0, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 86, Sex:"M", Update:"20.07.15" },
        //     {id:13, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.5, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 66, Sex:"M", Update:"20.07.15" },
        //     {id:14, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.9, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 72, Sex:"M", Update:"20.07.15"  },
        
        //     {id:15, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.2, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 56, Sex:"M", Update:"20.07.15" },
        //     {id:16, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.8, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 47, Sex:"M", Update:"20.07.15" },
        //     {id:17, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 3.0, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 86, Sex:"M", Update:"20.07.15" },
        //     {id:18, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.5, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 66, Sex:"M", Update:"20.07.15" },
        //     {id:19, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.9, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 72, Sex:"M", Update:"20.07.15"  },
        
        //     {id:20, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.2, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 56, Sex:"M", Update:"20.07.15" },
        //     {id:21, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.8, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 47, Sex:"M", Update:"20.07.15" },
        //     {id:22, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 3.0, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 86, Sex:"M", Update:"20.07.15" },
        //     {id:23, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.5, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 66, Sex:"M", Update:"20.07.15" },
        //     {id:24, Focus:false, Select:false, Tracer: "C-PIB", SUVR: 2.9, PatientName: "Sandwich Eater", PatientID: "Sandwich Eater", Age: 72, Sex:"M", Update:"20.07.15"  },
        // ],
    }
    componentDidMount(){
        const {fileList} = this.props;
        this.setState({
            data:fileList.filter(item=>{return item.Group==1}),
        })
    }
    componentWillUnmount(){
        try{
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0].removeEventListener('click', this.handleSelect);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[3].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[4].removeEventListener('click', this.handleSort);
            ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[5].removeEventListener('click', this.handleSort);
            this.setState({
                clickListenerState:false,
                // selectAll: false,
            })
        } catch(e){
            console.log('findDOMNode error when componentWillUnmount')
        }
    }
    componentDidUpdate(prevProps){
        // console.log('componentDidUpdate1:',prevProps.fileList)
        // console.log('componentDidUpdate2:',this.props.fileList)
        if (prevProps.fileList !== this.props.fileList){
            // console.log('componentDidUpdate3:',this.props.fileList)
            const {fileList} = this.props;
            this.setState({
                data:fileList.filter(item=>{return item.Group==1}),
            })
        }
        // console.log('clickListenerState: ',this.state.clickListenerState)
        if (this.state.clickListenerState==false){
            try{
                // console.log(ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0])
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[0].addEventListener('click', this.handleSelect);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[1].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[2].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[3].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[4].addEventListener('click', this.handleSort);
                ReactDOM.findDOMNode(this).children[1].children[0].children[0].children[0].children[0].children[5].addEventListener('click', this.handleSort);
                this.setState({clickListenerState:true})
            }catch(e){
                // console.log('findDOMNode error when componentDidUpdate')
            }
        }
    }
    handleSelect = event => {
        const {selectAll} = this.state;
        if (selectAll==false) {
            // console.log('selectAll: true')
            this.props.selectAllGroup(1);
            this.setState({
                selectAll: true,
            })
        }
        else {
            // console.log('selectAll: false')
            this.props.unSelectAllGroup(1);
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
    ungroupAsync = async (data) =>{
        const res = await services.ungroupIndividual(data)
        // console.log('res.data:',res.data)
        const groupUpdated = res.data.map((v,i)=>{return {...v, Select:this.props.fileList[i].Select, Opened:this.props.fileList[i].Opened}})
        // console.log('fileList:',this.props.fileList)
        this.props.fetchItems(groupUpdated)
    }
    renderRemove = (props) => {
      // const { data } = this.state;
        return(
          <div className={`WorklistTable-Default ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`} 
            onClick={()=>{
                    // this.props.ungroupItemIndividual(props.record.fileID)
                    this.ungroupAsync({token:this.state.token, obj:{method:'ungroupIndividual', fileID:props.record.fileID}})
                    // this.props.fetchItems(res.data)
                //   this.props.removeFileList(props.record)
                  // this.setState({
                  //   data: data.filter(item => item.id !== props.record.id)
                  // })
                  // console.dir(props)
                }
              }
            >
            <div style={{userSelect:"none"}}>
                <IconDelete className="WorklistIcon-Delete"/>
            </div>
          </div>
        );
    }
    renderSelect = (props) => {
        const {data} = this.state;
        return(
            <div className={`WorklistTable-Default ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`} 
                    onClick={()=>{{props.record.Composite_C != null && (props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id))}}}
                    // onClick={()=>{{props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id)}}}
                    >
                <div className={`WorklistTable-Select ${props.value && 'act'}`}>
                    <div></div>
                </div>
            </div>
        );
    }
    renderTracer = (props) => {
        const {data} = this.state;
        return(
            <div className={`WorklistTable-Default ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`}
                onClick={()=>{{props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id)}}}
                onDoubleClick={()=>{
                    const nextStackManager = [...this.props.stackManager, ...this.props.fileList.filter((v, i)=>v.Opened == false && v.fileID == props.record.fileID).map(v=>{return {fileID:v.fileID, currentC:50, currentS:50, currentA:50, in_suvr_max:v.in_suvr_max, in_suvr_min:v.in_suvr_min, out_suvr_max:v.out_suvr_max, out_suvr_min:v.out_suvr_min}})];
                    const isNewlyOpened = nextStackManager.length!==this.props.stackManager.length
                    // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}
                    // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}

                    {props.record.Composite_C != null && this.props.openItem(props.record.id)}
                    {props.record.Composite_C != null && this.props.addStack(nextStackManager)};
                    {(props.record.Composite_C != null && isNewlyOpened) ? this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID}):this.props.tab_location({...this.props.counter, tabX:this.props.stackManager.findIndex(item=>item.fileID==props.record.fileID), fileID: props.record.fileID})};
                    // {props.record.Composite_C != null && setTimeout(() => this.props.history.push('/analysis/suvr/'+this.props.counter.tabX), 300)}
                    // {props.record.Composite_C != null && (setTimeout(() => this.props.history.push('/analysis/suvr/'+props.record.fileID), 100))}
                    // alert('double')
                    // this.setState({
                    //     // data:[...data, props.record]
                    //     data: data.map(
                    //     item => props.record.id === item.id ?
                    //     { ...item, ...{Opened:!props.record.Opened} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                    //         : {...item} // 기존의 값을 그대로 유지
                    //     ),
                    // });
                }}
                    >
                <div className={`WorklistTable-Tracer ${props.value.slice(-3)}`}  >
                    <div>&emsp;[<sup>{props.value.split(/[\[,\]]/)[1].slice(0,-1)}</sup>{props.value.split(/[\[,\]]/)[1].slice(-1)}]{props.value.split(/[\[,\]]/)[2]}</div>
                </div>
            </div>
        );
    }
    renderClick = (props) => {
        const {data} = this.state;
        return(
            <div className={`WorklistTable-Default ${props.record.Select && 'sel'} ${props.record.Opened && 'opened'}`} 
                        onClick={()=>{{props.record.Select ? this.props.unselectItem(props.record.id):this.props.selectItem(props.record.id)}}}
                        onDoubleClick={()=>{
                            const nextStackManager = [...this.props.stackManager, ...this.props.fileList.filter((v, i)=>v.Opened == false && v.fileID == props.record.fileID).map(v=>{return {fileID:v.fileID, currentC:50, currentS:50, currentA:50, in_suvr_max:v.in_suvr_max, in_suvr_min:v.in_suvr_min, out_suvr_max:v.out_suvr_max, out_suvr_min:v.out_suvr_min}})];
                            const isNewlyOpened = nextStackManager.length!==this.props.stackManager.length
                            // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}
                            // {props.record.Opened ? this.props.closeItem(props.record.id):this.props.openItem(props.record.id)}
        
                            {props.record.Composite_C != null && this.props.openItem(props.record.id)}
                            {props.record.Composite_C != null && this.props.addStack(nextStackManager)};
                            {(props.record.Composite_C != null && isNewlyOpened) ? this.props.tab_location({...this.props.counter, tabX:nextStackManager.length-1, fileID: props.record.fileID}):this.props.tab_location({...this.props.counter, tabX:this.props.stackManager.findIndex(item=>item.fileID==props.record.fileID), fileID: props.record.fileID})};
                                // this.setState({
                                //     // data:[...data, props.record]
                                //     data: data.map(
                                //     item => props.record.id === item.id ?
                                //     { ...item, ...{Select:!props.record.Select, Focus:true} } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
                                //       : {...item,...{Focus:false}} // 기존의 값을 그대로 유지
                                //     ),
                                // });
                                // console.dir(props)
                            }
                        }
                    >
                {props.value}
            </div>
        );
    }
    render() {
        const {data, filterState} = this.state;
        const fields = [
            { render: this.renderSelect, name: 'Select', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Select</div>, inputFilterable: false, sortable: false},
            { render: this.renderTracer, name: 'Tracer', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Tracer&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Tracer').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, sortable: true },
            // { render: this.renderSUVR, name: 'SUVR', displayName: "SUVR", inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'PatientName', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>PatientName&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='PatientName').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'PatientID', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>PatientID&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='PatientID').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'Age', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>BirthDate&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='BirthDate').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderClick, name: 'Sex', displayName: <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>Sex&nbsp;<img style={{width: "15px"}} src={filterState.find(v=>v.title=='Sex').state ? IconAscending:IconDescending}/></div>, inputFilterable: true, exactFilterable: false, sortable: true },
            { render: this.renderRemove, name: 'Remove', displayName: "", inputFilterable: true, exactFilterable: false, sortable: true },
            // { render: this.renderClick, name: 'Update', displayName: "Update", inputFilterable: true, exactFilterable: false, sortable: true },
        ];
        return (
            <FilterableTable
                className="WorklistTable"
                tableClassName="WorklistTable"
                // trClassName="WorklistTable"
                namespace="WorklistTable"
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
  fetchItems: (items) => dispatch(actions.fetchItems(items)),
  tab_location: (items) => dispatch(actions.tab_location(items)),
  addStack: (items) => dispatch(actions.addStack(items)),
  openItem: (itemID) => dispatch(actions.openItem(itemID)),
  closeItem: (itemID) => dispatch(actions.closeItem(itemID)),
  selectItem: (itemID) => dispatch(actions.selectItem(itemID)),
  unselectItem: (itemID) => dispatch(actions.unselectItem(itemID)),
  selectAllGroup: (groupID) => dispatch(actions.selectAllGroup(groupID)),
  unSelectAllGroup: (groupID) => dispatch(actions.unSelectAllGroup(groupID)),
  ungroupItemIndividual: (itemID) => dispatch(actions.ungroupItemIndividual(itemID)),
});
export default connect(mapStateToProps, mapDispatchToProps)(WorklistTable);
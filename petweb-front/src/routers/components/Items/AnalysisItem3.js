import React, { Component } from 'react'
import axios from 'axios';
import {IPinUSE} from '../../../services/IPs'
import { connect } from 'react-redux';
import * as actions from '../../../reduxs/actions';
import './AnalysisItem3.css'
// import * as services from '../../../services/fetchApi'
class Analysisitem3 extends Component {
    state = {
        currentStepIndex: 1.6,
    }
    // state = {
    //     subRegion:{},
    // }

    // componentDidUpdate(prevProps) {
    //     const {counter} = this.props;
    //     const username = localStorage.getItem('username')
    //     if (prevProps.counter.tabX != this.props.counter.tabX){
    //         console.log('componentDidUpdate')
    //         try {
    //             axios.get(IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/aal_subregion.txt')
    //             .then(res => {
    //                 const posts = res.data.split(/\s+/)
    //                 const obj = posts.reduce(function(o, val, idx) { o[subRegionName[idx]] = val; return o; }, {});
    //                 console.log(res.data,posts, typeof(posts), obj)
    //                 this.setState({
    //                     subRegion: obj,
    //                 })
    //             })
    //         } catch (err) {
        
    //         }
    //     }
    // }
    handleInputChange = e => {
        this.setState({ currentStepIndex: e.currentTarget.value });
    };

    render() {
        const {counter} = this.props;
        const {currentStepIndex} = this.state;
        const username = localStorage.getItem('username')
        return (
            <div className="AnalysisItem3-Default">
                <div className="AnalysisItem3-Surface" >
                    {/* IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/'+inoutSelect+'_coronal_'+i+'.png' */}
                    <div>
                        <img src={IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/_rlat_'+parseFloat(currentStepIndex).toFixed(1)+'.png'} height="220px"/>
                        <div>Right Lateral</div>
                    </div>
                    <div>
                        <img src={IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/_llat_'+parseFloat(currentStepIndex).toFixed(1)+'.png'} height="220px"/>
                        <div>Left Lateral</div>
                    </div>
                </div>
                <div className="AnalysisItem3-Surface" >
                    <div>
                        <img src={IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/_rmed_'+parseFloat(currentStepIndex).toFixed(1)+'.png'} height="220px"/>
                        <div>Right Medial</div>
                    </div>
                    <div>
                        <img src={IPinUSE+'result/download/'+username+'/database/'+counter.fileID+'/_lmed_'+parseFloat(currentStepIndex).toFixed(1)+'.png'} height="220px"/>
                        <div>Left Medial</div>
                    </div>
                </div>
                <div className="AnalysisItem3-Threshold">
                    <span>SUVR &nbsp;</span>
                    <input type="range" min="0.6" max="2.6" value={this.state.currentStepIndex} step="0.5" onInput={this.handleInputChange} style={{width:"35%"}}/>
                    <span> &nbsp;{parseFloat(currentStepIndex).toFixed(1)}</span>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    // storeCount: state.count.count,
    counter:state.counter,
    isLogged:state.isLogged,
    listSelected:state.stackManager,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    increment: () => dispatch(actions.increment()),
    decrement: () => dispatch(actions.decrement()),
    login: () => dispatch(actions.login()),
    logout: () => dispatch(actions.logout()),
  });
  export default connect(mapStateToProps, mapDispatchToProps)(Analysisitem3);